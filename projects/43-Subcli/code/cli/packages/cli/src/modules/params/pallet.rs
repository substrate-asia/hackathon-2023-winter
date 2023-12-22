use clap::Parser;
use std::path::PathBuf;

use crate::utils::pallets::pallet_template::Template;
use anyhow::Result;

#[derive(Parser, Debug)]
pub struct PalletArg {
    /// Pallet Name
    name: String,
    /// Path to store generated pallet
    #[clap(short, long)]
    target_dir: Option<PathBuf>,
    #[clap(short, long)]
    branch: Option<String>,
}

impl PalletArg {
    pub fn exec(&self) -> Result<(), anyhow::Error> {
        Template::default()
            .with_name(Some(self.pallet_name()))
            .with_target_dir(self.target_dir.clone())
            .generate()?;
        Ok(())
    }
}

pub trait PalletConfig {
    fn pallet_name(&self) -> String;
    //TODO
    //fn config_file_path(&self) -> Result<PathBuf>;
}

impl PalletConfig for PalletArg {
    fn pallet_name(&self) -> String {
        self.name.to_string()
    }
    // TODO
    // fn config_file_path(&self) -> Result<PathBuf> {
    //     let current_path = env::current_dir();
    //     match current_path {
    //         Ok(path) => {
    //             let join = path.join(self.target_dir.clone().unwrap_or_default());
    //             if !join.exists() {
    //                 fs::create_dir_all(self.target_dir.clone().unwrap_or_default())?;
    //             }
    //             return Ok(join)
    //         }
    //         Err(e) => Err(anyhow!(" Error: {}", e)),
    //     }

    //     // return Ok(current_path)
    // }
}
