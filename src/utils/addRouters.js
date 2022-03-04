
import {getComponent} from '../router/_import'

// 获取组件的方法
function addRouter (routerList) {
  routerList.forEach(e => {
    if (e.component) {
      e.component = getComponent(e.name) // 动态匹配组件
    }
    if (e.children != null) {
      // 存在子路由就递归
      addRouter(e.children)
    }
    e.meta.index = e.name
    e.meta.requireAuth = true
    if (e.name === '/equipmentList') {
      e.meta.menuIndex = 1
    } else if (e.name === '/warningCenter') {
      e.redirect = '/warningRecord'
    } else if (e.name === '/warningRecord') {
      e.meta.menuIndex = 2
      e.meta.childrenIndex = '2-1'
    } else if (e.name === '/warningSetting') {
      e.meta.menuIndex = 2
      e.meta.childrenIndex = '2-2'
    } else if (e.name === '/system') {
      e.redirect = '/user'
    } else if (e.name === '/user') {
      e.meta.menuIndex = 3
      e.meta.childrenIndex = '4-1'
    } else if (e.name === '/role') {
      e.meta.menuIndex = 3
      e.meta.childrenIndex = '4-2'
    } else if (e.name === '/organization') {
      e.meta.menuIndex = 3
      e.meta.childrenIndex = '4-3'
    }
  })
  let routerData = [{
    path: '/random',
    name: 'index',
    // redirect: '/index',
    component: () => import('../components/layout/index'),
    children: routerList
  }]
  return routerData
}

export { addRouter }
