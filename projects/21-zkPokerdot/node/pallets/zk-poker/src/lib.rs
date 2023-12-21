#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;
#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_support::{pallet_prelude::*, traits::Randomness};
	use frame_system::pallet_prelude::*;
	use pallet_zk_snarks;
	use scale_info::prelude::string::String;
	use sha2::{Digest, Sha256};
	use sp_std::vec::Vec;

	fn generate_room_number(seed: u32) -> u32 {
		// 使用 sha256 哈希函数
		let mut hasher = Sha256::new();
		// 将 seed 转换为字节数组并输入到 hasher 中
		hasher.update(seed.to_be_bytes());
		let result = hasher.finalize();

		// 将哈希值转换为一个 u32 类型的房间号
		let hash_as_array = result.as_slice();
		let mut room_number: u32 = 0;
		for (i, &val) in hash_as_array.iter().enumerate() {
			room_number += (val as u32) << (i * 8);
		}

		room_number
	}

	// 2. Declaration of the Pallet type
	// This is a placeholder to implement traits and methods.
	#[pallet::pallet]
	#[pallet::without_storage_info]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(PhantomData<T>);

	// 3. Runtime Configuration Trait
	// All types and constants go here.
	// Use #[pallet::constant] and #[pallet::extra_constants]
	// to pass in values to metadata.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
	}

	// 4. Runtime Storage
	// Use to declare storage items.
	#[pallet::storage]
	pub type Proofs<T: Config> = StorageMap<_, Blake2_128Concat, u32, u128>;

	#[pallet::storage]
	#[pallet::getter(fn my_game)]
	pub type Game<T: Config> = StorageMap<_, Blake2_128Concat, u32, u32, ValueQuery>;

	#[pallet::storage]
	#[pallet::getter(fn my_game_players)]
	pub type GamePlayers<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		u32,
		Vec<<T as frame_system::Config>::AccountId>,
		ValueQuery,
	>;

	// 5. Runtime Events
	// Can stringify event types to metadata.
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		ClaimCreated(u32, u128),
		// 游戏已经创建
		GameCreated(u32),
		// 玩家加入游戏
		GamerJoined(u32),
	}

	#[pallet::error]
	pub enum Error<T> {
		// 玩家人数已满
		GamerEnough,
		// 请勿重复加入游戏
		PlayerAlreadyJoined,
	}

	// 7. Extrinsics
	// Functions that are callable from outside the runtime.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::weight(0)]
		pub fn create_claim(
			origin: OriginFor<T>,
			id: u32,
			claim: u128,
		) -> DispatchResultWithPostInfo {
			ensure_signed(origin)?;
			Proofs::<T>::insert(&id, &claim);

			Self::deposit_event(Event::ClaimCreated(id, claim));
			Ok(().into())
		}

		#[pallet::weight(0)]
		pub fn create_game(origin: OriginFor<T>, room: u32) -> DispatchResultWithPostInfo {
			// Account calling this dispatchable.
			let sender = ensure_signed(origin)?;
			// 检查存储中是否已存在相同的seed
			ensure!(!Game::<T>::contains_key(&room), "Room already exists");
			let game_id: u32 = generate_room_number(room);
			Game::<T>::insert(&room, &game_id);
			Self::deposit_event(Event::GameCreated(game_id));
			Ok(().into())
		}

		#[pallet::weight(0)]
		pub fn join_game(origin: OriginFor<T>, game_name: u32) -> DispatchResultWithPostInfo {
			// Account calling this dispatchable.
			let gamer = ensure_signed(origin)?;
			let game_id = Game::<T>::get(&game_name);
			// 获取当前 key 对应的 Vec
			let accounts = GamePlayers::<T>::get(&game_id);

			// 检查玩家数量是否超出限制
			if accounts.len() >= 3 {
				return Err(Error::<T>::GamerEnough.into())
			}

			// 检查玩家是否已存在于列表中
			if accounts.contains(&gamer) {
				return Err(Error::<T>::PlayerAlreadyJoined.into())
			}

			// 向 vector 中添加一个新的 AccountID
			let mut new_accounts = accounts.clone();
			new_accounts.push(gamer.clone());

			// 存入新的 Vector
			GamePlayers::<T>::insert(&game_id, new_accounts);
			let num_players = accounts.len() as u32; // 玩家数量
			Self::deposit_event(Event::GamerJoined(num_players));

			Ok(().into())
		}

		#[pallet::weight(0)]
		pub fn shuffle(
			origin: OriginFor<T>,
			id: u32,
			cards: Vec<u32>,
		) -> DispatchResultWithPostInfo {
			Ok(().into())
		}

		#[pallet::weight(0)]
		pub fn unmask(
			origin: OriginFor<T>,
			id: u32,
			unmask: Vec<u32>,
		) -> DispatchResultWithPostInfo {
			Ok(().into())
		}

		#[pallet::weight(0)]
		pub fn call(origin: OriginFor<T>, id: u32) -> DispatchResultWithPostInfo {
			Ok(().into())
		}

		#[pallet::weight(0)]
		pub fn play(origin: OriginFor<T>, id: u32, cards: Vec<u32>) -> DispatchResultWithPostInfo {
			Ok(().into())
		}
	}
}
