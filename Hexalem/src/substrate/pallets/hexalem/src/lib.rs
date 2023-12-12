#![cfg_attr(not(feature = "std"), no_std)]

use core::cmp;

use crate::vec::Vec;
/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://docs.substrate.io/reference/frame-pallets/>
pub use pallet::*;

//#[cfg(test)]
//mod mock;

//#[cfg(test)]
//mod tests;

//#[cfg(feature = "runtime-benchmarks")]
//mod benchmarking;

pub mod weights;
use frame_support::{
	ensure, sp_runtime, sp_runtime::SaturatedConversion, traits::Get, StorageHasher,
};
use scale_info::prelude::vec;
pub use weights::*;

#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	// Tiles to select
	pub type TileSelection<T> = BoundedVec<TileCostIndex, <T as Config>::MaxTileSelection>;

	// Type of AccountId that is going to be used
	pub type AccountId<T> = <T as frame_system::Config>::AccountId;

	pub type GameId = [u8; 32];

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, PartialEq, Copy, Clone)]
	pub enum GameState {
		Matchmaking,
		Playing,
		Finished, // Ready to reward players
	}

	// Index used for referencing the TileCost
	pub type TileCostIndex = u8;

	pub type Players<T> = BoundedVec<AccountId<T>, <T as Config>::MaxPlayers>;

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct Game<T: Config> {
		pub state: GameState,
		pub max_rounds: u8, // maximum number of rounds

		// These can be compressed to take only u8
		pub round: u8,       // current round number
		pub player_turn: u8, // Who is playing?
		pub played: bool,
		last_played_block: <frame_system::Pallet<T> as crate::sp_runtime::traits::BlockNumberProvider>::BlockNumber,

		// pub number_of_players: u8,
		pub players: Players<T>, // Player ids
		pub selection: TileSelection<T>,
		pub selection_size: u8,
	}

	impl<T: Config> GameProperties<T> for Game<T> {
		fn get_played(&self) -> bool {
			self.played
		}

		fn set_played(&mut self, played: bool) -> () {
			self.played = played;
		}

		fn get_max_rounds(&self) -> u8 {
			self.max_rounds
		}

		fn get_round(&self) -> u8 {
			self.round
		}

		fn set_round(&mut self, round: u8) -> () {
			self.round = round;
		}

		fn get_player_turn(&self) -> u8 {
			self.player_turn
		}

		fn set_player_turn(&mut self, turn: u8) -> () {
			self.player_turn = turn;
		}

		fn borrow_players(&self) -> &Players<T> {
			&self.players
		}

		fn get_state(&self) -> GameState {
			self.state
		}

		fn set_state(&mut self, state: GameState) -> () {
			self.state = state;
		}
	}

	pub type ResourceUnit = u8;

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, Copy, PartialEq, Debug)]
	pub enum ResourceType {
		Mana = 0,
		Human = 1,
		Water = 2,
		Food = 3,
		Wood = 4,
		Stone = 5,
		Gold = 6,
	}

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, Copy, PartialEq, Eq, Debug)]
	pub enum TileType {
		Empty = 0,
		Home = 1,
		Grass = 2,
		Water = 3,
		Mountain = 4,
		Tree = 5,
		Desert = 6,
		Cave = 7,
	}

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Copy, Clone, PartialEq, Debug)]
	pub struct ResourceAmount {
		pub resource_type: ResourceType,
		pub amount: ResourceUnit,
	}

	impl TileType {
		pub fn from_u8(value: u8) -> Self {
			match value {
				1 => TileType::Home,
				2 => TileType::Grass,
				3 => TileType::Water,
				4 => TileType::Mountain,
				5 => TileType::Tree,
				6 => TileType::Desert,
				7 => TileType::Cave,
				_ => TileType::Empty,
			}
		}
	}

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, Copy, PartialEq, Eq, Debug)]
	pub enum TilePattern {
		Normal = 0,
		Delta = 1,
		Line = 2,
		Ypsilon = 3,
	}

	impl TilePattern {
		pub fn from_u8(value: u8) -> Self {
			match value {
				1 => TilePattern::Delta,
				2 => TilePattern::Line,
				3 => TilePattern::Ypsilon,
				_ => TilePattern::Normal,
			}
		}
	}

	pub struct ResourceProduction {
		produces: ResourceAmount,
		human_requirements: ResourceUnit,
	}

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Copy, Clone, PartialEq)]
	#[scale_info(skip_type_params(T))]
	pub struct TileCost<T: Config> {
		pub tile_to_buy: T::Tile,
		pub cost: ResourceAmount,
	}

	// This type will get changed to be more generic, but I did not have time now.
	#[derive(Encode, Decode, TypeInfo, PartialEq, Clone, Debug)]
	pub struct Move {
		place_index: u8,
		buy_index: u8, // We can fit buy_index and pay_type together
	}

	// The board hex grid
	pub type HexGrid<T> = BoundedVec<<T as Config>::Tile, <T as Config>::MaxHexGridSize>;

	// The board of the player, with all stats and resources
	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct HexBoard<T: Config> {
		pub resources: [ResourceUnit; 7],
		pub hex_grid: HexGrid<T>, // Board with all tiles
		game_id: GameId,          // Game key
	}

	impl<T: Config> HexBoard<T> {
		fn new(size: usize, game_id: GameId) -> Result<HexBoard<T>, sp_runtime::DispatchError> {
			let mut new_hex_grid: HexGrid<T> = vec![Default::default(); size]
				.try_into()
				.map_err(|_| Error::<T>::InternalError)?;

			new_hex_grid[size / 2] = T::Tile::get_home();

			Ok(HexBoard::<T> {
				resources: T::DefaultPlayerResources::get(),
				hex_grid: new_hex_grid,
				game_id,
			})
		}

		pub fn get_stats(&self) -> BoardStats {
			let mut stats = BoardStats::default();

			for tile in self.hex_grid.clone() {
				let tile_type = tile.get_type();
				stats.set_tiles(tile_type, stats.get_tiles(tile_type).saturating_add(1));

				stats.set_levels(
					tile_type,
					tile.get_level(),
					stats.get_levels(tile_type, tile.get_level()).saturating_add(1),
				);

				stats.set_patterns(
					tile_type,
					tile.get_pattern(),
					stats.get_patterns(tile_type, tile.get_pattern()).saturating_add(1),
				);
			}

			stats
		}
	}

	pub struct BoardStats {
		tiles: [u8; 8],
		levels: [u8; 32],
		patterns: [u8; 64],
	}

	impl Default for BoardStats {
		fn default() -> Self {
			Self { tiles: [0; 8], levels: [0; 32], patterns: [0; 64] }
		}
	}

	impl BoardStats {
		pub fn get_tiles(&self, tile_type: TileType) -> u8 {
			self.tiles[tile_type as usize]
		}

		pub fn set_tiles(&mut self, tile_type: TileType, value: u8) -> () {
			self.tiles[tile_type as usize] = value;
		}

		pub fn get_levels(&self, tile_type: TileType, level: u8) -> u8 {
			self.levels[(tile_type as usize).saturating_mul(8).saturating_add(level as usize)]
		}

		pub fn set_levels(&mut self, tile_type: TileType, level: u8, value: u8) -> () {
			self.levels[(tile_type as usize).saturating_mul(8).saturating_add(level as usize)] =
				value;
		}

		pub fn get_patterns(&self, tile_type: TileType, pattern: TilePattern) -> u8 {
			self.patterns[(tile_type as usize).saturating_mul(8).saturating_add(pattern as usize)]
		}

		pub fn set_patterns(&mut self, tile_type: TileType, pattern: TilePattern, value: u8) -> () {
			self.patterns
				[(tile_type as usize).saturating_mul(8).saturating_add(pattern as usize)] = value;
		}
	}

	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

		/// Type representing the weight of this pallet
		type WeightInfo: WeightInfo;

		// Maximum number of players that can join a single game
		#[pallet::constant]
		type MaxPlayers: Get<u32>;

		// Minimum number of players that can join a single game
		#[pallet::constant]
		type MinPlayers: Get<u8>;

		#[pallet::constant]
		type BlocksToPlayLimit: Get<u8>;

		#[pallet::constant]
		type MaxHexGridSize: Get<u32>;

		#[pallet::constant]
		type MaxTileSelection: Get<u32>;

		type Tile: Encode
			+ Decode
			+ TypeInfo
			+ Clone
			+ Copy
			+ PartialEq
			+ MaxEncodedLen
			+ Parameter
			+ Default
			+ GetTileInfo;

		#[pallet::constant]
		type TileCosts: Get<[TileCost<Self>; 15]>;

		#[pallet::constant]
		type WaterPerHuman: Get<u8>;

		#[pallet::constant]
		type FoodPerHuman: Get<u8>;

		#[pallet::constant]
		type HomePerHumans: Get<u8>;

		#[pallet::constant]
		type FoodPerTree: Get<u8>;

		#[pallet::constant]
		type DefaultPlayerResources: Get<[ResourceUnit; 7]>;

		#[pallet::constant]
		type DefaultWinningConditionGold: Get<ResourceUnit>;

		#[pallet::constant]
		type DefaultWinningConditionHuman: Get<ResourceUnit>;
	}

	// The pallet's runtime storage items.
	// https://docs.substrate.io/main-docs/build/runtime-storage/

	// Learn more about declaring storage items:
	// https://docs.substrate.io/main-docs/build/runtime-storage/#declaring-storage-items
	#[pallet::storage]
	// Stores the Game data assigned to a creator address key
	pub type GameStorage<T: Config> = StorageMap<_, Blake2_128Concat, GameId, Game<T>>;

	#[pallet::storage]
	// Stores the HexBoard data assigned to a player key.
	pub type HexBoardStorage<T: Config> =
		StorageMap<_, Blake2_128Concat, T::AccountId, HexBoard<T>>;

	// Pallets use events to inform users when important changes are made.
	// https://docs.substrate.io/main-docs/build/events-errors/
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		// Game started
		GameCreated { game_id: GameId, grid_size: u8, players: Vec<T::AccountId> },

		// Player played a move
		MovePlayed { game_id: GameId, player: T::AccountId, move_played: Move },

		TileUpgraded { game_id: GameId, player: T::AccountId, place_index: u8 },

		// New selection has been drawn
		NewTileSelection { game_id: GameId, selection: TileSelection<T> },

		// Selection has been refilled
		SelectionRefilled { game_id: GameId, selection: TileSelection<T> },

		TurnForceFinished { game_id: GameId, player: T::AccountId },

		// New turn
		NewTurn { game_id: GameId, next_player: T::AccountId },

		// Game has finished
		GameFinished { game_id: GameId /* , winner: T::AccountId */ },

		// Event that is never used. It serves the purpose to expose hidden rust enums
		ExposeEnums { tile_type: TileType, tile_pattern: TilePattern },
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		// Player has already initialised a game. They need to finish it.
		AlreadyPlaying,

		// Game has not been initialized yet. Unable to join it.
		GameNotInitialized,

		// HexBoard has not been initialized yet. Unable to play.
		HexBoardNotInitialized,

		// The game has already started. Can not start it twice.
		GameAlreadyStarted,

		// The game has already started. Can not create it twice.
		GameAlreadyCreated,

		// Other errors, that should never happen.
		InternalError,

		// Please set the number_of_players parameter to a bigger number.
		NumberOfPlayersIsTooSmall,

		// Please set the number_of_players parameter to a smaller number.
		NumberOfPlayersIsTooLarge,

		// Math overflow.
		MathOverflow,

		// Not enough resources to pay for the tile offer.
		NotEnoughResources,

		// Not enough population to play all moves.
		NotEnoughPopulation,

		// Entered index for buying is out of bounds.
		BuyIndexOutOfBounds,

		// Entered index for placing the tile is out of bounds.
		PlaceIndexOutOfBounds,

		// Player is not on the turn.
		PlayerNotOnTurn,

		// Player is not playing this game
		PlayerNotInGame,

		// Current player cannot force finish his own turn
		CurrentPlayerCannotForceFinishTurn,

		// Game has not started yet, or has been finished already.
		GameNotPlaying,

		// The grid size is not 9, 25, 49.
		BadGridSize,

		// You can not place a tile on another tile, unless it is empty.
		TileIsNotEmpty,

		// Tile is already on the max level.
		TileOnMaxLevel,

		// Can not level up empty tile.
		CannotLevelUpEmptyTile,

		// This tile can not be leveled up.
		CannotLevelUp,

		// The tile is surrounded by empty tiles.
		TileSurroundedByEmptyTiles,

		// Not enough blocks have passed to force finish turn
		BlocksToPlayLimitNotPassed,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn create_game(
			origin: OriginFor<T>,
			players: Vec<T::AccountId>,
			grid_size: u8,
		) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// If you want to play, you need to specify yourself in the Vec as well
			let number_of_players = players.len();

			ensure!(
				number_of_players >= T::MinPlayers::get() as usize,
				Error::<T>::NumberOfPlayersIsTooSmall
			);

			ensure!(
				number_of_players <= T::MaxPlayers::get() as usize,
				Error::<T>::NumberOfPlayersIsTooLarge
			);

			ensure!(Self::is_valid_grid_size(grid_size), Error::<T>::BadGridSize);

			// Random GameId
			// I used `who` to ensure that even if 2 independent players wanted to create game in
			// the same block, they would be able to.
			let current_block_number = <frame_system::Pallet<T>>::block_number();
			let game_id: GameId = Blake2_256::hash(&(&who, &current_block_number).encode());

			// Eensure that the game has not already been created
			ensure!(!GameStorage::<T>::contains_key(&game_id), Error::<T>::GameAlreadyCreated);

			// Default Game Config
			let mut game = Game {
				state: GameState::Playing,
				max_rounds: 15,
				round: 0,
				played: false,
				last_played_block: current_block_number,
				players: players.clone().try_into().map_err(|_| Error::<T>::InternalError)?,
				player_turn: 0,
				selection_size: 2,
				selection: Default::default(),
			};

			Self::new_selection(&mut game, game_id)?;

			// Initialise HexBoards for all players
			for player in &players {
				ensure!(!HexBoardStorage::<T>::contains_key(player), Error::<T>::AlreadyPlaying);

				HexBoardStorage::<T>::set(
					player,
					Some(HexBoard::<T>::new(grid_size as usize, game_id.clone())?),
				);
			}

			GameStorage::<T>::set(game_id, Some(game));

			Self::deposit_event(Event::GameCreated {
				game_id: game_id.clone(),
				grid_size,
				players,
			});

			Ok(())
		}

		#[pallet::call_index(1)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn play(origin: OriginFor<T>, move_played: Move) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// Ensures that the HexBoard exists
			let mut hex_board = match HexBoardStorage::<T>::get(&who) {
				Some(value) => value,
				None => return Err(Error::<T>::HexBoardNotInitialized.into()),
			};

			let game_id: GameId = hex_board.game_id.clone();

			// Ensures that the Game exists
			let mut game = match GameStorage::<T>::get(&game_id) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			ensure!(game.state == GameState::Playing, Error::<T>::GameNotPlaying);

			ensure!(
				game.borrow_players()[game.get_player_turn() as usize] == who,
				Error::<T>::PlayerNotOnTurn
			);

			ensure!(
				hex_board.hex_grid.len() > move_played.place_index as usize,
				Error::<T>::PlaceIndexOutOfBounds
			);

			ensure!(
				hex_board.hex_grid[move_played.place_index as usize].get_type() == TileType::Empty,
				Error::<T>::TileIsNotEmpty
			);

			// buy and place the move
			hex_board.hex_grid[move_played.place_index as usize] = Self::buy_from_selection(
				&mut game.selection,
				&mut hex_board,
				move_played.buy_index as usize,
			)?;

			game.set_played(true);

			Self::refill_selection(&mut game, game_id)?;

			// Check formations
			let grid_length: usize = hex_board.hex_grid.len();

			let side_length: i8 = Self::side_length(&grid_length);
			let max_distance: i8 = Self::max_distance_from_center(&grid_length);
			let (tile_q, tile_r) =
				Self::index_to_coords(move_played.place_index, &side_length, &max_distance)?;

			let mut neighbours = Self::get_neighbouring_tiles(&max_distance, &tile_q, &tile_r)?;
			ensure!(
				Self::not_surrounded_by_empty_tiles(
					&neighbours,
					&hex_board.hex_grid,
					&max_distance,
					&side_length
				),
				Error::<T>::TileSurroundedByEmptyTiles
			);

			neighbours.push(Some((tile_q, tile_r)));

			for option_tile in neighbours {
				match option_tile {
					Some((q, r)) => Self::set_patterns(&mut hex_board, (q, r))?,
					None => (),
				}
			}

			GameStorage::<T>::set(&game_id, Some(game));
			HexBoardStorage::<T>::set(&who, Some(hex_board));

			Self::deposit_event(Event::MovePlayed { game_id, player: who, move_played });

			Ok(())
		}

		#[pallet::call_index(2)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn upgrade(origin: OriginFor<T>, place_index: u8) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// Ensures that the HexBoard exists
			let mut hex_board = match HexBoardStorage::<T>::get(&who) {
				Some(value) => value,
				None => return Err(Error::<T>::HexBoardNotInitialized.into()),
			};

			let game_id: GameId = hex_board.game_id.clone();

			// Ensures that the Game exists
			let game = match GameStorage::<T>::get(&game_id) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			ensure!(game.state == GameState::Playing, Error::<T>::GameNotPlaying);

			ensure!(
				game.borrow_players()[game.get_player_turn() as usize] == who,
				Error::<T>::PlayerNotOnTurn
			);

			ensure!(
				hex_board.hex_grid.len() > place_index as usize,
				Error::<T>::PlaceIndexOutOfBounds
			);

			let tile_to_upgrade: T::Tile = hex_board.hex_grid[place_index as usize];

			let tile_level = tile_to_upgrade.get_level();

			ensure!(tile_level != 3, Error::<T>::TileOnMaxLevel);

			Self::spend_for_tile_upgrade(&mut hex_board, &tile_to_upgrade)?;

			hex_board.hex_grid[place_index as usize].set_level(tile_level.saturating_add(1));

			HexBoardStorage::<T>::set(&who, Some(hex_board));

			Self::deposit_event(Event::TileUpgraded { game_id, player: who, place_index });

			Ok(())
		}

		#[pallet::call_index(3)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn finish_turn(origin: OriginFor<T>) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// Ensures that the HexBoard exists
			let mut hex_board = match HexBoardStorage::<T>::get(&who) {
				Some(value) => value,
				None => return Err(Error::<T>::HexBoardNotInitialized.into()),
			};

			let game_id: GameId = hex_board.game_id.clone();

			// Ensures that the Game exists
			let mut game = match GameStorage::<T>::get(&game_id) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			ensure!(game.state == GameState::Playing, Error::<T>::GameNotPlaying);

			ensure!(
				game.borrow_players()[game.get_player_turn() as usize] == who,
				Error::<T>::PlayerNotOnTurn
			);

			// Handle next turn counting
			game.next_turn();

			let current_block_number = <frame_system::Pallet<T>>::block_number();
			game.last_played_block = current_block_number;

			// If the player has not played, generate a new selection
			if game.get_played() {
				game.set_played(false);
			} else {
				Self::new_selection(&mut game, game_id)?;
			}

			let next_player = game.borrow_players()[game.get_player_turn() as usize].clone();

			GameStorage::<T>::set(&game_id, Some(game));

			Self::deposit_event(Event::NewTurn { game_id, next_player });

			// Updating the resources
			Self::evaluate_board(&mut hex_board);

			HexBoardStorage::<T>::set(&who, Some(hex_board));

			Ok(())
		}

		#[pallet::call_index(4)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn force_finish_turn(origin: OriginFor<T>, game_id: GameId) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			let mut game = match GameStorage::<T>::get(&game_id) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			ensure!(game.borrow_players().contains(&who), Error::<T>::PlayerNotInGame);

			let current_player = game.borrow_players()[game.get_player_turn() as usize].clone();
			ensure!(current_player != who, Error::<T>::CurrentPlayerCannotForceFinishTurn);

			// Handle next turn counting
			game.next_turn();

			let current_block_number = <frame_system::Pallet<T>>::block_number();

			ensure!(
				game.last_played_block
					.saturated_into::<u128>()
					.saturating_add(T::BlocksToPlayLimit::get() as u128) <
					current_block_number.saturated_into::<u128>(),
				Error::<T>::BlocksToPlayLimitNotPassed
			);

			game.last_played_block = current_block_number;

			let next_player = game.borrow_players()[game.get_player_turn() as usize].clone();

			GameStorage::<T>::set(&game_id, Some(game));

			Self::deposit_event(Event::NewTurn { game_id, next_player });

			Self::deposit_event(Event::TurnForceFinished { game_id, player: current_player });

			Ok(())
		}

		#[pallet::call_index(5)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn root_delete_game(origin: OriginFor<T>, game_id: GameId) -> DispatchResult {
			ensure_root(origin)?;

			// Ensures that the Game exists
			let game = match GameStorage::<T>::get(&game_id) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			for player in game.borrow_players() {
				HexBoardStorage::<T>::remove(player);
			}

			GameStorage::<T>::remove(&game_id);

			Ok(())
		}
	}
}

