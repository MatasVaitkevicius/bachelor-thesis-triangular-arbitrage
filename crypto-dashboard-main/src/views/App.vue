<template>
  <div id="app" class="app">
    <navbar />
    <router-view />
  </div>
</template>

<script>
  import Navbar from "@/components/Navbar"

  export default {
    components: {
      Navbar,
    },

    mounted() {
      // console.clear()

      const dexs = this.$store.getters['dexs/getDexs']

      this.fetchDexPairAddresses(dexs.QUICK)

      this.updateStore()

      setInterval(this.updateStore, 60000)
    },

    methods: {
      fetchDexPairAddresses(dex) {
        this.$store.dispatch('dexs/fetchPairAddresses', dex)
      },

      updateStore() {
        this.$store.dispatch('tokenos/fetchTokens')
        this.$store.dispatch('dexsAPI/fetchDexs')
        this.$store.dispatch('network/fetchGasPrice')
        this.$store.dispatch('network/fetchBlock')
        this.$store.dispatch('wallet/fetchBalance')
        this.$store.dispatch('wallet/fetchTokenBalances')
        this.$store.dispatch('contract/fetchTokenBalances')
        this.$store.dispatch('contract/fetchTokenAllowances')
      },
    },
  }
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .min-width {
    width: 1%;
    white-space: nowrap;
  }

  table td,
  table th {
    vertical-align: middle !important;
  }
</style>
