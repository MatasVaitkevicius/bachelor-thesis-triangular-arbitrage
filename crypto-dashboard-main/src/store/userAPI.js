export default {
  namespaced: true,

  state: {
    user: {},
    accessToken: null,
    publicAddress: null
  },

  getters: {
    getAccessToken(state) {
      return state.accessToken
    },
    getPublicAddress(state) {
      return state.publicAddress
    }
  },

  mutations: {
    setAccessToken(state, value) {
      state.accessToken = value
    },
    setPublicAddress(state, value) {
      state.publicAddress = value
    }
  }
};