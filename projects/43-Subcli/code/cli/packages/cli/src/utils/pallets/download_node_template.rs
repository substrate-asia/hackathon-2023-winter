use convert_case::{Case, Casing};
use std::fs;
use std::io::Cursor;

#[derive(Debug)]
pub struct Opt {
    pub name: String,
    pub directory: String,
}
use anyhow::Result;

//type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync>>;

pub async fn create_project(
    project_name: String,
    to_directory: String,
) -> Result<(), Box<dyn std::error::Error>> {
    let url = "https://github.com/substrate-developer-hub/substrate-node-template/archive/refs/tags/v0.9.40.zip".to_string();
    let tmp_path = &format!("{}.zip", project_name);
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
    let renamed_folder = format!("{}/{}", to_directory, project_name);
    println!(
        "Renamed folder: {} -> {}",
        extracted_folder.clone(),
        renamed_folder
    );
    let _ = fs::rename(extracted_folder.clone(), renamed_folder)?;

    let renamed_folder = format!("{}/{}", to_directory, project_name);
    println!(
        "Renamed folder: {} -> {}",
        format!("{}/pallets/template", renamed_folder.clone()),
        format!("{}/pallets/{}", renamed_folder.clone(), project_name)
    );
    let _ = fs::rename(
        format!("{}/pallets/template", renamed_folder.clone()),
        format!("{}/pallets/{}", renamed_folder.clone(), project_name),
    )?;

    // Delete the zip file
    fs::remove_file(tmp_path)?;

    Ok(())
}

pub fn update_project(
    project_name: String,
    to_directory: String,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut path = format!("{to_directory}/{project_name}/Cargo.toml");
    println!("Updating file: {}", path);
    let mut updated_content =
        fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

    updated_content = updated_content.replace(
        "pallets/template",
        format!("pallets/{}", project_name).as_str(),
    );

    fs::write(path.clone(), updated_content)
        .expect(format!("Failed to write to {path} file").as_str());

    // Update: pallets/template/Cargo.toml
    path = format!("{to_directory}/{project_name}/pallets/{project_name}/Cargo.toml");
    println!("Updating file: {}", path);
    updated_content =
        fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

    updated_content = updated_content.replace(
        "pallet-template",
        format!("pallet-{}", project_name).as_str(),
    );

    fs::write(path.clone(), updated_content)
        .expect(format!("Failed to write to {path} file").as_str());

    // Update: pallets/template/src/mock.rs
    path = format!("{to_directory}/{project_name}/pallets/{project_name}/src/mock.rs");
    println!("Updating file: {}", path);
    updated_content =
        fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

    updated_content = updated_content.replace(
        "pallet_template",
        format!("pallet_{}", project_name).as_str(),
    );

    updated_content = updated_content.replace(
        "TemplateModule",
        format!("{}{}", project_name.to_case(Case::Title), "Module").as_str(),
    );

    fs::write(path.clone(), updated_content)
        .expect(format!("Failed to write to {path} file").as_str());

    // Update: pallets/template/tests.rs
    path = format!("{to_directory}/{project_name}/pallets/{project_name}/src/tests.rs");
    println!("Updating file: {}", path);
    updated_content =
        fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

    updated_content = updated_content.replace(
        "TemplateModule",
        format!("{}{}", project_name.to_case(Case::Title), "Module").as_str(),
    );

    fs::write(path.clone(), updated_content)
        .expect(format!("Failed to write to {path} file").as_str());

    // Update: runtime/Cargo.toml
    path = format!("{to_directory}/{project_name}/runtime/Cargo.toml");
    println!("Updating file: {}", path);
    updated_content =
        fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

    updated_content = updated_content.replace(
        "pallet-template",
        format!("pallet-{}", project_name).as_str(),
    );
    updated_content = updated_content.replace(
        "pallets/template",
        format!("pallets/{}", project_name).as_str(),
    );

    fs::write(path.clone(), updated_content)
        .expect(format!("Failed to write to {path} file").as_str());

    // Update: runtime/src/lib.rs
    path = format!("{to_directory}/{project_name}/runtime/src/lib.rs");
    println!("Updating file: {}", path);
    updated_content =
        fs::read_to_string(path.clone()).expect(format!("Failed to read {path} file").as_str());

    updated_content = updated_content.replace(
        "pallet_template",
        format!("pallet_{}", project_name).as_str(),
    );
    updated_content = updated_content.replace(
        "TemplateModule",
        format!("{}{}", project_name.to_case(Case::Title), "Module").as_str(),
    );

    fs::write(path.clone(), updated_content)
        .expect(format!("Failed to write to {path} file").as_str());

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_fetch_url() {
        let project_name = "TODO".to_string();
        let to_directory = "test_extraction".to_string();

        let result = create_project(project_name.clone(), to_directory.clone()).await;

        assert!(result.is_ok(), "create_project should return Ok");

        // Verify that the extracted files exist
        let expected_files = vec![
            format!(
                "{}/{}/pallets/template/src/lib.rs",
                to_directory, project_name
            ),
            format!("{}/{}/Cargo.toml", to_directory, project_name),
        ];
        for file in expected_files {
            assert!(
                std::path::Path::new(&file).exists(),
                "File {} should exist",
                file
            );
        }

        // Clean up - delete the extracted files
        let _ = fs::remove_dir_all(to_directory);
    }
}
