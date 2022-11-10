<template>
  <div>
    <create-dex-modal/>
    <b-button v-b-modal.create-dex-modal class="btn btn-success">Create New Dex</b-button>
    <table class="table table-bordered">
    <thead>
      <tr class="bg-light">
        <td class="min-width text-center">Symbol</td>
        <td>Name</td>
        <td>Factory address</td>
        <td>Router address</td>
        <td class="text-center">Fee</td>
        <td>Actions</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="dex in dexs">
        <td class="text-center">
            <div><b-img :src="`${dex.image}`" fluid alt="Responsive image"></b-img></div>
            {{ dex.symbol }}
        </td>
        <td>{{ dex.name }}</td>
        <td><a :href="explorerUrl(dex.factoryAddress)" target="_blank">{{ dex.factoryAddress }}</a></td>
        <td><a :href="explorerUrl(dex.routerAddress)" target="_blank">{{ dex.routerAddress }}</a></td>
        <td class="text-center">{{ dex.fee }}</td>
        <td class="text-center">
            <b-button variant="primary" class="btn btn-secondary"  ref="btnShow" @click="updateTokenModal(dex._id)">
              Update
            </b-button>
            <b-button  @click.prevent="deleteDex(dex._id)" class="btn btn-danger">Delete</b-button >
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
import UpdateDexModal from './UpdateDexModal';
import CreateDexModal from './CreateDexModal';

export default {
  components: {
      UpdateDexModal,
      CreateDexModal
  },

  computed: {
    dexs() {
      return this.$store.getters['dexsAPI/getDexs']
    },
  },

  methods: {
    explorerUrl(address) {
      return process.env.VUE_APP_EXPLORER_URL + '/address/' + address
    },

    async deleteDex(dexId) {
      if(confirm("Do you really want to delete?"))
      {
        await this.$store.dispatch('dexsAPI/deleteDex', dexId);
        await this.$store.dispatch('dexsAPI/fetchDexs');
      }
    },
  },
}
</script>
