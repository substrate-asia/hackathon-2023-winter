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
use codec::MaxEncodedLen;
use frame_support::{ensure, sp_runtime, sp_runtime::SaturatedConversion};
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
	pub type TileSelection<T> = BoundedVec<TileOffer<T>, <T as Config>::MaxTileSelection>;

	// Type of AccountId that is going to be used
	pub type AccountId<T> = <T as frame_system::Config>::AccountId;

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, PartialEq)]
	#[scale_info(skip_type_params(T))]
	pub enum GameState {
		Matchmaking,
		Playing,
		Reward,
		Finish,
	}

	#[derive(Encode, Decode, TypeInfo, RuntimeDebugNoBound, PartialEq, Clone)]
	pub struct TeST {}

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct Game<T: Config> {
		pub state: GameState,
		pub max_rounds: u8,  // maximum number of rounds
		pub round: u8,       // current round number
		pub player_turn: u8, // Who is playing?
		pub number_of_players: u8,
		pub players: BoundedVec<AccountId<T>, T::MaxPlayers>, // Player ids
		// number of tiles for selection
		pub selection_base: TileSelectionBase<T>,
		pub selection_base_size: u8,
		pub selection: TileSelection<T>,
		pub selection_size: u8,
	}

	pub type MaterialUnit = u8;

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, Copy, PartialEq, Debug)]
	pub enum Material {
		Gold,
		Wood,
		Stone,
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
	pub type TileSelectionBase<T> = [TileOffer<T>; 6];

	// This type will get changed to be more generic, but I did not have time now.
	#[derive(Encode, Decode, TypeInfo, PartialEq, Clone, Debug)]
	pub struct Move {
		place_index: u8,
		buy_index: u8,
	}

	// The board hex grid
	pub type HexGrid<T> = BoundedVec<<T as Config>::Tile, <T as Config>::MaxHexGridSize>;

	// The board of the player, with all stats and materials
	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct HexBoard<T: Config> {
		pub gold: MaterialUnit,  // material
		pub wood: MaterialUnit,  // material
		pub stone: MaterialUnit, // material
		population: MaterialUnit,
		hex_grid: HexGrid<T>, // Board with all tiles
		game: AccountId<T>,   // Game key
	}

	impl<T: Config> HexBoard<T> {
		fn new(size: usize, game: AccountId<T>) -> Result<HexBoard<T>, sp_runtime::DispatchError> {
			let empty_hex_grid: HexGrid<T> = vec![Default::default(); size]
				.try_into()
				.map_err(|_| Error::<T>::InternalError)?;

			Ok(HexBoard::<T> {
				gold: 3,
				wood: 0,
				stone: 0,
				population: 1,
				hex_grid: empty_hex_grid,
				game,
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
		type MaxPlayers: Get<u8> + Get<u32>;

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
		type SelectionBase: Get<TileSelectionBase<Self>>;
	}

	// The pallet's runtime storage items.
	// https://docs.substrate.io/main-docs/build/runtime-storage/

	// Learn more about declaring storage items:
	// https://docs.substrate.io/main-docs/build/runtime-storage/#declaring-storage-items
	#[pallet::storage]
	// Stores the Game data assigned to a creator address key
	pub type GameStorage<T: Config> = StorageMap<_, Identity, T::AccountId, Game<T>>;

	#[pallet::storage]
	// Stores the HexBoard data assigned to a player key.
	pub type HexBoardStorage<T: Config> = StorageMap<_, Identity, T::AccountId, HexBoard<T>>;

	// Pallets use events to inform users when important changes are made.
	// https://docs.substrate.io/main-docs/build/events-errors/
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// New game has been initialized
		GameInitialized {
			who: T::AccountId,
		},

		// Player joined a game
		PlayerJoined {
			who: T::AccountId,
			game: T::AccountId,
		},

		// Game started
		GameStarted {
			game: T::AccountId,
			// More details ...
		},

		// Player played a move
		PlayedMoves {
			game: T::AccountId,
			player: T::AccountId,
			moves: Vec<Move>,
		},

		// Player skipped a turn
		SkippedTurn {
			game: T::AccountId,
			player: T::AccountId,
		},

		// New selection has been drawn
		NewTileSelection {
			game: T::AccountId,
			selection: TileSelection<T>,
		},
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

		// Game is already full of players. More players can not join anymore.
		GameIsFull,

		// Not enough players have joined the game, unable to start now
		NotEnoughPlayers,

		// The game has already started. Can not start it twice.
		GameAlreadyStarted,

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

		// Not enough population to play all moves
		NotEnoughPopulation,

		// Entered index for buying is out of bounds.
		BuyIndexOutOfBounds,

		// You have to buy and place at least one tile. You can instead use `skip_turn` call
		NoMoves,

		// Player is not on the turn
		PlayerNotOnTurn,

		// Game has not started yet, or has been finished already
		GameNotPlaying,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn initialize(origin: OriginFor<T>, number_of_players: u8) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			ensure!(!HexBoardStorage::<T>::contains_key(&who), Error::<T>::AlreadyPlaying);

			ensure!(
				number_of_players >= T::MinPlayers::get(),
				Error::<T>::NumberOfPlayersIsTooSmall
			);

			ensure!(
				number_of_players <= T::MaxPlayers::get(),
				Error::<T>::NumberOfPlayersIsTooLarge
			);

			// Creates the BoundedVec of players, currently just with one player (= creator)
			let players = BoundedVec::<T::AccountId, T::MaxPlayers>::try_from(vec![who.clone()])
				.map_err(|_| Error::<T>::InternalError)?;

			GameStorage::<T>::set(
				&who,
				Some(Game {
					state: GameState::Matchmaking,
					max_rounds: 15,
					round: 0,
					players,
					player_turn: 0,
					number_of_players,
					selection_base_size: 4,
					selection_base: T::SelectionBase::get(), // These are the tiles to select from
					selection_size: 2,
					selection: Default::default(),
				}),
			);

			HexBoardStorage::<T>::set(&who, Some(HexBoard::<T>::new(25, who.clone())?));

			Self::deposit_event(Event::GameInitialized { who });
			// Return a successful DispatchResultWithPostInfo
			Ok(())
		}

		#[pallet::call_index(1)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn join(origin: OriginFor<T>, creator_address: T::AccountId) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// Ensures that the player is not already playing
			ensure!(!HexBoardStorage::<T>::contains_key(&who), Error::<T>::AlreadyPlaying);

			// Ensures that the Game exists
			let mut game = match GameStorage::<T>::get(&creator_address) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			// Ensures that there is enough space for the user to join the game
			ensure!(game.players.len() < game.number_of_players as usize, Error::<T>::GameIsFull);

			let _ = game.players.try_push(who.clone());

			GameStorage::<T>::set(&creator_address, Some(game));

			HexBoardStorage::<T>::set(&who, Some(HexBoard::<T>::new(25, creator_address.clone())?));

			Self::deposit_event(Event::PlayerJoined { who, game: creator_address });

			Ok(())
		}

		#[pallet::call_index(2)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn start(origin: OriginFor<T>) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// Ensures that the Game exists
			let mut game = match GameStorage::<T>::get(&who) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			// Ensures that there enough players have joined the game
			ensure!(
				game.players.len() == game.number_of_players as usize,
				Error::<T>::NotEnoughPlayers
			);

			// Ensures the game has not started yet
			ensure!(game.state == GameState::Matchmaking, Error::<T>::GameAlreadyStarted);

			game.state = GameState::Playing;

			// Generate new selection Tiles.
		    Self::new_selection(
				&mut game
			)?;

			Self::deposit_event(Event::NewTileSelection {
				game: who.clone(),
				selection: game.selection.clone(),
			});

			GameStorage::<T>::set(&who, Some(game));

			Self::deposit_event(Event::GameStarted { game: who /* More info */ });

			Ok(())
		}

		#[pallet::call_index(3)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn play(origin: OriginFor<T>, moves: Vec<Move>) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// Ensures that the HexBoard exists
			let mut hex_board = match HexBoardStorage::<T>::get(&who) {
				Some(value) => value,
				None => return Err(Error::<T>::HexBoardNotInitialized.into()),
			};

			let game_address: T::AccountId = hex_board.game.clone();

			// Ensures that the Game exists
			let mut game = match GameStorage::<T>::get(&game_address) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};

			ensure!(game.state == GameState::Playing, Error::<T>::GameNotPlaying);

			// Ensure that the player is on move
			ensure!(game.players[game.player_turn as usize] == who, Error::<T>::PlayerNotOnTurn);

			// Ensure mana usage, once implemented

			let moves_len = moves.len();

			// Ensure enough population for playing all moves
			ensure!(
				moves_len <= (hex_board.population + 1) as usize,
				Error::<T>::NotEnoughPopulation
			);

			// Ensure that at least 1 move has been entered
			ensure!(moves_len != 0, Error::<T>::NoMoves);

			// Maybe ensure more things

			// place the first move, it is for free ^^
			let m: &Move = &moves[0];
			hex_board.hex_grid[m.place_index as usize] =
				Self::buy_free_from_selection(&mut game.selection, m.buy_index as usize)?;

			// Buy and place other moves
			for i in 1..moves_len {
				let m: &Move = &moves[i];
				hex_board.hex_grid[m.place_index as usize] = Self::buy_from_selection(
					&mut game.selection,
					&mut hex_board,
					m.buy_index as usize,
				)?;
			}

			// if last turn -> start new round
			if game.player_turn as usize == game.players.len() - 1 {
				game.player_turn = 0;

				// new selection
				Self::new_selection(
					&mut game
				)?;

				// if last round -> finish the game, give away rewards
				if game.round == game.max_rounds {
					// End of the game
					// Give away rewards
					// Delete all unncessary storage
				} else {
					game.round += 1;
				}

				Self::deposit_event(Event::NewTileSelection {
					game: game_address.clone(),
					selection: game.selection.clone(),
				});
			} else {
				// +1 turn
				game.player_turn += 1;

				// Refill selection
				Self::refill_selection(
					&mut game.selection,
					&game.selection_base,
					game.selection_base_size,
					game.selection_size,
				)?;
			}

			GameStorage::<T>::set(&game_address, Some(game));
			HexBoardStorage::<T>::set(&who, Some(hex_board));

			Self::deposit_event(Event::PlayedMoves { game: game_address, player: who, moves });

			Ok(())
		}

		#[pallet::call_index(4)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn temp_skip_turn(origin: OriginFor<T>, game_address: T::AccountId) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// ..

			Self::deposit_event(Event::SkippedTurn { game: game_address, player: who });

			return Ok(())
		}
	}
}