// Other helper methods
impl<T: Config> Pallet<T> {
	/// Helper method that generates a completely new selection from the selection_base
	fn new_selection(
		game: &mut Game<T>,
		selection_base: GameId,
	) -> Result<(), sp_runtime::DispatchError> {
		// Current random source
		let current_block_number = <frame_system::Pallet<T>>::block_number();

		let mut new_selection: Vec<TileCostIndex> = Default::default();

		let offset = (current_block_number.saturated_into::<u128>() % 32).saturated_into::<u8>();

		for i in 0..game.selection_size {
			new_selection.push(selection_base[((i + offset) % 32) as usize].clone() % T::TileCosts::get().len().saturated_into::<u8>());
		}

		// Casting
		game.selection = new_selection.try_into().map_err(|_| Error::<T>::InternalError)?;

		Self::deposit_event(Event::NewTileSelection {
			game_id: selection_base,
			selection: game.selection.clone(),
		});

		Ok(())
	}

	/// Helper method that refills the selection
	fn refill_selection(
		game: &mut Game<T>,
		selection_base: GameId,
	) -> Result<(), sp_runtime::DispatchError> {
		let selection_len = game.selection.len();

		if selection_len <= (game.selection_size / 2) as usize {
			if game.selection_size as u32 != T::MaxTileSelection::get() {
				game.selection_size = game.selection_size.saturating_add(2);
			}

			let current_block_number = <frame_system::Pallet<T>>::block_number();

			let offset =
				(current_block_number.saturated_into::<u128>() % 32).saturated_into::<usize>();

			let mut new_selection = game.selection.to_vec();

			for i in selection_len..game.selection_size as usize {
				new_selection.push(selection_base[(i + offset) % 32].clone() % T::TileCosts::get().len().saturated_into::<u8>());
			}

			game.selection = new_selection.try_into().map_err(|_| Error::<T>::InternalError)?;

			Self::deposit_event(Event::SelectionRefilled {
				game_id: selection_base,
				selection: game.selection.clone(),
			});
		}

		Ok(())
	}

