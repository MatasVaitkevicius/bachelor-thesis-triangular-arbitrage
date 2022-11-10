import { web3 } from '@/libs/web3'

import moment from 'moment'

export default {
  namespaced: true,

  state: {
    gasPrice: null,
    block: null,
    updatedAt: null,
  },

  getters: {
    getFeedUrl() {
      return process.env.VUE_APP_BLOCKCHAIN_FEED
    },

    getChainId() {
      return process.env.VUE_APP_BLOCKCHAIN_CHAIN_ID
    },

    getGasPrice(state) {
      return state.gasPrice
    },

    getPriorityGasPrice() {
      return process.env.VUE_APP_PRIORITY_GAS_PRICE.toString()
    },

    getBlock(state) {
      return state.block
    },

    getUpdatedAt(state) {
      return state.updatedAt
    },
  },

  mutations: {
    setGasPrice(state, value) {
      state.gasPrice = value
    },

    setBlock(state, value) {
      state.block = value
    },

    setUpdatedAt(state, value) {
      state.updatedAt = value
    },
  },

  actions: {
    fetchGasPrice({ commit }) {
      web3.eth.getGasPrice()
        .then(gasPrice => {
          commit('setGasPrice', gasPrice)
        }).catch(error => {
          commit('setGasPrice', null)
        })
    },

    fetchBlock({ commit }) {
      web3.eth.getBlockNumber()
        .then(block => {
          commit('setBlock', block)
          commit('setUpdatedAt', moment.utc())
        })
        .catch(error => {
          commit('setBlock', null)
          commit('setUpdatedAt', moment.utc())
        })
    }
  },
}
