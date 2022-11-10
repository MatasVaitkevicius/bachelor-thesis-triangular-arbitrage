<template>
  <div>
    <b-modal
      id="update-token-modal"
      ref="update-token-modal"
      title="Submit Your Name"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Symbol"
          label-for="symbol-input"
          invalid-feedback="Symbol is required"
          :state="token.symbolState"
        >
          <b-form-input
            id="symbol-input"
            v-model="token.symbol"
            :state="token.symbolState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="token.nameState"
        >
          <b-form-input
            id="name-input"
            v-model="token.name"
            :state="token.nameState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Address"
          label-for="address-input"
          invalid-feedback="Address is required"
          :state="token.addressState"
        >
          <b-form-input
            id="address-input"
            v-model="token.address"
            :state="token.addressState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Decimals"
          label-for="decimals-input"
          invalid-feedback="Decimals is required"
          :state="token.decimalsState"
        >
          <b-form-input
            type="number"
            id="decimals-input"
            v-model="token.decimals"
            :state="token.decimalsState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Image"
          label-for="image-input"
          invalid-feedback="Image is required"
          :state="token.imageState"
        >
          <b-form-input
            id="image-input"
            v-model="token.image"
            :state="token.imageState"
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
      tokenId: {
        type: Number,
        required: true,
      },

      showUpdateTokenModal: {
        type: Boolean,
        required: true,
      },
    },

    data() {
    return {
      token: this.token,
      loading: false,
      error:'',
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },

    created() {
      let apiURL = `http://localhost:4000/api/tokens/${this.tokenId}`;
      axios.get(apiURL).then((res) => {
        this.token = res.data;
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

      async updateToken(updateToken) {
        await this.$store.dispatch("tokenos/updateToken", updateToken);
      },

      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }

        const updateToken = {
          token: {
            _id: this.token.id,
            symbol: this.token.symbol,
            name: this.token.name,
            address: this.token.address,
            decimals: this.token.decimals,
            image: this.token.image,
          },
        }

        this.updateToken(updateToken)

        this.$nextTick(() => {
          this.$bvModal.hide('update-token-modal')
        })

        this.$store.dispatch('tokenos/fetchTokens')
      }
    }
  }
</script>