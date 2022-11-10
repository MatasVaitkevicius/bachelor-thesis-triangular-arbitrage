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
          </tr>
        </thead>
        <tbody>
          <tr v-for="token in tokens">
            <td class="text-center">
              <div>
                <b-img :src="`${token.image}`" fluid alt="Responsive image"></b-img>
              </div>{{ token.symbol }}</td>
            <td><a :href="explorerUrl(token.address)" target="_blank">{{ token.address }}</a></td>
            <td class="text-center">{{ tokenBalance(token.symbol) }}</td>
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
        return this.$store.getters['wallet/getTokenBalances'] || {}
      },

      tokenBalancesUpdatedAt() {
        return this.$store.getters['wallet/getTokenBalancesUpdatedAt']
      },
    },

    methods: {
      tokenBalance(symbol) {
        return _.get(this.tokenBalances, symbol) || 0
      },

      explorerUrl(address) {
        return process.env.VUE_APP_EXPLORER_URL + '/address/' + address
      },
    },
  }
</script>
