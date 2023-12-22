use core::fmt;
use std::fs::{self};

use crate::utils::pallets::{pallet_utils::list_pallet_path, share::parse_ast_from_file};
use anyhow::Result;
use std::error::Error;
use std::path::Path;
#[derive(Debug)]
pub enum FileError {
    ReadError(std::io::Error),
    WrongAttribute,
    NotFoundAttribute,
    NotFoundPallet,
    MultiplePallets,
}

impl fmt::Display for FileError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FileError::ReadError(inner) => write!(f, "Read Error:{}", inner),
            FileError::WrongAttribute => write!(f, "Wrong Attribute in Pallet"),
            FileError::NotFoundAttribute => write!(f, "Not found Attribute in Pallet"),
            FileError::NotFoundPallet => write!(f, "Not found Pallet"),
            FileError::MultiplePallets => write!(f, "Multiple Pallets found"),
        }
    }
}

impl Error for FileError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            FileError::ReadError(ref inner) => Some(inner),
            _ => None,
        }
    }
}

/// return list path to pallet file
/// (name_pallet, path_to_pallet)
pub fn find_pallet_file() -> Option<Vec<(String, String)>> {
    let root_pallet = "./pallets";
    let root_dir = fs::read_dir(root_pallet);

    let mut result: Vec<(String, String)> = Vec::new();
    match root_dir {
        Err(e) => {
            println!("read dir {} err {}", root_pallet, e);
            return None;
        }
        Ok(entries) => {
            for entry in entries {
                match entry {
                    Ok(dir_entry) => {
                        let dir_path = dir_entry.path().to_str().unwrap_or_default().to_string();
                        if dir_path.is_empty() {
                            continue;
                        }
                        let name_file_pallet = dir_path.split("/").last().unwrap_or_default();
                        if name_file_pallet.is_empty() {
                            continue;
                        }
                        let pallet_path = format!("{}/src/lib.rs", dir_path);
                        if is_exist_pallet_in_path(&pallet_path) {
                            result.push((
                                name_file_pallet.to_string().clone(),
                                pallet_path.to_string().clone(),
                            ));
                        }
                    }
                    _ => {}
                }
            }
        }
    }
    return Some(result);
}

/// find path to pallet by name
pub fn find_pallet_file_by_name(name_pallet: &str) -> Option<String> {
    let list = find_pallet_file();
    match list {
        None => {
            println!("not found pallet file");
            return None;
        }
        Some(list) => {
            if name_pallet.is_empty() {
                if list.len() == 1 {
                    return Some(list[0].1.clone());
                } else {
                    println!("more than one pallet file");
                    return None;
                }
            }
            for v in list.iter() {
                if v.0 == name_pallet {
                    return Some(v.1.to_string().clone());
                }
            }
        }
    }
    None
}

pub fn find_lib_pallet_unwrap(
    pallet_name: &Option<String>,
) -> Result<String, Box<dyn std::error::Error>> {
    let pallet_path = match pallet_name.clone() {
        Some(pallet_name) => find_pallet_file_by_name(&pallet_name),
        None => {
            let pallet_paths = list_pallet_path();
            if pallet_paths.is_empty() {
                return Err(FileError::NotFoundPallet.into());
            } else if pallet_paths.len() > 1 {
                return Err(FileError::MultiplePallets.into());
            } else {
                let default_pallet_path = &pallet_paths[0];

                let path = Path::new(default_pallet_path);
                let pallet_name = path.file_name().and_then(|n| n.to_str());
                find_pallet_file_by_name(pallet_name.unwrap())
            }
        }
    };

    let pallet_path_unwrap = pallet_path.ok_or_else(|| FileError::NotFoundPallet)?;
    Ok(pallet_path_unwrap)
}
pub fn is_exist_pallet_in_path(file_path: &str) -> bool {
    match parse_ast_from_file(file_path) {
        Err(_) => false,
        Ok(_) => true,
    }
}

#[cfg(test)]
mod tests {
    use crate::modules::params::share::*;
    #[test]
    fn test_find_pallet_file() {
        let list = find_pallet_file();
        match list {
            None => println!("not found pallets in path"),
            Some(list) => {
                for v in list.iter() {
                    println!("name pallet: {}, path: {}", v.0, v.1);
                }
            }
        }
    }
}
