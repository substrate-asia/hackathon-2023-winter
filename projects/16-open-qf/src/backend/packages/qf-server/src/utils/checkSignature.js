const { encodeAddress, signatureVerify } = require("@polkadot/util-crypto");
const { HttpError } = require("../utils/httpError");

function isValidSignature(signedMessage, signature, address) {
  try {
    const result = signatureVerify(signedMessage, signature, address);
    return encodeAddress(result.publicKey, 42) === encodeAddress(address, 42);
  } catch (e) {
    return false;
  }
}
async function verifySignature(msg, address, signature) {
  if (!signature) {
    throw new HttpError(400, "Signature is missing");
  }

  if (!address) {
    throw new HttpError(400, "Address is missing");
  }

  return isValidSignature(msg, signature, address);
}

async function checkSignature(msg, signature, address) {
  if (!signature) {
    throw new HttpError(400, "Signature is missing");
  }

  const verified = await verifySignature(msg, address, signature);
  if (!verified) {
    throw new HttpError(400, "Signature is invalid");
  }
}

module.exports = {
  checkSignature,
};
