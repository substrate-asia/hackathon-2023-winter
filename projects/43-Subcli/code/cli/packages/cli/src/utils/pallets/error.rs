use proc_macro2::{Ident, Span};
use syn::Item;

use crate::modules::params::share::FileError;

use super::share::{self, write_file, EMPTY_TEMPLATE, TODO_TEMPLATE};
use anyhow::Result;
use std::error::Error;
#[derive(Debug)]
pub struct Opt {
    // pub name: String,
    pub types: Vec<String>,
}

impl Default for Opt {
    fn default() -> Self {
        Opt {
            // name: String::from(""),
            types: Vec::new(),
        }
    }
}

impl ToString for Opt {
    fn to_string(&self) -> String {
        use string_builder::Builder;
        let mut builder = Builder::default();
        builder.append("#[pallet::error]\r\n");
        builder.append("pub enum Error<T> {\r\n");
        builder.append(format!("{}\r\n", TODO_TEMPLATE.to_string()));
        for t in self.types.iter() {
            builder.append(format!("{},\r\n", t))
        }
        builder.append("}");
        match builder.string() {
            Ok(data) => data,
            Err(err) => {
                println!("generate event err {:?}", err);
                EMPTY_TEMPLATE.to_string()
            }
        }
    }
}

pub fn add_error(path_file: &str, name_err: &str, val_error: &str) -> Result<(), Box<dyn Error>> {
    if path_file.is_empty() || name_err.is_empty() || val_error.is_empty() {
        return Err(FileError::NotFoundPallet.into());
    }
    let mut ast = share::parse_ast_from_file(path_file)?;

    for item in ast.items.iter_mut() {
        match item {
            Item::Mod(m) => {
                if m.ident.to_string() != "pallet" {
                    continue;
                }
                let mut c = m.content.clone().unwrap().clone();
                for content in c.1.iter_mut().rev() {
                    match content {
                        Item::Enum(item) => {
                            if item.ident.to_string().as_str() != name_err {
                                continue;
                            } else {
                                let mut variants = item.variants.clone();
                                for variant in variants.iter() {
                                    if variant.ident.to_string() == val_error {
                                        return Ok(());
                                    }
                                }
                                let new_variant = syn::Variant {
                                    attrs: Vec::new(),
                                    discriminant: None,
                                    ident: Ident::new(val_error, Span::call_site()),
                                    fields: syn::Fields::Unit,
                                };
                                variants.push(new_variant);
                                item.variants = variants;
                            }
                        }
                        _ => {}
                    }
                }
                m.content = Some(c);
            }
            _ => {}
        }
    }
    //println!("Result here:{}", quote::quote!(#ast));

    write_file(path_file, prettyplease::unparse(&ast).as_str());
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::utils::pallets::error::*;

    #[test]
    fn test_error_to_string() {
        let v = Opt {
            // name: String::from("MyError"),
            // value: String::from("Student"),
            types: vec!["NoneValue".to_string(), "StorageOverflow".to_string()],
            ..Default::default()
        };
        println!("{}", v.to_string())
    }

    #[test]
    fn test_add_error() {
        let path_file =
            "/home/sondq/Documents/substrace/cli/packages/cli/src/utils/pallets/pallet.rs";
        let name_err = "Error";
        let val_error = "new_error2";
        //let res = find_error_index(path_file, name_err, val_error);
    }
}
