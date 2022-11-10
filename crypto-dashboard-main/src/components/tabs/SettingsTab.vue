<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-8 offset-sm-2">
        <div class="card">
          <div class="card-header">Flashloan fee</div>
          <div class="card-body d-flex">
            <div>{{ flashloanFee }}</div>
            <div class="ml-auto">{{ flashloanFeePercentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      flashloanFee() {
        return this.$store.getters['settings/getFlashloanFee']
      },

      flashloanFeePercentage() {
        return this.flashloanFee * 100
      },
    },
  }
</script>
