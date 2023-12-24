use crate::utils::pallets::error;
use clap::Args;

#[derive(Args, Default, Debug)]
pub struct ErrorArg {
    // #[arg(short, long)]
    // name: String,
    #[arg(short, long)]
    values: Vec<String>,
}

impl ErrorArg {
    pub fn exec(&self) {
        let opt = error::Opt {
            // name: self.name.to_string(),
            types: self.values.clone(),
            ..Default::default()
        };
        println!("generate error with {:?} \r\n {}", self, opt.to_string());
    }
}
