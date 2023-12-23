// Copyright 2023 ZeroDAO

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use std::process::Stdio;
use anyhow::{ensure, Result};
use tokio::process::Command as TokioCommand;

/// Entry point for the asynchronous main function.
#[tokio::main]
async fn main() -> Result<()> {
    // Fetch all the available example names.
    let examples = fetch_all_examples().await?;
    
    // Iterate through each example and run it.
    for example in examples.iter() {
        println!("Running example: {}", example);
        run_example(example).await?;
    }
    
    Ok(())
}

/// Asynchronously run a given example using cargo.
/// 
/// # Arguments
///
/// * `example` - The name of the example to run.
///
/// # Returns
///
/// * `Result<()>` - A result type indicating success or any potential error.
///
async fn run_example(example: &str) -> Result<()> {
    // Execute the example using cargo. It assumes that the example can be run using the cargo command.
    let status = TokioCommand::new("cargo")
        .args(["run", "--release", "--example", example])
        .status()
        .await?;

    // Check if the command was successful; if not, return an error.
    ensure!(status.success(), format!("Example {} failed", example));
    Ok(())
}

/// Asynchronously fetch the names of all available examples.
/// 
/// # Returns
///
/// * `Result<Vec<String>>` - A result type containing a vector of example names or any potential error.
///
async fn fetch_all_examples() -> Result<Vec<String>> {
    // Use tokio's spawn_blocking to run a blocking operation in the context of an asynchronous function.
    let output = tokio::task::spawn_blocking(move || {
        std::process::Command::new("cargo")
            .args(["run", "--release", "--example"])
            .stderr(Stdio::piped())
            .output()
    })
    .await??;

    // Process the output to fetch example names.
    // We skip the first two lines assuming they may contain info or error messages.
    // The following lines are considered to contain the names of the examples.
    let lines = String::from_utf8(output.stderr)?
        .lines()
        .skip(2)
        .map(|line| line.trim().to_string())
        .filter(|line| !line.is_empty())
        .collect();

    Ok(lines)
}
