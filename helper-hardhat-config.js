

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile = "../frontend/src/configs/constants/contractAddresses.json"
const frontEndAbiFile = "../frontend/src/configs/constants/abi.json"

module.exports = {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndAbiFile,
}