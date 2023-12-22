extern crate proc_macro;
use crate::utils::pallets::share::first_letter_to_uppper_case;

use std::{fs::OpenOptions, io::Read};
use syn::Item;

use super::{
    pallet_mod,
    share::{self, get_pallet_from_file, EMPTY_TEMPLATE, TODO_TEMPLATE},
};
#[derive(Debug)]
pub struct Opt {
    pub name: String,
    // pub value: String,
    pub getter: bool,
    pub name_of_t: String,
}

impl Default for Opt {
    fn default() -> Self {
        Opt {
            name: String::from(""),
            // value: String::from(""),
            getter: false,
            name_of_t: String::from("Config"),
        }
    }
}

impl ToString for Opt {
    fn to_string(&self) -> String {
        use string_builder::Builder;
        let mut builder: Builder = Builder::default();
        builder.append("#[pallet::event]\r\n");
        if !self.name.is_empty() && self.getter {
            builder.append(format!(
                "#[pallet::generate_deposit(pub(super) fn deposit_{})]\r\n",
                self.name.to_ascii_lowercase()
            ))
        }
        builder.append(format!(
            "pub enum {}<T: {}> {}\r\n",
            first_letter_to_uppper_case(self.name.clone()),
            self.name_of_t,
            "{"
        ));
        builder.append(format!("{}\r\n", TODO_TEMPLATE.to_string()));
        builder.append("}\r\n");
        match builder.string() {
            Ok(data) => data,
            Err(err) => {
                println!("generate event err {:?}", err);
                EMPTY_TEMPLATE.to_string()
            }
        }
    }
}

impl Opt {
    // pub fn save_to_file(&self, file_path: &str) -> Result<(), anyhow::Error> {
    //     init_event_pallet(file_path);

    //     pallet_mod::must_valid_mod_pallet(file_path);
    //     init_event_pallet(file_path);
    //     let ast = share::parse_ast_from_file(file_path);
    //     if let None = ast {
    //         return Ok(());
    //     }
    //     let mut ast: syn::File = ast.unwrap();
    //     for item in ast.items.iter_mut() {
    //         match item {
    //             Item::Mod(m) => {
    //                 if m.ident.to_string() != "pallet" {
    //                     continue;
    //                 }
    //                 let mut c = m.content.clone().unwrap().clone();
    //                 for content in c.1.iter_mut().rev() {
    //                     match content {
    //                         Item::Enum(item) => {
    //                             let enum_name: &proc_macro2::Ident = &item.ident;
    //                             if enum_name.to_string().to_lowercase() != "event" {
    //                                 continue;
    //                             }
    //                             let input = quote::quote!(
    //                                 pub enum NewEvent {
    //                                     SomethingStored { something: u32, who: T::AccountId },
    //                                 }
    //                             );
    //                             let input2: TokenStream2 = input.into();

    //                             let parsed_item: Result<ItemEnum, Error> = syn::parse2(input2);
    //                         }
    //                         _ => {}
    //                     }
    //                 }
    //                 m.content = Some(c);
    //             }
    //             _ => {}
    //         }
    //     }
    //     // share::write_file(&self.pallet_path, quote::quote!(#ast).to_string().as_str());
    //     Ok(())
    // }
}

pub fn init_event_pallet(file_path: &str) {
    pallet_mod::must_valid_mod_pallet(file_path);
    let file = OpenOptions::new().read(true).open(file_path);
    if let Err(e) = file {
        println!("read file {} err {}", file_path, e);
        return;
    }
    let mut content = String::new();
    _ = file.unwrap().read_to_string(&mut content);
    // let ast = syn::parse_file(&content);
    match syn::parse_file(&content) {
        Err(e) => {
            println!("parse file {} err {}", file_path, e);
        }
        Ok(mut ast) => {
            let item = get_pallet_from_file(&ast, share::PalletAttr::Event, "StudentCreated");
            println!("Go to here");
            println!("Result:{:?}", quote::quote!(#item.unwrap()));
            if let None = item {
                println!("Go to here 1");
                let new_content = quote::quote!(
                    #[pallet::event]
                    #[pallet::generate_deposit(pub(super) fn deposit_event)]
                    pub enum Event<T: Config> {}
                );
                for item in ast.items.iter_mut() {
                    match item {
                        Item::Mod(m) => {
                            if m.ident.to_string() != "pallet" {
                                continue;
                            }
                            // for content in m.content.clone().unwrap().1.iter().rev() {
                            let mut v = m.content.clone().unwrap();
                            v.1.push(Item::Verbatim(new_content.to_string().parse().unwrap()));
                            m.content = Some(v);
                            // }
                        }
                        _ => {}
                    }
                }
                share::write_file(file_path, quote::quote!(#ast).to_string().as_str());
            } else {
            }
        }
    }
}
#[cfg(test)]
mod tests {
    use crate::utils::pallets::event::*;
    #[test]
    fn test_event_to_string() {
        let v = Opt {
            name: String::from("MyError"),
            getter: true,
            ..Default::default()
        };
        println!("{}", v.to_string())
    }

    // #[test]
    // fn test_event_to_file() {
    //     let v = Opt {
    //         name: String::from("MyError"),
    //         getter: true,
    //         ..Default::default()
    //     };
    //     v.save_to_file(share::PALLET_PATH_DEFAULT.to_string().as_str());
    // }
}
