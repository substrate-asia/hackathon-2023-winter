pragma circom 2.0.0;

include "./common/permutation.circom";
include "./common/elgamal.circom";

template DecryptTemplate(base, numBits) {
    signal input Y[4];      // two group elements on inner curve. Layout: [c0.x, c0.y, c1.x, c1.y]
    signal input pkP[2];    // group elements on inner curve.
    signal input skP;       // secret key, {0, 1}^numBits
    signal output out[2];   // decrypt result
    component bitDecomposition = Num2Bits(numBits);
    bitDecomposition.in <== skP;
    component deriveKey = EscalarMulFix(numBits, base);
    for(var i=0; i<numBits; i++) {
        deriveKey.e[i] <== bitDecomposition.out[i];
    }
    pkP[0] === deriveKey.out[0];
    pkP[1] === deriveKey.out[1];
    component decrypt = ElGamalDecrypt(numBits);
    decrypt.c0[0] <== Y[0];
    decrypt.c0[1] <== Y[1];
    decrypt.c1[0] <== Y[2];
    decrypt.c1[1] <== Y[3];
    decrypt.sk <== skP;
    out[0] <== decrypt.m[0];
    out[1] <== decrypt.m[1];
}

template Decrypt() {
    var numBits = 251;
    var base[2] = [5299619240641551281634865583518297030282874472190772894086521144482721001553,
                   16950150798460657717958625567821834550301663161624707787222815936182638968203];
    signal input Y[4];
    signal input pkP[2];
    signal input skP;
    signal output out[2];
    component decrypt = DecryptTemplate(base, numBits);
    for(var i = 0; i < 4; i++) {
        decrypt.Y[i] <== Y[i];
    }

    decrypt.pkP[0] <== pkP[0];
    decrypt.pkP[1] <== pkP[1];
    decrypt.skP <== skP;
    out[0] <== decrypt.out[0];
    out[1] <== decrypt.out[1];
}

component main {public [Y, pkP]}  = Decrypt();