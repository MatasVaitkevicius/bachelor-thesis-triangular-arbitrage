<template>
  <div class="card">
    <div class="card-header d-flex">
      <div>Wallet</div>
      <div class="ml-auto text-muted">
        <small>{{ balanceUpdatedAt | datetime }}</small>
      </div>
    </div>
    <div class="card-body">
      <div class="d-flex">
        <div>Address</div>
        <div class="ml-auto"><a :href="explorerUrl(walletAddress)" target="_blank">{{ walletAddress }}</a></div>
      </div>
      <div class="d-flex">
        <div>Balance</div>
        <div class="ml-auto">{{ walletBalance | smallNumber(walletNativeTokenDecimals, 4) }} <small class="text-muted">{{ walletNativeTokenSymbol }}</small></div>
      </div>
      <div class="d-flex">
        <div>Minimum balance</div>
        <div class="ml-auto">{{ walletMinimumBalance | smallNumber(walletNativeTokenDecimals, 4) }} <small class="text-muted">{{ walletNativeTokenSymbol }}</small></div>
      </div>
      <div class="d-flex">
        <div>Balance exceeds minimum</div>
        <div class="ml-auto">{{ walletBalanceExceedsMinimum ? 'Yes' : 'No' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      walletAddress() {
        return this.$store.getters['userAPI/getPublicAddress'] || this.$store.getters['wallet/getAddress']
      },

      walletBalance() {
        return this.$store.getters['wallet/getBalance'] || 0
      },

      balanceUpdatedAt() {
        return this.$store.getters['wallet/getBalanceUpdatedAt']
      },

      walletNativeTokenSymbol() {
        return this.$store.getters['wallet/getNativeTokenSymbol']
      },

      walletNativeTokenDecimals() {
        return this.$store.getters['wallet/getNativeTokenDecimals']
      },

      walletMinimumBalance() {
        return this.$store.getters['wallet/getMinimumBalance']
      },

      walletBalanceExceedsMinimum() {
        return this.$store.getters['wallet/balanceExceedsMinimum']
      },
    },

    methods: {
      explorerUrl(address) {
        return process.env.VUE_APP_EXPLORER_URL + '/address/' + address
      },
    },
  }
</script>