	/// Helper method that determines if the user can buy a piece from the active selection
	fn buy_from_selection(
		selection: &mut TileSelection<T>,
		hex_board: &mut HexBoard<T>,
		index_to_buy: usize,
	) -> Result<T::Tile, sp_runtime::DispatchError> {
		// Select the offer
		ensure!(selection.len() > index_to_buy, Error::<T>::BuyIndexOutOfBounds);
		let selected_offer_index: TileCostIndex = selection.remove(index_to_buy);

		let all_offers = T::TileCosts::get();

		ensure!(all_offers.len() > selected_offer_index as usize, Error::<T>::BuyIndexOutOfBounds);
		let selected_offer = all_offers[selected_offer_index as usize].clone();

		Self::spend_resource(&selected_offer.cost, hex_board)?;

		Ok(selected_offer.tile_to_buy)
	}

	/// Helper method that determines, how expensive the upgrade for a tile is.
	fn spend_for_tile_upgrade(
		hex_board: &mut HexBoard<T>,
		tile_to_upgrade: &T::Tile,
	) -> Result<(), sp_runtime::DispatchError> {
		match (tile_to_upgrade.get_type(), tile_to_upgrade.get_level()) {
			(TileType::Home, tile_level) => {
				Self::spend_resource(
					&ResourceAmount { resource_type: ResourceType::Wood, amount: (tile_level + 1).saturating_mul(2) },
					hex_board,
				)?;
				Self::spend_resource(
					&ResourceAmount { resource_type: ResourceType::Stone, amount: (tile_level + 1).saturating_mul(2) },
					hex_board,
				)?;
				Self::spend_resource(
					&ResourceAmount { resource_type: ResourceType::Gold, amount: tile_level.saturating_mul(2) },
					hex_board,
				)?;
			},
			(TileType::Empty, _) => return Err(Error::<T>::CannotLevelUpEmptyTile.into()),
			_ => return Err(Error::<T>::CannotLevelUp.into()),
		};

		Ok(())
	}

