pragma circom 2.0.0;

/// Checks that `in` is a boolean.
template Boolean() {
    signal input in;
    in * (in -1) === 0;
}