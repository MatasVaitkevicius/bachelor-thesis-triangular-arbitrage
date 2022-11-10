<template>
  <div>
    <b-modal
      id="create-token-modal"
      ref="modal"
      title="Submit Token Name"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Symbol"
          label-for="symbol-input"
          invalid-feedback="Token symbol is required"
        >
          <b-form-input
            id="symbol-input"
            v-model="token.symbol"
            :state="token.symbolState"
            placeholder="Enter token symbol"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Token name is required"
        >
          <b-form-input
            id="name-input"
            v-model="token.name"
            :state="token.nameState"
            placeholder="Enter token name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Address"
          label-for="address-input"
          invalid-feedback="Token address is required"
        >
          <b-form-input
            id="address-input"
            v-model="token.address"
            :state="token.addressState"
            placeholder="Enter token address"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Decimals"
          label-for="decimals-input"
          invalid-feedback="Token decimals is required"
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
          invalid-feedback="Token image is required"
        >
          <b-form-input
            id="image-input"
            v-model="token.image"
            :state="token.imageState"
            placeholder="Enter token image address"
            required
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
        token: {
        symbol: '',
        symbolState: null,
        name: '',
        nameState: null,
        address: '',
        addressState: null,
        decimals: 0,
        decimalsState: null,
        image: '',
        imageState: null,
        }
      }
    },
    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.token.symbolState = valid
        this.token.nameState = valid
        this.token.addressState = valid
        this.token.decimalsState = valid
        this.token.imageState = valid
        return valid
      },
      resetModal() {
        this.token.symbol = ''
        this.token.symbolState = null
        this.token.name = ''
        this.token.nameState = null
        this.token.address = ''
        this.token.addressState = null
        this.token.decimals = 0
        this.token.decimalsState = null
        this.token.image = ''
        this.token.imageState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()

        // this.resetModal()
      },

      async submitToken(newToken) {
        await this.$store.dispatch("tokenos/createToken", newToken);
      },

      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }

        const newToken = {
          token: {
            symbol: this.token.symbol,
            name: this.token.name,
            address: this.token.address,
            decimals: this.token.decimals,
            image: this.token.image,
          },
        }

        this.submitToken(newToken)

        this.$nextTick(() => {
          this.$bvModal.hide('create-token-modal')
        })

        this.$store.dispatch('tokenos/fetchTokens')

        this.resetModal()
      }
    }
  }
</script>