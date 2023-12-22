use super::{
    share::{EMPTY_TEMPLATE, TODO_TEMPLATE},
    storage,
};

#[derive(Debug, Default)]
pub struct Opt {
    pub name: String,
    pub call_index: u32,
    pub weight: String,
    pub name_struct: String,
    pub extrinsic_params: Vec<(String, String)>,
    pub storage_pallet_name: String,
    pub storage_pallet_type: storage::StorageType,
}

pub enum Type {
    Create(Opt),
    Update(Opt),
    Delete(Opt),
}

impl ToString for Type {
    fn to_string(&self) -> String {
        match self {
            Type::Create(opt) => gen_create_fn(opt),
            Type::Update(opt) => gen_update_fn(opt),
            Type::Delete(opt) => gen_delete_fn(opt),
        }
    }
}
// TODO: hanlder not struct
fn gen_create_fn(opt: &Opt) -> String {
    // EMPTY_TEMPLATE.to_string()
    match opt.storage_pallet_type {
        storage::StorageType::Value(_) => gen_create_storage_value_fn(opt),
        storage::StorageType::Map(_) => gen_create_storate_map_fn(opt),
        storage::StorageType::DoubleKeyMap(_) => gen_create_storate_double_map_fn(opt),
        storage::StorageType::Nmap(_) => gen_create_storate_nmap_fn(opt),
    }
}

fn gen_update_fn(opt: &Opt) -> String {
    // EMPTY_TEMPLATE.to_string()
    match opt.storage_pallet_type {
        storage::StorageType::Value(_) => gen_create_storage_value_fn(opt),
        storage::StorageType::Map(_) => gen_update_storage_map_fn(opt),
        storage::StorageType::DoubleKeyMap(_) => gen_create_storate_double_map_fn(opt),
        storage::StorageType::Nmap(_) => gen_create_storate_nmap_fn(opt),
    }
}

fn gen_delete_fn(opt: &Opt) -> String {
    // EMPTY_TEMPLATE.to_string()
    match opt.storage_pallet_type {
        storage::StorageType::Value(_) => gen_create_storage_value_fn(opt),
        storage::StorageType::Map(_) => gen_delete_storage_map_fn(opt),
        storage::StorageType::DoubleKeyMap(_) => gen_create_storate_double_map_fn(opt),
        storage::StorageType::Nmap(_) => gen_create_storate_nmap_fn(opt),
    }
}

fn gen_create_storage_value_fn(opt: &Opt) -> String {
    if opt.extrinsic_params.len() == 0 {
        return EMPTY_TEMPLATE.to_string();
    }
    use string_builder::Builder;
    let mut builder = Builder::default();
    builder.append(format!("#[pallet::call_index({})]\r\n", opt.call_index));
    if !opt.weight.is_empty() {
        builder.append(format!("#[pallet::weight({})]\r\n", opt.weight));
    }
    let param = opt.extrinsic_params[0].clone();
    builder.append(format!(
        "pub fn {}(origin: OriginFor<T>, {}: {} ) -> DispatchResult {{\r\n",
        opt.name, param.0, param.1
    ));
    builder.append(format!("{} \n\n", TODO_TEMPLATE));
    builder.append("let who = ensure_signed(origin)?;\r\n");
    builder.append(format!(
        "<{}<T>>::put({});",
        opt.storage_pallet_name, param.0
    ));
    builder.append(format!(
        "
    Ok(())
		}}"
    ));
    match builder.string() {
        Ok(data) => data,
        Err(err) => {
            println!("generate_storage_value err {:?}", err);
            EMPTY_TEMPLATE.to_string()
        }
    }
}

fn gen_create_storate_map_fn(opt: &Opt) -> String {
    use string_builder::Builder;
    let mut builder = Builder::default();
    builder.append(format!("#[pallet::call_index({})]\r\n", opt.call_index));
    if !opt.weight.is_empty() {
        builder.append(format!("#[pallet::weight({})]\r\n", opt.weight));
    }
    builder.append(format!("pub fn {}(origin: OriginFor<T>", opt.name));
    for v in opt.extrinsic_params.iter() {
        builder.append(format!(", {}: {}", v.0, v.1))
    }
    builder.append(") -> DispatchResult {\r\n");
    builder.append(format!("{} \r\n", TODO_TEMPLATE));
    builder.append("let who = ensure_signed(origin)?;\r\n");
    let err_exist = format!("{}", opt.name_struct);
    builder.append(format!(
        "if let Some(_) = {0}::<T>::get(&who) {{
        return Err(Error::<T>::{1}Existed.into())
    }}",
        opt.storage_pallet_name, err_exist
    ));
    let mut name_new_struct: String = format!("new_{}\r\n", opt.name_struct.to_lowercase());
    if opt.extrinsic_params.len() > 0 {
        builder.append(format!(
            "let {0} = {1} {{ ",
            name_new_struct, opt.name_struct,
        ));
        for v in opt.extrinsic_params.iter() {
            builder.append(format!("{},", v.0))
        }
        builder.append("};\r\n");
    } else {
        name_new_struct = opt.name_struct.clone();
    }
    builder.append(format!(
        "<{0}<T>>::insert(&who, {1});
        Ok(())
        }}",
        opt.storage_pallet_name, name_new_struct,
    ));
    match builder.string() {
        Ok(data) => data,
        Err(err) => {
            println!("generate_storage_value err {:?}", err);
            EMPTY_TEMPLATE.to_string()
        }
    }
}
fn gen_create_storate_double_map_fn(_opt: &Opt) -> String {
    EMPTY_TEMPLATE.to_string()
}
fn gen_create_storate_nmap_fn(_opt: &Opt) -> String {
    EMPTY_TEMPLATE.to_string()
}

