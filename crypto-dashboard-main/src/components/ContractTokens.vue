<template>
  <div class="card">
    <div class="card-header d-flex">
      <div>Token Balances</div>
      <div class="ml-auto text-muted">
        <small>{{ tokenBalancesUpdatedAt | datetime }}</small>
      </div>
    </div>
    <div class="card-body">
      <table class="table table-bordered mb-0">
        <thead>
          <tr class="bg-light">
            <td class="min-width text-center">Symbol</td>
            <td>Address</td>
            <td class="text-center">Balance</td>
            <td class="min-width text-center">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="token in tokens">
            <td class="text-center">
                <div>
                    <b-img :src="`${token.image}`" fluid alt="Responsive image"></b-img>
                </div>
                {{ token.symbol }}
            </td>
            <td><a :href="explorerUrl(token.address)" target="_blank">{{ token.address }}</a></td>
            <td class="text-center">{{ tokenBalance(token.symbol) }}</td>
            <td>
              <b-button :disabled="tokenBalance(token.symbol) == 0" class="btn btn-secondary" @click.prevent="withdrawToken(token.address)">Withdraw Token</b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataApproveAmounts: {},
      }
    },

    mounted() {
      _.forIn(this.tokens, token => {
        this.dataApproveAmounts[token.symbol] = '1' + '0'.repeat(token.decimals)
      })
    },

    computed: {
      tokens() {
        return this.$store.getters['tokens/getTokens']
      },

      tokenBalances() {
        return this.$store.getters['contract/getTokenBalances'] || {}
      },

      tokenBalancesUpdatedAt() {
        return this.$store.getters['contract/getTokenBalancesUpdatedAt']
      },
    },

    methods: {
      tokenBalance(symbol) {
        return _.get(this.tokenBalances, symbol) || 0
      },

      explorerUrl(address) {
        return process.env.VUE_APP_EXPLORER_URL + '/address/' + address
      },

      withdrawToken(tokenAddress) {
        if(confirm(`Do you really want to Withdraw Token from Smart Contract?`)){
          this.$store.dispatch('contract/withdrawToken', tokenAddress)
        }
      },
    },
  }
</script>
