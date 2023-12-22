use node_template_runtime::{
	constants::currency::DOLLARS, opaque::SessionKeys, AccountId, AssetsConfig, BabeConfig,
	Balance, BalancesConfig, CouncilConfig, DemocracyConfig, GenesisConfig, MaxNominations,
	SessionConfig, Signature, StakerStatus, StakingConfig, SudoConfig, SystemConfig,
	TechnicalCommitteeConfig, BABE_GENESIS_EPOCH_CONFIG, WASM_BINARY,
};
use pallet_im_online::sr25519::AuthorityId as ImOnlineId;
use sc_service::{ChainType, Properties};
use sp_authority_discovery::AuthorityId as AuthorityDiscoveryId;
use sp_consensus_aura::sr25519::AuthorityId as AuraId;
use sp_consensus_grandpa::AuthorityId as GrandpaId;
use sp_core::{sr25519, Pair, Public};
use sp_runtime::{
	traits::{IdentifyAccount, Verify},
	Perbill,
};

// The URL for the telemetry server.
// const STAGING_TELEMETRY_URL: &str = "wss://telemetry.polkadot.io/submit/";

/// Specialized `ChainSpec`. This is a specialization of the general Substrate ChainSpec type.
pub type ChainSpec = sc_service::GenericChainSpec<GenesisConfig>;

/// Generate a crypto pair from seed.
pub fn get_from_seed<TPublic: Public>(seed: &str) -> <TPublic::Pair as Pair>::Public {
	TPublic::Pair::from_string(&format!("//{}", seed), None)
		.expect("static values are valid; qed")
		.public()
}

type AccountPublic = <Signature as Verify>::Signer;

/// Generate an account ID from seed.
pub fn get_account_id_from_seed<TPublic: Public>(seed: &str) -> AccountId
where
	AccountPublic: From<<TPublic::Pair as Pair>::Public>,
{
	AccountPublic::from(get_from_seed::<TPublic>(seed)).into_account()
}

/// Helper function to generate stash, controller and session key from seed
pub fn authority_keys_from_seed(
	seed: &str,
) -> (AccountId, AccountId, GrandpaId, AuraId, ImOnlineId, AuthorityDiscoveryId) {
	(
		get_account_id_from_seed::<sr25519::Public>(&format!("{}//stash", seed)),
		get_account_id_from_seed::<sr25519::Public>(seed),
		get_from_seed::<GrandpaId>(seed),
		get_from_seed::<AuraId>(seed),
		get_from_seed::<ImOnlineId>(seed),
		get_from_seed::<AuthorityDiscoveryId>(seed),
	)
}

fn session_keys(
	grandpa: GrandpaId,
	aura: AuraId,
	im_online: ImOnlineId,
	authority_discovery: AuthorityDiscoveryId,
) -> SessionKeys {
	SessionKeys { grandpa, aura, im_online, authority_discovery }
}

pub fn get_endowed_accounts_with_balance() -> Vec<(AccountId, u128)> {
	let accounts: Vec<AccountId> = vec![
		get_account_id_from_seed::<sr25519::Public>("Alice"),
		get_account_id_from_seed::<sr25519::Public>("Bob"),
		get_account_id_from_seed::<sr25519::Public>("Charlie"),
		get_account_id_from_seed::<sr25519::Public>("Dave"),
		get_account_id_from_seed::<sr25519::Public>("Eve"),
		get_account_id_from_seed::<sr25519::Public>("Ferdie"),
		get_account_id_from_seed::<sr25519::Public>("Alice//stash"),
		get_account_id_from_seed::<sr25519::Public>("Bob//stash"),
		get_account_id_from_seed::<sr25519::Public>("Charlie//stash"),
		get_account_id_from_seed::<sr25519::Public>("Dave//stash"),
	];

	const ENDOWMENT: Balance = 10_000_000 * DOLLARS;
	let accounts_with_balance: Vec<(AccountId, u128)> =
		accounts.iter().cloned().map(|k| (k, ENDOWMENT)).collect();
	let json_data = &include_bytes!("../../seed/balances.json")[..];
	let additional_accounts_with_balance: Vec<(AccountId, u128)> =
		serde_json::from_slice(json_data).unwrap_or_default();

	let mut accounts = additional_accounts_with_balance.clone();

	accounts_with_balance.iter().for_each(|tup1| {
		for tup2 in additional_accounts_with_balance.iter() {
			if tup1.0 == tup2.0 {
				return;
			}
		}
		accounts.push(tup1.to_owned());
	});

	accounts
}

pub fn get_root_account() -> AccountId {
	let json_data = &include_bytes!("../../seed/balances.json")[..];
	let additional_accounts_with_balance: Vec<(AccountId, u128)> =
		serde_json::from_slice(json_data).unwrap_or_default();

	additional_accounts_with_balance[0].0.clone()
}

pub fn development_config() -> Result<ChainSpec, String> {
	let wasm_binary = WASM_BINARY.ok_or_else(|| "Development wasm not available".to_string())?;

	// Give your base currency a unit name and decimal places
	let mut properties = Properties::new();
	properties.insert("tokenSymbol".into(), "XCAV".into());
	properties.insert("tokenDecimals".into(), 12.into());
	properties.insert("ss58Format".into(), 42.into());

	Ok(ChainSpec::from_genesis(
		// Name
		"Development",
		// ID
		"dev",
		ChainType::Development,
		move || {
			testnet_genesis(
				wasm_binary,
				vec![authority_keys_from_seed("Alice")],
				vec![],
				get_account_id_from_seed::<sr25519::Public>("Alice"),
				get_endowed_accounts_with_balance(),
				true,
			)
		},
		// Bootnodes
		vec![],
		// Telemetry
		None,
		// Protocol ID
		None,
		None,
		// Properties
		Some(properties),
		// Extensions
		None,
	))
}