/* UPDATE */
fn gen_update_storage_map_fn(opt: &Opt) -> String {
    if opt.extrinsic_params.len() == 0 {
        return EMPTY_TEMPLATE.to_string();
    }
    use string_builder::Builder;
    let mut builder = Builder::default();
    builder.append(format!("#[pallet::call_index({})]\r\n", opt.call_index));
    if !opt.weight.is_empty() {
        builder.append(format!("#[pallet::weight({})]\r\n", opt.weight));
    }
    builder.append(format!("pub fn {}(origin: OriginFor<T>", opt.name));
    for v in opt.extrinsic_params.iter() {
        builder.append(format!(", {}: {}", v.0, v.1))
    }
    builder.append(") -> DispatchResult {\r\n");
    builder.append(format!("{} \r\n", TODO_TEMPLATE));
    builder.append("let who = ensure_signed(origin)?;\r\n");
    let name_new_struct = format!("new_{}\r\n", opt.name_struct.to_lowercase());
    builder.append(format!(
        "if let None = {0}::<T>::get(&who) {{
        return Err(Error::<T>::{2}NotExisted.into());
        }}
        let {1} = {2} {{ ",
        opt.storage_pallet_name, name_new_struct, opt.name_struct,
    ));
    for v in opt.extrinsic_params.iter() {
        builder.append(format!("{},", v.0))
    }
    if opt.extrinsic_params.len() > 0 {
        builder.append("};\r\n");
    }
    builder.append(format!(
        "<{0}<T>>::insert(&who, {1});
    Ok(())
    }}",
        opt.storage_pallet_name, name_new_struct,
    ));
    match builder.string() {
        Ok(data) => data,
        Err(err) => {
            println!("generate_storage_value err {:?}", err);
            EMPTY_TEMPLATE.to_string()
        }
    }
}

/*
* DELETE
 */

fn gen_delete_storage_map_fn(opt: &Opt) -> String {
    if opt.extrinsic_params.len() == 0 {
        return EMPTY_TEMPLATE.to_string();
    }
    use string_builder::Builder;
    let mut builder = Builder::default();
    builder.append(format!("#[pallet::call_index({})]\r\n", opt.call_index));
    if !opt.weight.is_empty() {
        builder.append(format!("#[pallet::weight({})]\r\n", opt.weight));
    }
    builder.append(format!("pub fn {}(origin: OriginFor<T>", opt.name));
    for v in opt.extrinsic_params.iter() {
        builder.append(format!(", {}: {}", v.0, v.1))
    }
    builder.append(") -> DispatchResult {\r\n");
    builder.append(format!("{} \r\n", TODO_TEMPLATE));
    builder.append("let who = ensure_signed(origin)?;\r\n");

    builder.append(format!(
        " <{0}<T>>::remove(&who);
    Ok(())
    }}",
        opt.storage_pallet_name,
    ));
    match builder.string() {
        Ok(data) => data,
        Err(err) => {
            println!("generate_storage_value err {:?}", err);
            EMPTY_TEMPLATE.to_string()
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::utils::pallets::func::*;
    #[test]
    fn test_gen_create_storage_value_fn() {
        let template = gen_create_storage_value_fn(&Opt {
            name: "create_student".to_string(),
            call_index: 1,
            weight: "10000".to_string(),
            name_struct: "Student".to_string(),
            extrinsic_params: vec![
                ("name".to_string(), "[u8; 4]".to_string()),
                ("age".to_string(), "u8".to_string()),
                ("grage".to_string(), "u8".to_string()),
            ],
            storage_pallet_name: "Students".to_string(),
            storage_pallet_type: storage::StorageType::Value(storage::StorageValueProperty::default()),
        });
        println!("{}", template)
    }

    fn test_gen_create_storate_map_fn() {
        let template = gen_create_storage_value_fn(&Opt {
            name: "create_student".to_string(),
            call_index: 1,
            weight: "10000".to_string(),
            name_struct: "Student".to_string(),
            extrinsic_params: vec![
                ("name".to_string(), "[u8; 4]".to_string()),
                ("age".to_string(), "u8".to_string()),
                ("grage".to_string(), "u8".to_string()),
            ],
            storage_pallet_name: "Students".to_string(),
            storage_pallet_type: storage::StorageType::Value(storage::StorageValueProperty::default()),
        });
        println!("{}", template)
    }
}
