use std::{fs::OpenOptions, io::Read};

use crate::utils::pallets::func;
use proc_macro2::{Ident, Span};
use syn::{ImplItem, Item};

use super::{
    pallet_mod,
    share::{self, get_max_call_index, get_pallet_from_file, EMPTY_TEMPLATE, PALLET_PATH_DEFAULT},
    storage,
};
use anyhow::Result;
use std::error::Error;
#[derive(Debug)]
pub struct Opt {
    pub pallet_path: String,
    pub struct_name: String,
    pub extrinsic_params: Vec<(String, String)>,
    pub type_fn_gen: Vec<String>,
    pub storage_pallet_name: String,
    pub storage_pallet_type: storage::StorageType,
}

impl Default for Opt {
    fn default() -> Self {
        Opt {
            pallet_path: PALLET_PATH_DEFAULT.to_string(),
            struct_name: "".to_string(),
            type_fn_gen: Vec::new(),
            extrinsic_params: Vec::new(),
            // storage_pallet: storage::Type::Value(storage::Opt::default()),
            storage_pallet_name: "".to_string(),
            storage_pallet_type: storage::StorageType::Value(storage::StorageProperty::default()),
        }
    }
}

impl ToString for Opt {
    fn to_string(&self) -> String {
        if self.struct_name.is_empty() {
            return EMPTY_TEMPLATE.to_string();
        }
        if self.type_fn_gen.len() == 0 {
            return EMPTY_TEMPLATE.to_string();
        }
        // find extrinsic params for extrinsic
        let extrinsic_params: Vec<(String, String)> = match self.storage_pallet_type {
            storage::StorageType::Value(_) => self.extrinsic_params.clone(),
            storage::StorageType::Map(_) => {
                share::get_struct_from_pallet(self.pallet_path.as_ref(), self.struct_name.as_ref())
                    .clone()
            }
            _ => {
                unimplemented!()
            }
        };
        use string_builder::Builder;
        let mut builder = Builder::default();
        let mut call_index = 100;
        for v in self.type_fn_gen.iter() {
            let type_fn = v.to_lowercase();
            builder.append(self.to_string_by_type(&type_fn, call_index, extrinsic_params.clone()));
            builder.append("\r\n");
            call_index += 1;
        }
        match builder.string() {
            Ok(data) => data,
            Err(err) => {
                println!("generate_storage_value err {:?}", err);
                EMPTY_TEMPLATE.to_string()
            }
        }
    }
}

impl Opt {
    pub fn to_string_by_type(
        &self,
        type_fn: &str,
        call_index: u32,
        extrinsic_params: Vec<(String, String)>,
    ) -> String {
        let mut fn_gen: Vec<func::Type> = Vec::new();
        match type_fn {
            "create" => {
                let fn_create_opt = func::Type::Create(func::Opt {
                    name: format!("create_{}", self.struct_name.to_lowercase()),
                    call_index,
                    weight: 10000.to_string(),
                    name_struct: self.struct_name.to_string(),
                    extrinsic_params,
                    storage_pallet_name: self.storage_pallet_name.clone(),
                    storage_pallet_type: self.storage_pallet_type.clone(),
                });
                fn_gen.push(fn_create_opt);
            }
            "update" => {
                let fn_create_opt = func::Type::Update(func::Opt {
                    name: format!("update_{}", self.struct_name.to_lowercase()),
                    call_index,
                    weight: 10000.to_string(),
                    name_struct: self.struct_name.to_string(),
                    extrinsic_params,
                    storage_pallet_name: self.storage_pallet_name.clone(),
                    storage_pallet_type: self.storage_pallet_type.clone(),
                });
                fn_gen.push(fn_create_opt);
            }
            "delete" => {
                let fn_create_opt = func::Type::Delete(func::Opt {
                    name: format!("delete_{}", self.struct_name.to_lowercase()),
                    call_index,
                    weight: 10000.to_string(),
                    name_struct: self.struct_name.to_string(),
                    extrinsic_params,
                    storage_pallet_name: self.storage_pallet_name.clone(),
                    storage_pallet_type: self.storage_pallet_type.clone(),
                });
                fn_gen.push(fn_create_opt);
            }
            _ => {
                println!("invalid type gem fn")
            }
        }
        use string_builder::Builder;
        let mut builder: Builder = Builder::default();
        // builder.append("#[pallet::call]\r\nimpl<T: Config> Pallet<T> {\r\n");
        for gen in fn_gen.iter() {
            builder.append(gen.to_string());
            builder.append("\r\n");
        }
        // builder.append("}");
        match builder.string() {
            Ok(data) => {
                return data;
            }
            Err(err) => {
                println!("generate_storage_value err {:?}", err);
                EMPTY_TEMPLATE.to_string()
            }
        }
    }

