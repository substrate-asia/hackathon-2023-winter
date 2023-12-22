use gitlab_runner::{job::Job, JobHandler};
use gitlab_runner::{CancellableJobHandler, Runner};
use std::path::Path;
use structopt::StructOpt;
use tokio::process::Command;
use tokio_util::sync::CancellationToken;
use tracing::info;
use tracing_subscriber::prelude::*;
use url::Url;

#[derive(StructOpt)]
struct Opts {
    #[structopt(env = "GITLAB_URL")]
    server: Url,
    #[structopt(env = "GITLAB_TOKEN")]
    token: String,
}

struct Run {
    job: Job,
}

impl Run {
    pub fn new(job: Job) -> Self {
        Self { job }
    }
}

#[async_trait::async_trait]
impl CancellableJobHandler for Run {
    async fn step(
        &mut self,
        script: &[String],
        _phase: gitlab_runner::Phase,
        _cancel_token: &CancellationToken,
    ) -> gitlab_runner::JobResult {
        for command in script {
            info!("command is {:?}", command);
            let ci_project_url = self
                .job
                .variable("CI_PROJECT_URL")
                .expect("Can't find CI_PROJECT_URL in variables");
            let ci_commit_sha = self
                .job
                .variable("CI_COMMIT_SHA")
                .expect("Can't find CI_COMMIT_SHA in variables");
            let ci_project_title = self
                .job
                .variable("CI_PROJECT_TITLE")
                .expect("Can't find CI_PROJECT_TITLE in variables");

            info!("{}", ci_project_url.value());
            info!("{}", ci_commit_sha.value());

            let build_dir = self.job.build_dir();
            // Clone the repo to temp
            info!(
                "Clonning the repo in {} ...",
                build_dir.to_str().expect("can't fail")
            );
            let clone_output = Command::new("git")
                .current_dir(build_dir)
                .arg("clone")
                .arg(ci_project_url.value())
                .output()
                .await
                .expect("clonning the repo should not fail");
            assert!(clone_output.status.success());

            info!("Clonning the repo: DONE");

            info!(
                "project located at {}",
                build_dir
                    .join(Path::new(ci_project_title.value()))
                    .as_path()
                    .to_str()
                    .expect("can't fail")
            );
            let reset_head = Command::new("git")
                .current_dir(
                    build_dir
                        .join(Path::new(ci_project_title.value()))
                        .as_path(),
                )
                .arg("reset")
                .arg("--hard")
                .arg(ci_commit_sha.value())
                .output()
                .await
                .expect("git reset should not fail");
            assert!(reset_head.status.success());
            info!("Reset to commit {}: DONE", ci_commit_sha.value());

            // Run cargo risczero test
            let cargo_test = Command::new("cargo")
                .current_dir(
                    build_dir
                        .join(Path::new(ci_project_title.value()))
                        .as_path(),
                )
                .arg("risczero")
                .arg("test")
                .output()
                .await
                .expect("cargo risczero test can't fail");
            assert!(cargo_test.status.success());
            info!(
                "cargo risczero test succeed with {:#?}",
                String::from_utf8(cargo_test.stdout)
            );

            // Copy proof.json files
            let node_client_path = env!("CARGO_MANIFEST_DIR").to_string() + "/node_client/proofs";

            info!("node path {}", node_client_path);
            info!(
                "proofs path {}",
                build_dir
                    .join(ci_project_title.value())
                    .join("target/riscv32im-risc0-zkvm-elf/release/deps/*_proof.json")
                    .to_str()
                    .unwrap()
            );
            use glob::glob;
            for proof in glob(
                build_dir
                    .join(ci_project_title.value())
                    .join("target/riscv32im-risc0-zkvm-elf/release/deps/*_proof.json")
                    .to_str()
                    .unwrap(),
            )
            .expect("Failed to read glob pattern")
            {
                match proof {
                    Ok(path) => {
                        let dest_path = Path::new(&node_client_path).join(path.file_name().unwrap());
                        info!("dest_path {}", dest_path.to_str().unwrap());
                        info!("path {}", path.to_str().unwrap());
                        let copy = Command::new("cp")
                            .arg(path.to_str().unwrap())
                            .arg(dest_path.to_str().unwrap())
                            .output()
                            .await
                            .expect("copy failed");
                        info!("copy stdout {:#?}", String::from_utf8(copy.stdout));
                        info!("copy stderr {:#?}", String::from_utf8(copy.stderr));
                        // tokio::fs::copy(
                        //     path.clone(),
                        //     dest_path,
                        // )
                        // .await
                        // .expect("copy failed");
                    }
                    Err(e) => info!("error {:?}", e),
                }
            }

            // Run node client to send data to chain
            let cargo_run = Command::new("cargo")
                .current_dir(Path::new(
                    &(env!("CARGO_MANIFEST_DIR").to_string() + "/node_client"),
                ))
                .arg("run")
                .arg("--")
                .arg("--url \"ws://bore.pub:10030\"")
                .output()
                .await
                .expect("cargo run can't fail");
            assert!(cargo_run.status.success());
            info!(
                "cargo run succeed with {:#?}",
                String::from_utf8(cargo_run.stdout)
            );
        }
        Ok(())
    }

    async fn cleanup(&mut self) {
        // let ci_project_title = self
        //     .job
        //     .variable("CI_PROJECT_TITLE")
        //     .expect("Can't find CI_PROJECT_TITLE in variables");

        // let build_dir = self.job.build_dir();
        // info!("proofs path {}",build_dir.join(ci_project_title.value()).join("target/riscv32im-risc0-zkvm-elf/release/deps/*_proof.json").to_str().unwrap());
        // use glob::glob;
        // for proof in glob(build_dir.join(ci_project_title.value()).join("target/riscv32im-risc0-zkvm-elf/release/deps/*_proof.json").to_str().unwrap()).expect("Failed to read glob pattern") {
        // match proof {
        // Ok(path) => info!("Ok {:?}", path.display()),
        // Err(e) => info!("error {:?}", e),
        // }
        // }
    }
}

#[tokio::main]
async fn main() {
    let opts = Opts::from_args();
    let dir = tempfile::tempdir().unwrap();

    let (mut runner, layer) =
        Runner::new_with_layer(opts.server, opts.token, dir.path().to_path_buf());

    tracing_subscriber::Registry::default()
        .with(
            tracing_subscriber::fmt::Layer::new()
                .pretty()
                .with_filter(tracing::metadata::LevelFilter::INFO),
        )
        .with(layer)
        .init();

    info!("temp dir path {:?}", dir);

    runner
        .run(move |job| async move { Ok(Run::new(job)) }, 8)
        .await
        .expect("Couldn't pick up jobs");
}
