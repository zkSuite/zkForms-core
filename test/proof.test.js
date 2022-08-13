const assert = require('assert');
const fs = require('fs');
const snarkjs = require('snarkjs');
const {
  testPrivateKey,
  testWhitelisted,
  testFormId,
} = require('../utils/keypair');
const { h2d, bigint_to_tuple, fillArray } = require('../utils');

describe('Generate proof test', function () {
  this.timeout(500000);

  it('should return true for generating proof on sample inputs', async () => {
    const privateKeyDecimal = h2d(testPrivateKey);

    const priv_tuple = bigint_to_tuple(BigInt(privateKeyDecimal));

    const inputs = {
      privateKey: priv_tuple,
      whitelisted: fillArray(
        testWhitelisted.map((addr) => h2d(addr.slice(2))),
        10,
        '0x0000000000000000000000000000000000000000'
      ),
      formID: testFormId,
    };

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      'circuit.wasm',
      'https://cloudflare-ipfs.com/ipfs/bafybeidf5knam5nygkqo4nvpez7zj6a7jberur2anjc4vvcvczqav5yfcq/circuit.zkey'
    );

    const vKey = JSON.parse(fs.readFileSync('verification_key.json'));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    assert.equal(res, true);
  });
});
