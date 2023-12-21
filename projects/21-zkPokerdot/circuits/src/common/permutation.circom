pragma circom 2.0.0;

include "./boolean.circom";

/// Checks if matrix `in` of shape nxn is a permutation matrix.
template Permutation(n) {
    signal input in[n*n];
    component boolean_check[n*n];
    for (var i = 0; i < n*n; i++) {
        boolean_check[i] = Boolean();
        boolean_check[i].in <== in[i];
    }
    var sum;
    for (var i = 0; i < n; i++) {
        sum = 0;
        for (var j = 0; j < n; j++) {
            sum += in[i*n + j];
        }
        sum === 1;
    }
    for (var j = 0; j < n; j++) {
        sum = 0;
        for (var i = 0; i < n; i++) {
            sum += in[i*n + j];
        }
        sum === 1;
    }
}