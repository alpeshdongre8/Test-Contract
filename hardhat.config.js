require("@nomicfoundation/hardhat-toolbox");
// require('dotenv').config();

const FORK_FUJI = false;
const FORK_MAINNET = false;
let forkingData = undefined;

if (FORK_MAINNET) {
  forkingData = {
    url: "https://api.avax.network/ext/bc/C/rpcc",
  };
}
if (FORK_FUJI) {
  forkingData = {
    url: "https://api.avax-test.network/ext/bc/C/rpc",
  };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      gasPrice: 225000000000,
      chainId: !forkingData ? 43112 : undefined, //Only specify a chainId if we are not forking
      forking: forkingData,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: ["f17a4ff713091aa1b6abf82d087c73ff960bb736b1b01ed293f9a883d3df1fa1"], //Private Key
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: ["f17a4ff713091aa1b6abf82d087c73ff960bb736b1b01ed293f9a883d3df1fa1"],   //Private Key
    },
  },
  etherscan: {
    apiKey: "QGGY1A9HYVUVC471H47IMJC7UF46XK6CAW"   //Snowtrace API KEY
  },
};