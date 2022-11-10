export default {
  namespaced: true,

  getters: {
    getTokens(state) {
      return state.tokenos
    },
  },

  state: {
    tokenos: [],
  },

  mutations: {
    setTokens(state, value) {
      state.tokenos = value
    },
  },

  actions: {
    async fetchTokens({ commit }) {
      return fetch("http://localhost:4000/api/tokens")
        .then(
          (response) => response.json())
        .then(data => {
          commit("setTokens", data);
        }).catch((err) => console.error(err));
    },

    async createToken({ commit }, data) {
      axios.post("http://localhost:4000/api/tokens", {
        symbol: data.token.symbol,
        name: data.token.name,
        address: data.token.address,
        decimals: data.token.decimals,
        image: data.token.image,
      })
        .then((res) => {
          let newToken = res.data;
          commit("setTokens", newToken);
        });
    },

    async updateToken({ commit }, data) {
      axios.put(`http://localhost:4000/api/tokens/${data.token._id}`, {
        symbol: data.token.symbol,
        name: data.token.name,
        address: data.token.address,
        decimals: data.token.decimals,
        image: data.token.image,
      })
        .then((res) => {
          let newToken = res.data;
          commit("setTokens", newToken);
        });
    },

    async fetchToken({ commit }, data) {
      return fetch(`http://localhost:4000/api/tokens/${data.token._id}`)
        .then(
          (response) => response.json())
        .then(data => {
          commit("setTokens", data);
        }).catch((err) => console.error(err));
    },

    async deleteToken({ commit }, data) {
      return axios.delete(`http://localhost:4000/api/tokens/${data}`, {
      })
    }
  },
};