use anyhow::{anyhow, Context, Result};
use cargo_generate::{generate as cargo_generate, Cli as CargoGen};
use clap::Parser;
use std::env;
use std::fs;
use std::fs::File;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
const DEPENDENCIES_NAME: &'static str = "[dependencies]";
const STD_NAME: &'static str = "std=[";
const RUNTIME_NAME_START: &'static str = "pub struct Runtime {";
const RUNTIME_NAME_END: &'static str = "}";
#[derive(Clone)]
pub struct Template {
    /// Generated directory name
    name: String,

    /// Git repo url to used as template
    repo: String,

    branch: String,

    sub_folder: Option<String>,

    target_dir: PathBuf,

    is_remote: bool,
}

impl Default for Template {
    fn default() -> Self {
        Self {
            name: "template".to_string(),
            repo: "https://github.com/SubCli/cli.git".to_string(),
            branch: "main".to_string(),
            sub_folder: Some("templates/pallet".to_string()),
            target_dir: Path::new("pallets").to_path_buf(),
            is_remote: false,
        }
    }
}
impl Template {
    pub fn with_name(&self, name: Option<String>) -> Template {
        Template {
            name: name.unwrap_or_else(|| "template".to_string()),
            ..self.clone()
        }
    }
    pub fn with_target_dir(&self, target_dir: Option<PathBuf>) -> Template {
        Template {
            target_dir: target_dir.unwrap_or_else(|| self.target_dir.clone()),
            ..self.clone()
        }
    }

    pub fn with_repo(&self, repo: Option<String>) -> Template {
        Template {
            repo: repo.unwrap_or_else(|| self.repo.clone()),
            ..self.clone()
        }
    }

    pub fn with_branch(&self, branch: Option<String>) -> Template {
        Template {
            branch: branch.unwrap_or_else(|| self.branch.clone()),
            ..self.clone()
        }
    }

    pub fn with_remote(&self, is_remote: bool) -> Template {
        Template {
            is_remote,
            ..self.clone()
        }
    }

    pub fn change_package_name(&self, pallets_dir: PathBuf) -> Result<()> {
        let toml_dir = pallets_dir.join("Cargo.toml");
        let mut cargo_file = File::open(toml_dir.clone())?;

        let mut cargo_file_contents = String::new();
        cargo_file.read_to_string(&mut cargo_file_contents)?;

        let mutated_cargo_contents = cargo_file_contents.replace(
            "pallet-template",
            ["pallet", self.name.as_str()].join("-").as_str(),
        );

        // Write the changes back to the file
        let mut updated_file = File::create(toml_dir)?;
        updated_file.write_all(mutated_cargo_contents.as_bytes())?;

        Ok(())
    }
    pub fn get_runtime_path(&self) -> Result<PathBuf, anyhow::Error> {
        let current_dir = env::current_dir()
            .ok()
            .with_context(|| "Unable get root dir")?;
        let runtime_dir = current_dir.join("runtime");
        if !runtime_dir.exists() {
            return Err(anyhow!("Runtime folder is not existing"));
        } else {
            return Ok(runtime_dir);
        }
    }
    // Add pallet directory to runtime Cargo.toml
    pub fn import_pallet_package(
        &self,
        runtime_dir: &PathBuf,
        is_remote: bool,
    ) -> Result<(), anyhow::Error> {
        let runtime_cargo_dir = runtime_dir.join("Cargo.toml");
        let mut cargo_file = File::open(runtime_cargo_dir.clone())?;

        let mut cargo_file_contents = String::new();
        cargo_file.read_to_string(&mut cargo_file_contents)?;

        //let mut path_pallet = String::new();
        let path_pallet = if is_remote {
            format!("git = \"{}\", branch = \"{}\"", self.repo, self.branch)
        } else {
            format!("path = \"../{}/{}\"", self.target_dir.display(), self.name)
        };
        let import_pallet = format!(
            "pallet-{} = {{ version = \"4.0.0-dev\", default-features = false, {} }}",
            self.name, path_pallet
        );
        let import_std = format!("\t\"pallet-{}/std\",", self.name);

        let index_import_pallet = cargo_file_contents
            .lines()
            .into_iter()
            .position(|line| line == DEPENDENCIES_NAME)
            .unwrap();
        let index_import_std = cargo_file_contents
            .lines()
            .into_iter()
            .position(|line| line.replace(" ", "") == STD_NAME && line.starts_with("std"))
            .unwrap();

        let mut contents = cargo_file_contents
            .lines()
            .into_iter()
            .collect::<Vec<&str>>();

        // Insert pallet dependency after [dependencies] in runtime/Cargo.toml
        contents.insert(index_import_pallet + 1, import_pallet.as_str());

        // Insert <pallet package>/std
        // due to insert 1 line -> should be increase by 2
        contents.insert(index_import_std + 2, import_std.as_str());

        let mutated_contents = contents.join("\r\n");

        let mut updated_file = File::create(runtime_cargo_dir)?;

        updated_file.write_all(mutated_contents.as_bytes())?;

        Ok(())
    }

