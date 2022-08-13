const hre = require('hardhat');

async function main() {
  const Verifier = await hre.ethers.getContractFactory('Verifier');
  const verifier = await (await Verifier.deploy()).deployed();

  const Identifier = await hre.ethers.getContractFactory('Forms');

  const forms = await (await Identifier.deploy(verifier.address)).deployed();

  console.log('Verifier =>', verifier.address);
  console.log('zkForms =>', forms.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