	/// Helper method that spends the resources according to ResourceAmount
	fn spend_resource(
		resource_cost: &ResourceAmount,
		hex_board: &mut HexBoard<T>,
	) -> Result<(), sp_runtime::DispatchError> {
		hex_board.resources[resource_cost.resource_type as usize] = hex_board.resources
			[ResourceType::Gold as usize]
			.checked_sub(resource_cost.amount)
			.ok_or(Error::<T>::NotEnoughResources)?;
		Ok(())
	}

	fn set_patterns(
		hex_board: &mut HexBoard<T>,
		tile_coords: (i8, i8),
	) -> Result<(), sp_runtime::DispatchError> {
		let grid_length: usize = hex_board.hex_grid.len();
		let max_distance: i8 = Self::max_distance_from_center(&grid_length);
		let side_length: i8 = Self::side_length(&grid_length);

		let mut impact_tiles: Vec<i8> = vec![Self::coords_to_index(
			&max_distance,
			&side_length,
			&tile_coords.0,
			&tile_coords.1,
		)];

		for neighbour in
			Self::get_neighbouring_tiles(&max_distance, &tile_coords.0, &tile_coords.1)?
		{
			match neighbour {
				Some(value) => impact_tiles.push(Self::coords_to_index(
					&max_distance,
					&side_length,
					&value.0,
					&value.1,
				)),
				None => (),
			};
		}

		for index in impact_tiles {
			Self::set_pattern_around_tile(
				hex_board,
				index.saturated_into(),
				&max_distance,
				&side_length,
			)?;
		}

		Ok(())
	}

