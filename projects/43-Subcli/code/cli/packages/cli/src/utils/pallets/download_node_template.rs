use convert_case::{Case, Casing};
use std::env;
use std::fs;
use std::fs::File;
use std::io::Cursor;
use std::io::Read;
use std::io::Write;
use std::path::PathBuf;
const DEPENDENCIES_NAME: &'static str = "[dependencies]";
use quote::quote;

const PROPERTIES_NAME: &'static str = "// Properties";

#[derive(Debug)]
pub struct Opt {
    pub project_name: String,
    pub directory: Option<String>,
    pub token_symbol: Option<String>,
    pub token_decimal: Option<usize>,
}
use anyhow::{Context, Result};

use crate::utils::pallets::share::write_file;

impl Opt {
    pub async fn create_project(&self) -> Result<(), Box<dyn std::error::Error>> {
        let to_directory = self.directory.clone().unwrap_or_else(|| String::from("."));
        let url = "https://github.com/substrate-developer-hub/substrate-node-template/archive/refs/tags/v0.9.40.zip".to_string();
        let tmp_path = &format!("{}.zip", self.project_name);
        let response = reqwest::get(url).await?;

        if !response.status().is_success() {
            return Err(format!("Failed to retrieve file from URL: {}", response.status()).into());
        }

        let mut tmp_file = std::fs::File::create(tmp_path)?;
        let mut content = Cursor::new(response.bytes().await?);
        std::io::copy(&mut content, &mut tmp_file)?;

        // Unzip the file
        let file = fs::File::open(tmp_path)?;
        let reader = std::io::BufReader::new(file);
        let mut archive = zip::ZipArchive::new(reader)?;

        // Extract to the project_name directory
        //let extraction_path = format!("{}/{}", to_directory, project_name);
        let _ = archive.extract(to_directory.clone())?;

        // Rename the extracted folder
        let extracted_folder = format!(
            "{}/{}",
            to_directory.clone(),
            archive.by_index(0)?.name().trim_end_matches('/')
        );
        let renamed_folder = format!("{}/{}", to_directory, self.project_name);
        println!(
            "Renamed folder: {} -> {}",
            extracted_folder.clone(),
            renamed_folder
        );
        let _ = fs::rename(extracted_folder.clone(), renamed_folder)?;

        let renamed_folder = format!("{}/{}", to_directory, self.project_name);
        println!(
            "Renamed folder: {} -> {}",
            format!("{}/pallets/template", renamed_folder.clone()),
            format!("{}/pallets/{}", renamed_folder.clone(), self.project_name)
        );
        let _ = fs::rename(
            format!("{}/pallets/template", renamed_folder.clone()),
            format!("{}/pallets/{}", renamed_folder.clone(), self.project_name),
        )?;

        // Delete the zip file
        fs::remove_file(tmp_path)?;

        Ok(())
    }

    pub fn add_dependencies_node(&self) -> Result<()> {
        let current_dir = env::current_dir()
            .ok()
            .with_context(|| " Unable get root dir")?;
        let mut project_path = PathBuf::new();

        if let Some(dir) = self.directory.clone() {
            let project_string = format!("{}/{}", dir, self.project_name);
            project_path.push(&project_string);
        } else {
            project_path.push(&self.project_name);
        }
        let project_dir = current_dir.join(&project_path);

        let node_cargo_dir = project_dir.join("node/Cargo.toml");
        let mut cargo_file = File::open(node_cargo_dir.clone())?;

        let mut cargo_file_contents = String::new();
        cargo_file.read_to_string(&mut cargo_file_contents)?;

        let index_import_serde_json = cargo_file_contents
            .lines()
            .into_iter()
            .position(|line| line == DEPENDENCIES_NAME)
            .unwrap();

        let import_serde = quote!(serde_json = "1");
        let mut contents = cargo_file_contents
            .lines()
            .into_iter()
            .collect::<Vec<&str>>();
        let import_serde_string = import_serde.to_string();
        // Insert serde_json dependency after [dependencies] in node/Cargo.toml
        contents.insert(index_import_serde_json + 1, &import_serde_string);

        let mutated_contents = contents.join("\r\n");

        let mut updated_file = File::create(node_cargo_dir)?;

        updated_file.write_all(mutated_contents.as_bytes())?;

        Ok(())
    }

