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

use crate::sp_runtime::Percent;

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

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, PartialEq)]
	pub enum GameState {
		Matchmaking,
		Playing,
		Finished, // Ready to reward players
	}

	// Index used for referencing the TileCost
	pub type TileCostIndex = u8;

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct Game<T: Config> {
		pub state: GameState,
		pub max_rounds: u8, // maximum number of rounds

		// These can be compressed to take only u8
		pub round: u8,       // current round number
		pub player_turn: u8, // Who is playing?
		pub played: bool,

		// pub number_of_players: u8,
		pub players: BoundedVec<AccountId<T>, T::MaxPlayers>, // Player ids
		pub selection: TileSelection<T>,
		pub selection_size: u8,
	}

	impl<T: Config> GameProperties for Game<T> {
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
	}

	pub type MaterialUnit = u8;

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, Copy, PartialEq, Debug)]
	pub enum Material {
		Mana,
		Humans,
		Water,
		Food,
		Wood,
		Stone,
		Gold,
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

	#[derive(
		Encode, Decode, TypeInfo, MaxEncodedLen, Copy, Clone, PartialEq, RuntimeDebugNoBound,
	)]
	#[scale_info(skip_type_params(T))]
	pub struct TileCost<T: Config> {
		pub tile_to_buy: T::Tile,
		pub cost: T::MaterialCost,
	}

	// This type will get changed to be more generic, but I did not have time now.
	#[derive(Encode, Decode, TypeInfo, PartialEq, Clone, Debug)]
	pub struct Move {
		place_index: u8,
		buy_index: u8, // We can fit buy_index and pay_type together
	}

	// The board hex grid
	pub type HexGrid<T> = BoundedVec<<T as Config>::Tile, <T as Config>::MaxHexGridSize>;

	// The board of the player, with all stats and materials
	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct HexBoard<T: Config> {
		pub gold: MaterialUnit,
		pub wood: MaterialUnit,
		pub stone: MaterialUnit,
		pub food: MaterialUnit,
		pub water: MaterialUnit,
		pub mana: MaterialUnit,
		pub humans: MaterialUnit,
		pub hex_grid: HexGrid<T>, // Board with all tiles
		game_id: GameId,          // Game key
	}

	impl<T: Config> HexBoard<T> {
		fn new(size: usize, game_id: GameId) -> Result<HexBoard<T>, sp_runtime::DispatchError> {
			let mut new_hex_grid: HexGrid<T> = vec![Default::default(); size]
				.try_into()
				.map_err(|_| Error::<T>::InternalError)?;

			new_hex_grid[size / 2] = T::HomeTile::get();

			Ok(HexBoard::<T> {
				gold: 255,
				wood: 0,
				stone: 0,
				food: 0,
				water: 0,
				mana: 1,
				humans: 1,
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

		type MaterialCost: Encode
			+ Decode
			+ TypeInfo
			+ Clone
			+ Copy
			+ scale_info::prelude::fmt::Debug
			+ PartialEq
			+ MaxEncodedLen
			+ GetMaterialInfo;

		#[pallet::constant]
		type TileCosts: Get<[TileCost<Self>; 16]>;

		#[pallet::constant]
		type WaterPerHuman: Get<Percent>;

		#[pallet::constant]
		type FoodPerHuman: Get<u8>;

		#[pallet::constant]
		type HomePerHumans: Get<u8>;

		#[pallet::constant]
		type FoodPerTree: Get<Percent>;

		#[pallet::constant]
		type HomeTile: Get<Self::Tile>;
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

		// New selection has been drawn
		NewTileSelection { game_id: GameId, selection: TileSelection<T> },

		// Selection has been refilled
		SelectionRefilled { game_id: GameId, selection: TileSelection<T> },

		// New turn
		NewTurn { game_id: GameId, next_player: T::AccountId },

		// Game has finished
		GameFinished { game_id: GameId },

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

		// Other errors, that should never happen
		InternalError,

		// Please set the number_of_players parameter to a bigger number.
		NumberOfPlayersIsTooSmall,

		// Please set the number_of_players parameter to a smaller number.
		NumberOfPlayersIsTooLarge,

		// Math overflow
		MathOverflow,

		// Not enough resources to pay for the tile offer
		NotEnoughResources,

		// Not enough mana to pay for the tile offer
		NotEnoughMana,

		// Not enough population to play all moves
		NotEnoughPopulation,

		// Entered index for buying is out of bounds.
		BuyIndexOutOfBounds,

		// Entered index for placing the tile is out of bounds.
		PlaceIndexOutOfBounds,

		// You have to buy and place at least one tile. You can instead use `skip_turn` call
		NoMoves,

		// Player is not on the turn
		PlayerNotOnTurn,

		// Game has not started yet, or has been finished already
		GameNotPlaying,

		// The grid size is not 9, 25, 49
		BadGridSize,

		// You can not place a tile on another tile, unless it is empty.
		TileIsNotEmpty,
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
				game.players[game.get_player_turn() as usize] == who,
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
		pub fn upgrade(origin: OriginFor<T>, _place_index: u8) -> DispatchResult {
			let _who: T::AccountId = ensure_signed(origin)?;

			todo!()
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

			let player_turn = game.get_player_turn();

			ensure!(game.players[player_turn as usize] == who, Error::<T>::PlayerNotOnTurn);

			let next_player_turn = (player_turn + 1) % game.players.len().saturated_into::<u8>();

			game.set_player_turn(next_player_turn);

			if next_player_turn == 0 {
				let round = game.get_round() + 1;
				game.set_round(round);

				if round > game.get_max_rounds() {
					game.state = GameState::Finished;

					GameStorage::<T>::set(&game_id, Some(game));

					Self::deposit_event(Event::GameFinished { game_id });

					return Ok(())
				}
			}

			// If the player has not played, generate a new selection
			if game.get_played() {
				game.set_played(false);
			} else {
				Self::new_selection(&mut game, game_id)?;
			}

			let next_player = game.players[next_player_turn as usize].clone();

			GameStorage::<T>::set(&game_id, Some(game));

			Self::deposit_event(Event::NewTurn { game_id, next_player });

			// Updating the resources
			Self::evaluate_board(&mut hex_board);

			HexBoardStorage::<T>::set(&who, Some(hex_board));

			Ok(())
		}

		#[pallet::call_index(4)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn root_delete_game(origin: OriginFor<T>, game_id: GameId) -> DispatchResult {
			ensure_root(origin)?;

			// Ensures that the Game exists
			let game = match GameStorage::<T>::get(&game_id) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			for player in &game.players {
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
			new_selection.push(selection_base[((i + offset) % 32) as usize].clone() % 16);
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

		if selection_len < (game.selection_size / 2 + 1) as usize {
			if game.selection_size as u32 != T::MaxTileSelection::get() {
				game.selection_size = game.selection_size.saturating_add(2);
			}

			let current_block_number = <frame_system::Pallet<T>>::block_number();

			let offset =
				(current_block_number.saturated_into::<u128>() % 32).saturated_into::<usize>();

			let mut new_selection = game.selection.to_vec();

			for i in selection_len..game.selection_size as usize {
				new_selection.push(selection_base[(i + offset) % 32].clone() % 16);
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

		Self::spend_material(&selected_offer.cost, hex_board)?;

		Ok(selected_offer.tile_to_buy)
	}

	/// Helper method that spends the resources according to MaterialCost
	fn spend_material(
		material_cost: &T::MaterialCost,
		hex_board: &mut HexBoard<T>,
	) -> Result<(), sp_runtime::DispatchError> {
		match material_cost.get_material_type() {
			Material::Gold =>
				hex_board.gold = hex_board
					.gold
					.checked_sub(material_cost.get_material_cost())
					.ok_or(Error::<T>::NotEnoughResources)?,
			Material::Wood =>
				hex_board.wood = hex_board
					.wood
					.checked_sub(material_cost.get_material_cost())
					.ok_or(Error::<T>::NotEnoughResources)?,
			Material::Stone =>
				hex_board.stone = hex_board
					.stone
					.checked_sub(material_cost.get_material_cost())
					.ok_or(Error::<T>::NotEnoughResources)?,
			Material::Mana =>
				hex_board.mana = hex_board
					.mana
					.checked_sub(material_cost.get_material_cost())
					.ok_or(Error::<T>::NotEnoughMana)?,
			Material::Food =>
				hex_board.food = hex_board
					.food
					.checked_sub(material_cost.get_material_cost())
					.ok_or(Error::<T>::NotEnoughResources)?,
			Material::Water =>
				hex_board.water = hex_board
					.water
					.checked_sub(material_cost.get_material_cost())
					.ok_or(Error::<T>::NotEnoughResources)?,
			Material::Humans => (),
		};

		// Successfully paid
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

		hex_board.mana = hex_board
			.mana
			.saturating_add(hex_board.humans / 3)
			.saturating_add(board_stats.get_tiles(TileType::Home));

		let food_and_water_eaten = cmp::min(
			hex_board.food.saturating_mul(T::FoodPerHuman::get()),
			T::WaterPerHuman::get() * hex_board.water, /* It is safe to multiply Percent, it
			                                            * will never overflow */
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

		hex_board.water = hex_board.water.saturating_add(board_stats.get_tiles(TileType::Water));

		hex_board.food = hex_board
			.food
			.saturating_add(board_stats.get_tiles(TileType::Grass))
			.saturating_add(T::FoodPerTree::get() * board_stats.get_tiles(TileType::Tree));

		hex_board.wood = hex_board.wood.saturating_add(cmp::min(
			board_stats.get_tiles(TileType::Tree).saturating_mul(3),
			hex_board.humans / 2,
		));

		hex_board.stone = hex_board
			.stone
			.saturating_add(cmp::min(
				board_stats.get_tiles(TileType::Mountain) * 4,
				hex_board.humans / 4,
			))
			.saturating_add(cmp::min(
				board_stats.get_tiles(TileType::Cave) * 2,
				hex_board.humans / 2,
			));

		hex_board.gold = hex_board
			.gold
			.saturating_add(cmp::min(board_stats.get_tiles(TileType::Cave), hex_board.humans / 3));

		hex_board.humans = hex_board.humans.saturating_add(new_humans);
	}

	/// Check if the hexagon at (q, r) is within the valid bounds of the grid
	fn is_valid_hex(max_distance: &i8, q: &i8, r: &i8) -> bool {
		&q.abs() <= max_distance && &r.abs() <= max_distance
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
}

// Custom trait for MaterialCost definition
pub trait GetMaterialInfo {
	/// Gets the material type you have to pay
	fn get_material_type(&self) -> Material;

	/// Gets the material cost
	fn get_material_cost(&self) -> MaterialUnit;
}

trait GameProperties {
	// Player made a move
	// It is used for determining whether to generate a new selection
	fn get_played(&self) -> bool;
	fn set_played(&mut self, played: bool) -> ();

	fn get_max_rounds(&self) -> u8;

	fn get_round(&self) -> u8;
	fn set_round(&mut self, round: u8) -> ();

	fn get_player_turn(&self) -> u8;
	fn set_player_turn(&mut self, turn: u8) -> ();
}