	fn set_pattern_around_tile(
		hex_board: &mut HexBoard<T>,
		index: u8,
		max_distance: &i8,
		side_length: &i8,
	) -> Result<(), sp_runtime::DispatchError> {
		let tile = hex_board.hex_grid[index as usize];

		if tile.get_pattern() == TilePattern::Normal {
			return Ok(())
		}

		let (q, r) = Self::index_to_coords(index, side_length, max_distance)?;
		let neighbours = Self::get_neighbouring_tiles(max_distance, &q, &r)?;

		let mut n: Vec<Option<(u8, T::Tile)>> = vec![Some((index, tile))];

		for neighbour in neighbours {
			match neighbour {
				Some(value) => {
					let neighbour_index: u8 =
						Self::coords_to_index(&max_distance, &side_length, &value.0, &value.1)
							.saturated_into();
					n.push(Some((neighbour_index, hex_board.hex_grid[neighbour_index as usize])));
				},
				None => n.push(None),
			}
		}

		let pattern = Self::get_pattern(n);

		match pattern {
			Some((p, indexes)) =>
				for i in indexes {
					hex_board.hex_grid[i as usize].set_pattern(p);
				},
			None => (),
		}
		Ok(())
	}

	fn get_pattern(n: Vec<Option<(u8, T::Tile)>>) -> Option<(TilePattern, Vec<u8>)> {
		match n[0] {
			Some((_i, tile)) =>
				if tile.get_type() == TileType::Empty {
					return None
				},
			None => (),
		};

		// Delta
		match Self::match_same_tile(n[0], n[1], n[2]) {
			Some(v) => return Some((TilePattern::Delta, v)),
			None => (),
		};
		match Self::match_same_tile(n[0], n[2], n[3]) {
			Some(v) => return Some((TilePattern::Delta, v)),
			None => (),
		};
		match Self::match_same_tile(n[0], n[3], n[4]) {
			Some(v) => return Some((TilePattern::Delta, v)),
			None => (),
		};
		match Self::match_same_tile(n[0], n[4], n[5]) {
			Some(v) => return Some((TilePattern::Delta, v)),
			None => (),
		};
		match Self::match_same_tile(n[0], n[5], n[6]) {
			Some(v) => return Some((TilePattern::Delta, v)),
			None => (),
		};
		match Self::match_same_tile(n[0], n[6], n[1]) {
			Some(v) => return Some((TilePattern::Delta, v)),
			None => (),
		};

		// Line
		match Self::match_same_tile(n[0], n[1], n[4]) {
			Some(v) => return Some((TilePattern::Line, v)),
			None => (),
		};
		match Self::match_same_tile(n[0], n[2], n[5]) {
			Some(v) => return Some((TilePattern::Line, v)),
			None => (),
		};
		match Self::match_same_tile(n[0], n[3], n[6]) {
			Some(v) => return Some((TilePattern::Line, v)),
			None => (),
		};

		// ypsilon
		match Self::match_same_tile_4(n[0], n[1], n[3], n[5]) {
			Some(v) => return Some((TilePattern::Line, v)),
			None => (),
		};
		match Self::match_same_tile_4(n[0], n[2], n[4], n[6]) {
			Some(v) => return Some((TilePattern::Line, v)),
			None => (),
		};

		None
	}

