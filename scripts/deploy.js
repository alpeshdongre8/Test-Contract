// const hre = require("hardhat");

// async function main() {
//   // Get the smart contract
//   const Message = await hre.ethers.getContractFactory("MessageBoard");

//   // Deploy it
//   const message = await Message.deploy();
//   await message.deployed();

//   // Display the contract address
//   console.log(`Contract deployed to ${message.address}`);
// }

// // Hardhat recommends this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const hre = require("hardhat");

async function main() {

const deployedContract = await hre.ethers.deployContract("MessageBoard");

await deployedContract.waitForDeployment();

console.log("POINTS TOKEN DEPLOYED TO:", await deployedContract.getAddress());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});