<template>
  <b-container class="mt-3" fluid>
    <b-tabs card>
      <b-tab title="Arbitrage">
        <arbitrage-tab />
      </b-tab>
      <b-tab title="Wallet">
        <wallet-tab />
      </b-tab>
      <b-tab title="Contract">
        <contract-tab />
      </b-tab>
      <b-tab title="Trios">
        <trio-tab />
      </b-tab>
      <b-tab title="Tokens">
        <token-tab />
      </b-tab>
      <b-tab title="Dexs">
        <dex-tab />
      </b-tab>
      <b-tab title="Network">
        <network-tab />
      </b-tab>
      <b-tab title="Settings">
        <settings-tab />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
  import NetworkTab from '@/components/tabs/NetworkTab'
  import WalletTab from '@/components/tabs/WalletTab'
  import TokenTab from '@/components/tabs/TokenTab'
  import DexTab from '@/components/tabs/DexTab'
  import TrioTab from '@/components/tabs/TrioTab'
  import ArbitrageTab from '@/components/tabs/ArbitrageTab'
  import SettingsTab from '@/components/tabs/SettingsTab'
  import ContractTab from '@/components/tabs/ContractTab'
  import MetaMaskTab from '@/components/tabs/MetaMaskTab'
  import ListComponent from '@/components/ListComponent'
  import MetaMask from '@/components/MetaMask'

  export default {
    components: {
      NetworkTab,
      WalletTab,
      TokenTab,
      DexTab,
      TrioTab,
      ArbitrageTab,
      SettingsTab,
      MetaMaskTab,
      ContractTab,
      ListComponent,
      MetaMask,
    }
  }
</script>
