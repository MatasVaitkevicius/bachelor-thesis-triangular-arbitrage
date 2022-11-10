<template>
  <div>
    <table class="table table-bordered">
      <thead>
        <tr class="bg-light">
          <td class="min-width">Symbol</td>
          <td class="text-center">Token 1</td>
          <td class="text-center">Token 2</td>
          <td class="text-center">Token 3</td>
          <td class="text-center">Seed</td>
          <td class="text-center">Approve</td>
          <td class="text-center">Profit Target</td>
        </tr>
      </thead>
      <tbody>
        <template v-for="(trio, symbol) in trios">
          <tr>
            <td>{{ symbol }}</td>
            <td class="text-center">
                <div>
                    <b-img :src="`${trio.images[0]}`" fluid alt="Responsive image"></b-img>
                </div>
                    {{ trio.tokens[0] }}
            <td class="text-center">
                <div>
                    <b-img :src="`${trio.images[1]}`" fluid alt="Responsive image"></b-img>
                </div>
                {{ trio.tokens[1] }}
            </td>
            <td class="text-center">
                <div>
                    <b-img :src="`${trio.images[2]}`" fluid alt="Responsive image"></b-img>
                </div>
                {{ trio.tokens[2] }}
            </td>
            <td class="text-center">{{ trio.seed }}</td>
            <td class="text-center">{{ trio.approvalAmount }}</td>
            <td class="text-center">{{ trio.requiredProfit }}</td>
          </tr>
        </template>
      </tbody>
    </table>

     <div class="card mt-3">
      <div class="card-header">Pairs</div>
      <div class="card-body pb-0">
        <pre>{{ dexPairs }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      trios() {
        return this.$store.getters['trios/getTrios']
      },

      dexPairs() {
        return this.$store.getters['dexs/getDexPairs']
      },
    },
  }
</script>
