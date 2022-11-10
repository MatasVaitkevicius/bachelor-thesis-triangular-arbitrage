<template>
  <div>
    <b-modal
      id="create-dex-modal"
      ref="modal"
      title="Submit Dex Name"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Symbol"
          label-for="dex-symbol-input"
          invalid-feedback="Dex symbol is required"
        >
          <b-form-input
            id="dex-symbol-input"
            v-model="dex.dexSymbol"
            :state="dex.dexSymbolState"
            placeholder="Enter dex symbol"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Name"
          label-for="dex-name-input"
          invalid-feedback="Dex name is required"
        >
          <b-form-input
            id="dex-name-input"
            v-model="dex.dexName"
            :state="dex.dexNameState"
            placeholder="Enter dex name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Factory Address"
          label-for="factory-address-input"
          invalid-feedback="Dex factory address is required"
        >
          <b-form-input
            id="factory-address-input"
            v-model="dex.factoryAddress"
            :state="dex.factoryAddressState"
            placeholder="Enter dex factory address"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Router Address"
          label-for="router-address-input"
          invalid-feedback="Dex router address is required"
        >
          <b-form-input
            id="router-address-input"
            v-model="dex.routerAddress"
            :state="dex.routerAddressState"
            placeholder="Enter dex router address"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Fee"
          label-for="fee-input"
          invalid-feedback="Dex fee is required"
        >
          <b-form-input
            id="fee-input"
            v-model="dex.fee"
            :state="dex.feeState"
            placeholder="Enter dex fee"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Image"
          label-for="image-input"
          invalid-feedback="Dex image address is required"
        >
          <b-form-input
            id="image-input"
            v-model="dex.image"
            :state="dex.imageState"
            required
            placeholder="Enter dex image address"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dex: {
          dexSymbol: '',
          dexSymbolState: null,
          dexName: '',
          dexNameState: null,
          factoryAddress: '',
          factoryAddressState: null,
          routerAddress: '',
          routerAddressState: null,
          fee: '',
          feeState: null,
          image: '',
          imageState: null,
        }
      }
    },
    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.dex.dexSymbolState = valid
        this.dex.dexNameState = valid
        this.dex.factoryAddressState = valid
        this.dex.routerAddressState = valid
        this.dex.feeState = valid
        this.dex.imageState = valid
        return valid
      },
      resetModal() {
        this.dex.dexSymbol = ''
        this.dex.dexSymbolState = null
        this.dex.dexName = ''
        this.dex.dexNameState = null
        this.dex.factoryAddress = ''
        this.dex.factoryAddressState = null
        this.dex.routerAddress = ''
        this.dex.routerAddressState = null
        this.dex.fee = ''
        this.dex.feeState = null
        this.dex.image = ''
        this.dex.imageState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()

        // this.resetModal()
      },

      async submitDex(newDex) {
        await this.$store.dispatch("dexsAPI/createDex", newDex);
      },

      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }

        const newDex = {
          dex: {
            symbol: this.dex.dexSymbol,
            name: this.dex.dexName,
            factoryAddress: this.dex.factoryAddress,
            routerAddress: this.dex.routerAddress,
            fee: this.dex.fee,
            image: this.dex.image,
          },
        }

        this.submitDex(newDex)

        this.$nextTick(() => {
          this.$bvModal.hide('create-dex-modal')
        })

        this.$store.dispatch('dexsAPI/fetchDexs')

        this.resetModal()
      }
    }
  }
</script>