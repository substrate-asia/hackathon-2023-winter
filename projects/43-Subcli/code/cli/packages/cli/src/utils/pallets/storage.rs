use quote::quote;
use std::fmt::Display;
use syn::{Item, ItemType, ItemUse};

use crate::utils::pallets::share::first_letter_to_uppper_case;
use anyhow::Result;
use std::error::Error;
// use super::share::EMPTY_TEMPLATE;
use super::share::{self, EMPTY_TEMPLATE};

#[derive(Debug, Clone)]
pub enum StorageType {
    Value(StorageValueProperty),
    Map(StorageValueProperty),
    DoubleKeyMap(OptMap),
    Nmap(OptMap),
}
impl Default for StorageType {
    fn default() -> Self {
        StorageType::Value(StorageValueProperty::default())
    }
}

#[derive(Debug, Clone)]
pub struct StorageValueProperty {
    pub name: String,
    pub getter: bool,
    pub hash: String,
    pub key: String,
    pub value: String,
    pub query_kind: String,
    pub name_of_t: String,
    pub on_empty: String,
    pub max_values: String,
    // pub fn_gen_type: Vec<String>,
}

impl Default for StorageValueProperty {
    fn default() -> Self {
        StorageValueProperty {
            name: String::from(""),
            value: String::from(""),
            getter: false,
            hash: String::from("Blake2_128Concat"),
            key: String::from(""),
            query_kind: String::from("OptionQuery"),
            name_of_t: String::from("Config"),
            on_empty: "".to_string(),
            max_values: "".to_string(),
            // fn_gen_type: Vec::new(),
        }
    }
}

impl Display for StorageType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let storage_template = match self {
            StorageType::Value(val) => generate_storage_value(val),
            StorageType::Map(val) => generate_storage_map(val),
            StorageType::DoubleKeyMap(val) => generate_double_storage_map(val),
            StorageType::Nmap(val) => generate_n_storage_map(val),
        };
        write!(f, "{}", storage_template)
    }
}

impl StorageType {
    pub fn insert_storage_into_pallet(&self, path_file: &str) -> Result<(), Box<dyn Error>> {
        let mut ast = share::parse_ast_from_file(path_file)?;

        for item in ast.items.iter_mut() {
            match item {
                Item::Mod(module) => {
                    if module.ident.to_string() != "pallet".to_string() {
                        continue;
                    }
                    let mut module_content = module.content.clone().unwrap().clone();
                    let mut last_idx: Option<usize> = None;
                    for (idx, content) in module_content.1.iter_mut().enumerate().rev() {
                        match content {
                            Item::Type(_) => {
                                last_idx = Some(idx);
                                break;
                            }
                            Item::Macro(_) => {
                                log::debug!("marco in pallet: {}", quote!(marco));
                            }
                            _ => {}
                        }
                    }

                    let item_use = quote!(use sp_std::prelude::*;);
                    let new_item_use: ItemUse = 
                    syn::parse_str(&item_use.to_string()).unwrap();
                    module_content
                    .1
                    .insert(last_idx.unwrap(), Item::Use(new_item_use));
                    let new_item_type: Result<ItemType, syn::Error> =
                        syn::parse_str(&self.to_string());
                    match new_item_type {
                        Err(e) => println!(
                            "err parse item type {} \r\n {} ",
                            e,
                            self.to_string().trim()
                        ),
                        Ok(new_struct_item) => {

                            if let Some(idx) = last_idx {

                                module_content
                                    .1
                                    .insert(idx + 1, Item::Type(new_struct_item));
                            } else {
                                // Nếu không có type thì thêm ở cuối file
                                module_content
                                    .1
                                    .insert(module_content.1.len(), Item::Type(new_struct_item));
                            }
                        }
                    };
                    module.content = Some(module_content);
                }
                _ => {}
            }
        }
        //println!("quote:{:?}", quote::quote!(#ast).to_string());
        share::write_file(path_file, prettyplease::unparse(&ast).as_str());
        Ok(())
    }
}

#[derive(Debug, Clone)]
pub struct OptMap {
    pub name: String,
    pub getter: bool,
    pub keys: Vec<(String, String)>,
    pub value: String,
    pub query_kind: String,
    pub name_of_t: String,
    pub on_empty: String,
    pub max_values: String,
    // pub fn_gen_type: Vec<String>,
}

