import { cryptoWaitReady, secp256k1PairFromSeed, encodeAddress, blake2AsU8a } from "https://deno.land/x/polkadot/util-crypto/mod.ts"
import { Keyring } from "https://deno.land/x/polkadot/keyring/mod.ts"
import { hexToU8a, u8aToHex } from "https://deno.land/x/polkadot/util/mod.ts"

await cryptoWaitReady().catch((e) => {
	console.error(e.message);
	Deno.exit(1);
});

import * as ethUtil from "npm:@ethereumjs/util";
import * as ethSigUtil from "npm:@metamask/eth-sig-util";
import { secp256k1 } from "npm:ethereum-cryptography/secp256k1.js"

// Seed an ETH wallet

const ethPrivateKey = hexToU8a("0x415ac5b1b9c3742f85f2536b1eb60a03bf64a590ea896b087182f9c92f41ea12")
const ethPublicKey = ethUtil.privateToPublic(ethPrivateKey)
const ethCompressedPublicKey = secp256k1.getPublicKey(ethPrivateKey, true)
const ethEthAddress = ethUtil.privateToAddress(ethPrivateKey)

console.log(`ETH private key: ${u8aToHex(ethPrivateKey)}`)
console.log(`ETH public key: ${u8aToHex(ethPublicKey)}`)
console.log(`ETH compressed public key: ${u8aToHex(ethCompressedPublicKey)}`)
console.log(`ETH address: ${u8aToHex(ethEthAddress)}`)
console.log("")

// Map the ETH wallet to Sub wallet

const ss58Format = 42

console.log(`Substrate SS58 prefix: ${ss58Format}`)
console.log("")

const subKeyPair = function () {
	try {
		return secp256k1PairFromSeed(ethPrivateKey);
	} catch (e) {
		console.error(e.message)
		Deno.exit(1);
	}
}()

const subPublicKey = u8aToHex(subKeyPair.publicKey)
if (subPublicKey !== u8aToHex(ethCompressedPublicKey)) {
	console.error(`${subPublicKey} != ${u8aToHex(ethCompressedPublicKey)}`)
	Deno.exit(1)
}

const subKeyring = new Keyring({ type: "ecdsa", ss58Format })
const subKeyringPair = subKeyring.createFromPair(subKeyPair)
const subAddress = subKeyringPair.address

const subAddressFromPublicKey = encodeAddress(blake2AsU8a(ethCompressedPublicKey), ss58Format)
if (subAddress !== subAddressFromPublicKey) {
	console.error(`${subAddress} != 0x${subAddressFromPublicKey}`)
	Deno.exit(1)
}

// Prepare the meta call

const who = subAddress
// Important: Different chain may not the same
const callData = "0x00071448656c6c6f" // system.remarkWithEvent("Hello")
const nonce = 0

console.log("Meta call")
console.log(`Who: ${who}`)
console.log(`Call data: ${callData}`)
console.log(`Nonce: ${nonce}`)
console.log("")

// Prepare EIP-712 signature for the meta call

const eip712Name = "Substrate"
const eip712Version = "1"
const eip712ChainId = 0
const eip712VerifyingContract = "0x0000000000000000000000000000000000000000"

console.log("EIP-712 domain")
console.log(`Name: ${eip712Name}`)
console.log(`Version: ${eip712Version}`)
console.log(`ChainId: ${eip712ChainId}`)
console.log(`VerifyingContract: ${eip712VerifyingContract}`)
console.log("")

const eip712Data = {
	types: {
		EIP712Domain: [
			{
				name: "name",
				type: "string",
			},
			{
				name: "version",
				type: "string",
			},
			{
				name: "chainId",
				type: "uint256",
			},
			{
				name: "verifyingContract",
				type: "address",
			},
		],
		SubstrateCall: [
			{ name: 'who', type: 'string' },
			{ name: 'callData', type: 'bytes' },
			{ name: 'nonce', type: 'uint64' },
		],
	},
	primaryType: "SubstrateCall",
	domain: {
		name: eip712Name,
		version: eip712Version,
		chainId: eip712ChainId,
		verifyingContract: eip712VerifyingContract,
	},
	message: {
		who,
		callData,
		nonce,
	},
}
const eip712Signature = ethSigUtil.signTypedData({
	privateKey: ethPrivateKey,
	data: eip712Data,
	version: ethSigUtil.SignTypedDataVersion.V3,
})

console.log(`EIP-712 message: "${JSON.stringify(eip712Data)}"`)
console.log(`EIP-712 signature: ${eip712Signature}`)
console.log("")

// Conclusion

console.log("evmAccountMapping.metaCall(who, call, nonce, signature, tip)")
console.log(`evmAccountMapping.metaCall("${subAddress}", "${callData}", ${nonce}, "${eip712Signature}", None)`)