	fn match_same_tile(
		n1: Option<(u8, T::Tile)>,
		n2: Option<(u8, T::Tile)>,
		n3: Option<(u8, T::Tile)>,
	) -> Option<Vec<u8>> {
		match (n1, n2, n3) {
			(Some((index1, tile1)), Some((index2, tile2)), Some((index3, tile3))) =>
				if tile1.same(&tile2) && tile1.same(&tile3) {
					Some(vec![index1, index2, index3])
				} else {
					None
				},
			_ => None,
		}
	}

	fn match_same_tile_4(
		n1: Option<(u8, T::Tile)>,
		n2: Option<(u8, T::Tile)>,
		n3: Option<(u8, T::Tile)>,
		n4: Option<(u8, T::Tile)>,
	) -> Option<Vec<u8>> {
		match (n1, n2, n3, n4) {
			(
				Some((index1, tile1)),
				Some((index2, tile2)),
				Some((index3, tile3)),
				Some((index4, tile4)),
			) =>
				if tile1.same(&tile2) && tile1.same(&tile3) && tile1.same(&tile4) {
					Some(vec![index1, index2, index3, index4])
				} else {
					None
				},
			_ => None,
		}
	}

	fn evaluate_board(hex_board: &mut HexBoard<T>) -> () {
		let board_stats: BoardStats = hex_board.get_stats();

		hex_board.resources[ResourceType::Mana as usize] = hex_board.resources
			[ResourceType::Mana as usize]
			.saturating_add(hex_board.resources[ResourceType::Human as usize] / 3)
			.saturating_add(board_stats.get_tiles(TileType::Home));

		let food_and_water_eaten = cmp::min(
			hex_board.resources[ResourceType::Food as usize].saturating_mul(T::FoodPerHuman::get()),
			T::WaterPerHuman::get() * hex_board.resources[ResourceType::Water as usize], /* It is safe to multiply Percent, it
			                                                                              * will
			                                                                              * never
			                                                                              * overflow */
		);

		let mut home_weighted: u8 = 0;

		for level in 0..4 {
			home_weighted = home_weighted.saturating_add(
				(level + 1u8).saturating_mul(board_stats.get_levels(TileType::Home, level)),
			);
		}

		let new_humans = cmp::max(
			cmp::min(
				board_stats.get_tiles(TileType::Home).saturating_add(food_and_water_eaten),
				home_weighted.saturating_mul(T::HomePerHumans::get()),
			),
			1,
		);

		hex_board.resources[ResourceType::Water as usize] = hex_board.resources
			[ResourceType::Water as usize]
			.saturating_add(board_stats.get_tiles(TileType::Water));

		hex_board.resources[ResourceType::Food as usize] = hex_board.resources
			[ResourceType::Food as usize]
			.saturating_add(board_stats.get_tiles(TileType::Grass))
			.saturating_add(T::FoodPerTree::get() * board_stats.get_tiles(TileType::Tree));

		hex_board.resources[ResourceType::Wood as usize] =
			hex_board.resources[ResourceType::Wood as usize].saturating_add(cmp::min(
				board_stats.get_tiles(TileType::Tree).saturating_mul(3),
				hex_board.resources[ResourceType::Human as usize] / 2,
			));

		hex_board.resources[ResourceType::Stone as usize] = hex_board.resources
			[ResourceType::Stone as usize]
			.saturating_add(cmp::min(
				board_stats.get_tiles(TileType::Mountain) * 4,
				hex_board.resources[ResourceType::Human as usize] / 4,
			))
			.saturating_add(cmp::min(
				board_stats.get_tiles(TileType::Cave) * 2,
				hex_board.resources[ResourceType::Human as usize] / 2,
			));

		hex_board.resources[ResourceType::Gold as usize] =
			hex_board.resources[ResourceType::Gold as usize].saturating_add(cmp::min(
				board_stats.get_tiles(TileType::Cave),
				hex_board.resources[ResourceType::Human as usize] / 3,
			));

		hex_board.resources[ResourceType::Human as usize] =
			hex_board.resources[ResourceType::Human as usize].saturating_add(new_humans);
	}

