import Vue from 'vue'
// eslint-disable-next-line camelcase
import SQ_ORGIN_Axios from 'axios'
import router from '../../router'
import store from '../../store'
let showMsg = true

let SQ_TOOLS_ROUTE_OPEN_PAGE = function (router, path, data) {
  if (data) {
    // data = SQ_TOOLS_ENCODE_URL_PARAM_METHOD(data)
    router.push({
      path: path,
      query: {
        id: data
      }
    })
  } else {
    router.push({
      path: path
    })
  }
}
let SqTools = new Vue({
  data: {
    push: SQ_TOOLS_ROUTE_OPEN_PAGE,
    http: (function () {
      SQ_ORGIN_Axios.interceptors.request.use(function (config) {
        config.cancelToken = new SQ_ORGIN_Axios.CancelToken((cancel) => {
          // 使用vuex 定义pushCancel，请求进来存入
          store.dispatch('pushCancel', {cancelToken: cancel})
        })
        // 在发送请求之前做些什么
        return config
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      })
      // 添加响应拦截器
      SQ_ORGIN_Axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        // if (response.data.code === 401) {
        //   localStorage.clear()
        //   sessionStorage.clear()
        //   SQ_TOOLS_ROUTE_OPEN_PAGE(router, '/')
        // }
        return response
      }, function (error) {
        // 对响应错误做点什么
        if (error.response) {
          switch (error.response.status) {
            case 401:
              store.dispatch('clearCancel')
              if (showMsg) {
                Vue.prototype.$warning({
                  title: '会话过期，请重新登录！'
                })
                showMsg = false
                setTimeout(() => {
                  showMsg = true
                }, 3000)
              }
              sessionStorage.clear()
              SQ_TOOLS_ROUTE_OPEN_PAGE(router, '/login')
              break
          }
        }
        return Promise.reject(error)
      })
      // eslint-disable-next-line camelcase
      return SQ_ORGIN_Axios
    })(),
    post: function (url, data, type) {
      let header = {}
      if (type) {
        header = {
          'Content-type': 'application/json'
        }
      } else {
        header = {
          'Content-type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        }
      }
      let httpConfig = {
        url: url,
        data: data,
        method: 'POST',
        responseType: 'json',
        headers: header
      }
      // if (param) {
      //   url = CREATE_URL_WITH_PARAM(url, param)
      // }
      httpConfig.url = url
      return SqTools.http(httpConfig)
    },
    get: function (url, type, param) {
      let header = {}
      if (type) {
        header = {
          'Content-type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        }
      } else {
        header = {
          'Content-type': 'application/json'
        }
      }
      let httpConfig = {
        method: 'GET',
        responseType: 'json',
        param: param,
        headers: header
      }
      // if (param) {
      //   url = CREATE_URL_WITH_PARAM(url, param)
      // }
      httpConfig.url = url
      return SqTools.http(httpConfig)
    },
    getFile: function (url, data) {
      let httpConfig = {
        method: 'POST',
        data: data,
        headers: {
          'Authorization': sessionStorage.getItem('token')
        },
        responseType: 'arraybuffer'
      }
      httpConfig.url = url
      return SqTools.http(httpConfig)
    }
  }
})
export default SqTools
