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
          label-for="symbol-input"
          invalid-feedback="Symbol is required"
          :state="dex.symbolState"
        >
          <b-form-input
            id="symbol-input"
            v-model="dex.symbol"
            :state="dex.symbolState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="dex.nameState"
        >
          <b-form-input
            id="name-input"
            v-model="dex.name"
            :state="dex.nameState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Factory Address"
          label-for="factory-address-input"
          invalid-feedback="Factory Address is required"
          :state="dex.factoryAddressState"
        >
          <b-form-input
            id="factory-address-input"
            v-model="dex.factoryAddress"
            :state="dex.factoryAddressState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Router Address"
          label-for="router-address-input"
          invalid-feedback="Router Address is required"
          :state="dex.routerAddressState"
        >
          <b-form-input
            id="router-address-input"
            v-model="dex.routerAddress"
            :state="dex.routerAddressState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Fee"
          label-for="fee-input"
          invalid-feedback="Fee is required"
          :state="dex.fee"
        >
          <b-form-input
            type="number"
            id="fee-input"
            v-model="dex.fee"
            :state="dex.feeState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Image"
          label-for="image-input"
          invalid-feedback="Image is required"
          :state="dex.imageState"
        >
          <b-form-input
            id="image-input"
            v-model="dex.image"
            :state="dex.imageState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
    props: {
      dexId: {
        type: Number,
        required: true,
      },

      showUpdateDexModal: {
        type: Boolean,
        required: true,
      },
    },

    data() {
    return {
      dex: this.dex,
      loading: false,
      error:'',
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },

    created() {
      let apiURL = `http://localhost:4000/api/dexs/${this.dexId}`;
      axios.get(apiURL).then((res) => {
        this.dex = res.data;
      })

    },

    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.nameState = valid
        return valid
      },

      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },

      async updateDex(updateDex) {
        await this.$store.dispatch("dexsAPI/updateDex", updateDex);
      },

      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }

        const updateDex = {
          dex: {
            _id: this.dex.id,
            symbol: this.dex.symbol,
            name: this.dex.name,
            factoryAddress: this.dex.factoryAddress,
            routerAddress: this.dex.routerAddress,
            fee: this.dex.fee,
            image: this.dex.image,
          },
        }

        this.updateDex(updateDex)

        this.$nextTick(() => {
          this.$bvModal.hide('update-dex-modal')
        })

        this.$store.dispatch('dexsAPI/fetchDexs')
      }
    }
  }
</script>