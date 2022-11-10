const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

export const web3 = createAlchemyWeb3(process.env.VUE_APP_BLOCKCHAIN_FEED)
