#![cfg_attr(not(feature = "std"), no_std)]

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
	pub type TileSelection<T> = BoundedVec<TileOfferIndex, <T as Config>::MaxTileSelection>;

	pub type TileSelectionBase<T> = BoundedVec<TileOfferIndex, <T as Config>::MaxTileSelectionBase>;

	// Type of AccountId that is going to be used
	pub type AccountId<T> = <T as frame_system::Config>::AccountId;

	pub type GameId = [u8; 32];

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, PartialEq)]
	pub enum GameState {
		Matchmaking,
		Playing,
		Finished, // Ready to reward players
	}

	// Index used for referencing the TileOffer
	pub type TileOfferIndex = u8;

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct Game<T: Config> {
		pub state: GameState,
		pub max_rounds: u8,  // maximum number of rounds
		pub round: u8,       // current round number
		pub player_turn: u8, // Who is playing?
		// pub number_of_players: u8,
		pub players: BoundedVec<AccountId<T>, T::MaxPlayers>, // Player ids
		pub selection_base_size: u8,                          // number of tiles for selection
		pub selection: TileSelection<T>,
		pub selection_size: u8,
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
		Empty,
		Tree,
		Water,
		Mountain,
		Desert,
		House,
		Grass,
	}

	#[derive(
		Encode, Decode, TypeInfo, MaxEncodedLen, Copy, Clone, PartialEq, RuntimeDebugNoBound,
	)]
	#[scale_info(skip_type_params(T))]
	pub struct TileOffer<T: Config> {
		pub tile_to_buy: T::Tile,
		pub tile_cost: T::MaterialCost,
	}

	// This type will get changed to be more generic, but I did not have time now.
	pub type TileOffers<T> = [TileOffer<T>; 6];

	#[derive(Encode, Decode, TypeInfo, PartialEq, Clone, Debug)]
	pub enum PayType {
		Material,
		Mana,
	}

	// This type will get changed to be more generic, but I did not have time now.
	#[derive(Encode, Decode, TypeInfo, PartialEq, Clone, Debug)]
	pub struct Move {
		place_index: u8,
		buy_index: u8, // We can fit buy_index and pay_type together
		pay_type: PayType,
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
			let empty_hex_grid: HexGrid<T> = vec![Default::default(); size]
				.try_into()
				.map_err(|_| Error::<T>::InternalError)?;

			Ok(HexBoard::<T> {
				gold: 3,
				wood: 0,
				stone: 0,
				food: 0,
				water: 0,
				mana: 1,
				humans: 1,
				hex_grid: empty_hex_grid,
				game_id,
			})
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

		#[pallet::constant]
		type MaxTileSelectionBase: Get<u32>;

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
		type AllTileOffers: Get<TileOffers<Self>>;
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

		// New turn
		NewTurn { game_id: GameId, next_player: T::AccountId },

		// Game has finished
		GameFinished { game_id: GameId },
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
				players: players.clone().try_into().map_err(|_| Error::<T>::InternalError)?,
				player_turn: 0,
				selection_base_size: 3,
				selection_size: 2,
				selection: Default::default(),
			};

			Self::new_selection(&mut game, game_id)?;

			game.selection_base_size = 6;

			let new_selection = game.selection.clone();

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

			Self::deposit_event(Event::NewTileSelection { game_id, selection: new_selection });

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

			ensure!(game.players[game.player_turn as usize] == who, Error::<T>::PlayerNotOnTurn);

			ensure!(
				hex_board.hex_grid.len() > move_played.place_index as usize,
				Error::<T>::PlaceIndexOutOfBounds
			);

			ensure!(hex_board.hex_grid[move_played.place_index as usize].get_type() == TileType::Empty, Error::<T>::TileIsNotEmpty);

			// buy and place the move
			hex_board.hex_grid[move_played.place_index as usize] = Self::buy_from_selection(
				&mut game.selection,
				&mut hex_board,
				move_played.buy_index as usize,
				&move_played.pay_type,
			)?;

			Self::refill_selection(&mut game, game_id)?;

			GameStorage::<T>::set(&game_id, Some(game));
			HexBoardStorage::<T>::set(&who, Some(hex_board));

			Self::deposit_event(Event::MovePlayed { game_id, player: who, move_played });

			Ok(())
		}

		#[pallet::call_index(2)]
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

			ensure!(game.players[game.player_turn as usize] == who, Error::<T>::PlayerNotOnTurn);

			if game.player_turn as usize == game.players.len() - 1 {
				game.player_turn = 0;
				game.round += 1;

				if game.round > game.max_rounds {
					game.state = GameState::Finished;

					GameStorage::<T>::set(&game_id, Some(game));

					Self::deposit_event(Event::GameFinished { game_id });

					return Ok(())
				}
			} else {
				game.player_turn += 1;
			}

			let next_player = game.players[game.player_turn as usize].clone();

			GameStorage::<T>::set(&game_id, Some(game));

			Self::deposit_event(Event::NewTurn { game_id, next_player });

			// Updating the resources
			Self::receive_resources(&mut hex_board);

			HexBoardStorage::<T>::set(&who, Some(hex_board));

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

		let mut new_selection: Vec<TileOfferIndex> = Default::default();

		let offset = (current_block_number.saturated_into::<u128>() % 32).saturated_into::<u8>();

		for i in 0..game.selection_size {
			new_selection.push(
				selection_base[((i + offset) % 32) as usize].clone() % game.selection_base_size,
			);
		}

		// Casting
		game.selection = new_selection.try_into().map_err(|_| Error::<T>::InternalError)?;

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
				game.selection_size += 2;
			}
			
			let current_block_number = <frame_system::Pallet<T>>::block_number();

			let offset = (current_block_number.saturated_into::<u128>() % 32).saturated_into::<usize>();

			let mut new_selection = game.selection.to_vec();

			for i in selection_len..game.selection_size as usize {
				new_selection.push(
					selection_base[(i + offset) % 32].clone() % game.selection_base_size,
				);
			}

			game.selection = new_selection.try_into().map_err(|_| Error::<T>::InternalError)?;
		}

		Ok(())
	}

	/// Helper method that determines if the user can buy a piece from the active selection
	fn buy_from_selection(
		selection: &mut TileSelection<T>,
		hex_board: &mut HexBoard<T>,
		index_to_buy: usize,
		pay_type: &PayType,
	) -> Result<T::Tile, sp_runtime::DispatchError> {
		// Select the offer
		ensure!(selection.len() > index_to_buy, Error::<T>::BuyIndexOutOfBounds);
		let selected_offer_index: TileOfferIndex = selection.remove(index_to_buy);

		let all_offers = T::AllTileOffers::get();

		ensure!(all_offers.len() > selected_offer_index as usize, Error::<T>::BuyIndexOutOfBounds);
		let selected_offer = all_offers[selected_offer_index as usize].clone();

		// Spend the materials / mana for the offer
		match pay_type {
			PayType::Material => Self::spend_material(&selected_offer.tile_cost, hex_board)?,
			PayType::Mana => Self::spend_material(&selected_offer.tile_cost.get_mana_cost(), hex_board)?,
		}

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

	/// Helper method that updates the resources according to the formations on grid
	fn receive_resources(hex_board: &mut HexBoard<T>) -> () {
		// To be implemented later
		hex_board.mana += hex_board.humans;
	}

	/// Check if the hexagon at (q, r) is within the valid bounds of the grid
	fn is_valid_hex(max_distance: i8, q: &i8, r: &i8) -> bool {
		q.abs() <= max_distance && r.abs() <= max_distance
	}

	/// Get the neighbors of a hex tile in the grid
	fn get_neigbouring_tiles(
		max_distance: i8,
		q: &i8,
		r: &i8,
	) -> Result<Vec<(i8, i8)>, sp_runtime::DispatchError> {
		let mut neigbouring_tiles: Vec<(i8, i8)> = Default::default();

		let directions = [(1, 1), (1, 0), (0, -1), (-1, -1), (-1, 0), (0, 1)];

		for (q_direction, r_direction) in directions {
			let neighbour_q = q.checked_add(q_direction).ok_or(Error::<T>::MathOverflow)?;
			let neighbout_r = r.checked_add(r_direction).ok_or(Error::<T>::MathOverflow)?;

			if Self::is_valid_hex(max_distance, &neighbour_q, &neighbout_r) {
				neigbouring_tiles.push((neighbour_q, neighbout_r));
			}
		}

		Ok(neigbouring_tiles)
	}

	/// Get the side length of the grid
	fn hex_directions_to_index(max_distance: &i8, side_length: &i8, q: &i8, r: &i8) -> i8 {
		q + max_distance + (r + max_distance) * side_length
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

	fn get_type(&self) -> TileType;

	fn get_formation_flags(&self) -> [bool; 3];

	fn set_level(&mut self, level: u8) -> ();
}

// Custom trait for MaterialCost definition
pub trait GetMaterialInfo {
	// Gets the material type you have to pay
	fn get_material_type(&self) -> Material;

	// Gets the material cost
	fn get_material_cost(&self) -> MaterialUnit;

	// Gets the mana cost equivalent
	fn get_mana_cost(&self) -> Self;
}
