export default {
  namespaced: true,

  getters: {
    getDexs(state) {
      return state.dexs
    },
  },

  state: {
    dexs: [],
  },

  mutations: {
    setDexs(state, value) {
      state.dexs = value
    },
  },

  actions: {
    async fetchDexs({ commit }) {
      return fetch("http://localhost:4000/api/dexs")
        .then(
          (response) => response.json())
        .then(data => {
          commit("setDexs", data);
        }).catch((err) => console.error(err));
    },

    async createDex({ commit }, data) {
      axios.post("http://localhost:4000/api/dexs", {
        symbol: data.dex.symbol,
        name: data.dex.name,
        factoryAddress: data.dex.factoryAddress,
        routerAddress: data.dex.routerAddress,
        fee: data.dex.fee,
        image: data.dex.image,
      })
        .then((res) => {
          let newDex = res.data;
          commit("setDexs", newDex);
        });
    },

    async updateDex({ commit }, data) {
      axios.put(`http://localhost:4000/api/dexs/${data.dex._id}`, {
        symbol: data.dex.symbol,
        name: data.dex.name,
        factoryAddress: data.dex.factoryAddress,
        routerAddress: data.dex.routerAddress,
        fee: data.dex.fee,
        image: data.dex.image,
      })
        .then((res) => {
          let updateDex = res.data;
          commit("setDexs", updateDex);
        });
    },

    async fetchDex({ commit }, data) {
      return fetch(`http://localhost:4000/api/dexs/${data.dex._id}`)
        .then(
          (response) => response.json())
        .then(data => {
          commit("setDexs", data);
        }).catch((err) => console.error(err));
    },

    async deleteDex({ commit }, data) {
      return axios.delete(`http://localhost:4000/api/dexs/${data}`, {
      })
    }
  },
};