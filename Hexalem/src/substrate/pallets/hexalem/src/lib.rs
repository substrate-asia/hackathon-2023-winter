#![cfg_attr(not(feature = "std"), no_std)]

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
use scale_info::prelude::vec;
pub use weights::*;

#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	// Type of Hash that we will use
	type Hash = [u8; 64];

	// Type of AccountId that is going to be used
	pub type AccountId<T> = <T as frame_system::Config>::AccountId;

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen, PartialEq)]
	#[scale_info(skip_type_params(T))]
	pub enum HexBoardState {
		Matchmaking,
		Playing,
		Reward,
		Finish,
	}

	#[derive(Encode, Decode, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	pub struct HexBoard<T: Config> {
		pub state: HexBoardState,
		pub rounds: u8,      // maximum number of rounds
		pub turn: u8,        // current turn number
		pub player_turn: u8, // Who is playing?
		pub selection: u8,   // number of pieces for selection
		pub number_of_players: u8,
		pub players: BoundedVec<AccountId<T>, T::MaxPlayers>, // Player ids
		pub last_move: u8,

		//pub board: Hash,
		pub selection_base: Hash,
		pub selection_current: Hash,
	}

	/// Configure the pallet by specifying the parameters and types on which it depends.
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
	}

	// The pallet's runtime storage items.
	// https://docs.substrate.io/main-docs/build/runtime-storage/

	// Learn more about declaring storage items:
	// https://docs.substrate.io/main-docs/build/runtime-storage/#declaring-storage-items
	#[pallet::storage]
	// Stores the HexBoard data assigned to a creator address key
	pub type HexBoardStorage<T: Config> = StorageMap<_, Twox64Concat, T::AccountId, HexBoard<T>>;

	#[pallet::storage]
	// Stores a creator address key assigned to a player key.
	pub type PlayersJoinedStorage<T: Config> =
		StorageMap<_, Twox64Concat, T::AccountId, T::AccountId>;

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
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		// Player has already initialised a game. They need to finish it.
		AlreadyPlaying,

		// Game has not been initialized yet. Unable to join it.
		GameNotInitialized,

		// Game is already full of players. More players can not join anymore.
		GameIsFull,

		// Not enough players have joined the game, unable to start now
		NotEnoughPlayers,

		// The game has already started. Can not start it twice.
		GameAlreadyStarted,

		// Other errors
		InternalError,

		// Please set the number_of_players parameter to a bigger number.
		NumberOfPlayersIsTooSmall,
		// Please set the number_of_players parameter to a smaller number.
		NumberOfPlayersIsTooLarge,
	}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// An example dispatchable that takes a singles value as a parameter, writes the value to
		/// storage and emits an event. This function must be dispatched by a signed extrinsic.
		#[pallet::call_index(0)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn initialize(origin: OriginFor<T>, number_of_players: u8) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			ensure!(!PlayersJoinedStorage::<T>::contains_key(&who), Error::<T>::AlreadyPlaying);

			ensure!(
				number_of_players >= T::MinPlayers::get(),
				Error::<T>::NumberOfPlayersIsTooSmall
			);

			ensure!(
				number_of_players <= T::MaxPlayers::get(),
				Error::<T>::NumberOfPlayersIsTooLarge
			);

			let players = BoundedVec::<T::AccountId, T::MaxPlayers>::try_from(vec![who.clone()])
				.map_err(|_| Error::<T>::InternalError)?;

			HexBoardStorage::<T>::set(
				&who,
				Some(HexBoard {
					state: HexBoardState::Matchmaking,
					rounds: 15,
					turn: 0,
					players,
					player_turn: 0,
					selection: 2,
					last_move: 0,
					number_of_players,
					selection_base: [0; 64],
					selection_current: [0; 64],
				}),
			);

			PlayersJoinedStorage::<T>::set(&who, Some(who.clone()));

			Self::deposit_event(Event::GameInitialized { who });
			// Return a successful DispatchResultWithPostInfo
			Ok(())
		}

		#[pallet::call_index(1)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn join(origin: OriginFor<T>, creator_address: T::AccountId) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// Ensures that the player is not already playing
			ensure!(!PlayersJoinedStorage::<T>::contains_key(&who), Error::<T>::AlreadyPlaying);

			// Ensures that the hexboard exists
			let mut hex_board = match HexBoardStorage::<T>::get(&creator_address) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};
			
			// Ensures that there is enough space for the user to join the game
			ensure!(hex_board.players.len() < hex_board.number_of_players as usize, Error::<T>::GameIsFull);

			let _ = hex_board.players.try_push(who.clone());

			HexBoardStorage::<T>::set(&creator_address, Some(hex_board));

			PlayersJoinedStorage::<T>::set(&who, Some(creator_address.clone()));

			Self::deposit_event(Event::PlayerJoined { who, game: creator_address });

			Ok(())
		}

		#[pallet::call_index(2)]
		#[pallet::weight(10_000 + T::DbWeight::get().reads_writes(1,1).ref_time())]
		pub fn start(origin: OriginFor<T>) -> DispatchResult {
			let who: T::AccountId = ensure_signed(origin)?;

			// Ensures that the hexboard exists
			let mut hex_board = match HexBoardStorage::<T>::get(&who) {
				Some(value) => value,
				None => return Err(Error::<T>::GameNotInitialized.into()),
			};
			
			// Ensures that there enough players have joined the game
			ensure!(hex_board.players.len() == hex_board.number_of_players as usize, Error::<T>::NotEnoughPlayers);

			// Ensures the game has not started yet
			ensure!(hex_board.state == HexBoardState::Matchmaking, Error::<T>::GameAlreadyStarted);

			hex_board.state = HexBoardState::Playing;

			//
			// Generate new selection pieces.
			//

			HexBoardStorage::<T>::set(&who, Some(hex_board));

			Self::deposit_event(Event::GameStarted { game: who, /* More info */ });

			Ok(())
		}
	}
}
