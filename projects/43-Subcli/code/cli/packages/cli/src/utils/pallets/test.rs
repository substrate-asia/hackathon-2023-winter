#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://docs.substrate.io/reference/frame-pallets/>
pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;
pub use weights::*;

#[frame_support::pallet]
pub mod pallet {
    use super::*;
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    /// Configure the pallet by specifying the parameters and types on which it depends.
    #[pallet::config]
    pub trait Config: frame_system::Config {
        /// Because this pallet emits events, it depends on the runtime's definition of an event.
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        /// Type representing the weight of this pallet
        type WeightInfo: WeightInfo;
    }

    pub struct Student {
        age: String,
        name: String,
    }

    pub struct DotHack {
        time: String,
        members: Student,
    }

    // The pallet's runtime storage items.
    // https://docs.substrate.io/main-docs/build/runtime-storage/
    #[pallet::storage]
    #[pallet::getter(fn something)]
    // Learn more about declaring storage items:
    // https://docs.substrate.io/main-docs/build/runtime-storage/#declaring-storage-items
    pub type Something<T> = StorageValue<_, u32>;

    // https://docs.substrate.io/main-docs/build/runtime-storage/
    #[pallet::storage]
    #[pallet::getter(fn something)]
    // Learn more about declaring storage items:
    // https://docs.substrate.io/main-docs/build/runtime-storage/#declaring-storage-items
    pub type Something2<T> = StorageValue<_, u32>;
    #[pallet::storage]
    #[pallet::getter(fn mymap_map)]
    pub type Mymap<T: Config> = StorageMap<_, Blake2_128Concat, u32, Student, ValueQuery>;
    #[pallet::storage]
    #[pallet::getter(fn mymap_map)]
    pub type Mymap<T: Config> = StorageMap<_, Blake2_128Concat, u32, Student, ValueQuery>;
    #[pallet::storage]
    #[pallet::getter(fn mymap_map)]
    pub type Mymap<T: Config> = StorageMap<_, Blake2_128Concat, u32, Student, ValueQuery>;
    #[pallet::storage]
    #[pallet::getter(fn mymap_map)]
    pub type Mymap<T: Config> = StorageMap<_, Blake2_128Concat, u32, Student, ValueQuery>;

    // Pallets use events to inform users when important changes are made.
    // https://docs.substrate.io/main-docs/build/events-errors/
    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// Event documentation should end with an array that provides descriptive names for event
        /// parameters. [something, who]
        SomethingStored { something: u32, who: T::AccountId },
    }

    // Errors inform users that something went wrong.
    #[pallet::error]
    pub enum Error<T> {
        /// Error names should be descriptive.
        NoneValue,
        /// Errors should have helpful documentation associated with them.
        StorageOverflow,
    }

    // Dispatchable functions allows users to interact with the pallet and invoke state changes.
    // These functions materialize as "extrinsics", which are often compared to transactions.
    // Dispatchable functions must be annotated with a weight and must return a DispatchResult.
}
#[pallet::call]
impl<T: Config> Pallet<T> {
    #[pallet::call_index(0)]
    #[pallet::weight(T::WeightInfo::do_something())]
    pub fn do_something(origin: OriginFor<T>, something: u32) -> DispatchResult {
        // Check that the extrinsic was signed and get the signer.
        // This function will return an error if the extrinsic is not signed.
        // https://docs.substrate.io/main-docs/build/origins/
        let who = ensure_signed(origin)?;

        // Update storage.
        <Something<T>>::put(something);

        // Emit an event.
        Self::deposit_event(Event::SomethingStored { something, who });
        // Return a successful DispatchResultWithPostInfo
        Ok(())
    }
    #[pallet::call_index(100)]
    #[pallet::weight(10000)]
    pub fn create_student(
        origin: OriginFor<T>,
        name: [u8; 4],
        age: u16,
        grade: u8,
    ) -> DispatchResult {
        // TODO: Implement here
        let who = ensure_signed(origin)?;
        if let Some(_) = Mymap::<T>::get(&who) {
            return Err(Error::<T>::MymapExisted.into());
        }
        let new_student = Student { name, age, grade };
        <Mymap<T>>::insert(&who, new_student);
        Ok(())
    }
    #[pallet::call_index(101)]
    #[pallet::weight(10000)]
    pub fn update_student(
        origin: OriginFor<T>,
        name: [u8; 4],
        age: u16,
        grade: u8,
    ) -> DispatchResult {
        // TODO: Implement here
        let who = ensure_signed(origin)?;
        if let None = Mymap::<T>::get(&who) {
            return Err(Error::<T>::MymapNotExisted.into());
        }
        let new_student = Student { name, age, grade };
        <Mymap<T>>::insert(&who, new_student);
        Ok(())
    }
    #[pallet::call_index(102)]
    #[pallet::weight(10000)]
    pub fn delete_student(
        origin: OriginFor<T>,
        name: [u8; 4],
        age: u16,
        grade: u8,
    ) -> DispatchResult {
        // TODO: Implement here
        let who = ensure_signed(origin)?;
        <Mymap<T>>::remove(&who);
        Ok(())
    }
    #[pallet::call_index(100)]
    #[pallet::weight(10000)]
    pub fn create_student(
        origin: OriginFor<T>,
        name: [u8; 4],
        age: u16,
        grade: u8,
    ) -> DispatchResult {
        // TODO: Implement here
        let who = ensure_signed(origin)?;
        if let Some(_) = Mymap::<T>::get(&who) {
            return Err(Error::<T>::MymapExisted.into());
        }
        let new_student = Student { name, age, grade };
        <Mymap<T>>::insert(&who, new_student);
        Ok(())
    }
    #[pallet::call_index(101)]
    #[pallet::weight(10000)]
    pub fn update_student(
        origin: OriginFor<T>,
        name: [u8; 4],
        age: u16,
        grade: u8,
    ) -> DispatchResult {
        // TODO: Implement here
        let who = ensure_signed(origin)?;
        if let None = Mymap::<T>::get(&who) {
            return Err(Error::<T>::MymapNotExisted.into());
        }
        let new_student = Student { name, age, grade };
        <Mymap<T>>::insert(&who, new_student);
        Ok(())
    }
    #[pallet::call_index(102)]
    #[pallet::weight(10000)]
    pub fn delete_student(
        origin: OriginFor<T>,
        name: [u8; 4],
        age: u16,
        grade: u8,
    ) -> DispatchResult {
        // TODO: Implement here
        let who = ensure_signed(origin)?;
        <Mymap<T>>::remove(&who);
        Ok(())
    }
}
