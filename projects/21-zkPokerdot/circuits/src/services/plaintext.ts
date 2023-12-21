import { compressDeck, decompressDeck, matrixMultiplication } from "./utilities";

// todo
export type BabyJub = any;
export type EC = any;

/// Computes ElGamal Encryption.
export function elgamalEncrypt(babyJub: BabyJub, ic0: EC, ic1: EC, r: bigint, pk: EC): EC[] {
  return [
    babyJub.addPoint(babyJub.mulPointEscalar(babyJub.Base8, r), ic0), // c0 = r * g + ic0
    babyJub.addPoint(babyJub.mulPointEscalar(pk, r), ic1), // c1 = r * pk + ic1
  ];
}

/// Computes ElGamal Decryption.
export function elgamalDecrypt(babyJub: BabyJub, c0: EC, c1: EC, sk: bigint): EC {
  // Scalar Field Size of Baby JubJub curve
  const r = 2736030358979909402780800718157159386076813972158567259200215660948447373041n;
  // c1 - sk * c0
  return babyJub.addPoint(c1, babyJub.mulPointEscalar(c0, r - sk));
}

/// Shuffles `numCards` cards and encrypts individual cards, given an randomness array `R`, a permutation matrix `A`,
/// input card deck `X`, and a public key `pk`. Each card is represented as 2 elliptic curve points
//      (c0i.x, c0i.y, c1i.x, c1i.y)
/// Layout of X: [
///     c01.x, ..., c0n.x,
///     c01.y, ..., c0n.y,
///     c11.x, ..., c1n.x,
///     c11.y, ..., c1n.y,
/// ]
export function shuffleEncryptPlaintext(
  babyjub: BabyJub,
  numCards: number,
  A: bigint[],
  X: bigint[],
  R: bigint[],
  pk: EC
): bigint[] {
  const B: bigint[] = [];
  for (let i = 0; i < 4; i++) {
    const tmp: bigint[] = matrixMultiplication(A, X.slice(i * numCards, (i + 1) * numCards), numCards, numCards);
    for (let j = 0; j < numCards; j++) {
      B.push(tmp[j]);
    }
  }
  const ECOutArr: EC[] = [];
  for (let i = 0; i < numCards; i++) {
    const ic0: EC = [babyjub.F.e(B[i]), babyjub.F.e(B[numCards + i])];
    const ic1: EC = [babyjub.F.e(B[2 * numCards + i]), babyjub.F.e(B[3 * numCards + i])];
    const out = elgamalEncrypt(babyjub, ic0, ic1, R[i], pk);
    ECOutArr.push(out);
  }
  const Y: bigint[] = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < ECOutArr.length; k++) {
        Y[(i * 2 + j) * numCards + k] = BigInt(babyjub.F.toString(ECOutArr[k][i][j]));
      }
    }
  }
  return Y;
}

/// Shuffle encrypt version2 that uses compressed format of elliptic curves.
export function shuffleEncryptV2Plaintext(
  babyjub: BabyJub,
  numCards: number,
  A: bigint[],
  R: bigint[],
  pk: EC,
  UX0: bigint[],
  UX1: bigint[],
  UY0_delta: bigint[],
  UY1_delta: bigint[],
  s_u: bigint[]
): {
  X0: bigint[];
  X1: bigint[];
  delta0: bigint[];
  delta1: bigint[];
  selector: bigint[];
} {
  const U = decompressDeck(UX0, UX1, UY0_delta, UY1_delta, s_u);
  return compressDeck(shuffleEncryptPlaintext(babyjub, numCards, A, U, R, pk));
}
