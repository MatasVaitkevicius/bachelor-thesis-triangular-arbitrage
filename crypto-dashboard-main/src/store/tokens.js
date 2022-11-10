import Tokens from '@/json/tokens'
import StableTokens from '@/json/stableTokens'

export default {
  namespaced: true,

  getters: {
    getTokens() {
      return Tokens
    },
    getStableTokens() {
        return StableTokens
      },
  },
}