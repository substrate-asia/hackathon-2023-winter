use super::share::{EMPTY_TEMPLATE, TODO_TEMPLATE};

#[derive(Debug)]
pub struct Opt {
    pub name: String,
    pub value: String,
    pub call_index: u32,
    pub weight: String,
    pub name_of_t: String,
}

impl Default for Opt {
    fn default() -> Self {
        Opt {
            name: "".to_string(),
            value: "".to_string(),
            call_index: 0,
            name_of_t: "Config".to_string(),
            weight: "10_000".to_string(),
        }
    }
}

impl ToString for Opt {
    fn to_string(&self) -> String {
        use string_builder::Builder;
        let mut builder = Builder::default();
        builder.append("#[pallet::call]\r\nimpl<T: Config> Pallet<T> {\r\n");
        builder.append(format!("#[pallet::call_index({})]\r\n", self.call_index));
        if !self.weight.is_empty() {
            builder.append(format!("#[pallet::weight({})]\r\n", self.weight));
        }
        builder.append(format!(
            "pub fn {}(origin: OriginFor<T>, value: {}) -> DispatchResult {}\r\n",
            self.name,
            self.value,
            "{".to_string(),
        ));
        builder.append(format!("{}\r\n", TODO_TEMPLATE.to_string()));
        builder.append("let who = ensure_signed(origin)?;\r\nOk(())\r\n");
        builder.append("}}\r\n");
        match builder.string() {
            Ok(data) => data,
            Err(err) => {
                println!("generate event err {:?}", err);
                EMPTY_TEMPLATE.to_string()
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::utils::pallets::extrinsic::*;
    #[test]
    fn test_extrinsic_to_string() {
        let v = Opt {
            name: "do_something".to_string(),
            call_index: 10,
            value: "u32".to_string(),
            // weight: "T::WeightInfo::do_something()".to_string(),
            ..Default::default()
        };
        println!("{}", v.to_string())
    }
}
