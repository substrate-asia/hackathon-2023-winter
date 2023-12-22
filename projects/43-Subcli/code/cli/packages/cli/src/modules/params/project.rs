use clap::Args;

use crate::utils::pallets::download_node_template::{create_project, update_project, Opt};

#[derive(Args, Default, Debug)]
pub struct ProjectArg {
    #[clap(help = "Name of project")]
    project: String,

    #[clap(short, long, default_value = ".", help = "Target dir to create new substrate node")]
    directory: Option<String>,
}

impl ProjectArg {
    pub async fn exec(&self) -> Result<(), Box<dyn std::error::Error>> {
        let opt = Opt {
            name: self.project.to_string().to_lowercase(),
            directory: self.directory.clone().unwrap_or_default().to_string(),
        };
        create_project(opt.name.clone(), opt.directory.clone()).await?;
        update_project(opt.name.clone(), opt.directory.clone())?;
        println!("create project {} successfully", opt.name);
        Ok(())
    }
}
