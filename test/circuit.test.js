const path = require('path');
const {
  testPrivateKey,
  testWhitelisted,
  testFormId,
} = require('../utils/keypair');
const { h2d, bigint_to_tuple, fillArray } = require('../utils');
const wasm_tester = require('circom_tester').wasm;

describe('Circuit compile test', function () {
  this.timeout(500000);

  it('Checking compilation of circuit and witness calculation', async () => {
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

    const circuit = await wasm_tester(path.join(__dirname, 'circuit.circom'), {
      output: path.join(__dirname, 'circuits'),
      recompile: true,
    });
    const w = await circuit.calculateWitness(inputs);
    await circuit.checkConstraints(w);
  });
});
