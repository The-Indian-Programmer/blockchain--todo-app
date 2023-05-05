require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()


/** @type import('hardhat/config').HardhatUserConfig */



const {ETHERSCAN_API_KEY, PRIVATE_KEY, REPORT_GAS, SEPOLIA_RPC_URL, LOCALHOST_RPC_URL } = process.env


module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 1337,
      url: LOCALHOST_RPC_URL,
      saveDeployments: true,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 11155111,
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    }
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  contractSizer: {
    runOnCompile: false,
    only: ["TodoList"],
  },
};
