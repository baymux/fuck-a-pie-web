import Vue from 'vue'
import Router from 'vue-router'
import charts from '@/views/charts'

Vue.use(Router)

let staticRoute = [
  {
    path: '/',
    redirect: '/charts'
  },
  {
    path: '/charts',
    name: 'charts',
    component: charts
  }
]

export default new Router({
  // mode: 'hash', // 去掉url中的#
  // "base": '/dx',
  // scrollBehavior: () => ({ y: 0 }),
  routes: staticRoute
})