    pub fn save_to_file(&self) -> Result<(), Box<dyn Error>> {
        pallet_mod::must_valid_mod_pallet(&self.pallet_path);
        init_pallet_call(&self.pallet_path);
        let mut ast = share::parse_ast_from_file(&self.pallet_path)?;

        for item in ast.items.iter_mut() {
            match item {
                Item::Mod(m) => {
                    if m.ident.to_string() != "pallet" {
                        continue;
                    }
                    let mut c = m.content.clone().unwrap().clone();
                    for content in c.1.iter_mut().rev() {
                        match content {
                            Item::Impl(item) => {
                                let mut call_index = get_max_call_index(self.pallet_path.as_str())
                                    .unwrap_or_default()
                                    + 1;
                                // let struct_params = share::get_struct_from_pallet(
                                //     self.pallet_path.as_ref(),
                                //     self.struct_name.as_ref(),
                                // )
                                // .clone();

                                let extrinsic_params: Vec<(String, String)> = match self
                                    .storage_pallet_type
                                {
                                    storage::StorageType::Value(_) => self.extrinsic_params.clone(),
                                    storage::StorageType::Map(_) => share::get_struct_from_pallet(
                                        self.pallet_path.as_ref(),
                                        self.struct_name.as_ref(),
                                    )
                                    .clone(),
                                    _ => {
                                        unimplemented!()
                                    }
                                };

                                for v in self.type_fn_gen.iter() {
                                    let new_method_str = self.to_string_by_type(
                                        v,
                                        call_index,
                                        extrinsic_params.clone(),
                                    );
                                    if new_method_str.trim().is_empty() {
                                        continue;
                                    }
                                    let new_method: Result<ImplItem, syn::Error> =
                                        syn::parse_str(&new_method_str);
                                    match new_method {
                                        Err(e) => println!("err {}", e),
                                        Ok(new_method_item) => {
                                            item.items.push(new_method_item);
                                            call_index += 1;
                                        }
                                    };
                                }
                                //break;
                            }
                            Item::Enum(item) => match self.storage_pallet_type {
                                storage::StorageType::Value(_) => continue,
                                storage::StorageType::Map(_) => {
                                    if item.ident.to_string().as_str() != "Error" {
                                        continue;
                                    } else {
                                        // add error value into Error
                                        let error_name_existed =
                                            format!("{}Existed", self.struct_name);
                                        let error_name_not_existed =
                                            format!("{}NotExisted", self.struct_name);
                                        let mut variants = item.variants.clone();
                                        for variant in variants.iter() {
                                            if variant.ident.to_string() == error_name_existed
                                                || variant.ident.to_string() == error_name_existed
                                            {
                                                return Ok(());
                                            }
                                        }
                                        let new_variant_existed = syn::Variant {
                                            attrs: Vec::new(),
                                            discriminant: None,
                                            ident: Ident::new(
                                                &error_name_existed,
                                                Span::call_site(),
                                            ),
                                            fields: syn::Fields::Unit,
                                        };
                                        let new_variant_not_existed = syn::Variant {
                                            attrs: Vec::new(),
                                            discriminant: None,
                                            ident: Ident::new(
                                                &error_name_not_existed,
                                                Span::call_site(),
                                            ),
                                            fields: syn::Fields::Unit,
                                        };
                                        variants.push(new_variant_existed);
                                        variants.push(new_variant_not_existed);

                                        item.variants = variants;
                                    }
                                }
                                _ => {
                                    unimplemented!()
                                }
                            },
                            _ => {}
                        }
                    }
                    m.content = Some(c);
                }
                _ => {}
            }
        }
        share::write_file(&self.pallet_path, prettyplease::unparse(&ast).as_str());
        Ok(())
    }
}

fn init_pallet_call(file_path: &str) {
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
            let item = get_pallet_from_file(&ast, share::PalletAttr::Extrinsic, "");
            if let None = item {
                let new_content = quote::quote!(
                    #[pallet::call]
                    impl<T: Config> Pallet<T> {}
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
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::utils::pallets::extrinsic_template::*;

    #[test]
    fn test_init_pallet_call() {
        init_pallet_call(
            "/home/sondq/Documents/substrace/cli/packages/cli/src/utils/pallets/pallet.rs",
        )
    }

    #[test]
    fn test_extrinsic_to_string() {
        let v = Opt {
            pallet_path: "/home/sondq/Documents/substrace/cli/pallet.rs".to_string(),
            struct_name: "Student".to_string(),
            type_fn_gen: vec![
                "create".to_string(),
                "update".to_string(),
                "delete".to_string(),
            ],
            storage_pallet_name: "MyMapStorage".to_string(),
            storage_pallet_type: storage::StorageType::Map(storage::StorageProperty::default()),
            ..Default::default()
        };
        println!("{}", v.to_string());
        v.save_to_file();
    }
}