pub fn local_testnet_config() -> Result<ChainSpec, String> {
	let wasm_binary = WASM_BINARY.ok_or_else(|| "Development wasm not available".to_string())?;

	let mut properties = Properties::new();
	properties.insert("tokenSymbol".into(), "XCAV".into());
	properties.insert("tokenDecimals".into(), 12.into());
	properties.insert("ss58Format".into(), 42.into());

	Ok(ChainSpec::from_genesis(
		// Name
		"Local Testnet",
		// ID
		"local_testnet",
		ChainType::Local,
		move || {
			testnet_genesis(
				wasm_binary,
				vec![authority_keys_from_seed("Alice"), authority_keys_from_seed("Bob")],
				vec![],
				get_account_id_from_seed::<sr25519::Public>("Alice"),
				get_endowed_accounts_with_balance(),
				true,
			)
		},
		// Bootnodes
		vec![],
		// Telemetry
		None,
		// Protocol ID
		None,
		// Properties
		None,
		Some(properties),
		// Extensions
		None,
	))
}

/// Configure initial storage state for FRAME modules.
fn testnet_genesis(
	wasm_binary: &[u8],
	initial_authorities: Vec<(
		AccountId,
		AccountId,
		GrandpaId,
		AuraId,
		ImOnlineId,
		AuthorityDiscoveryId,
	)>,
	initial_nominators: Vec<AccountId>,
	root_key: AccountId,
	endowed_accounts: Vec<(AccountId, u128)>,
	_enable_println: bool,
) -> GenesisConfig {
	// endow all authorities and nominators.
	/* 	initial_authorities
	.iter()
	.map(|x| &x.0)
	.chain(initial_nominators.iter())
	.for_each(|x, y| {
		if !endowed_accounts.contains((x,y)) {
			endowed_accounts.push(x.clone())
		}
	}); */

	// stakers: all validators and nominators.
	let mut rng = rand::thread_rng();
	let stakers = initial_authorities
		.iter()
		.map(|x| (x.0.clone(), x.0.clone(), STASH, StakerStatus::Validator))
		.chain(initial_nominators.iter().map(|x| {
			use rand::{seq::SliceRandom, Rng};
			let limit = (MaxNominations::get() as usize).min(initial_authorities.len());
			let count = rng.gen::<usize>() % limit;
			let nominations = initial_authorities
				.as_slice()
				.choose_multiple(&mut rng, count)
				.map(|choice| choice.0.clone())
				.collect::<Vec<_>>();
			(x.clone(), x.clone(), STASH, StakerStatus::Nominator(nominations))
		}))
		.collect::<Vec<_>>();

	let _num_endowed_accounts = endowed_accounts.len();

	const ENDOWMENT: Balance = 10_000_000 * DOLLARS;
	const STASH: Balance = ENDOWMENT / 1000;

	GenesisConfig {
		system: SystemConfig { code: wasm_binary.to_vec(), ..Default::default() },
		balances: BalancesConfig {
			balances: endowed_accounts.iter().cloned().map(|x| (x.0.clone(), x.1)).collect(),
		},
		aura: Default::default(),
		grandpa: Default::default(),
		sudo: SudoConfig {
			// Assign network admin rights.
			key: Some(root_key.clone()),
		},
		transaction_payment: Default::default(),
		assets:  AssetsConfig {
			assets: vec![(1, root_key.clone(), true, 1)], // Genesis assets: id, owner, is_sufficient, min_balance
			metadata: vec![(1, "XUSD".into(), "XUSD".into(), 0)], // Genesis metadata: id, name, symbol, decimals
			accounts: endowed_accounts.iter().cloned().map(|x| (1, x.0.clone(), 1_000_000)).collect(),
		},
		pool_assets: Default::default(),
		im_online: Default::default(),
		council: CouncilConfig { members: vec![], phantom: Default::default() },
		staking: StakingConfig {
			validator_count: initial_authorities.len() as u32,
			minimum_validator_count: initial_authorities.len() as u32,
			invulnerables: initial_authorities.iter().map(|x| x.0.clone()).collect(),
			slash_reward_fraction: Perbill::from_percent(10),
			stakers,
			..Default::default()
		},
		babe: BabeConfig {
			authorities: Default::default(),
			epoch_config: Some(BABE_GENESIS_EPOCH_CONFIG),
			..Default::default()
		},
		session: SessionConfig {
			keys: initial_authorities
				.iter()
				.map(|x| {
					(
						x.0.clone(),
						x.0.clone(),
						session_keys(x.2.clone(), x.3.clone(), x.4.clone(), x.5.clone()),
					)
				})
				.collect::<Vec<_>>(),
		},
		authority_discovery: Default::default(),
		treasury: Default::default(),
		alliance_motion: Default::default(),
		democracy: DemocracyConfig::default(),
		technical_committee: TechnicalCommitteeConfig {
			members: vec![],
			phantom: Default::default(),
		},
		community_loan_pool: Default::default(),
	}
}
