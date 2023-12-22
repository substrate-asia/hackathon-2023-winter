use crate::modules::params::share::find_pallet_file_by_name;
use crate::share::FileError;
use crate::utils::pallets::pallet_utils::list_pallet_path;
use crate::utils::pallets::share::parse_keyhash;
use crate::utils::pallets::strct::{self, parse_struct_field};
use anyhow::Result;
use clap::Parser;
use std::error::Error;
use std::path::Path;
#[derive(Parser, Debug)]
pub struct StructArg {
    #[arg(value_name = "STRUCT NAME")]
    pub name: String,
    #[clap(
        value_name = "FIELDS OF STRUCT",
        help = "Array of fields in a struct",
        num_args = 0..,
    )]
    pub params: Vec<String>,
    #[clap(long, short, value_name = "PALLET NAME")]
    pub pallet: Option<String>,
}

impl StructArg {
    pub fn exec(&self) -> Result<(), Box<dyn Error>> {
        let params = self.params.join(" ");
        let opt = strct::Opt {
            name: self.name.clone(),
            values: parse_struct_field(params),
        };
        let pallet_name = match self.pallet.clone() {
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
        if let Some(path) = pallet_name {
            opt.save_to_file(&path)?;
            return Ok(());
        } else {
            Err(FileError::NotFoundPallet.into())
        }
    }
}
