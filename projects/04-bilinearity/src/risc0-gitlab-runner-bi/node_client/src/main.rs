use std::fs;
use serde::{Deserialize, Serialize};
use risc0_zkvm::{sha::Digest, Receipt};
use subxt::{OnlineClient, PolkadotConfig};
use subxt_signer::sr25519::dev;
use clap::Parser;

use codec::Encode;

#[subxt::subxt(runtime_metadata_path = "./metadata.scale")]
pub mod substrate_node {}

// Combined data structure for deserialization
#[derive(Debug, Deserialize, Serialize)]
struct ProofData {
    receipt: Receipt,
    image_id: Digest,
}

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// ws/wss Url of the node
    // e.g. ws://bore.pub:10030
    #[arg(short, long)]
    url: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    println!("Connecting to node at {:?}", args.url);
    // Specify the directory containing the JSON files
    let directory_path = "./proofs";
    let api = OnlineClient::<PolkadotConfig>::from_url(args.url).await.unwrap();

    // The well-known Alice account - not for production use
    let signer = dev::alice();

    // Iterate over all files in the directory
    for entry in fs::read_dir(directory_path)? {
        println!("Checking {:?}", entry);
        if let Ok(entry) = entry {
            let path = entry.path();
            
            // Check if the file has a ".json" extension
            if let Some(extension) = path.extension() {
                if extension == "json" {
                    // Read the file content
                    let content = fs::read_to_string(&path)?;

                    // Deserialize the JSON content into ProofData
                    let proof_data: ProofData = serde_json::from_str(&content)?;

                    // Access receipt and image_id for your logic
                    let receipt = proof_data.receipt;
                    let image_id = proof_data.image_id;

                    // Implement your logic here based on receipt and image_id
                    println!("File: {:?}", path);
                    // println!("Receipt: {:?}", receipt);
                    println!("Image ID: {:?}", image_id);

                    let receipt_bytes = serde_json::to_string(&receipt).unwrap().encode();

                    let submit_proof_tx = substrate_node::tx().test_proofs().store_and_verify_proof(
                        image_id.into(),
                        receipt_bytes);

                    println!("About to submit");

                    let events = api
                        .tx()
                        .sign_and_submit_then_watch_default(&submit_proof_tx, &signer)
                        .await?
                        .wait_for_finalized_success()
                        .await?;

                    println!("Proof uploaded");

                    let proof_verification_event = events.find_first::<substrate_node::test_proofs::events::ProofVerified>()?;
                    if let Some(event) = proof_verification_event {
                        println!("Onchain proof verification success: {event:?}");
                    }
                }
            }
        }
    }
    println!("Done");
    Ok(())
}
