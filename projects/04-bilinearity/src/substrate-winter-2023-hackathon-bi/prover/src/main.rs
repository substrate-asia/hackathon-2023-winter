use clap::Parser;
use risc0_zkvm::{Executor, ExecutorEnv, SegmentReceipt, SessionReceipt};
use subxt::{
	config::WithExtrinsicParams,
	ext::sp_core::{sr25519::Pair as SubxtPair, Pair as SubxtPairT},
	tx::{BaseExtrinsicParams, PairSigner, PlainTip},
	OnlineClient, PolkadotConfig, SubstrateConfig,
};

use crate::substrate_node::runtime_types::pallet_prover_mgmt::pallet::ProofRequest;

// // Runtime types, etc
#[subxt::subxt(runtime_metadata_path = "./metadata.scale")]
pub mod substrate_node {}

type ApiType = OnlineClient<
	WithExtrinsicParams<SubstrateConfig, BaseExtrinsicParams<SubstrateConfig, PlainTip>>,
>;

type ImageId = [u32; 8];

async fn get_program(api: &ApiType, image_id: ImageId) -> Result<Option<Vec<u8>>, subxt::Error> {
	let query = substrate_node::storage().prover_mgmt().programs(image_id);

	api.storage().fetch(&query, None).await
}

async fn get_proof_request(
	api: &ApiType,
	image_id: ImageId,
) -> Result<Option<ProofRequest>, subxt::Error> {
	let query = substrate_node::storage().prover_mgmt().proof_requests(image_id);

	api.storage().fetch(&query, None).await
}

// Prove the program which was given as serialized bytes
fn prove_program_execution(onchain_program: Vec<u8>, args: Vec<Vec<u32>>) -> SessionReceipt {
	let mut envbuilder = ExecutorEnv::builder();
	args.iter().for_each(|a| {
		envbuilder.add_input(a);
	});

	let env = envbuilder.build();

	let mut executor =
		Executor::from_elf(env.clone(), bincode::deserialize(&onchain_program).unwrap()).unwrap();

	println!("Starting session");
	let session = executor.run().unwrap();
	println!("Now proving execution");
	let receipt = session.prove().unwrap();
	println!("Done proving");
	receipt
}

async fn upload_proof(
	api: ApiType,
	image_id: ImageId,
	session_receipt: SessionReceipt,
	signing_key: String,
) {
	let substrate_session_receipt = session_receipt
		.segments
		.into_iter()
		.map(|SegmentReceipt { seal, index }| (seal, index))
		.collect();

	let restored_key = SubxtPair::from_string(&signing_key, None).unwrap();

	let signer = PairSigner::new(restored_key);

	api.tx()
		.sign_and_submit_then_watch_default(
			&substrate_node::tx()
				.prover_mgmt()
				// Upload the proof
				.store_and_verify_proof(
					image_id,
					substrate_session_receipt,
					session_receipt.journal,
				),
			&signer,
		)
		.await
		.unwrap()
		.wait_for_finalized()
		.await
		.unwrap();
	println!("Proof uploaded");
}

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
	/// The hex-encoded, bincode-serialized image id of the onchain program to prove
	#[arg(short, long)]
	image_id: String,
	/// The Secret key of prover to sign and submit proof to chain.
	#[arg(env)]
	signing_key: String,
}

#[tokio::main]
async fn main() {
	let cli_args = Args::parse();

	let hex_decoded = hex::decode(&cli_args.image_id).unwrap();
	let image_id = bincode::deserialize(&hex_decoded).unwrap();

	let api = OnlineClient::<PolkadotConfig>::new().await.unwrap();

	// listen_for_event_then_prove().await;
	let program = get_program(&api, image_id).await;
	let proof_request = get_proof_request(&api, image_id).await;

	println!("Proof request for given image id: {:?}", &proof_request);

	let program_args = proof_request
		.unwrap()
		.expect("Args were not provided, or request was not made for program proof")
		.args;

	println!("Passing args to program :{:?}", program_args);

	let session_receipt = prove_program_execution(
		program.unwrap().expect("Onchain program should exist"),
		program_args,
	);

	upload_proof(api, image_id, session_receipt, cli_args.signing_key).await;
}
