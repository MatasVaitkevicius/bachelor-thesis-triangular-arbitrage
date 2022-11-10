import Trios from '@/json/trios'

export default {
  namespaced: true,

  getters: {
    getTrios() {
      return Trios
    },
  },
}
