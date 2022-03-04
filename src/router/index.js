import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

let staticRoute = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/management/login')
  },
  {
    path: '/main',
    name: 'index',
    redirect: '/index',
    component: () => import('../components/layout/index'),
    children: [
      {
        path: '/indexMenu',
        redirect: '/index',
        name: 'indexMenu',
        component: () => import('../views/index/indexMenu'),
        children: [
          {
            path: '/index',
            name: 'index',
            component: () => import('../views/index/indexMap'),
            meta: {
              index: '/index',
              title: '首页',
              requireAuth: true,
              menuIndex: 0
            }
          },
          {
            path: '/operateProfile',
            name: 'operateProfile',
            component: () => import('../views/index/operateProfile'),
            meta: {
              index: '/index',
              title: '详情页',
              requireAuth: true,
              menuIndex: 0
            }
          }
        ]
      },
      // {
      //   path: '/warningCenter',
      //   redirect: '/warningRecord',
      //   name: 'warningCenter',
      //   component: () => import('../views/earlyWarningCenter/warningMenu'),
      //   children: [
      //     {
      //       path: '/warningRecord',
      //       name: 'index',
      //       component: () => import('../views/earlyWarningCenter/warningRecord'),
      //       meta: {
      //         index: '/warningRecord',
      //         title: '预警记录',
      //         requireAuth: true,
      //         menuIndex: '2',
      //         childrenIndex: '2-1'
      //       }
      //     },
      //     {
      //       path: '/warningSetting',
      //       name: 'warningSetting',
      //       component: () => import('../views/earlyWarningCenter/warningSetting'),
      //       meta: {
      //         index: '/warningSetting',
      //         title: '预警设置',
      //         requireAuth: true,
      //         menuIndex: '2',
      //         childrenIndex: '2-2'
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: '/equipmentList',
      //   name: 'equipmentList',
      //   component: () => import('../views/equipmentAnalysis/equipmentList'),
      //   meta: {
      //     index: '/equipmentList',
      //     title: '设备分析列表',
      //     requireAuth: true,
      //     menuIndex: '3'
      //   }
      // },
      {
        path: '/equipmentBaseInfo',
        name: 'equipmentBaseInfo',
        component: () => import('../views/equipmentAnalysis/equipmentBaseInfo'),
        meta: {
          index: '/equipmentBaseInfo',
          title: '设备基本信息',
          requireAuth: true,
          menuIndex: 1
        }
      }
      // {
      //   path: '/userInfo',
      //   name: 'userInfo',
      //   redirect: '/user',
      //   component: () => import('../views/roleManagement/commonMenu'),
      //   children: [
      //     {
      //       path: '/user',
      //       name: 'user',
      //       component: () => import('../views/roleManagement/user'),
      //       meta: {
      //         title: '用户设置',
      //         menuIndex: '4',
      //         meIndex: '4-1'
      //       }
      //     },
      //     {
      //       path: '/role',
      //       name: 'role',
      //       component: () => import('../views/roleManagement/role'),
      //       meta: {
      //         title: '角色设置',
      //         menuIndex: '4',
      //         meIndex: '4-2'
      //       }
      //     },
      //     {
      //       path: '/organization',
      //       name: 'organization',
      //       component: () => import('../views/roleManagement/organization'),
      //       meta: {
      //         title: '组织机构',
      //         menuIndex: '4',
      //         meIndex: '4-3'
      //       }
      //     }
      //   ]
      // }
    ]
  }
]

export default new Router({
  // mode: 'hash', // 去掉url中的#
  // "base": '/dx',
  // scrollBehavior: () => ({ y: 0 }),
  routes: staticRoute
})
