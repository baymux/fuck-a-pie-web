import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    axiosCancelArr: [],
    LOADING: false,
    menuDeviceStatus: undefined,
    componentStatus: 1,
    modelStatus: false
  },
  mutations: {
    showLoading (state) {
      state.LOADING = true
    },
    hideLoading (state) {
      state.LOADING = false
    },
    showModelLoading (state) {
      state.modelStatus = true
    },
    hideModelLoading (state) {
      state.modelStatus = false
    },
    // tabs 切换状态值
    changeStatus (state, data) {
      state.menuDeviceStatus = data
    },
    // 子组件状态 切换状态值
    changeComponentStatus (state, data) {
      state.componentStatus = data
    },
    PUSH_CANCEL (state, cancel) {
      state.axiosCancelArr.push(cancel.cancelToken)
    },

    CLEAR_CANCEL (state) {
      state.axiosCancelArr.forEach(e => {
        e && e()
      })
      state.axiosCancelArr = []
    }
  },
  actions: {
    pushCancel ({commit}, cancel) {
      commit('PUSH_CANCEL', cancel)
    },
    clearCancel ({commit}) {
      commit('CLEAR_CANCEL')
    }
  }
})
