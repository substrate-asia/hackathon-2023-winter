use crate::modules::params::share::find_pallet_file_by_name;
use crate::utils::pallets::extrinsic_template;
use crate::utils::pallets::{pallet_mod, storage};
use anyhow::Result;
use clap::Subcommand;

use crate::modules::params::share::{find_lib_pallet_unwrap, FileError};

#[derive(Subcommand, Debug)]
pub enum StorageCmd {
    Value {
        #[clap(required = true, help = "Name of storage value")]
        name_storage: String,

        #[clap(required = true, help = "Type of storage value")]
        type_value: String,

        #[clap(short = 'p', long = "pallet", help = "Pallet name")]
        pallet: Option<String>,

        #[clap(
            short = 'm',
            long = "method",
            help = "Create/ Update/ Delete Extrinsics based on StorageValue"
        )]
        method: Option<String>,

        #[clap(
            short = 'q',
            long = "query-kind",
            default_value = "OptionQuery",
            help = "Kind of query: ValueQuery, OptionQuery"
        )]
        query_kind: String,
    },
    Map {
        #[clap(required = true, help = "Name of storage map")]
        name_storage: String,

        #[clap(required = true, help = "Type of key")]
        type_key: String,

        #[clap(required = true, help = "Type of value")]
        type_value: String,

        #[clap(short = 'p', long = "pallet", help = "Pallet name")]
        pallet_name: Option<String>,

        #[clap(
            long = "hash",
            help = "Type of hash",
            default_value = "Blake2_128Concat"
        )]
        type_hash: String,

        #[clap(
            short = 'm',
            long = "method",
            help = "Create/ Update / Delete Extrinsics based on StorageMap"
        )]
        method: Option<String>,

        #[clap(
            short = 'q',
            long = "query-kind",
            default_value = "OptionQuery",
            help = "Kind of query: ValueQuery, OptionQuery"
        )]
        query_kind: String,
    },
}

impl StorageCmd {
    pub fn exec(&self) -> Result<(), Box<dyn std::error::Error>> {
        match self {
            Self::Value {
                name_storage,
                type_value,
                pallet,
                method,
                query_kind,
            } => {
                // unwrap lib file based on pallet name
                let path_lib = find_lib_pallet_unwrap(pallet)?;

                let opt = storage::StorageProperty {
                    name: name_storage.clone(),
                    getter: true,
                    value: type_value.clone(),
                    query_kind: query_kind.clone(),
                    ..Default::default()
                };
                let v = storage::StorageType::Value(opt);
                v.insert_storage_into_pallet(&path_lib)?;
                let mut fn_gen_type: Vec<String> = Vec::new();

                let mut params = Vec::new();
                params.push((name_storage.to_lowercase(), type_value.to_owned()));
                let mut ex_gen_opt = extrinsic_template::Opt {
                    pallet_path: path_lib,
                    struct_name: name_storage.to_lowercase().clone(),
                    extrinsic_params: params,
                    storage_pallet_name: name_storage.clone(),
                    storage_pallet_type: storage::StorageType::Value(
                        storage::StorageProperty::default(),
                    ),
                    ..Default::default()
                };

                if let Some(method) = method {
                    if method.contains('c') {
                        fn_gen_type.push("create".to_string());
                    }
                    if method.contains('u') {
                        fn_gen_type.push("update".to_string());
                    }
                    if method.contains('d') {
                        fn_gen_type.push("delete".to_string());
                    }
                }
                ex_gen_opt.type_fn_gen = fn_gen_type;
                ex_gen_opt.save_to_file()?;
                return Ok(());
            }
            Self::Map {
                name_storage,
                type_key,
                type_value,
                type_hash,
                pallet_name,
                method,
                query_kind,
            } => {
                let mut opt = storage::StorageProperty {
                    name: name_storage.to_owned(),
                    getter: true,
                    value: type_value.clone(),
                    key: type_key.clone(),
                    query_kind: query_kind.clone(),
                    ..Default::default()
                };
                // if have --hash flag, otherwise default type of hash

                opt.hash = type_hash.clone();

                let v = storage::StorageType::Map(opt);

                let path_lib = find_lib_pallet_unwrap(pallet_name)?;

                pallet_mod::must_valid_mod_pallet(&path_lib);
                _ = v.insert_storage_into_pallet(path_lib.as_str());
                let mut fn_gen_type: Vec<String> = Vec::new();

                let mut ex_gen_opt = extrinsic_template::Opt {
                    pallet_path: path_lib.clone(),
                    struct_name: type_value.to_string(),
                    storage_pallet_name: name_storage.clone(),
                    storage_pallet_type: storage::StorageType::Map(
                        storage::StorageProperty::default(),
                    ),
                    ..Default::default()
                };

                if let Some(method) = method {
                    if method.contains('c') {
                        fn_gen_type.push("create".to_string());
                    }
                    if method.contains('u') {
                        fn_gen_type.push("update".to_string());
                    }
                    if method.contains('d') {
                        fn_gen_type.push("delete".to_string());
                    }
                }
                ex_gen_opt.type_fn_gen = fn_gen_type;
                ex_gen_opt.save_to_file()?;

                Ok(())
            }
        }
    }
}
