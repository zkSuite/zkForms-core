#!/bin/bash

PHASE1=pot19_final.ptau
CIRCUIT_NAME=circuit

if [ -f "$PHASE1" ]; then
    echo "Found Phase 1 ptau file"
else
    echo "No Phase 1 ptau file found. Exiting..."
    exit 1
fi

echo "****COMPILING CIRCUIT****"
start=`date +%s`
circom "$CIRCUIT_NAME".circom --r1cs --wasm --sym
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****GENERATING WITNESS FOR SAMPLE INPUT****"
start=`date +%s`
node "$CIRCUIT_NAME"_js/generate_witness.js "$CIRCUIT_NAME"_js/"$CIRCUIT_NAME".wasm input.json witness.wtns
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****GENERATING ZKEY 0****"
start=`date +%s`
npx snarkjs groth16 setup "$CIRCUIT_NAME".r1cs "$PHASE1" "$CIRCUIT_NAME"_0.zkey
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****CONTRIBUTE TO THE PHASE 2 CEREMONY****"
start=`date +%s`
echo "test" | npx snarkjs zkey contribute "$CIRCUIT_NAME"_0.zkey "$CIRCUIT_NAME"_1.zkey --name="Test Contribution"
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****GENERATING FINAL ZKEY****"
start=`date +%s`
npx snarkjs zkey beacon "$CIRCUIT_NAME"_1.zkey "$CIRCUIT_NAME".zkey 0102030405060708090a0b0c0d0e0f101112231415161718221a1b1c1d1e1f 10 -n="Final Beacon phase2"
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****VERIFYING FINAL ZKEY****"
start=`date +%s`
npx snarkjs zkey verify "$CIRCUIT_NAME".r1cs "$PHASE1" "$CIRCUIT_NAME".zkey
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****EXPORTING VKEY****"
start=`date +%s`
npx snarkjs zkey export verificationkey "$CIRCUIT_NAME".zkey verification_key.json
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****GENERATING PROOF FOR SAMPLE INPUT****"
start=`date +%s`
npx snarkjs groth16 prove "$CIRCUIT_NAME".zkey witness.wtns proof.json public.json
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****VERIFYING PROOF FOR SAMPLE INPUT****"
start=`date +%s`
npx snarkjs groth16 verify verification_key.json public.json proof.json
end=`date +%s`
echo "DONE ($((end-start))s)"