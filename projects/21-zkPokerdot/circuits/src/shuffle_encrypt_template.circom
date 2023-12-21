pragma circom 2.0.0;

include "./common/elgamal.circom";
include "./common/matrix.circom";
include "./common/permutation.circom";
include "./common/babyjubjub.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

/// X layout:
/// [ic_{0,0}.x, ic_{1,0}.x, ..., ic_{n-1,0}.x,
///  ic_{0,0}.y, ic_{1,0}.y, ..., ic_{n-1,0}.y,
///  ic_{0,1}.x, ic_{1,1}.x, ..., ic_{n-1,1}.x,
///  ic_{0,1}.y, ic_{1,1}.y, ..., ic_{n-1,1}.y,
/// ]
/// Here, the i^th cards is represented as two group elements on inner curve
///  ic_{i,0}.x, ic_{i,0}.y, ic_{i,1}.x, ic_{i,1}.y
template ShuffleEncryptTemplate(base, numCards, numBits) {
    signal input A[numCards*numCards];  // Permutation matrix
    signal input X[4*numCards];         // 2*numCards group elements on inner curve
    signal input R[numCards];           // numCards scalars as randomness
    signal input pk[2];                 // aggregate PK, which is a group element on inner curve
    signal output Y[4*numCards];        // 2*numCards group elements on inner curve. Y shares the same layout as X.
    signal B[4*numCards];
    component permutation = Permutation(numCards);
    for (var i = 0; i < numCards*numCards; i++) {
        permutation.in[i] <== A[i];
    }
    component shuffle[4];
    for (var i = 0; i < 4; i++) {
        shuffle[i] = matrixMultiplication(numCards, numCards);
        for (var j = 0; j < numCards*numCards; j++) {
            shuffle[i].A[j] <== A[j];
        }
        for (var j = 0; j < numCards; j++) {
            shuffle[i].X[j] <== X[i*numCards + j];
        }
        for (var j = 0; j < numCards; j++) {
            B[i*numCards + j] <== shuffle[i].B[j];
        }
    }
    component elgamal[numCards];
    for (var i = 0; i < numCards; i++) {
        elgamal[i] = ElGamalEncrypt(numBits, base);
        elgamal[i].ic0[0] <== B[i];
        elgamal[i].ic0[1] <== B[numCards + i];
        elgamal[i].ic1[0] <== B[2*numCards + i];
        elgamal[i].ic1[1] <== B[3*numCards + i];
        elgamal[i].r <== R[i];
        elgamal[i].pk[0] <== pk[0];
        elgamal[i].pk[1] <== pk[1];
        Y[i] <== elgamal[i].c0[0];
        Y[numCards + i] <== elgamal[i].c0[1];
        Y[2*numCards + i] <== elgamal[i].c1[0];
        Y[3*numCards + i] <== elgamal[i].c1[1];
    }
}

template ShuffleEncryptV2Template(base, numCards, numBits) {
    assert(numCards <= 253);
    signal input pk[2];                 // group element on inner curve
    signal input UX0[numCards];         // numCards x-coordinates of group elements on inner curve
    signal input UX1[numCards];         // numCards x-coordinates of group elements on inner curve
    signal input VX0[numCards];         // numCards x-coordinates of group elements on inner curve
    signal input VX1[numCards];         // numCards x-coordinates of group elements on inner curve
    signal input UDelta0[numCards];     // numCards base field elements on inner curve
    signal input UDelta1[numCards];     // numCards base field elements on inner curve
    signal input VDelta0[numCards];     // numCards base field elements on inner curve
    signal input VDelta1[numCards];     // numCards base field elements on inner curve
    signal input s_u[2];                // selector of y-coordinates
    signal input s_v[2];                // selector of y-coordinates
    signal input A[numCards*numCards];  // Permutation matrix
    signal input R[numCards];           // numCards scalars as randomness

    component n2b_u0 = Num2Bits(numCards);
    component n2b_u1 = Num2Bits(numCards);
    component n2b_v0 = Num2Bits(numCards);
    component n2b_v1 = Num2Bits(numCards);
    n2b_u0.in <== s_u[0];
    n2b_u1.in <== s_u[1];
    n2b_v0.in <== s_v[0];
    n2b_v1.in <== s_v[1];

    component decompress[4*numCards];
    for (var i = 0; i < numCards; i++) {
        decompress[i] = ecDecompress();
        decompress[i].x <== UX0[i];
        decompress[i].s <== n2b_u0.out[i];
        decompress[i].delta <== UDelta0[i];
    }
    for (var i = 0; i < numCards; i++) {
        decompress[numCards + i] = ecDecompress();
        decompress[numCards + i].x <== UX1[i];
        decompress[numCards + i].s <== n2b_u1.out[i];
        decompress[numCards + i].delta <== UDelta1[i];
    }
    for (var i = 0; i < numCards; i++) {
        decompress[2*numCards + i] = ecDecompress();
        decompress[2*numCards + i].x <== VX0[i];
        decompress[2*numCards + i].s <== n2b_v0.out[i];
        decompress[2*numCards + i].delta <== VDelta0[i];
    }
    for (var i = 0; i < numCards; i++) {
        decompress[3*numCards + i] = ecDecompress();
        decompress[3*numCards + i].x <== VX1[i];
        decompress[3*numCards + i].s <== n2b_v1.out[i];
        decompress[3*numCards + i].delta <== VDelta1[i];
    }

    component shuffleEncryptV1 = ShuffleEncryptTemplate(base, numCards, numBits);
    for(var i = 0; i < numCards*numCards; i++) {
        shuffleEncryptV1.A[i] <== A[i];
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.R[i] <== R[i];
    }
    for (var i = 0; i < 2; i++) {
        shuffleEncryptV1.pk[i] <== pk[i];
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.X[i] <== UX0[i];
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.X[numCards + i] <== decompress[i].y;
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.X[2*numCards+i] <== UX1[i];
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.X[3*numCards + i] <== decompress[numCards+i].y;
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.Y[i] === VX0[i];
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.Y[numCards + i] === decompress[2*numCards + i].y;
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.Y[2*numCards + i] === VX1[i];
    }
    for (var i = 0; i < numCards; i++) {
        shuffleEncryptV1.Y[3*numCards + i] === decompress[3*numCards + i].y;
    }
}