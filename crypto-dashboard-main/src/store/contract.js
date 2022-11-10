const flashloanDexSwapContractJson = require('../../artifacts/contracts/FlashloanDexSwap.sol/FlashloanDexSwap.json')
import IERC20 from '../../artifacts/contracts/Interfaces.sol/IERC20.json'
import Tokens from '@/json/tokens'
import moment from 'moment'
const flashloanDexSwapContractAddress = process.env.VUE_APP_CONTRACT_ADDRESS
import { web3 } from '@/libs/web3'

export default {
  namespaced: true,

  state: {
    isSubmitting: false,
    tokenBalances: null,
    tokenBalancesUpdatedAt: null,
    tokenAllowances: null,
    tokenAllowancesUpdatedAt: null,
    balance: null,
    transactionStatus: "No Status",
    contractTransactionStatus: "No Status",
  },

  getters: {
    getAddress() {
      return process.env.VUE_APP_CONTRACT_ADDRESS
    },

    isSubmitting(state) {
      return state.isSubmitting
    },

    getTokenBalances(state) {
      return state.tokenBalances
    },

    getTokenBalancesUpdatedAt(state) {
      return state.tokenBalancesUpdatedAt
    },

    getTokenAllowances(state) {
      return state.tokenAllowances
    },

    getTokenAllowancesUpdatedAt(state) {
      return state.tokenAllowancesUpdatedAt
    },

    getBalance(state) {
      return state.balance
    },

    getTransactionStatus(state) {
      return state.transactionStatus
    },

    getContractTransactionStatus(state) {
      return state.contractTransactionStatus
    }
  },

  mutations: {
    setIsSubmitting(state, value) {
      state.isSubmitting = value
    },

    setTokenBalances(state, value) {
      state.tokenBalances = value
    },

    setTokenBalancesUpdatedAt(state, value) {
      state.tokenBalancesUpdatedAt = value
    },

    setTokenAllowances(state, value) {
      state.tokenAllowances = value
    },

    setTokenAllowancesUpdatedAt(state, value) {
      state.tokenAllowancesUpdatedAt = value
    },

    setBalance(state, value) {
      state.balance = value
    },

    setTransactionStatus(state, value) {
      state.transactionStatus = value
    },

    setContractTransactionStatus(state, value) {
      state.contractTransactionStatus = value
    }
  },

  actions: {
    async getSmartContractBalance({ commit }) {
      const balance = await web3.eth.getBalance(flashloanDexSwapContractAddress);
      commit('setBalance', balance)
    },

    async isLogEnabled({ rootGetters }) {
      const walletAddress = rootGetters['wallet/getAddress']
      const flashloanDexSwapContract = new web3.eth.Contract(flashloanDexSwapContractJson.abi, flashloanDexSwapContractAddress)

      const response = await flashloanDexSwapContract.methods.getIsLogEnabled().call({
        from: walletAddress,
      })

      return response === true
    },

    async enableLog({ getters, rootGetters }) {
      if (getters.isSubmitting) {
        return
      }

      const walletAddress = rootGetters['wallet/getAddress']
      const flashloanDexSwapContract = new web3.eth.Contract(flashloanDexSwapContractJson.abi, flashloanDexSwapContractAddress)
      const priorityGasPrice = rootGetters['network/getPriorityGasPrice']

      await flashloanDexSwapContract.methods.enableLog().send({
        from: walletAddress,
        gasPrice: priorityGasPrice,
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

    fetchTokenAllowances({ commit, getters, rootGetters }) {
      const walletAddress = rootGetters['wallet/getAddress']

      const tokenSymbols = _.map(_.values(Tokens), token => {
        return token.symbol
      })

      const tokenAddresses = _.map(_.values(Tokens), token => {
        return token.address
      })

      let tokenContract
      let promises = []

      _.forEach(tokenAddresses, tokenAddress => {
        tokenContract = new web3.eth.Contract(IERC20.abi, tokenAddress)
        promises.push(tokenContract.methods.allowance(walletAddress, getters.getAddress).call())
      })

      let tokenAllowances = {}

      Promise.all(promises).then(tokenAllowanceResponses => {
        _.forEach(tokenAllowanceResponses, (tokenAllowanceResponse, index) => {
          tokenAllowances[tokenSymbols[index]] = tokenAllowanceResponse
        })

        commit('setTokenAllowances', tokenAllowances)
        commit('setTokenAllowancesUpdatedAt', moment.utc())
      })
    },

    approveContractForAmount({ getters, rootGetters, commit }, data) {
      if (getters.isSubmitting) {
        return
      }
      commit('setIsSubmitting', true)
      commit('setTransactionStatus', 'Transaction is Submitting!')

      const { tokenAddress, spenderAddress, amount } = data

      const walletAddress = rootGetters['wallet/getAddress']
      const walletPrivateKey = rootGetters['wallet/getPrivateKey']
      const tokenContract = new web3.eth.Contract(IERC20.abi, tokenAddress)
      const gasPrice = rootGetters['network/getGasPrice']

      const tx = {
        from: walletAddress,
        to: tokenAddress,
        gas: '100000',
        gasPrice: gasPrice,
        data: tokenContract.methods.approve(spenderAddress, amount).encodeABI()
      }

      web3.eth.accounts.signTransaction(tx, walletPrivateKey).then(signed => {
        const transaction = web3.eth.sendSignedTransaction(signed.rawTransaction)

        transaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('contract@approveContractForAmount/confirmation: ' + confirmationNumber)
          commit('setIsSubmitting', false)
          commit('setTransactionStatus', 'contract@approveContractForAmount/confirmation: ' + confirmationNumber)
        })

        transaction.on('transactionHash', hash => {
          console.log('contract@approveContractForAmount/transactionHash')
          console.log(hash)
          const messageHash = hash
          commit('setTransactionStatus', 'contract@approveContractForAmount/transactionHash' + hash)
        })

        transaction.on('receipt', receipt => {
          console.log('contract@approveContractForAmount/receipt')
          console.log(receipt)
          commit('setTransactionStatus', 'contract@approveContractForAmount/receipt' + receipt)
        })

        transaction.on('error', error => {
          console.log('contract@approveContractForAmount/error')
          console.log(error)
          commit('setIsSubmitting', false)
          commit('setTransactionStatus', 'contract@approveContractForAmount/error' + error)
        })
      })
        .then(
          commit('setTransactionStatus', 'Completed')
        )
    },

    async submitArbitrage({ getters, rootGetters, commit }, data) {
      if (getters.isSubmitting) {
        return
      }

      commit('setIsSubmitting', true)
      commit('setTransactionStatus', 'Transaction is Submitting!')

      const { assets, inputAmount, minimumOutputAmount, router, feeAmount } = data
      const flashloanDexSwapContract = new web3.eth.Contract(flashloanDexSwapContractJson.abi, flashloanDexSwapContractAddress)
      const priorityGasPrice = rootGetters['network/getPriorityGasPrice']
      const walletAddress = rootGetters['wallet/getAddress']
      const walletPrivateKey = rootGetters['wallet/getPrivateKey']
      const gasPrice = rootGetters['network/getGasPrice']
      const tx = {
        from: walletAddress,
        to: getters.getAddress,
        gas: '5000000',
        gasPrice: gasPrice,
        data: flashloanDexSwapContract.methods.trade(assets, inputAmount, minimumOutputAmount, router, feeAmount).encodeABI(),
        value: '0x00',
      }

      web3.eth.accounts.signTransaction(tx, walletPrivateKey).then(signed => {
        const transaction = web3.eth.sendSignedTransaction(signed.rawTransaction)

        transaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('contract@submitArbitrage/confirmation: ' + confirmationNumber)
          commit('setIsSubmitting', false)
          commit('setTransactionStatus', 'contract@submitArbitrage/confirmation: ' + confirmationNumber)
        })

        transaction.on('transactionHash', hash => {
          console.log('contract@submitArbitrage/transactionHash')
          console.log(hash)
          const messsageHash = hash
          commit('setTransactionStatus', 'contract@submitArbitrage/transactionHash: ' + hash)
        })

        transaction.on('receipt', receipt => {
          console.log('contract@submitArbitrage/receipt')
          console.log(receipt)
          commit('setTransactionStatus', 'contract@submitArbitrage/receipt: ' + receipt.transactionHash)
        })

        transaction.on('error', error => {
          console.log('contract@submitArbitrage/error')
          commit('setIsSubmitting', false)
          console.log(error)
          commit('setTransactionStatus', 'contract@submitArbitrage/error ' + error)
        })
      }).then(
        commit('setTransactionStatus', 'Completed')
      )
    },

    async withdrawBalance({ getters, rootGetters, commit }) {
      if (getters.isSubmitting) {
        return
      }

      commit('setIsSubmitting', true)
      commit('setContractTransactionStatus', 'Transaction is Submitting!')

      const flashloanDexSwapContract = new web3.eth.Contract(flashloanDexSwapContractJson.abi, flashloanDexSwapContractAddress)
      const gasPrice = rootGetters['network/getGasPrice']
      const walletAddress = rootGetters['wallet/getAddress']
      const walletPrivateKey = rootGetters['wallet/getPrivateKey']

      const tx = {
        from: walletAddress,
        to: getters.getAddress,
        gas: '4000000',
        gasPrice: gasPrice,
        data: flashloanDexSwapContract.methods.withdrawBalance().encodeABI(),
        value: '0x00',
      }

      web3.eth.accounts.signTransaction(tx, walletPrivateKey).then(signed => {
        const transaction = web3.eth.sendSignedTransaction(signed.rawTransaction)

        transaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('contract@withdrawBalance/confirmation: ' + confirmationNumber)
          commit('setIsSubmitting', false)
          commit('setContractTransactionStatus', 'contract@withdrawBalance/confirmation: ' + confirmationNumber)
        })

        transaction.on('transactionHash', hash => {
          console.log('contract@withdrawBalance/transactionHash')
          console.log(hash)
          commit('setContractTransactionStatus', 'contract@approveContractForAmount/transactionHash:' + hash)
        })

        transaction.on('receipt', receipt => {
          console.log('contract@withdrawBalance/receipt')
          console.log(receipt)
          commit('setContractTransactionStatus', 'contract@withdrawBalance/receipt:' + receipt.transactionHash)
        })

        transaction.on('error', error => {
          console.log('contract@withdrawBalance/error')
          commit('setIsSubmitting', false)
          console.log(error)
          commit('setContractTransactionStatus', 'contract@withdrawBalance/error ' + error)
        })
      })
        .then(
          commit('setContractTransactionStatus', 'Completed')
        )
    },

    async withdrawToken({ getters, rootGetters, commit }, tokenAddress) {
      if (getters.isSubmitting) {
        return
      }
      commit('setIsSubmitting', true)
      commit('setContractTransactionStatus', 'Transaction is Submitting!')

      const flashloanDexSwapContract = new web3.eth.Contract(flashloanDexSwapContractJson.abi, flashloanDexSwapContractAddress)
      const gasPrice = rootGetters['network/getGasPrice']
      const walletAddress = rootGetters['wallet/getAddress']
      const walletPrivateKey = rootGetters['wallet/getPrivateKey']

      const tx = {
        from: walletAddress,
        to: getters.getAddress,
        gas: '4000000',
        gasPrice: gasPrice,
        data: flashloanDexSwapContract.methods.withdrawToken(tokenAddress).encodeABI(),
        value: '0x00',
      }
      web3.eth.accounts.signTransaction(tx, walletPrivateKey).then(signed => {
        const transaction = web3.eth.sendSignedTransaction(signed.rawTransaction)

        transaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('contract@withdrawToken/confirmation: ' + confirmationNumber)
          commit('setIsSubmitting', false)
          commit('setContractTransactionStatus', 'contract@withdrawBalance/confirmation: ' + confirmationNumber)
        })

        transaction.on('transactionHash', hash => {
          console.log('contract@withdrawToken/transactionHash')
          console.log(hash)
          commit('setContractTransactionStatus', 'contract@approveContractForAmount/transactionHash:' + hash)
        })

        transaction.on('receipt', receipt => {
          console.log('contract@withdrawToken/receipt')
          console.log(receipt)
          commit('setContractTransactionStatus', 'contract@withdrawToken/receipt: ' + receipt.transactionHash)
        })

        transaction.on('error', error => {
          console.log('contract@withdrawToken/error')
          commit('setIsSubmitting', false)
          console.log(error)
          commit('setContractTransactionStatus', 'contract@withdrawBalance/error: ' + error)
        })
      })
        .then(
          commit('setContractTransactionStatus', 'Completed')
        )
    },
  },
}
