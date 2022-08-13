#!/bin/bash

CIRCUIT_NAME=circuit

echo "****CONVERTING VERIFIER TO SMART CONTRACT****"
start=`date +%s`
npx snarkjs zkey export solidityverifier "$CIRCUIT_NAME".zkey verifier.sol
end=`date +%s`
echo "DONE ($((end-start))s)"