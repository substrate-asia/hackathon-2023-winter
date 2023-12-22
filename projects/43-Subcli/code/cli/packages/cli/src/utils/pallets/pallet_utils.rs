use std::fs::read_dir;

const PALLET_DIR: &str = "./pallets";

pub fn find_pallet_with_name(
    pallet_name: &str,
    pallet_paths: &Vec<String>,
    pallet_names: &Vec<String>,
) -> Option<String> {
    if pallet_name == "" {
        // find first pallet
        log::info!("list pallet {:?}", &pallet_paths);

        if pallet_paths.is_empty() || pallet_paths.len() > 1 {
            println!("Folder pallet is empty or a least than one.");
            return None;
        }

        return Some(pallet_names.get(0).unwrap().clone());
    } else {
        let found = pallet_names
            .into_iter()
            .find(|p| p == &pallet_name)
            .is_some();

        if found == false {
            log::error!("Not found pallet {}", pallet_name);
            return None;
        } else {
            return Some(pallet_name.to_string());
        }
    }
}

pub fn list_pallet_path() -> Vec<String> {
    read_dir(PALLET_DIR)
        .and_then(|dirs| {
            let a: Vec<String> = dirs
                .map(|dir| {
                    let a1 =
                        dir.and_then(|d| Ok(d.path().to_str().unwrap_or_default().to_string()));
                    if a1.is_err() {
                        return "".to_string();
                    } else {
                        return a1.ok().unwrap();
                    }
                })
                .filter(|d| if d == "" { false } else { true })
                .collect();

            Ok(a)
        })
        .unwrap_or(vec![])
}
