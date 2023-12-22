// This file is part of EVM Account Mapping Pallet.

// Copyright (C) HashForest Technology Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// 	http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#[allow(unused)]
use crate::{mock::*, Error, Event};
use codec::Decode;
use frame_support::assert_ok;

use sp_core::crypto::Ss58Codec;
use sp_runtime::traits::TrailingZeroInput;

#[test]
fn it_works() {
	new_test_ext().execute_with(|| {
		run_to_block(1);

		let account = AccountId::from_ss58check("5DT96geTS2iLpkH8fAhYAAphNpxddKCV36s5ShVFavf1xQiF").unwrap();
		let call_data = hex::decode("00071448656c6c6f").expect("Valid"); // system.remarkWithEvent("Hello")
		let call = RuntimeCall::decode(&mut TrailingZeroInput::new(&call_data)).expect("Valid");
		let nonce: u64 = 0;
		let signature: [u8; 65] = hex::decode("37cb6ff8e296d7e476ee13a6cfababe788217519d428fcc723b482dc97cb4d1359a8d1c020fe3cebc1d06a67e61b1f0e296739cecacc640b0ba48e8a7555472e1b").expect("Decodable").try_into().expect("Valid");

		set_balance(account.clone(), DOLLARS);

		// TODO: this skip validate_unsigned so the nonce will mismatch
		// Dispatch a signed extrinsic.
		// 0x07003d589a72aacea3f5f98494fdb5a7c3c70296b2410fa7552444d0206f61aa8e9100071448656c6c6f00000000000000008fe82b58127bdaf5090c00375181fb4152ec28af422e371d73a05b776c22f4e70aaa24e2d7604b65cfaf2fe332e6763c9cbafb59c1be7f4a0fd8cae1f3e351fb1b
		assert_ok!(
			EvmAccountMapping::meta_call(
				RuntimeOrigin::none(),
				account,
				Box::<RuntimeCall>::new(call),
				nonce,
				signature,
				0u128.into()
			)
		);

		// Assert that the correct event was deposited
		// System::assert_last_event(Event::SomethingStored { something: 42, who: 1 }.into());
	});
}

#[test]
fn eip712() {
	let eip712_name = b"Substrate".to_vec();
	let eip712_version = b"1".to_vec();
	let eip712_chain_id: crate::EIP712ChainID = sp_core::U256::from(0);
	let eip712_verifying_contract_address: crate::EIP712VerifyingContractAddress =
		TryInto::<[u8; 20]>::try_into(
			hex::decode("0000000000000000000000000000000000000000").expect("Decodable"),
		)
		.expect("Decodable")
		.try_into()
		.expect("Decodable");

	let eip712_domain = crate::eip712::EIP712Domain {
		name: eip712_name,
		version: eip712_version,
		chain_id: eip712_chain_id,
		verifying_contract: eip712_verifying_contract_address,
		salt: None,
	};
	let domain_separator = eip712_domain.separator();

	let type_hash = sp_io::hashing::keccak_256(
		"SubstrateCall(string who,bytes callData,uint64 nonce)".as_bytes(),
	);
	// Token::Uint(U256::from(keccak_256(&self.name)))
	let who = "5DT96geTS2iLpkH8fAhYAAphNpxddKCV36s5ShVFavf1xQiF";
	let call_data =
		sp_io::hashing::keccak_256(&hex::decode("00071448656c6c6f").expect("Decodable"));
	let nonce = 0u64;
	let message_hash = sp_io::hashing::keccak_256(&ethabi::encode(&[
		ethabi::Token::FixedBytes(type_hash.to_vec()),
		ethabi::Token::FixedBytes(sp_io::hashing::keccak_256(who.as_bytes()).to_vec()),
		ethabi::Token::FixedBytes(call_data.to_vec()),
		ethabi::Token::Uint(nonce.into()),
	]));

	// panic!("{}", hex::encode(message_hash));

	let typed_data_hash_input = &vec![
		crate::encode::SolidityDataType::String("\x19\x01"),
		crate::encode::SolidityDataType::Bytes(&domain_separator),
		crate::encode::SolidityDataType::Bytes(&message_hash),
	];
	let bytes = crate::encode::abi::encode_packed(typed_data_hash_input);
	let signing_message = sp_io::hashing::keccak_256(bytes.as_slice());

	let signature: [u8; 65] = hex::decode("37cb6ff8e296d7e476ee13a6cfababe788217519d428fcc723b482dc97cb4d1359a8d1c020fe3cebc1d06a67e61b1f0e296739cecacc640b0ba48e8a7555472e1b").expect("Decodable").try_into().expect("Decodable");

	// Check the signature and get the public key
	let recovered_public_key =
		sp_io::crypto::secp256k1_ecdsa_recover_compressed(&signature, &signing_message)
			.ok()
			.expect("Recoverable");
	println!("0x{}", hex::encode(recovered_public_key));

	let decoded_account =
		AccountId::decode(&mut &sp_io::hashing::blake2_256(&recovered_public_key)[..])
			.expect("Decodable");
	assert_eq!(decoded_account.to_ss58check(), who);
}
