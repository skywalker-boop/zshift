require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.17",
  networks: {
    "base-sepolia": {
      url: process.env.BASE_SEPOLIA_RPC,
      accounts: process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : []
    }
  }
};
