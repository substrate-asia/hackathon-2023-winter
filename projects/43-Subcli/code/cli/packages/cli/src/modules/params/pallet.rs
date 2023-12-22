use clap::Parser;
use std::path::PathBuf;

use crate::utils::pallets::pallet_template::Template;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;

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

#[derive(Serialize, Deserialize, Debug)]
struct Marketplace {
    pallets: Vec<Pallet>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Pallet {
    pallet_name: String,
    github: String,
    branch: String,
}

impl PalletArg {
    pub fn exec(&self) -> Result<(), anyhow::Error> {
        let mut file = File::open("repo.subcli")?;
        let mut data = String::new();
        file.read_to_string(&mut data)?;
        let market: Marketplace = serde_json::from_str(&data)?;

        for pallet in market.pallets.iter() {
            if pallet.pallet_name == self.pallet_name() {
                let repo = &pallet.github;
                let branch = &pallet.branch;
                Template::default()
                    .with_name(Some(self.pallet_name()))
                    .with_target_dir(self.target_dir.clone())
                    .with_repo(Some(repo.clone()))
                    .with_branch(Some(branch.clone()))
                    .with_remote(true)
                    .generate()?;
                return Ok(());
            }
        }
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
