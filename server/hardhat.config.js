require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

if (!SEPOLIA_RPC_URL) {
  console.error("Missing SEPOLIA_RPC_URL in .env file");
}
if (!ETHERSCAN_API_KEY) {
  console.error("Missing ETHERSCAN_API_KEY in .env file");
}

module.exports = {
  defaultNetwork: "sepolia",  // @crucial this solves the error The selected network is "hardhat", which is not supported for contract verification.
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    }
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      chainId: 11155111  // @note does not solve error: The selected network is "hardhat", which is not supported for contract verification.
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};