	/// Check if the hexagon at (q, r) is within the valid bounds of the grid
	fn is_valid_hex(max_distance: &i8, q: &i8, r: &i8) -> bool {
		&q.abs() <= max_distance && &r.abs() <= max_distance
	}

	/// Check if at least one of the neighbouring tiles is not Empty.
	fn not_surrounded_by_empty_tiles(
		neighbours: &Vec<Option<(i8, i8)>>,
		hex_grid: &HexGrid<T>,
		max_distance: &i8,
		side_length: &i8,
	) -> bool {
		for neighbour in neighbours {
			match neighbour {
				Some((q, r)) =>
					if hex_grid[Self::coords_to_index(max_distance, side_length, &q, &r) as usize]
						.get_type() != TileType::Empty
					{
						return true
					},
				None => (),
			};
		}
		false
	}

	/// Get the neighbors of a hex tile in the grid
	fn get_neighbouring_tiles(
		max_distance: &i8,
		q: &i8,
		r: &i8,
	) -> Result<Vec<Option<(i8, i8)>>, sp_runtime::DispatchError> {
		let mut neigbouring_tiles: Vec<Option<(i8, i8)>> = Default::default();

		let directions = [(0, -1), (1, -1), (1, 0), (0, 1), (-1, 1), (-1, 0)];

		for (q_direction, r_direction) in directions {
			let neighbour_q = q.checked_add(q_direction).ok_or(Error::<T>::MathOverflow)?;
			let neighbout_r = r.checked_add(r_direction).ok_or(Error::<T>::MathOverflow)?;

			if Self::is_valid_hex(&max_distance, &neighbour_q, &neighbout_r) {
				neigbouring_tiles.push(Some((neighbour_q, neighbout_r)));
			} else {
				neigbouring_tiles.push(None)
			}
		}

		Ok(neigbouring_tiles)
	}

