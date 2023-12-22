pragma circom 2.0.0;

include "./common/babyjubjub.circom";
include "./common/elgamal.circom";
include "./common/matrix.circom";
include "./common/permutation.circom";
include "./shuffle_encrypt_template.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template ShuffleEncryptV2(numCards) {
    var numBits = 251;
    // Base8 generator of Baby JubJub curve: https://github.com/iden3/circomlibjs/blob/main/src/babyjub.js#L18-L21
    var base[2] = [5299619240641551281634865583518297030282874472190772894086521144482721001553,
                   16950150798460657717958625567821834550301663161624707787222815936182638968203];
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

    signal output dummy_output; // Circom requires at least 1 output signal.
    dummy_output <== pk[0] * pk[1];

    component shuffle_encrypt = ShuffleEncryptV2Template(base, numCards, numBits);
    shuffle_encrypt.pk[0] <== pk[0];
    shuffle_encrypt.pk[1] <== pk[1];
    for (var i = 0; i<numCards; i++) {
        shuffle_encrypt.UX0[i] <== UX0[i];
        shuffle_encrypt.UX1[i] <== UX1[i];
        shuffle_encrypt.VX0[i] <== VX0[i];
        shuffle_encrypt.VX1[i] <== VX1[i];
        shuffle_encrypt.UDelta0[i] <== UDelta0[i];
        shuffle_encrypt.UDelta1[i] <== UDelta1[i];
        shuffle_encrypt.VDelta0[i] <== VDelta0[i];
        shuffle_encrypt.VDelta1[i] <== VDelta1[i];
    }
    for(var i = 0; i < 2; i++) {
        shuffle_encrypt.s_u[i] <== s_u[i];
        shuffle_encrypt.s_v[i] <== s_v[i];
    }
    for (var i = 0; i<numCards*numCards; i++) {
        shuffle_encrypt.A[i] <== A[i];
    }
    for (var i = 0; i<numCards; i++) {
        shuffle_encrypt.R[i] <== R[i];
    }
}

component main {public [pk, UX0, UX1, VX0, VX1, s_u, s_v]}  = ShuffleEncryptV2(54);
