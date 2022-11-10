<template>
  <div>
  <div class="card">
    <div>
      <div class="border p-1 bg-light d-flex">
      <div>
        <small>Transaction Status: {{ contractTransactionStatus }}</small>
      </div>
    </div>
    <div class="card-header d-flex">
      <div>Smart Contract</div>
      <div class="ml-auto text-muted">
        <small>{{ tokenBalancesUpdatedAt | datetime }}</small>
      </div>
    </div>
    <div class="card-body">
      <div class="d-flex">
        <div>Address</div>
        <div class="ml-auto"><a :href="explorerUrl(contractAddress)" target="_blank">{{ contractAddress }}</a></div>
      </div>
      <div class="d-flex">
        <div>Balance</div>
        <div class="ml-auto">{{ Number(contractBalance) | smallNumber(walletNativeTokenDecimals, 4) }} <small class="text-muted">MATIC</small></div>
      </div>
      <div class="d-flex">
      <div class="ml-auto"><b-button :disabled="contractBalance == 0" class="btn btn-secondary" @click.prevent="withdrawBalance()">Withdraw Balance (MATIC)</b-button></div>
      </div>
    </div>
    </div>
  </div>
    <contract-tokens class="mt-3" />
  </div>
</template>

<script>
  import ContractTokens from '@/components/ContractTokens'

  export default {
    components: {
      ContractTokens,
    },

    computed: {
      contractAddress() {
        return this.$store.getters['contract/getAddress']
      },

      contractBalance() {
        this.$store.dispatch('contract/getSmartContractBalance')
        return this.$store.getters['contract/getBalance']
      },

      walletNativeTokenSymbol() {
        return this.$store.getters['wallet/getNativeTokenSymbol']
      },

      walletNativeTokenDecimals() {
        return this.$store.getters['wallet/getNativeTokenDecimals']
      },

      tokenBalancesUpdatedAt() {
        return this.$store.getters['contract/getTokenBalancesUpdatedAt']
      },

      contractTransactionStatus() {
        return this.$store.getters['contract/getContractTransactionStatus']
      },
    },

    methods: {
      explorerUrl(address) {
        return process.env.VUE_APP_EXPLORER_URL + '/address/' + address
      },

      withdrawBalance() {
        if(confirm(`Do you really want to Withdraw Balancefrom Smart Contract?`)){
          this.$store.dispatch('contract/withdrawBalance');
        }
      },
    },
  }
</script>