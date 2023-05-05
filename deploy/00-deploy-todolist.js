const { ethers, network, run } = require("hardhat");

async function main() {
    const TaskContractFactory = await ethers.getContractFactory("TodoList");
    console.log('Deploying Contract ............');
    const taskContract = await TaskContractFactory.deploy();
    await taskContract.deployed();

    console.log(`Deployed Task contract on ${taskContract.address}`);


    // async function verify(contractAddress, args) {
    const verifyGoerlyConract = async (contractAddress, args) => {
        console.log("Verifying contract...")
        try {
            const verification = await run("verify:verify", {
                address: contractAddress,
                constructorArguments: args,
            })
            console.log(verification)
        } catch (e) {
            if (e.message.toLowerCase().includes("already verified")) {
                console.log("Already Verified!")
            } else {
                console.log(e)
            }
        }
    }
    // async function verify(contractAddress, args) {
    const verifySepoliaConract = async (contractAddress, args) => {
        console.log("Verifying contract...")
        try {
            await run("verify:verify", {
                address: contractAddress,
                constructorArguments: args,
            })
        } catch (e) {
            if (e.message.toLowerCase().includes("already verified")) {
                console.log("Already Verified!")
            } else {
                console.log(e)
            }
        }
    }


    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await taskContract.deployTransaction.wait(6)
        await verifyGoerlyConract(taskContract.address, [])
    }

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await taskContract.deployTransaction.wait(6)
        await verifySepoliaConract(taskContract.address, [])
    }

}

main().then(() => process.exit(0)).catch((error) => {
    console.log(error)
    process.exit(1)
})

module.exports.tags = ["all", "todoList"]