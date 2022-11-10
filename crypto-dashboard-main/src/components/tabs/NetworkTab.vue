<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-8 offset-sm-2">
        <div class="card">
          <div class="card-header">Feed</div>
          <div class="card-body d-flex">
            <div>{{ feedUrl }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 col-md-8 offset-sm-2">
        <div class="card">
          <div class="card-header">Chain ID</div>
          <div class="card-body d-flex">
            <div>{{ chainId }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 col-md-8 offset-sm-2">
        <div class="card">
          <div class="card-header d-flex">
            <div>Gas price</div>
            <div class="ml-auto text-muted">
              <small>{{ updatedAt | datetime }}</small>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex">
              <div>Network gas price</div>
              <div class="ml-auto">{{ gasPrice }}</div>
            </div>
            <!--
            <div class="d-flex">
              <div>Network priority gas price</div>
              <div class="ml-auto">{{ priorityGasPrice }}</div>
            </div>
            -->
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 col-md-8 offset-sm-2">
        <div class="card">
          <div class="card-header d-flex">
            <div>Block height</div>
            <div class="ml-auto text-muted">
              <small>{{ updatedAt | datetime }}</small>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex">
              <div>Block</div>
              <div class="ml-auto">{{ block }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      chainId() {
        return this.$store.getters['network/getChainId'] || '-'
      },

      feedUrl() {
        return this.$store.getters['network/getFeedUrl'] || '-'
      },

      gasPrice() {
        return this.$store.getters['network/getGasPrice'] || '-'
      },

      priorityGasPrice() {
        return this.$store.getters['network/getPriorityGasPrice'] || '-'
      },

      block() {
        return this.$store.getters['network/getBlock'] || '-'
      },

      updatedAt() {
        return this.$store.getters['network/getUpdatedAt']
      },
    },
  }
</script>
