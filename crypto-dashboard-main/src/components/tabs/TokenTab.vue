<template>
  <div>
    <create-token-modal/>
    <b-button v-b-modal.create-token-modal class="btn btn-success" style="margin-bottom: 10px">Create New Token </b-button>
    <div class="border p-1 text-muted bg-light d-flex">
      <div>
        <small>Timer interval {{ arbitrageTimerInterval | number }}ms</small>
      </div>
    </div>
    <table class="mt-3 table table-bordered table-sm">
    <thead>
      <tr class="bg-light">
        <td class="min-width text-center">Symbol</td>
        <td class="min-width text-center">Address</td>
        <td class="text-center">Decimals</td>
        <td class="text-center">Token Price ({{dexs['QUICK'].name}})</td>
        <td class="text-center">Actions</td>
      </tr>
    </thead>
    <tbody>
      <template v-for="(token, symbol) in dataTokens">
          <tokens
            :token="token"
            :timer-interval="arbitrageTimerInterval"
            @update="onArbitrageUpdate"
          />
            <td class="text-center">
            <div>
            <b-img :src="`${token.image}`" fluid alt="Responsive image"></b-img>
            </div>
            {{ token.symbolText }}
            </td>
            <td><a :href="explorerUrl(token.address)" target="_blank">{{ token.address }}</a></td>
            <td class="text-center">{{ token.decimals }}</td>
            <td class="text-center text-muted">
                <small>1 USDC = {{ arbitrageProfit(symbol) }}</small>
            </td>
          </td>
          <td class="text-center">
            <b-button variant="primary" class="btn btn-secondary"  ref="btnShow" @click="updateTokenModal(token)">
              Update
            </b-button>
            <b-button  @click.prevent="deleteToken(token._id)" class="btn btn-danger">Delete</b-button >
          </td>
        </tr>
        <tr>
          <td colspan="999" class="bg-light" style="border-bottom: 4px solid #dee2e6">
            <div class="d-flex">
              <div class="ml-3">
                <small class="text-muted">
                  <span v-if="arbitrageUpdatedAt(symbol)">Updated {{ arbitrageUpdatedAt(symbol) | datetime }}</span>
                  <span v-else>&nbsp;</span>
                </small>
              </div>
            </div>
          </td>
        </tr>
        </tr>
      </template>
    </tbody>
  </table>
    <div>
      <b-modal
        id="update-token-modal"
        ref="update-token-modal"
        title="Update Token"
        @ok="handleOk"
      >
        <b-form-group
          label="Symbol"
          label-for="symbol-input"
        >
          <b-form-input
            id="symbol-input"
            v-model="this.selectedToken.symbolText"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Name"
          label-for="name-input"
        >
          <b-form-input
            id="name-input"
            v-model="this.selectedToken.name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Address"
          label-for="address-input"
        >
          <b-form-input
            id="address-input"
            v-model="this.selectedToken.address"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Decimals"
          label-for="decimals-input"
        >
          <b-form-input
            type="number"
            id="decimals-input"
            v-model="this.selectedToken.decimals"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Image"
          label-for="image-input"
          invalid-feedback="Token image is required"
        >
          <b-form-input
            id="image-input"
            v-model="this.selectedToken.image"
          ></b-form-input>
        </b-form-group>
        </form>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import moment from "moment"
  import Big from 'big.js'
  import Tokens from '@/components/Tokens'
  import CreateTokenModal from '../CreateTokenModal'

  export default {
    components: {
      Tokens,
      CreateTokenModal
    },

    data() {
      return {
        dataTokens: {},
        dataArbitrageUpdates: {},
        selectedToken: {
          name: '',
        },
      }
    },

    mounted() {
      this.buildTokens()
    },

    computed: {
      dexs() {
        return this.$store.getters['dexs/getDexs']
      },

      tokens() {
        return this.$store.getters['tokenos/getTokens']
      },

      arbitrageTimerInterval() {
        return this.$store.getters['settings/getArbitrageTimerInterval']
      },

      tokenAllowances() {
        return this.$store.getters['contract/getTokenAllowances']
      },
    },

    methods: {
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()

        // this.resetModal()
      },

      async updateToken(updateToken) {
        await this.$store.dispatch("tokenos/updateToken", updateToken);
      },

      handleSubmit() {
        const updateToken = {
          token: {
            symbol: this.selectedToken.symbol,
            name: this.selectedToken.name,
            address: this.selectedToken.address,
            decimals: this.selectedToken.decimals,
            image: this.selectedToken.image,
          },
        }

        // this.updateToken(updateToken)

        this.$nextTick(() => {
          this.$bvModal.hide('update-token-modal')
        })

        // this.$store.dispatch('tokenos/fetchTokens')

        // this.resetModal()
      },

      async buildTokens() {
        await this.$store.dispatch('tokenos/fetchTokens')

        let tokens = this.$store.getters['tokenos/getTokens']

        this.dataTokens = {}

        _.forIn(tokens, (token, symbol) => {
          this.dataTokens[symbol] = {
            isLive: true,
            token: token,
            symbol: symbol,
            address: token.address,
            decimals: token.decimals,
            image: token.image,
            _id: token._id,
            symbolText: token.symbol
          }
        })
      },

      arbitrageProfit(symbol) {
        return _.get(this.dataArbitrageUpdates, symbol + '.profit') || '0'
      },

      arbitrageUpdatedAt(symbol) {
        return moment.utc()
      },

      onArbitrageUpdate(payload) {
        this.buildTokens()
        let update = {}

        update[payload.symbol] = payload.update

        this.dataArbitrageUpdates = {
          ...this.dataArbitrageUpdates,
          ...update,
        }
      },

      explorerUrl(address) {
        return process.env.VUE_APP_EXPLORER_URL + '/address/' + address
      },

      updateTokenModal(token) {
        this.selectedToken = token;
        this.selectedToken.name = token.token.name;
        this.$refs['update-token-modal'].show()
      },

      async deleteToken(tokenId) {
        if(confirm("Do you really want to delete?"))
        {
          await this.$store.dispatch("tokenos/deleteToken", tokenId);
          await this.$store.dispatch('tokenos/fetchTokens')
          this.buildTokens()
        }
      },
    },
  }
</script>
