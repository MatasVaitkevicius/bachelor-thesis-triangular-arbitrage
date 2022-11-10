// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// Polygon mainnet
const aaveLendingPoolAddressProvider = '0xd05e3E715d945B59290df0ae8eF85c1BdB684744'

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');


  const [deployer] = await ethers.getSigners();

  console.log(
      "Deploying contracts with the account:",
      deployer.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  let contract_owner = await ethers.getSigner(network.config.from);
  const FlashloanDexSwap = await hre.ethers.getContractFactory("FlashloanDexSwap");
  const flashloanDexSwap = await FlashloanDexSwap.deploy(aaveLendingPoolAddressProvider);
  console.log("Contract owner:", contract_owner);
  // console.log("Contract creation transaction:", contract.deployTransaction.hash);

  await flashloanDexSwap.deployed();

  console.log("FlashloanDexSwap deployed to:", flashloanDexSwap.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