// Other helper methods
impl<T: Config> Pallet<T> {
	/// Helper method that generates a completely new selection
	fn new_selection(
		game: &mut Game<T>
	) -> Result<(), sp_runtime::DispatchError> {
		// Current random source
		let current_block_number = <frame_system::Pallet<T>>::block_number();

		let mut new_tiles: Vec<TileOffer<T>> = Default::default();

		for i in 1..game.selection_size + 1 {
			let ti: usize = ((current_block_number.saturated_into::<u128>() * i as u128) %
				game.selection_base_size as u128)
				.saturated_into::<usize>();
			let randomly_selected_tile: TileOffer<T> = game.selection_base[ti].clone();
			new_tiles.push(randomly_selected_tile);
		}

		// Casting
		game.selection =
			new_tiles.try_into().map_err(|_| Error::<T>::InternalError)?;

		Ok(())
	}

	/// Helper method that generates a new offers to refill the existing selection
	fn refill_selection(
		selection: &mut TileSelection<T>,
		selection_base: &TileSelectionBase<T>,
		selection_base_size: u8, /* Number of tiles that can be selected from the
		                          * tile_selection */
		selection_size: u8, // The resulting number of tiles that can be selected
	) -> Result<(), sp_runtime::DispatchError> {
		// Current random source
		let current_block_number = <frame_system::Pallet<T>>::block_number();

		for i in 1..selection_size as usize + 1 - selection.len() {
			let ti: usize = ((current_block_number.saturated_into::<u128>() * i as u128) %
				selection_base_size as u128)
				.saturated_into::<usize>();
			let randomly_selected_tile: TileOffer<T> = selection_base[ti].clone();

			selection.try_push(randomly_selected_tile).map_err(|_| Error::<T>::InternalError)?;
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
		let selected_offer = selection.remove(index_to_buy);

		// Spend the materials for the offer
		Self::spend_material(&selected_offer.tile_cost, hex_board)?;

		Ok(selected_offer.tile_to_buy)
	}

	/// Helper method that determines if the user can buy a piece from the active selection
	fn buy_free_from_selection(
		selection: &mut TileSelection<T>,
		index_to_buy: usize,
	) -> Result<T::Tile, sp_runtime::DispatchError> {
		// Select the offer
		ensure!(selection.len() > index_to_buy, Error::<T>::BuyIndexOutOfBounds);
		let selected_offer = selection.remove(index_to_buy);

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
		};

		// Successfully paid
		Ok(())
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
}

// Custom trait for Tile definition
pub trait GetTileInfo {
	fn get_level(&self) -> u8;

	fn get_type(&self) -> u8;
}

// Custom trait for MaterialCost definition
pub trait GetMaterialInfo {
	// Gets the material type you have to pay
	fn get_material_type(&self) -> Material;

	// Gets the material type cost
	fn get_material_cost(&self) -> MaterialUnit;
}
