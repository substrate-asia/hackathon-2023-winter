use openbrush::{
    modifiers,
    traits::Storage,
    contracts::ownable::*,
};

pub trait UpgradableTrait: Storage<ownable::Data> {
    #[modifiers(only_owner)]
    fn _set_code(&mut self, code_hash: [u8; 32]) -> Result<(), OwnableError> {
        ink::env::set_code_hash(&code_hash).unwrap_or_else(|_| {
            panic!(
                "Failed to `set_code_hash` has an error"
            )
        });
        ink::env::debug_println!("Switched code hash to {:?}.", code_hash);
        Ok(())
    }
}

impl<T: Storage<ownable::Data>> UpgradableTrait for T {}
