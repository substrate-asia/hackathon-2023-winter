use super::share::{EMPTY_TEMPLATE, TODO_TEMPLATE};

#[derive(Debug)]
pub struct Opt {
    pub runtime_event: String,
    pub weight: String,
}

impl Default for Opt {
    fn default() -> Self {
        Opt {
            runtime_event: "RuntimeEvent".to_string(),
            weight: "WeightInfo".to_string(),
        }
    }
}

impl ToString for Opt {
    fn to_string(&self) -> String {
        use string_builder::Builder;
        let mut builder = Builder::default();
        builder.append("#[pallet::config]\r\npub trait Config: frame_system::Config {\r\n");
        builder.append(format!("{}\r\n", TODO_TEMPLATE.to_string()));
        if !self.runtime_event.is_empty() {
            builder.append(format!("type {}: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;\r\n", self.runtime_event));
        }
        if !self.weight.is_empty() {
            builder.append(format!("type {}: WeightInfo;\r\n", self.weight));
        }
        builder.append("}");
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
    use crate::utils::pallets::config::*;
    #[test]
    fn test_config_to_string() {
        let v = Opt {
            ..Default::default()
        };
        println!("{}", v.to_string())
    }
}