impl Default for OptMap {
    fn default() -> Self {
        OptMap {
            name: String::from(""),
            value: String::from(""),
            getter: false,
            keys: Vec::new(),
            query_kind: String::from("ValueQuery"),
            name_of_t: String::from("Config"),
            on_empty: "".to_string(),
            max_values: "".to_string(),
            // fn_gen_type: Vec::new(),
        }
    }
}

fn generate_storage_value(params: &StorageValueProperty) -> String {
    use string_builder::Builder;
    let mut builder = Builder::default();
    builder.append("#[pallet::storage]\r\n");
    if !params.name.is_empty() && params.getter {
        builder.append(format!(
            "#[pallet::getter(fn {}_value)]\r\n",
            params.name.to_ascii_lowercase()
        ))
    }
    builder.append(format!(
        "pub type {}<T> = StorageValue<_, {}, {}>;\r\n",
        first_letter_to_uppper_case(params.name.clone()),
        params.value,
        params.query_kind
    ));
    match builder.string() {
        Ok(data) => data,
        Err(err) => {
            println!("generate_storage_value err {:?}", err);
            EMPTY_TEMPLATE.to_string()
        }
    }
}

fn generate_storage_map(v: &StorageValueProperty) -> String {
    let opt = v.clone();
    use string_builder::Builder;
    let mut builder = Builder::default();
    builder.append("#[pallet::storage]\r\n");
    builder.append("#[pallet::unbounded]\r\n");
    if !opt.name.is_empty() && opt.getter {
        builder.append(format!(
            "#[pallet::getter(fn {}_map)]\r\n",
            opt.name.to_ascii_lowercase()
        ))
    }
    builder.append(format!(
        "pub type {}<T: {}> = StorageMap<_, {}, {}, {}, {}",
        first_letter_to_uppper_case(opt.name.clone()),
        opt.name_of_t,
        opt.hash,
        opt.key,
        opt.value,
        opt.query_kind
    ));
    if !opt.on_empty.is_empty() {
        builder.append(format!(",{}", opt.on_empty));
    }
    if !opt.max_values.is_empty() {
        builder.append(format!(",{}", opt.max_values));
    }
    builder.append(">;\r\n");
    match builder.string() {
        Ok(data) => data,
        Err(err) => {
            println!("generate_storage_value err {:?}", err);
            EMPTY_TEMPLATE.to_string()
        }
    }
}

/*
#[pallet::storage]
pub(super) type SomeDoubleMap<T: Config> = StorageDoubleMap<
    _,
    Blake2_128Concat, u32,
    Blake2_128Concat, T::AccountId,
    u32,
    ValueQuery
>;
 */
fn generate_double_storage_map(opt: &OptMap) -> String {
    if opt.keys.len() < 2 {
        return EMPTY_TEMPLATE.to_string();
    }
    use string_builder::Builder;
    let mut builder = Builder::default();
    builder.append("#[pallet::storage]\r\n");

    builder.append(format!(
        "pub(super) type {}<T: {}> = StorageDoubleMap<_, {}, {}, {}, {}",
        first_letter_to_uppper_case(opt.name.clone()),
        opt.name_of_t,
        opt.keys[0].1,
        opt.keys[0].0,
        opt.keys[1].1,
        opt.keys[1].0,
    ));
    builder.append(format!(",{}, {}", opt.value, opt.query_kind));
    if !opt.on_empty.is_empty() {
        builder.append(format!(",{}", opt.on_empty));
    }
    if !opt.max_values.is_empty() {
        builder.append(format!(",{}", opt.max_values));
    }
    builder.append(">;\r\n");
    match builder.string() {
        Ok(data) => data,
        Err(err) => {
            println!("generate_storage_value err {:?}", err);
            super::share::EMPTY_TEMPLATE.to_string()
        }
    }
}

/*
#[pallet::storage]
#[pallet::getter(fn some_nmap)]
pub(super) type SomeNMap<T: Config> = StorageNMap<
    _,
    (
        NMapKey<Blake2_128Concat, u32>,
        NMapKey<Blake2_128Concat, T::AccountId>,
        NMapKey<Twox64Concat, u32>,
    ),
    u32,
    ValueQuery,
>;
 */
