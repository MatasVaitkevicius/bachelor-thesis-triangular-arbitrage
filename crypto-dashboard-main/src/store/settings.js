export default {
  namespaced: true,

  getters: {
    getArbitrageTimerInterval() {
      return process.env.VUE_APP_ARBITRAGE_TIMER_INTERVAL ? parseInt(process.env.VUE_APP_ARBITRAGE_TIMER_INTERVAL) : 20000
    },

    getFlashloanFee() {
      return process.env.VUE_APP_FLASHLOAN_FEE ? Number(process.env.VUE_APP_FLASHLOAN_FEE) : 0
    },
  },
}
