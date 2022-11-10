import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/',
    name: 'metamask',
    component: () => import('../components/MetaMask')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
