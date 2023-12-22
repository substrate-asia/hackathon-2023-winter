use crate::utils::pallets::event::{self, init_event_pallet};
use clap::Args;

#[derive(Args, Default, Debug)]
pub struct EventArg {
    #[clap(short = 'n', long)]
    name: String,
    #[clap(long, short = 'p', value_name = "PALLET NAME")]
    pub pallet_name: String,
}

impl EventArg {
    pub fn exec(&self) {
        let opt = event::Opt {
            name: self.name.to_string(),
            getter: true,
            ..Default::default()
        };
        init_event_pallet(&self.pallet_name);
        println!("generate event with {:?} \r\n {}", self, opt.to_string());
    }
}
