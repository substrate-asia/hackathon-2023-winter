use clap::Parser;
use subcli::{execute, Cli};

use env_logger;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    env_logger::init();

    let cli = Cli::parse();
    execute(&cli.command).await?;

    Ok(())
}
