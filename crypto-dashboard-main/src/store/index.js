import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import network from '@/store/network'
import wallet from '@/store/wallet'
import trios from '@/store/trios'
import tokens from '@/store/tokens'
import dexs from '@/store/dexs'
import settings from '@/store/settings'
import contract from '@/store/contract'
import tokenos from '@/store/tokenos'
import dexsAPI from '@/store/dexsAPI'
import userAPI from '@/store/userAPI'

const vuexLocal = new VuexPersistence({
  key: 'carb2',
  storage: window.localStorage,

  reducer: (state) => ({
    // dexs: state.dexs,
  })
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  modules: {
    tokenos,
    network,
    wallet,
    trios,
    tokens,
    dexs,
    settings,
    contract,
    dexsAPI,
    userAPI,
  },
})

