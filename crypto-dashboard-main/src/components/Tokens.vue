<script>
  import Big from 'big.js'
  import moment from 'moment'

  export default {
    render() {
      return null
    },

    props: {
      timerInterval: {
        type: Number,
        required: true,
      },

      token: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        dataCurrentDexName: null,
        dataTimer: null,
        dataToken: this.token,
        dataIsArbitrageRunning: false,
      }
    },

    async mounted() {
      if (this.dataToken.isLive) {
        this.startTimer()
      }
    },

    computed: {
      dexs() {
        return this.$store.getters['dexs/getDexs']
      },
      tokens() {
        return this.$store.getters['tokens/getTokens']
      },
      stableTokens() {
        return this.$store.getters['tokens/getStableTokens']
      },
    },

    methods: {
      startTimer() {
        this.stopTimer()
        this.dataTimer = setInterval(this.runArbitrage, this.timerInterval)
      },

      stopTimer() {
        this.dataIsArbitrageRunning = false

        clearInterval(this.dataTimer)
      },

      setUpdate(update) {
        this.$emit('update', {
          symbol: this.dataToken.symbol,
          update: update,
        })
      },

      async runArbitrage() {
        if (this.dataIsArbitrageRunning) {
          return
        }

        this.dataIsArbitrageRunning = true

        const dex =  this.dexs['QUICK']

        if(this.stableTokens['USDC'].symbol === this.dataToken.token.symbol || this.stableTokens['USDT'].symbol === this.dataToken.token.symbol)
        {
            const profitBig = 1

            this.setUpdate({
            profit: profitBig,
            updatedAt: moment.utc(),
            })

            this.dataIsArbitrageRunning = false

            return
        }

        let reserves = [
          await this.$store.dispatch('dexs/fetchReserves', {
            dex: dex,
            token1: this.stableTokens['USDC'],
            token2: this.dataToken.token,
          })
        ]

        const dexFeeRateBig = new Big(dex.fee)
        const decimal = this.dataToken.token.decimals
        // Pair 1 swap
        const pair1InputBig = new Big(1000000)
        const pair1FeeBig = pair1InputBig.mul(dexFeeRateBig)
        const pair1InputAfterFeeBig = pair1InputBig.sub(pair1FeeBig)
        const pair1Token1ReservesBig = new Big(reserves[0].token1)
        const pair1Token2ReservesBig = new Big(reserves[0].token2)
        const pair1ConstantBig = pair1Token1ReservesBig.mul(pair1Token2ReservesBig)
        const pair2InputBig = pair1Token2ReservesBig.sub(pair1ConstantBig.div(pair1Token1ReservesBig.add(pair1InputAfterFeeBig)))

        // Calculate the profit
        const profitBig = pair2InputBig.div(10**decimal).toFixed(8)

        this.setUpdate({
          profit: profitBig,
          updatedAt: moment.utc(),
        })

        this.dataIsArbitrageRunning = false

        return
      },
    },

    watch: {
      'dataToken.isLive': {
        handler: function(newIsLive) {
          if (newIsLive) {
            this.dataIsArbitrageRunning = false
            this.runArbitrage()
            this.startTimer()
          } else {
            this.stopTimer()
          }
        },
        deep: true,
      },
    },
  }
</script>
