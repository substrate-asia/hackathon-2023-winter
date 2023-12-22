use crate::utils::pallets::extrinsic;
use clap::Args;

#[derive(Args, Default, Debug)]
pub struct ExtrinsicArg {
    #[arg(short, long)]
    name: String,
    #[arg(short, long)]
    index_call: u32,
    #[arg(short, long)]
    value: String,
    #[arg(short, long)]
    weight: String,
}

impl ExtrinsicArg {
    pub fn exec(&self) {
        let opt = extrinsic::Opt {
            name: self.name.to_string(),
            call_index: self.index_call,
            value: self.value.to_string(),
            weight: self.weight.to_string(),
            ..Default::default()
        };
        println!(
            "generate extrinsic with {:?} \r\n {}",
            self,
            opt.to_string()
        );
    }
}