    // Add pallet directory to runtime Cargo.toml
    pub fn import_construct_runtime(&self, runtime_dir: &PathBuf) -> Result<()> {
        let runtime_lib_dir = runtime_dir.join("src/lib.rs");
        let mut cargo_file = File::open(runtime_lib_dir.clone())?;

        let mut cargo_file_contents = String::new();
        cargo_file.read_to_string(&mut cargo_file_contents)?;

        let (_, index_contruct_runtime_end) = find_construct_runtime(cargo_file_contents.as_str());

        let add_pallet_contruct_runtime = format!(
            "\t\t{}: pallet_{},",
            uppercase_first_char(self.name.as_str()),
            self.name
        );

        let mut contents = cargo_file_contents
            .lines()
            .into_iter()
            .collect::<Vec<&str>>();

        // Add pallet to contruct runtime in runtime/src/lib.rs
        contents.insert(
            index_contruct_runtime_end,
            add_pallet_contruct_runtime.as_str(),
        );

        let mutated_contents = contents.join("\r\n");

        let mut updated_file = File::create(runtime_lib_dir)?;

        updated_file.write_all(mutated_contents.as_bytes())?;

        Ok(())
    }

    pub fn import_impl_runtime(&self, runtime_dir: &PathBuf) -> Result<()> {
        let runtime_lib_dir = runtime_dir.join("src/lib.rs");
        let mut cargo_file = File::open(runtime_lib_dir.clone())?;

        let mut cargo_file_contents = String::new();
        cargo_file.read_to_string(&mut cargo_file_contents)?;

        let (index_contruct_runtime_start, _) =
            find_construct_runtime(cargo_file_contents.as_str());

        //let add_impl_runtime = format!("\t\t{}: pallet_{},", uppercase_first_char(self.name.as_str()), self.name);
        let implement = format!("impl pallet_{}::Config for Runtime {{\r\n", self.name);
        let type_event = format!("\ttype RuntimeEvent = RuntimeEvent;\r\n");
        let close_curly = format!("}};\r\n");
        let add_impl_runtime = format!("{}{}{}", implement, type_event, close_curly);

        let mut contents = cargo_file_contents
            .lines()
            .into_iter()
            .collect::<Vec<&str>>();

        // Add pallet to contruct runtime in runtime/src/lib.rs
        contents.insert(index_contruct_runtime_start - 1, add_impl_runtime.as_str());

        let mutated_contents = contents.join("\r\n");
        let mut updated_file = File::create(runtime_lib_dir)?;

        updated_file.write_all(mutated_contents.as_bytes())?;

        Ok(())
    }

    pub fn generate(&self) -> Result<()> {
        let runtime_dir = self.get_runtime_path()?;
        let current_dir = env::current_dir().with_context(|| "Unable to get current dir")?;
        let target_dir_display = self.target_dir.display();

        let joined = current_dir.join(self.target_dir.clone());
        // if pallets folder is not existing, create new pallets folder
        if !joined.exists() && !self.is_remote {
            fs::create_dir_all(self.target_dir.as_path())
                .with_context(|| format!("Unable to create directory: {target_dir_display}"))?;
            env::set_current_dir(self.target_dir.as_path()).with_context(|| {
                format!("Unable to set current directory to {target_dir_display}`.")
            })?;
        }

        if !self.is_remote {
            let argv = vec![
                "cargo",
                "generate",
                "--name",
                &self.name,
                "--git",
                &self.repo,
                "--branch",
                &self.branch,
            ];

            let argv = if let Some(subfolder) = &self.sub_folder {
                [argv, vec!["--", subfolder]].concat()
            } else {
                argv
            };
            let CargoGen::Generate(args) = CargoGen::parse_from(argv.iter());
            let name = &self.name;
            let repo = &self.repo;
            let new_pallet_dir = cargo_generate(args).with_context(|| {
                format!("Unable to generate pallet `{name}` with template `{repo}`.")
            })?;

            // change pallet name
            self.change_package_name(new_pallet_dir)?;
        }

        self.import_pallet_package(&runtime_dir, self.is_remote)?;

        self.import_construct_runtime(&runtime_dir)?;
        self.import_impl_runtime(&runtime_dir)?;

        Ok(())
    }
}

// Helper function

fn find_construct_runtime(runtime_lib: &str) -> (usize, usize) {
    let index_runtime_start = runtime_lib
        .lines()
        .into_iter()
        .position(|line| line.contains(RUNTIME_NAME_START))
        .unwrap();

    let index_runtime_end = runtime_lib
        .lines()
        .into_iter()
        .skip(index_runtime_start)
        .position(|line| line.contains(RUNTIME_NAME_END))
        .unwrap();

    (index_runtime_start, index_runtime_start + index_runtime_end)
}

fn uppercase_first_char(s: &str) -> String {
    if let Some(c) = s.chars().next() {
        let first_upper = c.to_uppercase().collect::<String>();
        first_upper + &s[1..]
    } else {
        s.to_string()
    }
}
