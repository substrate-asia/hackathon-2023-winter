use anyhow::Result;
use quote::{quote, ToTokens};
use std::error::Error;
use std::fs::OpenOptions;
use std::io::{Read, Write};
use syn::{Expr, ImplItem, Item, Lit};
use syn::{Fields, ItemStruct};

use crate::modules::params::share::FileError;
pub static EMPTY_TEMPLATE: &str = "";
pub static TODO_TEMPLATE: &str = "// TODO: Implement here";
pub static PALLET_PATH_DEFAULT: &str = "./pallet.rs";

#[derive(PartialEq)]
pub enum PalletAttr {
    Storage,
    Pallet,
    Config,
    Event,
    Error,
    Extrinsic,
    Struct,
    Mod,
}

impl ToString for PalletAttr {
    fn to_string(&self) -> String {
        match self {
            PalletAttr::Storage => "#[pallet::storage]".to_string(),
            PalletAttr::Pallet => "#[frame_support::pallet]".to_string(),
            PalletAttr::Config => "#[pallet::config]".to_string(),
            PalletAttr::Event => "#[pallet::event]".to_string(),
            PalletAttr::Error => "#[pallet::error]".to_string(),
            PalletAttr::Extrinsic => "#[pallet::call]".to_string(),
            PalletAttr::Mod => "#[frame_support::pallet]".to_string(),
            _ => EMPTY_TEMPLATE.to_string(),
        }
    }
}

pub fn parse_keyhash(values: &Vec<String>) -> Vec<(String, String)> {
    let mut list: Vec<(String, String)> = Vec::new();
    for value in values.iter() {
        let mut key = "";
        let v = trim_whitespace(&value);
        let arr: Vec<&str> = v.split(":").collect();
        if arr.len() > 0 {
            key = arr[0];
        }
        let mut hash: &str = "";
        if arr.len() > 1 {
            hash = arr[1];
        }
        list.push((key.to_string(), hash.to_string()))
    }
    return list;
}

pub fn trim_whitespace(s: &str) -> String {
    let mut new_str = s.trim().to_owned();
    let mut prev = ' '; // The initial value doesn't really matter
    new_str.retain(|ch| {
        let result = ch != ' ' || prev != ' ';
        prev = ch;
        result
    });
    new_str
}

pub fn first_letter_to_uppper_case(s1: String) -> String {
    let mut c = s1.chars();
    match c.next() {
        None => String::new(),
        Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
    }
}

/// return Vector key:value
pub fn find_and_parse_struct(
    pallet_path: &str,
    name_struct: &str,
) -> Result<ItemStruct, Box<dyn Error>> {
    let ast = parse_ast_from_file(pallet_path)?;

    match get_pallet_from_file(&ast, PalletAttr::Struct, name_struct) {
        Some(item) => match item {
            Item::Struct(r) => Ok(r),
            _ => Err(FileError::WrongAttribute.into()),
        },
        None => Err(FileError::NotFoundAttribute.into()),
    }
}

