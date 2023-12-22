use anyhow::Result;
use clap::{Parser, Subcommand};
mod modules;
mod utils;
use modules::params::*;
use std::error::Error;

#[derive(Parser)]
#[clap(author, version, about)]
pub struct Cli {
    #[clap(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    //TODO
    New(project::ProjectArg),
    Pallet(pallet::PalletArg),
    Struct(strct::StructArg),
    Extrinsic(extrinsic::ExtrinsicArg),
    Event(event::EventArg),
    Error(error::ErrorArg),
    Storage {
        #[clap(subcommand)]
        cmd: storage::StorageCmd,
    },
}

pub async fn execute(cmd: &Commands) -> Result<(), Box<dyn Error>> {
    //TODO
    match cmd {
        Commands::New(s) => s.exec().await?,
        Commands::Pallet(s) => s.exec()?,
        Commands::Storage { cmd } => cmd.exec()?,
        Commands::Struct(s) => s.exec()?,
        Commands::Extrinsic(s) => s.exec(),
        Commands::Event(s) => s.exec(),
        Commands::Error(s) => s.exec(),
    }
    Ok(())
}
