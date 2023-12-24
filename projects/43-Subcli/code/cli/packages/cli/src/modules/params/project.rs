use clap::Args;

use crate::utils::pallets::download_node_template::Opt;

#[derive(Args, Default, Debug)]
pub struct ProjectArg {
    #[clap(help = "Name of project")]
    project: String,

    #[clap(short, long, help = "Target dir to create new substrate node")]
    directory: Option<String>,

    #[clap(long, help = "Token symbol")]
    symbol: Option<String>,

    #[clap(long, help = "Token decimal")]
    decimal: Option<usize>,
}

impl ProjectArg {
    pub async fn exec(&self) -> Result<(), Box<dyn std::error::Error>> {
        let opt = Opt {
            project_name: self.project.to_lowercase(),
            directory: self.directory.clone(),
            token_symbol: self.symbol.clone(),
            token_decimal: self.decimal.clone(),
        };

        opt.create_project().await?;
        opt.update_project()?;
        println!("create project {} successfully", opt.project_name);
        Ok(())
    }
}
