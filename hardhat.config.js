require('dotenv').config();
require('hardhat-circom');
require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.0',
  circom: {
    inputBasePath: './circuits',
    ptau: 'pot19_final.ptau',
    circuits: [
      {
        name: 'circuit',
      },
    ],
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
  etherscan: { apiKey: process.env.ETHERSCAN_API_KEY },
};