	fn coords_to_index(max_distance: &i8, side_length: &i8, q: &i8, r: &i8) -> i8 {
		q + max_distance + (r + max_distance) * side_length
	}

	fn index_to_coords(
		index: u8,
		side_length: &i8,
		max_distance: &i8,
	) -> Result<(i8, i8), sp_runtime::DispatchError> {
		let index_i8: i8 = index.try_into().map_err(|_| Error::<T>::InternalError)?;
		let q: i8 = (index_i8 % side_length) - max_distance;
		let r: i8 = index_i8 / side_length - (side_length - 1) / 2;
		Ok((q, r))
	}

	/// Fast helper method that quickly computes the max_distance for the size of the board
	fn max_distance_from_center(hex_grid_len: &usize) -> i8 {
		// (sqrt(hex_grid_len) - 1) / 2
		match hex_grid_len {
			9 => 1,
			25 => 2,
			49 => 3,
			_ => 0,
		}
	}

	/// Fast helper method that quickly computes the side_length for the size of the board
	fn side_length(hex_grid_len: &usize) -> i8 {
		// (sqrt(hex_grid_len)
		match hex_grid_len {
			9 => 3,
			25 => 5,
			49 => 7,
			_ => 0,
		}
	}

	/// Helper method that tells you if the board size is valid
	fn is_valid_grid_size(size: u8) -> bool {
		match size {
			9 | 25 | 49 => true,
			_ => false,
		}
	}
}

// Custom trait for Tile definition
pub trait GetTileInfo {
	fn get_level(&self) -> u8;
	fn set_level(&mut self, level: u8) -> ();

	fn get_type(&self) -> TileType;

	fn get_pattern(&self) -> TilePattern;
	fn set_pattern(&mut self, value: TilePattern) -> ();

	fn same(&self, other: &Self) -> bool {
		self.get_type() == other.get_type()
	}

	fn get_home() -> Self;
}

trait GameProperties<T: Config> {
	// Player made a move
	// It is used for determining whether to generate a new selection
	fn get_played(&self) -> bool;
	fn set_played(&mut self, played: bool) -> ();

	fn get_max_rounds(&self) -> u8;

	fn get_round(&self) -> u8;
	fn set_round(&mut self, round: u8) -> ();

	fn get_player_turn(&self) -> u8;
	fn set_player_turn(&mut self, turn: u8) -> ();

	fn get_state(&self) -> GameState;
	fn set_state(&mut self, state: GameState) -> ();

	fn borrow_players(&self) -> &Players<T>;

	fn next_turn(&mut self) -> () {
		let player_turn = self.get_player_turn();

		let next_player_turn =
			(player_turn + 1) % self.borrow_players().len().saturated_into::<u8>();

		self.set_player_turn(next_player_turn);

		if next_player_turn == 0 {
			let round = self.get_round() + 1;
			self.set_round(round);

			if round > self.get_max_rounds() {
				self.set_state(GameState::Finished);
			}
		}
	}
}
