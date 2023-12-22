use super::{
    pallet_mod,
    share::{parse_ast_from_file, write_file, EMPTY_TEMPLATE, TODO_TEMPLATE},
};
use crate::utils::types::type_info::TypeInfo;
use anyhow::Result;
use syn::Item;

#[derive(Debug, Default, Clone)]
pub struct Opt {
    pub name: String,
    pub values: Vec<(String, String)>,
}

impl ToString for Opt {
    fn to_string(&self) -> String {
        use string_builder::Builder;
        let mut builder = Builder::default();
        builder.append(format!("#[derive(Encode, Decode, TypeInfo)]"));
        builder.append("\r\n");
        builder.append(format!("pub struct {} {}\r\n", self.name, "{"));

        builder.append(TODO_TEMPLATE);
        builder.append("\r\n");
        let default_type = "[u8;32]".to_string();
        let mut is_generic = false;
        let mut generic_values = Vec::new();
        for value in self.values.iter() {
            if value.1.is_empty() {
                builder.append(format!("{}: {},\r\n", value.0, default_type));
            } else if value.1.check_type() {
                builder.append(format!("{}: {},\r\n", value.0, value.1));
            } else {
                is_generic = true;
                generic_values.push(value.1.clone());
                builder.append(format!("{}: {},\r\n", value.0, value.1));
            }
        }
        builder.append("}\r\n");
        match builder.string() {
            Ok(data) => {
                if is_generic {
                    let mut updated_generics = generic_values.join(", ");
                    println!("Updated generic:{}", updated_generics);
                    if updated_generics.contains("T::AccountId") {
                        updated_generics = "T".to_string()
                    }
                    let updated_data = data.replace(
                        self.name.as_str(),
                        format!("{}<{}>", self.name, updated_generics).as_str(),
                    );
                    updated_data
                } else {
                    data
                }
            }
            Err(err) => {
                println!("generate event err {:?}", err);
                EMPTY_TEMPLATE.to_string()
            }
        }
    }
}

impl Opt {
    pub fn save_to_file(&self, pallet_path: &str) -> Result<(), Box<dyn std::error::Error>> {
        pallet_mod::must_valid_mod_pallet(pallet_path);
        let mut ast = parse_ast_from_file(pallet_path)?;
        for item in ast.items.iter_mut() {
            match item {
                Item::Mod(m) => {
                    if m.ident.to_string() != "pallet" {
                        continue;
                    }
                    let mut c = m.content.clone().unwrap().clone();
                    let mut last_idx: Option<usize> = None;
                    for (idx, content) in c.1.iter_mut().enumerate().rev() {
                        match content {
                            Item::Struct(_) => {
                                last_idx = Some(idx);
                                break;
                            }
                            _ => {}
                        }
                    }
                    let new_struct: Result<Item, syn::Error> =
                        syn::parse_str(self.to_string().as_str());
                    if new_struct.is_err() {
                        println!("parse new struct failed {}", self.to_string());
                        return Ok(());
                    }
                    let new_struct = new_struct.unwrap();
                    if let Some(idx) = last_idx {
                        c.1.insert(idx + 1, new_struct)
                    } else {
                        c.1.insert(c.1.len(), new_struct);
                    }
                    m.content = Some(c);
                }
                _ => {}
            }
        }

        write_file(pallet_path, prettyplease::unparse(&ast).as_str());

        Ok(())
    }
}

pub fn parse_struct_field(fields: String) -> Vec<(String, String)> {
    fields
        .split_whitespace()
        .flat_map(|field| {
            let mut parts = field.splitn(2, ':');
            let key = parts.next().unwrap_or("");
            let value = parts.next().unwrap_or("");
            vec![(key.to_string(), value.to_string())]
        })
        .collect::<Vec<(String, String)>>()
}
#[cfg(test)]
mod tests {
    use crate::utils::pallets::strct::*;
    #[test]
    fn test_struct_to_string() {
        let v = Opt {
            name: "Student".to_string(),
            values: vec![
                ("id".to_string(), "u32".to_string()),
                ("grade".to_string(), "u8".to_string()),
            ],
            ..Default::default()
        };

        println!("{}", v.to_string())
    }

    #[test]
    fn test_struct_save_to_file() {
        let v = Opt {
            name: "Studentx".to_string(),
            values: vec![
                ("id".to_string(), "u32".to_string()),
                ("grade".to_string(), "u8".to_string()),
            ],
            ..Default::default()
        };
        let _ = v.save_to_file("/home/sondq/Documents/substrace/cli/pallet.rs");
    }
}
