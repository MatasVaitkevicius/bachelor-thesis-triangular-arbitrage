<template>
  <div>
    <div class="border p-1 text-muted bg-light d-flex">
      <div>
        <small>Timer interval {{ arbitrageTimerInterval | number }}ms</small>
      </div>
    </div>
         <div class="border p-1 bg-light d-flex">
      <div>
        <small>Transaction Status: {{ transactionStatus }}</small>
      </div>
    </div>
    <table class="mt-3 table table-bordered table-sm">
    <thead>
      <tr class="bg-light">
        <td class="min-width text-center">Trio</td>
        <td class="text-center">Input</td>
        <td class="text-center">Wallet Balance</td>
        <td class="text-center">Contract Balance</td>
        <td class="text-center">Contract Allowance</td>
        <!--<td class="text-center">Min Output</td>-->
        <td class="text-center">Output</td>
        <td class="text-center" style="width:100px;">Profit</td>
        <td class="min-width text-center">Allow</td>
        <td class="min-width text-center">Swap</td>
        <td class="min-width">Live</td>
        <td class="min-width">Trade</td>
      </tr>
    </thead>
    <tbody>
      <template v-for="(trio, symbol) in dataTrios">
        <tr>
          <arbitrage
            :trio="trio"
            :timer-interval="arbitrageTimerInterval"
            @message="onArbitrageMessage"
            @update="onArbitrageUpdate"
          />
          <td class="text-center">
          <div>
            <b-img :src="`${trio.tokens[0].image}`" left  fluid alt="Responsive image"></b-img>
            <b-img :src="`${trio.tokens[1].image}`" fluid alt="Responsive image"></b-img>
            <b-img :src="`${trio.tokens[2].image}`" right fluid alt="Responsive image"></b-img>
          </div>
          {{ symbol }}</td>
          <td class="text-center">
            <div>{{ trio.seed | smallNumber(trio.tokens[0].decimals) }} <small class="text-muted">{{ trio.tokens[0].symbol }}</small></div>
            <div class="text-muted">
              <small>{{ trio.seed }}</small>
            </div>
          </td>
          <td class="text-center">
            <div>{{ tokenBalance(trio.tokens[0].symbol) | smallNumber(trio.tokens[0].decimals) }} <small class="text-muted">{{ trio.tokens[0].symbol }}</small></div>
            <div class="text-muted">
              <small>{{ tokenBalance(trio.tokens[0].symbol) }}</small>
            </div>
          </td>
          <td class="text-center">
            <div>{{ contractBalance(trio.tokens[0].symbol) | smallNumber(trio.tokens[0].decimals) }} <small class="text-muted">{{ trio.tokens[0].symbol }}</small></div>
            <div class="text-muted">
              <small>{{ contractBalance(trio.tokens[0].symbol) }}</small>
            </div>
          </td>
          <td class="text-center">
            <div>{{ contractAllowance(trio.tokens[0].symbol) | smallNumber(trio.tokens[0].decimals) }} <small class="text-muted">{{ trio.tokens[0].symbol }}</small></div>
            <div class="text-muted">
              <small>{{ contractAllowance(trio.tokens[0].symbol) }}</small>
            </div>
          </td>
         <!--<td class="text-center">
            <div> {{ trio.minimumOutput | smallNumber(trio.tokens[0].decimals) }} <small class="text-muted">{{ trio.tokens[0].symbol }}</small></div>
            <div class="text-muted">
              <small>{{ trio.minimumOutput }}</small>
            </div>
          </td>
          -->
          <td class="text-center">
            <div>{{ arbitrageOutput(symbol) | smallNumber(trio.tokens[0].decimals) }} <small class="text-muted">{{ trio.tokens[0].symbol }}</small></div>
            <div class="text-muted">
              <small>{{ arbitrageOutput(symbol) }}</small>
            </div>
          </td>
          <td class="text-center text-muted">
            <small class="text-danger" v-if="isNegative(arbitrageProfit(symbol))">{{ arbitrageProfit(symbol) | smallNumber(trio.tokens[0].decimals) }}</small>
            <small v-else>{{ arbitrageProfit(symbol) | smallNumber(trio.tokens[0].decimals) }}</small>
          </td>
          <td>
             <b-button class="btn btn-secondary" @click.prevent="setContractAllowance(trio)">Allow</b-button>
          </td>
          <td>
            <b-button :disabled="trio.approvalAmount > contractAllowance(trio.tokens[0].symbol)" @click.prevent="submitSwap(trio)" class="btn btn-info">Swap</b-button>
          </td>
          <td class="text-center">
            <input type="checkbox" :value="true" v-model="dataTrios[symbol].isLive" />
          </td>
          <td class="text-center">
            <input type="checkbox" :value="true" v-model="dataTrios[symbol].canTrade" />
          </td>
        </tr>
        <tr>
          <td colspan="999" class="bg-light" style="border-bottom: 4px solid #dee2e6">
            <div class="d-flex">
              <div>
                <small class="text-muted">
                  <span>Required profit {{ trio.requiredProfit }}</span>
                </small>
              </div>
              <div class="ml-3">
                <small class="text-muted">
                  <span v-if="arbitrageUpdatedAt(symbol)">Updated {{ arbitrageUpdatedAt(symbol) | datetime }}</span>
                  <span v-else>&nbsp;</span>
                </small>
              </div>
              <div class="ml-auto">
                <small class="text-muted">{{ dataArbitrageMessages[symbol] }}</small>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  </div>
