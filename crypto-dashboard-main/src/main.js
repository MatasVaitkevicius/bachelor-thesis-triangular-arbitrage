require('dotenv').config()

import Vue from 'vue'
import App from '@/views/App.vue'
import router from '@/router'
import store from '@/store'
import moment from 'moment'

require('@/libs/lodash')
require('@/libs/axios')
require('@/libs/filters')

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { web3 } from '@/libs/web3'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.prototype.$web3 = web3

Vue.prototype.$moment = moment

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
