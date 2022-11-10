<template>
  <div>
    <create-dex-modal/>
    <b-button v-b-modal.create-dex-modal class="btn btn-success" style="margin-bottom: 10px;">Create New Dex</b-button>
    <table class="table table-bordered">
    <thead>
      <tr class="bg-light">
        <td class="min-width text-center">Symbol</td>
        <td class="min-width text-center">Name</td>
        <td class="min-width text-center">Factory address</td>
        <td class="min-width text-center">Router address</td>
        <td class="text-center">Fee</td>
        <td class="text-center">Actions</td>
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
            <b-button variant="primary" class="btn btn-secondary"  ref="btnShow" @click="updateDexModal(dex)">
              Update
            </b-button>
            <b-button  @click.prevent="deleteDex(dex._id)" class="btn btn-danger">Delete</b-button >
        </td>
      </tr>
    </tbody>
  </table>
     <b-modal
      id="update-dex-modal"
      ref="update-dex-modal"
      title="Update Dex"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Symbol"
          label-for="dex-symbol-input"
        >
          <b-form-input
            id="dex-symbol-input"
            v-model="this.selectedDex.symbol"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Name"
          label-for="dex-name-input"
        >
          <b-form-input
            id="dex-name-input"
            v-model="this.selectedDex.name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Factory Address"
          label-for="factory-address-input"
        >
          <b-form-input
            id="factory-address-input"
            v-model="this.selectedDex.factoryAddress"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Router Address"
          label-for="router-address-input"
        >
          <b-form-input
            id="router-address-input"
            v-model="this.selectedDex.routerAddress"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Fee"
          label-for="fee-input"
        >
          <b-form-input
            id="fee-input"
            v-model="this.selectedDex.fee"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Image"
          label-for="image-input"
        >
          <b-form-input
            id="image-input"
            v-model="this.selectedDex.image"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import CreateDexModal from '../CreateDexModal';

export default {
  components: {
      CreateDexModal
  },
    data() {
      return {
        dataTokens: {},
        dataArbitrageUpdates: {},
        selectedDex: {},
      }
    },

  computed: {
    dexs() {
      return this.$store.getters['dexsAPI/getDexs']
    },
  },

  methods: {
      updateDexModal(dex) {
        this.selectedDex = dex;
        this.$refs['update-dex-modal'].show()
      },

      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()

        // this.resetModal()
      },

      handleSubmit() {
        // const newDex = {
        //   dex: {
        //     symbol: this.selectedDex.symbol,
        //     name: this.selectedDex.name,
        //     factoryAddress: this.selectedDex.factoryAddress,
        //     routerAddress: this.selectedDex.routerAddress,
        //     fee: this.selectedDex.fee,
        //     image: this.selectedDex.image,
        //   },
        // }

        // this.updateToken(updateToken)

        this.$nextTick(() => {
          this.$bvModal.hide('update-dex-modal')
        })

        // this.$store.dispatch('tokenos/fetchTokens')

        // this.resetModal()
      },

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