fn generate_n_storage_map(opt: &OptMap) -> String {
    use string_builder::Builder;
    let mut builder = Builder::default();
    builder.append("#[pallet::storage]\r\n");
    if !opt.name.is_empty() && opt.getter {
        builder.append(format!(
            "#[pallet::getter(fn {}_nmap)]\r\n",
            opt.name.to_ascii_lowercase()
        ))
    }
    builder.append(format!(
        "pub(super) type {}<T: {}> = StorageNMap<_,(\r\n",
        first_letter_to_uppper_case(opt.name.clone()),
        opt.name_of_t
    ));
    for key in opt.keys.iter() {
        let k = key.0.clone();
        let hash = key.1.clone();
        builder.append(format!("NMapKey<{}, {}>,\r\n", k, hash))
    }
    builder.append(format!("), {}, {}", opt.value, opt.query_kind));
    if !opt.on_empty.is_empty() {
        builder.append(format!(",{}", opt.on_empty));
    }
    if !opt.max_values.is_empty() {
        builder.append(format!(",{}", opt.max_values));
    }
    builder.append(">;\r\n");

    match builder.string() {
        Ok(data) => data,
        Err(err) => {
            println!("generate_storage_value err {:?}", err);
            super::share::EMPTY_TEMPLATE.to_string()
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::utils::pallets::storage::*;
    use proc_macro2::{TokenStream, TokenTree};

    fn format_token_stream(tokens: TokenStream) -> String {
        let mut formatted_code = String::new();
        let mut indentation = 0;

        for token in tokens {
            match &token {
                TokenTree::Group(group) => {
                    formatted_code.push_str(&format!("{:#}", group.stream()));
                }
                _ => {
                    let token_str = token.to_string();
                    if token_str == "{" {
                        formatted_code.push_str(&format!("{} {{\n", "    ".repeat(indentation)));
                        indentation += 1;
                    } else if token_str == "}" {
                        indentation -= 1;
                        formatted_code.push_str(&format!("{}}}\n", "    ".repeat(indentation)));
                    } else {
                        formatted_code.push_str(&format!(
                            "{}{} ",
                            "    ".repeat(indentation),
                            token_str
                        ));
                    }
                }
            }
        }

        formatted_code
    }

    #[test]
    fn test_generate_storage_value() {
        let data = generate_storage_value(&&StorageValueProperty {
            name: "Machine".to_string(),
            value: "u32".to_string(),
            getter: true,
            ..StorageValueProperty::default()
        });
        // println!("{}", data);

        let func_quote = quote! {
            fn new_function() {
                println!("")
            }
        };
        println!("{}", format_token_stream(func_quote));
    }

    #[test]
    fn test_generate_storage_map() {
        let data = generate_storage_map(&&StorageValueProperty {
            name: "Students".to_string(),
            key: "AccountId".to_string(),
            value: "Student".to_string(),
            getter: true,
            hash: "Blake2_128".to_string(),
            query_kind: "ValueQuery".to_string(),
            on_empty: "OnEmpty".to_string(),
            max_values: "MaxValues".to_string(),
            ..StorageValueProperty::default()
        });
        println!("{}", data);
    }

    #[test]
    fn test_generate_double_storage_map() {
        let data = generate_double_storage_map(&OptMap {
            name: "SomeDoubleMap".to_string(),
            // hash_1: "Blake2_128Concat".to_string(),
            // key_1: "u32".to_string(),
            // hash_2: "Blake2_256Concat".to_string(),
            // key_2: "u64".to_string(),
            keys: vec![
                ("Blake2_128Concat".to_string(), "u32".to_string()),
                ("Blake2_256Concat".to_string(), "u64".to_string()),
            ],
            value: "u8".to_string(),
            on_empty: "OnEmpty".to_string(),
            max_values: "MaxValues".to_string(),
            ..Default::default()
        });
        println!("{}", data);
    }

    #[test]
    fn test_generate_n_storage_map() {
        let data = generate_n_storage_map(&OptMap {
            name: "MyNMap".to_string(),
            getter: true,
            keys: vec![
                ("Blake2_128Concat".to_string(), "u32".to_string()),
                ("Blake2_128Concat".to_string(), "T::AccountId".to_string()),
                ("Twox64Concat".to_string(), "u64".to_string()),
            ],
            value: "u32".to_string(),
            on_empty: "OnEmpty".to_string(),
            max_values: "MaxValues".to_string(),
            ..Default::default()
        });
        println!("{}", data);
    }

    #[test]
    fn test_gen_file() {}
}
