set -x

snarkjs powersoftau new bls12-381 20 p20_00.ptau -v
snarkjs powersoftau contribute p20_00.ptau p20_01.ptau --name="1c" -v -e="jhdfljahg8943rtfdghdjsfghs34y58734yts"
snarkjs powersoftau prepare phase2 p20_01.ptau p20_final.ptau -v