</template>

<script>
  import moment from "moment"
  import Big from 'big.js'
  import Arbitrage from '@/components/Arbitrage'

  export default {
    components: {
      Arbitrage,
    },

    data() {
      return {
        dataTrios: {},
        dataArbitrageMessages: {},
        dataArbitrageUpdates: {},
      }
    },

    mounted() {
      this.buildTrios()
    },

    computed: {
      dexs() {
        return this.$store.getters['dexs/getDexs']
      },

      arbitrageTimerInterval() {
        return this.$store.getters['settings/getArbitrageTimerInterval']
      },

      tokenBalances() {
        return this.$store.getters['wallet/getTokenBalances']
      },

      contractBalances() {
        return this.$store.getters['contract/getTokenBalances']
      },

      tokenAllowances() {
        return this.$store.getters['contract/getTokenAllowances']
      },

      transactionStatus() {
        return this.$store.getters['contract/getTransactionStatus']
      },
    },

    methods: {
      buildTrios() {
        let tokens = this.$store.getters['tokens/getTokens']
        let trios = this.$store.getters['trios/getTrios']

        this.dataTrios = {}

        _.forIn(trios, (trio, symbol) => {
          this.dataTrios[symbol] = {
            isLive: false,
            canTrade: true,
            tokens: [
              tokens[trio.tokens[0]],
              tokens[trio.tokens[1]],
              tokens[trio.tokens[2]],
            ],
            seed: trio.seed,
            requiredProfit: trio.requiredProfit,
            symbol: trio.symbol,
            approvalAmount: trio.approvalAmount,
            minimumOutput: trio.minimumOutput,
          }
        })
      },

      tokenBalance(symbol) {
        return _.get(this.tokenBalances, symbol) || '0'
      },

      contractBalance(symbol) {
        return _.get(this.contractBalances, symbol) || '0'
      },

      contractAllowance(symbol) {
        return _.get(this.tokenAllowances, symbol) || '0'
      },

      arbitrageMinimumOutput(symbol) {
        return _.get(this.dataArbitrageUpdates, symbol + '.minimumOutput') || '0'
      },

      arbitrageOutput(symbol) {
        return _.get(this.dataArbitrageUpdates, symbol + '.output') || '0'
      },

      arbitrageProfit(symbol) {
        return _.get(this.dataArbitrageUpdates, symbol + '.profit') || '0'
      },

      isNegative(amount) {
        const amountBig = new Big(amount)
        const zeroBig = new Big('0')

        return amountBig.lt(zeroBig)
      },

      arbitrageUpdatedAt(symbol) {
        return moment.utc()
      },

      onArbitrageMessage(payload) {
        let update = {}

        update[payload.trioSymbol] = payload.message

        this.dataArbitrageMessages = {
          ...this.dataArbitrageMessages,
          ...update,
        }
      },

      onArbitrageUpdate(payload) {
        let update = {}

        update[payload.trioSymbol] = payload.update

        this.dataArbitrageUpdates = {
          ...this.dataArbitrageUpdates,
          ...update,
        }
      },

      setContractAllowance(trio) {
        if(confirm(`Do you really want to allow Smart Contract to use tokens? Amount = ${trio.approvalAmount} USDC`)){
          this.$store.dispatch('contract/approveContractForAmount', {
            tokenAddress: trio.tokens[0].address,
            spenderAddress: this.$store.getters['contract/getAddress'],
            amount: trio.approvalAmount,
          })
        }
      },

      submitSwap(trio) {
        if(confirm("Do you really want to execute Triangular Arbitrage? Fee = 0.09% USDC")){
          const dex =  this.dexs['QUICK']
          this.$store.dispatch('contract/submitArbitrage', {
            assets: [trio.tokens[0].address, trio.tokens[1].address, trio.tokens[2].address],
            inputAmount: trio.seed,
            minimumOutputAmount: trio.minimumOutput,
            feeAmount: '900000',
            router: dex.routerAddress,
          })
        }
      },
    },
  }
</script>
