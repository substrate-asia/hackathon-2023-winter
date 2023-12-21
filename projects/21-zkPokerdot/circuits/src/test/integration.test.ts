import { shuffleEncryptV2Plaintext } from "../services/plaintext";
import {
  generateDecryptProof,
  generateShuffleEncryptV2Proof,
} from "../services/proof";
import {
  initDeck,
  keyGen,
  sampleFieldElements,
  samplePermutation,
  compressDeck,
  recoverDeck,
  string2Bigint,
  assert,
} from "../services/utilities";
import { resolve } from "path";
import { readFileSync } from "fs";
const buildBabyjub = require("circomlibjs").buildBabyjub;
const snarkjs = require("snarkjs");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

jest.setTimeout(120000);

describe("Shuffle encrypt/decrypt benchmark tests", function () {
  const numBits = BigInt(251);
  const numCards = BigInt(54);
  const numProfiling = 1;

  it("Benchmark Shuffle Encrypt/Decrypt", async function () {
    const babyjub = await buildBabyjub();
    console.log("baby");
    const keysAlice = keyGen(babyjub, numBits);
    const pk = keysAlice.pk;
    const pkString = [babyjub.F.toString(keysAlice.pk[0]), babyjub.F.toString(keysAlice.pk[1])];

    const encryptWasmFile = resolve(__dirname, "../shuffle_encrypt_obj/shuffle_encrypt_js/shuffle_encrypt.wasm");
    const encryptZkeyFile = resolve(__dirname, "../shuffle_encrypt_obj/shuffle_encrypt_final.zkey");
    const encryptVkey = await snarkjs.zKey.exportVerificationKey(
      new Uint8Array(Buffer.from(readFileSync(encryptZkeyFile))),
    );
    console.log("vkey");
    console.log(JSON.stringify(encryptVkey));

    // Initializes deck.
    const initializedDeck: bigint[] = initDeck(babyjub, Number(numCards));
    console.log("initializedDeck");
    let compressedDeck = compressDeck(initializedDeck);
    console.log("compressedDeck");
    let deck: {
      X0: bigint[];
      X1: bigint[];
      selector: bigint[];
    } = {
      X0: compressedDeck.X0,
      X1: compressedDeck.X1,
      selector: compressedDeck.selector,
    };

    let A = samplePermutation(Number(numCards));
    let R = sampleFieldElements(babyjub, numBits, numCards);
    let deckDelta = recoverDeck(babyjub, deck.X0, deck.X1);
    let plaintext_output = shuffleEncryptV2Plaintext(
      babyjub,
      Number(numCards),
      A,
      R,
      pk,
      deck.X0,
      deck.X1,
      deckDelta.Delta0,
      deckDelta.Delta1,
      deck.selector,
    );
    console.log("generate proof");
    let shuffleEncryptOutput = await generateShuffleEncryptV2Proof(
      pkString,
      A,
      R,
      deck.X0,
      deck.X1,
      deckDelta.Delta0,
      deckDelta.Delta1,
      deck.selector,
      plaintext_output.X0,
      plaintext_output.X1,
      plaintext_output.delta0,
      plaintext_output.delta1,
      plaintext_output.selector,
      encryptWasmFile,
      encryptZkeyFile,
    );
    console.log("generated proof");
    const ep = await snarkjs.groth16.exportSolidityCallData(
      shuffleEncryptOutput.proof,
      shuffleEncryptOutput.publicSignals,
    );

    const eep = JSON.parse("[" + ep + "]");
    console.log("proof");
    console.log(JSON.stringify(shuffleEncryptOutput.proof));
    console.log("pubsig");
    console.log(JSON.stringify(shuffleEncryptOutput.publicSignals));
    console.log("proof");
    console.log(
      JSON.stringify({
        pi_a: eep[0],
        pi_b: eep[1],
        pi_c: eep[2],
        protocol: "groth16",
        curve: "bls12381",
      }),
    );
    console.log("input");
    console.log(JSON.stringify(eep[3]));

    assert(
      await snarkjs.groth16.verify(
        encryptVkey,
        shuffleEncryptOutput.publicSignals,
        shuffleEncryptOutput.proof,
      ),
      "Off-chain verification failed.",
    );

    let start = new Date().getTime();
    for (let i = 0; i < numProfiling; i++) {
      await generateShuffleEncryptV2Proof(
        pkString,
        A,
        R,
        deck.X0,
        deck.X1,
        deckDelta.Delta0,
        deckDelta.Delta1,
        deck.selector,
        plaintext_output.X0,
        plaintext_output.X1,
        plaintext_output.delta0,
        plaintext_output.delta1,
        plaintext_output.selector,
        encryptWasmFile,
        encryptZkeyFile,
      );
    }
    let elapsed = new Date().getTime() - start;
    console.log(
      "Shuffle Encrypt V2 Proof Generation Latency:",
      elapsed / (1000 * numProfiling),
      "seconds",
    );

    start = new Date().getTime();
    for (let i = 0; i < numProfiling; i++) {
      await snarkjs.groth16.verify(
        encryptVkey,
        shuffleEncryptOutput.publicSignals,
        shuffleEncryptOutput.proof,
      );
    }
    elapsed = new Date().getTime() - start;
    console.log(
      "Shuffle Encrypt V2 Proof Verification Latency:",
      elapsed / (1000 * numProfiling),
      "seconds",
    );

    const decryptWasmFile = resolve(__dirname, "../decrypt_obj/decrypt_js/decrypt.wasm");
    const decryptZkeyFile = resolve(__dirname, "../decrypt_obj/decrypt_final.zkey");
    const decryptVkey = await snarkjs.zKey.exportVerificationKey(
      new Uint8Array(Buffer.from(readFileSync(decryptZkeyFile))),
    );

    let shuffleEncryptedDecks = shuffleEncryptOutput.publicSignals.slice(0, Number(numCards) * 4);
    let Y: bigint[] = [];
    for (let j = 0; j < 4; j++) {
      Y.push(BigInt(shuffleEncryptedDecks[j * Number(numCards)]));
    }
    let decryptProof = await generateDecryptProof(
      Y,
      keysAlice.sk,
      pkString,
      decryptWasmFile,
      decryptZkeyFile,
    );
    assert(
      await snarkjs.groth16.verify(decryptVkey, decryptProof.publicSignals, decryptProof.proof),
      "Off-chain verification failed.",
    );

    start = new Date().getTime();
    for (let i = 0; i < numProfiling; i++) {
      await generateDecryptProof(Y, keysAlice.sk, pkString, decryptWasmFile, decryptZkeyFile);
    }
    elapsed = new Date().getTime() - start;
    console.log("Decrypt V1 Proof Generation Latency:", elapsed / (1000 * numProfiling), "seconds");

    start = new Date().getTime();
    for (let i = 0; i < numProfiling; i++) {
      await snarkjs.groth16.verify(decryptVkey, decryptProof.publicSignals, decryptProof.proof);
    }
    elapsed = new Date().getTime() - start;
    console.log(
      "Decrypt V1 Proof Verification Latency:",
      elapsed / (1000 * numProfiling),
      "seconds",
    );
  });
});
