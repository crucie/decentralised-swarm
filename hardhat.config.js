import HardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import dotenv from "dotenv";
dotenv.config();

export default {
  solidity: "0.8.24",
  plugins: [HardhatToolboxMochaEthers],
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 31337
    },
    local: {
      type: "http",
      url: process.env.RPC_URL || "http://127.0.0.1:8545",
      accounts: process.env.PRIVATE_KEY_DEPLOYER ? [process.env.PRIVATE_KEY_DEPLOYER] : []
    }
  }
};