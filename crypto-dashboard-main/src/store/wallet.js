import Tokens from '@/json/tokens'
import moment from 'moment'
import Big from 'big.js'
import { web3 } from '@/libs/web3'

export default {
  namespaced: true,

  state: {
    balance: null,
    balanceUpdatedAt: null,
    tokenBalances: null,
    tokenBalancesUpdatedAt: null,
  },

  getters: {
    getAddress() {
      return web3.eth.accounts.privateKeyToAccount(process.env.VUE_APP_WALLET_PRIVATE_KEY).address
    },

    getPrivateKey() {
      return process.env.VUE_APP_WALLET_PRIVATE_KEY
    },

    getNativeTokenSymbol() {
      return process.env.VUE_APP_NATIVE_TOKEN_SYMBOL
    },

    getNativeTokenDecimals() {
      return process.env.VUE_APP_NATIVE_TOKEN_DECIMALS
    },

    getBalance(state) {
      return state.balance
    },

    getBalanceUpdatedAt(state) {
      return state.balanceUpdatedAt
    },

    getTokenBalances(state) {
      return state.tokenBalances
    },

    getTokenBalancesUpdatedAt(state) {
      return state.tokenBalancesUpdatedAt
    },

    getMinimumBalance() {
      return process.env.VUE_APP_WALLET_MINIMUM_BALANCE || '1000000000000000000'
    },

    balanceExceedsMinimum(state) {
      const minimumBalance = process.env.VUE_APP_WALLET_MINIMUM_BALANCE || '1000000000000000000'

      const balanceBig = state.balance ? new Big(state.balance) : new Big('0')
      const minimumBalanceBig = new Big(minimumBalance)

      return balanceBig.gt(minimumBalanceBig)
    },
  },

  mutations: {
    setBalance(state, value) {
      state.balance = value
    },

    setBalanceUpdatedAt(state, value) {
      state.balanceUpdatedAt = value
    },

    setTokenBalances(state, value) {
      state.tokenBalances = value
    },

    setTokenBalancesUpdatedAt(state, value) {
      state.tokenBalancesUpdatedAt = value
    },
  },

  actions: {
    fetchBalance({ commit, getters }) {
      let balance

      web3.eth.getBalance(getters.getAddress).then(balance => {
        commit('setBalance', balance)
        commit('setBalanceUpdatedAt', moment.utc())
      })
    },

    fetchTokenBalances({ commit, getters }) {
      const tokenSymbols = _.map(_.values(Tokens), token => {
        return token.symbol
      })

      const tokenAddresses = _.map(_.values(Tokens), token => {
        return token.address
      })

      let tokenBalances = {}

      web3.alchemy.getTokenBalances(getters.getAddress, tokenAddresses).then(response => {
        _.forEach(response.tokenBalances, (tokenBalanceResponse, index) => {
          tokenBalances[tokenSymbols[index]] = tokenBalanceResponse.tokenBalance
        })

        commit('setTokenBalances', tokenBalances)
        commit('setTokenBalancesUpdatedAt', moment.utc())
      })
    },
  },
}
