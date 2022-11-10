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

      trio: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        dataCurrentDexName: null,
        dataTimer: null,
        dataTrio: this.trio,
        dataIsArbitrageRunning: false,
      }
    },

    async mounted() {
      await this.$store.commit('contract/setIsSubmitting', false)

      if (this.dataTrio.isLive) {
        this.startTimer()
      }
    },

    computed: {
      dexs() {
        return this.$store.getters['dexs/getDexs']
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

      setMessage(message) {
        this.$emit('message', {
          trioSymbol: this.dataTrio.symbol,
          message: message,
        })
      },

      setUpdate(update) {
        this.$emit('update', {
          trioSymbol: this.dataTrio.symbol,
          update: update,
        })
      },

      async runArbitrage() {
        if (this.dataIsArbitrageRunning) {
          return
        }

        this.dataIsArbitrageRunning = true

        this.setMessage('Running')

        // Check if wallet has minimum balance for fees
        if (!this.$store.getters['wallet/balanceExceedsMinimum']) {
          this.setMessage('Wallet balance below minimum')

          this.stopTimer()

          return
        }

        // Check if contract is submitting
        if(this.$store.getters['contract/isSubmitting']) {
          this.setMessage('Contract is submitting')

          this.dataIsArbitrageRunning = false

          return
        }

        const dex =  this.dexs['QUICK']

        let reserves = [
          await this.$store.dispatch('dexs/fetchReserves', {
            dex: dex,
            token1: this.dataTrio.tokens[0],
            token2: this.dataTrio.tokens[1],
          }),

          await this.$store.dispatch('dexs/fetchReserves', {
            dex: dex,
            token1: this.dataTrio.tokens[1],
            token2: this.dataTrio.tokens[2],
          }),

          await this.$store.dispatch('dexs/fetchReserves', {
            dex: dex,
            token1: this.dataTrio.tokens[2],
            token2: this.dataTrio.tokens[0],
          }),
        ]

        const dexFeeRateBig = new Big(dex.fee)

        // Pair 1 swap
        const pair1InputBig = new Big(this.dataTrio.seed)
        const pair1FeeBig = pair1InputBig.mul(dexFeeRateBig)
        const pair1InputAfterFeeBig = pair1InputBig.sub(pair1FeeBig)
        const pair1Token1ReservesBig = new Big(reserves[0].token1)
        const pair1Token2ReservesBig = new Big(reserves[0].token2)
        const pair1ConstantBig = pair1Token1ReservesBig.mul(pair1Token2ReservesBig)
        const pair2InputBig = pair1Token2ReservesBig.sub(pair1ConstantBig.div(pair1Token1ReservesBig.add(pair1InputAfterFeeBig)))

        // Pair 2 swap
        const pair2FeeBig = pair2InputBig.mul(dexFeeRateBig)
        const pair2InputAfterFeeBig = pair2InputBig.sub(pair2FeeBig)
        const pair2Token1ReservesBig = new Big(reserves[1].token1)
        const pair2Token2ReservesBig = new Big(reserves[1].token2)
        const pair2ConstantBig = pair2Token1ReservesBig.mul(pair2Token2ReservesBig)
        const pair3InputBig = pair2Token2ReservesBig.sub(pair2ConstantBig.div(pair2Token1ReservesBig.add(pair2InputAfterFeeBig)))

        // Pair 3 swap
        const pair3FeeBig = pair3InputBig.mul(dexFeeRateBig)
        const pair3InputAfterFeeBig = pair3InputBig.sub(pair3FeeBig)
        const pair3Token1ReservesBig = new Big(reserves[2].token1)
        const pair3Token2ReservesBig = new Big(reserves[2].token2)
        const pair3ConstantBig = pair3Token1ReservesBig.mul(pair3Token2ReservesBig)
        const pair3OutputBig = pair3Token2ReservesBig.sub(pair3ConstantBig.div(pair3Token1ReservesBig.add(pair3InputAfterFeeBig)))

        // Calculate the fee for the flashloan
        const flashloanFeeBig = pair1InputBig.mul(new Big(this.$store.getters['settings/getFlashloanFee']))

        // Calculate the profit
        const profitBig = pair3OutputBig.sub(pair1InputBig).sub(flashloanFeeBig)

        // Convert the pair's required profit to a big number
        const requiredProfitBig = new Big(this.dataTrio.requiredProfit)

        if (profitBig.gt(new Big('0'))) {
          console.log('Profit', this.dataTrio.symbol, profitBig.toFixed(0))
        }

        this.setUpdate({
          output: pair3OutputBig.toFixed(0),
          profit: profitBig.toFixed(0),
          requiredProfit: requiredProfitBig.toString(),
          minimumOutput: this.dataTrio.minimumOutput,
          updatedAt: moment.utc(),
        })

        if (profitBig.lt(new Big('0'))) {
          this.setMessage('No profit')

          this.dataIsArbitrageRunning = false

          return
        }

        console.log('Profit', profitBig.toFixed(0))

        if (profitBig.lt(requiredProfitBig)) {
          this.setMessage('No required profit')

          this.dataIsArbitrageRunning = false

          return
        }

        console.log('Has required profit', profitBig.toFixed(0))

        if (!this.dataTrio.canTrade) {
          this.setMessage('Trading disabled')

          this.dataIsArbitrageRunning = false

          return
        }

        // Check if contract is submitting
        if(this.$store.getters['contract/isSubmitting']) {
          this.setMessage('Already submitting')

          this.dataIsArbitrageRunning = false

          return
        }

        this.setMessage('Submitting arbitrage')

        const arbitrageData = {
          assets: [
            this.dataTrio.tokens[0].address,
            this.dataTrio.tokens[1].address,
            this.dataTrio.tokens[2].address
          ],
          inputAmount: pair1InputBig.toString(),
          minimumOutputAmount: this.dataTrio.minimumOutput,
          feeAmount: flashloanFeeBig.toFixed(0),
          router: dex.routerAddress,
        }

        console.log(arbitrageData)

        await this.$store.dispatch('contract/submitArbitrage', arbitrageData)

        this.setMessage('Arbitrage submitted')

        this.dataIsArbitrageRunning = false
      },
    },

    watch: {
      'dataTrio.isLive': {
        handler: function(newIsLive) {
          if (newIsLive) {
            this.dataIsArbitrageRunning = false
            this.runArbitrage()
            this.startTimer()
          } else {
            this.setMessage('Stopped')
            this.stopTimer()
          }
        },
        deep: true,
      },
    },
  }
</script>
