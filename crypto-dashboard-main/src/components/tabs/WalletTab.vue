<template>
  <div>
    <wallet />
    <wallet-tokens class="mt-3" />
  </div>
</template>

<script>
  import Wallet from '@/components/Wallet'
  import WalletTokens from '@/components/WalletTokens'

  export default {
    components: {
      Wallet,
      WalletTokens,
    }
  }
</script>