    pub fn add_properties_chain_spec(&self) -> Result<()> {
        if self.token_symbol.is_none() && self.token_decimal.is_none() {
            return Ok(());
        } else {
            let symbol = self.token_symbol.as_ref().unwrap();
            let decimal = self.token_decimal.as_ref().unwrap();

            let current_dir = env::current_dir()
                .ok()
                .with_context(|| " Unable get root dir")?;
            let mut project_path = PathBuf::new();

            if let Some(dir) = self.directory.clone() {
                let project_string = format!("{}/{}", dir, self.project_name);
                project_path.push(&project_string);
            } else {
                project_path.push(&self.project_name);
            }
            let project_dir = current_dir.join(&project_path);

            let node_spec_dir = project_dir.join("node/src/chain_spec.rs");
            let mut chain_spec_file = File::open(node_spec_dir.clone())?;

            let mut chain_spec_contents = String::new();
            chain_spec_file.read_to_string(&mut chain_spec_contents)?;

            let index_properties: Vec<usize> = chain_spec_contents
                .lines()
                .enumerate()
                .filter(|line| line.1.trim() == PROPERTIES_NAME)
                .map(|line| {
                    // return index
                    line.0
                })
                .collect();
            let properties_pattern = format!("Some(serde_json::from_str(\"{{\\\"tokenDecimals\\\":{},\\\"tokenSymbol\\\":\\\"{}\\\"}}\").expect(\"Provided valid json map\")),", decimal, symbol);
            let mut contents = chain_spec_contents
                .lines()
                .into_iter()
                .collect::<Vec<&str>>();
            //println!("contents:{:?}",contents);
            for index in index_properties.iter().rev() {
                contents.remove(index + 1);
                contents.insert(*index + 1, properties_pattern.as_str());
            }

            //println!("token:{:?}", contents);
            let mutated_contents = contents.join("\r\n");

            let ast: syn::File = syn::parse_file(&mutated_contents).unwrap();
            write_file(
                node_spec_dir.to_str().unwrap(),
                prettyplease::unparse(&ast).as_str(),
            );
            Ok(())
        }
    }
    pub fn update_project(&self) -> Result<(), Box<dyn std::error::Error>> {
        // Add serde_json to node/Cargo.toml
        self.add_dependencies_node()?;
        self.add_properties_chain_spec()?;

        let to_directory = self.directory.clone().unwrap_or_else(|| String::from("."));

        let mut path = format!("{}/{}/Cargo.toml", to_directory, self.project_name);
        println!("Updating file: {}", path);
        let mut updated_content =
            fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

        updated_content = updated_content.replace(
            "pallets/template",
            format!("pallets/{}", self.project_name).as_str(),
        );

        fs::write(path.clone(), updated_content)
            .expect(format!("Failed to write to {path} file").as_str());

        // Update: pallets/template/Cargo.toml
        path = format!(
            "{to_directory}/{}/pallets/{}/Cargo.toml",
            self.project_name, self.project_name
        );
        println!("Updating file: {}", path);
        updated_content =
            fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

        updated_content = updated_content.replace(
            "pallet-template",
            format!("pallet-{}", self.project_name).as_str(),
        );

        fs::write(path.clone(), updated_content)
            .expect(format!("Failed to write to {path} file").as_str());

        // Update: pallets/template/src/mock.rs
        path = format!(
            "{to_directory}/{}/pallets/{}/src/mock.rs",
            self.project_name, self.project_name
        );
        println!("Updating file: {}", path);
        updated_content =
            fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

        updated_content = updated_content.replace(
            "pallet_template",
            format!("pallet_{}", self.project_name).as_str(),
        );

        updated_content = updated_content.replace(
            "TemplateModule",
            format!("{}{}", self.project_name.to_case(Case::Title), "Module").as_str(),
        );

        fs::write(path.clone(), updated_content)
            .expect(format!("Failed to write to {path} file").as_str());

        // Update: pallets/template/tests.rs
        path = format!(
            "{to_directory}/{}/pallets/{}/src/tests.rs",
            self.project_name, self.project_name
        );
        println!("Updating file: {}", path);
        updated_content =
            fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

        updated_content = updated_content.replace(
            "TemplateModule",
            format!("{}{}", self.project_name.to_case(Case::Title), "Module").as_str(),
        );

        fs::write(path.clone(), updated_content)
            .expect(format!("Failed to write to {path} file").as_str());

        // Update: runtime/Cargo.toml
        path = format!("{to_directory}/{}/runtime/Cargo.toml", self.project_name);
        println!("Updating file: {}", path);
        updated_content =
            fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

        updated_content = updated_content.replace(
            "pallet-template",
            format!("pallet-{}", self.project_name).as_str(),
        );
        updated_content = updated_content.replace(
            "pallets/template",
            format!("pallets/{}", self.project_name).as_str(),
        );

        fs::write(path.clone(), updated_content)
            .expect(format!("Failed to write to {path} file").as_str());

        // Update: runtime/src/lib.rs
        path = format!("{to_directory}/{}/runtime/src/lib.rs", self.project_name);
        println!("Updating file: {}", path);
        updated_content =
            fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

        updated_content = updated_content.replace(
            "pallet_template",
            format!("pallet_{}", self.project_name).as_str(),
        );
        updated_content = updated_content.replace(
            "TemplateModule",
            format!("{}{}", self.project_name.to_case(Case::Title), "Module").as_str(),
        );

        fs::write(path.clone(), updated_content)
            .expect(format!("Failed to write to {path} file").as_str());

        Ok(())
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[tokio::test]
//     async fn test_fetch_url() {
//         let project_name = "TODO".to_string();
//         let to_directory = "test_extraction".to_string();

//         let result = create_project(project_name.clone(), to_directory.clone()).await;

//         assert!(result.is_ok(), "create_project should return Ok");

//         // Verify that the extracted files exist
//         let expected_files = vec![
//             format!(
//                 "{}/{}/pallets/template/src/lib.rs",
//                 to_directory, project_name
//             ),
//             format!("{}/{}/Cargo.toml", to_directory, project_name),
//         ];
//         for file in expected_files {
//             assert!(
//                 std::path::Path::new(&file).exists(),
//                 "File {} should exist",
//                 file
//             );
//         }

//         // Clean up - delete the extracted files
//         let _ = fs::remove_dir_all(to_directory);
//     }
// }