pub fn get_struct_from_pallet(pallet_path: &str, name_struct: &str) -> Vec<(String, String)> {
    if pallet_path.is_empty() || name_struct.is_empty() {
        return Vec::new();
    }

    if let Ok(item_struct) = find_and_parse_struct(pallet_path, name_struct) {
        let mut result: Vec<(String, String)> = Vec::new();
        if let Fields::Named(named_fields) = &item_struct.fields {
            for field in &named_fields.named {
                let field_name = field.ident.as_ref().unwrap();
                let field_type: &syn::Type = &field.ty;
                let field_type_string = quote! { #field_type }.to_string();
                result.push((field_name.to_string(), field_type_string));
            }
        }
        return result;
    } else {
        return Vec::new();
    }
}

pub fn get_pallet_from_file(
    ast: &syn::File,
    pallet_type: PalletAttr,
    name: &str,
) -> Option<syn::Item> {
    for item in ast.items.iter() {
        match item {
            Item::Mod(m) => {
                if m.ident.to_string() != "pallet" {
                    continue;
                }
                if pallet_type == PalletAttr::Mod {
                    return Some(item.clone());
                }
                let content = m.content.clone();

                if content.is_none() {
                    continue;
                }
                for content in m.content.clone().unwrap().1.iter() {
                    match content {
                        Item::Struct(v) => {
                            if pallet_type == PalletAttr::Struct {
                                if name.is_empty() || name == v.ident.to_string() {
                                    return Some(content.clone());
                                }
                            }
                        }
                        Item::Enum(v) => {
                            if pallet_type == PalletAttr::Event {
                                if v.ident.to_string().to_lowercase() == "event" {
                                    return Some(content.clone());
                                }
                            }
                            if pallet_type == PalletAttr::Error {
                                if v.ident.to_string().to_lowercase() == "error" {
                                    return Some(content.clone());
                                }
                            }
                        }
                        Item::Trait(v) => {
                            if pallet_type == PalletAttr::Config {
                                if v.ident.to_string().to_lowercase() == "config" {
                                    return Some(content.clone());
                                }
                            }
                        }
                        Item::Impl(v) => {
                            if pallet_type == PalletAttr::Extrinsic {
                                return Some(content.clone());
                            }
                        }
                        _ => {}
                    }
                }
            }
            _ => {}
        }
    }
    None
}

pub fn parse_ast_from_file(file_path: &str) -> Result<syn::File, Box<dyn Error>> {
    let file = OpenOptions::new()
        .create(true)
        .read(true)
        .write(true)
        .open(file_path)
        .map_err(FileError::ReadError);

    let mut content = String::new();
    _ = file.unwrap().read_to_string(&mut content);

    let ast = syn::parse_file(&content)?;
    Ok(ast)
}

pub fn write_file(file_path: &str, content: &str) {
    match OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(file_path)
    {
        Err(e) => {
            println!("open file to write {} err {}", file_path, e);
        }
        Ok(mut f) => {
            _ = f.write_all(content.as_bytes());
        }
    };
}

pub fn get_max_call_index(pallet_path: &str) -> Result<u32, Box<dyn Error>> {
    let mut ast = parse_ast_from_file(pallet_path)?;

    let mut max_call_index: u32 = 0;
    for item in ast.items.iter_mut() {
        match item {
            Item::Mod(m) => {
                if m.ident.to_string() != "pallet" {
                    continue;
                }
                let mut c = m.content.clone().unwrap().clone();
                for content in c.1.iter_mut().rev() {
                    match content {
                        Item::Impl(v) => {
                            for item_impl in v.items.iter() {
                                if let ImplItem::Fn(item) = item_impl {
                                    for attr in &item.attrs {
                                        // println!(
                                        //     "Call Index: {}",
                                        //     attr.path().to_token_stream().to_string()
                                        // );
                                        if attr.path().to_token_stream().to_string()
                                            == "pallet :: call_index"
                                        {
                                            let arg: Result<Expr, syn::Error> = attr.parse_args();
                                            match arg {
                                                Ok(Expr::Lit(v)) => {
                                                    if let Lit::Int(call_index_lit) = v.lit {
                                                        if let Ok(call_index) =
                                                            call_index_lit.base10_parse::<u32>()
                                                        {
                                                            if max_call_index < call_index {
                                                                max_call_index = call_index;
                                                            }
                                                        }
                                                    }
                                                }
                                                _ => {}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        _ => {}
                    }
                }
            }
            _ => {}
        }
    }
    return Ok(max_call_index);
}

#[cfg(test)]
mod tests {
    use crate::utils::pallets::share::*;
    #[test]
    fn test_find_and_parse_struct() {
        let pallet_path =
            "/home/sondq/Documents/substrace/cli/packages/cli/src/utils/pallets/pallet.rs"
                .to_string();
        let _ = find_and_parse_struct(&pallet_path, "Student");
    }

    #[test]
    fn test_get_max_call_index() {
        let path_file = "/home/sondq/Documents/substrace/cli/pallet.rs";
        let _ = get_max_call_index(path_file);
    }

    #[test]
    fn test_parse_keyhash() {
        let params = vec!["Number:u32".to_string()];
        let res = parse_keyhash(&params);
        println!("res {:?}", res);
    }
}
