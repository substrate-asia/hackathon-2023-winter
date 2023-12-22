use std::fs::OpenOptions;
use std::io::{Read, Write};

use super::share::get_pallet_from_file;
/// Make sure pallet in path valid
pub fn must_valid_mod_pallet(file_path: &str) {
    let file = OpenOptions::new()
        .create(true)
        .read(true)
        .write(true)
        .open(file_path);
    if let Err(e) = file {
        println!("read file {} err {}", file_path, e);
        return;
    }
    let mut content = String::new();
    _ = file.unwrap().read_to_string(&mut content);
    let ast = syn::parse_file(&content.trim());
    if let Err(e) = ast {
        println!(
            "parse file {} err {} -> override default pallet template",
            file_path, e
        );
        init_new_pallet(file_path);
        return;
    }
    if let None = get_pallet_from_file(&mut ast.unwrap(), super::share::PalletAttr::Mod, "") {
        init_new_pallet(file_path);
        return;
    }
}

fn init_new_pallet(file_path: &str) {
    let new_mod_pallet = quote::quote!(
        #![cfg_attr(not(feature = "std"), no_std)]
        pub use pallet::*;

        #[frame_support::pallet]
        pub mod pallet {
            use super::*;
            #[pallet::pallet]
            pub struct Pallet<T>(_);
        }

    );
    let file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(file_path);
    if let Err(e) = file {
        println!("open file to write {} err {}", file_path, e);
        return;
    }
    let mut f = file.unwrap();
    let _ = f.write_all(new_mod_pallet.to_string().as_bytes());
}

#[cfg(test)]
mod tests {
    use crate::utils::pallets::pallet_mod::*;

    #[test]
    fn test_must_valid_mod_pallet() {
        let file_path = "/home/sondq/Documents/substrace/cli/pallet.rs";
        must_valid_mod_pallet(file_path);
    }
}
