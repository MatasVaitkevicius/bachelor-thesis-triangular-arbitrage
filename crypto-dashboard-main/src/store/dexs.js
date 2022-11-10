import DEX_FACTORY_CONTRACT_ABI from '@/abis/UniswapV2Factory.json'
import DEX_PAIR_CONTRACT_ABI from '@/abis/UniswapV2Pair.json'
import { web3 } from '@/libs/web3'
import Dexs from '@/json/dexs'

export default {
    namespaced: true,

    state: {
        dexPairs: {},
    },

    getters: {
        getDexs() {
            return Dexs
        },

        getDexPairs(state) {
            return state.dexPairs
        },
    },

    mutations: {
        initDexPairs(state) {
            let update = {}

            state.dexPairs = {
                ...state.dexPairs,
                ...update,
            }
        },

        setDexPair(state, data) {
            let update = state.dexPairs

            update[data.pairSymbol] = {
                pairAddress: data.pairAddress,
                token0: data.token0,
                token1: data.token1,
            }

            state.dexPairs = {
                ...state.dexPairs,
                ...update,
            }
        },
    },

    actions: {
        fetchPairAddresses({ rootGetters, commit }, dex) {
            const factoryContract = new web3.eth.Contract(DEX_FACTORY_CONTRACT_ABI, dex.factoryAddress)

            const trios = rootGetters['trios/getTrios']
            const tokens = rootGetters['tokens/getTokens']

            commit('initDexPairs')

            _.forEach(_.keys(trios), trioKey => {
                const trio = trios[trioKey]

                const pairs = [
                    [tokens[trio.tokens[0]].address, tokens[trio.tokens[1]].address],
                    [tokens[trio.tokens[1]].address, tokens[trio.tokens[2]].address],
                    [tokens[trio.tokens[2]].address, tokens[trio.tokens[0]].address],
                ]

                Promise.all([
                    factoryContract.methods.getPair(pairs[0][0], pairs[0][1]).call(),
                    factoryContract.methods.getPair(pairs[1][0], pairs[1][1]).call(),
                    factoryContract.methods.getPair(pairs[2][0], pairs[2][1]).call(),
                ]).then(responses => {
                    const pair1Contract = new web3.eth.Contract(DEX_PAIR_CONTRACT_ABI, responses[0])

                    Promise.all([
                        pair1Contract.methods.token0().call(),
                        pair1Contract.methods.token1().call(),
                    ]).then(pair1Responses => {
                        commit('setDexPair', {
                            pairSymbol: tokens[trio.tokens[0]].symbol + '_' + tokens[trio.tokens[1]].symbol,
                            pairAddress: responses[0] !== '0x0000000000000000000000000000000000000000' ? responses[0] : false,
                            token0: pair1Responses[0],
                            token1: pair1Responses[1],
                        })
                    })

                    const pair2Contract = new web3.eth.Contract(DEX_PAIR_CONTRACT_ABI, responses[1])

                    Promise.all([
                        pair2Contract.methods.token0().call(),
                        pair2Contract.methods.token1().call(),
                    ]).then(pair2Responses => {
                        commit('setDexPair', {
                            pairSymbol: tokens[trio.tokens[1]].symbol + '_' + tokens[trio.tokens[2]].symbol,
                            pairAddress: responses[1] !== '0x0000000000000000000000000000000000000000' ? responses[1] : false,
                            token0: pair2Responses[0],
                            token1: pair2Responses[1],
                        })
                    })

                    const pair3Contract = new web3.eth.Contract(DEX_PAIR_CONTRACT_ABI, responses[2])

                    Promise.all([
                        pair3Contract.methods.token0().call(),
                        pair3Contract.methods.token1().call(),
                    ]).then(pair3Responses => {
                        commit('setDexPair', {
                            pairSymbol: tokens[trio.tokens[2]].symbol + '_' + tokens[trio.tokens[0]].symbol,
                            pairAddress: responses[2] !== '0x0000000000000000000000000000000000000000' ? responses[2] : false,
                            token0: pair3Responses[0],
                            token1: pair3Responses[1],
                        })
                    })
                })
            })
        },

        async fetchReserves({ commit, getters }, data) {
            const pairSymbol = data.token1.symbol + '_' + data.token2.symbol
            const dexPair = _.get(getters.getDexPairs, pairSymbol)
            const pairContract = new web3.eth.Contract(DEX_PAIR_CONTRACT_ABI, dexPair.pairAddress)

            let fetchedReserves

            try {
                fetchedReserves = await pairContract.methods.getReserves().call()

                if (dexPair.token0 === data.token1.address) {
                    return {
                        token1: fetchedReserves[0],
                        token2: fetchedReserves[1],
                        blockTimestamp: fetchedReserves[2],
                    }
                } else {
                    return {
                        token1: fetchedReserves[1],
                        token2: fetchedReserves[0],
                        blockTimestamp: fetchedReserves[2],
                    }
                }
            } catch (e) {
                fetchedReserves = false
                console.log(e.message)
            }

            return fetchedReserves || false
        },
    },
}

