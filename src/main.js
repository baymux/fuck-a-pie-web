// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { addRouter } from './utils/addRouters'

Vue.config.productionTip = false

let oneRun = true
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token')
  // if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
  if (token) { // 判断缓存里面是否有 userName  //在登录的时候设置它的值
    if (oneRun) {
      oneRun = false
      gotoRouter(to, next)
      // next()
      next({...to, replace: true})
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

function gotoRouter (to, next) {
  try {
    let getRouter = addRouter(JSON.parse(sessionStorage.getItem('menuList')))
    router.addRoutes(getRouter) // 动态添加路由    // getRouter = addRouter(getRouter)
    let allRouter = router.options.routes.concat(getRouter) // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
    router.options.routes = allRouter
  } catch (error) {
    console.log(error)
  }
}
// module.exports = {
//   configureWebpack: {
//     externals: {
//       AMap: 'window.AMap'
//     }
//   }
// }
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'watchStorage') {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val)

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal)
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
