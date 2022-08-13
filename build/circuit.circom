pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../circuits/eth_addr.circom";

// Check if public key is whitelisted
template Access(size,n,k){
   signal input whitelisted[size];
   signal input formID;
   signal input privateKey[k];

   signal publicKey[2];
   signal formIDSquare;
   signal userAddress;

   signal output out;

    // check that privateKey properly represents a 256-bit number
    component check[k];
    for (var i = 0; i < k; i++) {
        check[i] = Num2Bits(i == k-1 ? 256 - (k-1) * n : n);
        check[i].in <== privateKey[i];
    }

    // compute userAddress
    component privateToPublic = PrivKeyToAddr(n, k);
    for (var i = 0; i < k; i++) {
        privateToPublic.privkey[i] <== privateKey[i];
    }
    userAddress <== privateToPublic.addr;

    component equals[size];
    var sum=0;

    for(var i=0; i<size; i++){
        equals[i] = IsEqual();

        equals[i].in[0] <== whitelisted[i];
        equals[i].in[1] <== userAddress;

        sum += equals[i].out;
    }

    sum === 1;

    // Hidden signals to invalidate the manipulation of the formID
    formIDSquare <== formID * formID;
}

component main {public [whitelisted, formID]} = Access(10,64,4);

