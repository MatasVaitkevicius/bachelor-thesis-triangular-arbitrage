require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.12",

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-mainnet.g.alchemy.com/v2/5dMq9aZ5ZHh6_bUTjIQe480HYmmlfh8L",
        blockNumber: 22100540,
      },
    },

    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/5dMq9aZ5ZHh6_bUTjIQe480HYmmlfh8L",
      accounts: [
        "1d485f0c467a8dde4c256a0dda26703236285795923756001d2b9ac0ad9eab23",
      ],
    },
  },
};
