import Vue from 'vue'
// eslint-disable-next-line camelcase
const debug_ipAndPort = 'http://192.168.100.192:20101/api'
// eslint-disable-next-line camelcase
// const production_ipAndPort = 'http://117.157.78.45:30077'
// eslint-disable-next-line camelcase
// const production_ipAndPort = 'http://39.101.66.147:35513'
// eslint-disable-next-line camelcase
const production_ipAndPort = 'https://baiyanyun.vip'
// eslint-disable-next-line camelcase
// const debug_videoPort = 'http://192.168.1.192:20101'
// // eslint-disable-next-line camelcase
// const production_videoPort = 'http://1.116.210.225:10081/'

const $IS_DEBUG = true
// eslint-disable-next-line camelcase
const homeUrl = $IS_DEBUG ? debug_ipAndPort : production_ipAndPort

// eslint-disable-next-line camelcase
let deviceCommonName = $IS_DEBUG ? '/service' : '/deep-pit-server/service'
// eslint-disable-next-line camelcase
// let videoPort = $IS_DEBUG ? debug_videoPort : production_videoPort

function SqUrl (tagName) {
  // eslint-disable-next-line camelcase
  this.ipAndPort = $IS_DEBUG ? debug_ipAndPort : production_ipAndPort
  this.tagName = tagName
}
let Urls = new Vue({
  data: {
    homeUrl: homeUrl,
    loginUrl: (function () {
      let url = new SqUrl(deviceCommonName)
      url.captchaImage = function () {
        return this.ipAndPort + this.tagName + '/captchaImage'
      }
      url.login = function () {
        return this.ipAndPort + this.tagName + '/login'
      }
      url.getInfo = function () {
        return this.ipAndPort + this.tagName + '/getInfo'
      }
      url.getRouters = function () {
        return this.ipAndPort + this.tagName + '/getRouters'
      }
      return url
    }()),
    organizationUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/system/organization')
      url.saveOrUpdate = function () {
        return this.ipAndPort + this.tagName + '/saveOrUpdate'
      }
      url.list = function () {
        return this.ipAndPort + this.tagName + '/list'
      }
      url.listExclude = function () {
        return this.ipAndPort + this.tagName + '/list/exclude/{organizationId}'
      }
      url.organizationId = function () {
        return this.ipAndPort + this.tagName + '/'
      }
      url.treeSelect = function () {
        return this.ipAndPort + this.tagName + '/treeselect'
      }
      url.remove = function () {
        return this.ipAndPort + this.tagName + '/remove/'
      }
      return url
    }()),
    userUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/system/user')
      url.saveOrUpdate = function () {
        return this.ipAndPort + this.tagName + '/saveOrUpdate'
      }
      url.users = function () {
        return this.ipAndPort + this.tagName + '/users'
      }
      url.userInfo = function () {
        return this.ipAndPort + this.tagName + '/userinfo'
      }
      url.detail = function () {
        return this.ipAndPort + this.tagName + '/detail/'
      }
      url.delete = function () {
        return this.ipAndPort + this.tagName + '/delete'
      }
      url.changeStatus = function () {
        return this.ipAndPort + this.tagName + '/changeStatus'
      }
      return url
    }()),
    roleUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/system/role')
      url.saveOrUpdate = function () {
        return this.ipAndPort + this.tagName + '/saveOrUpdate'
      }
      url.list = function () {
        return this.ipAndPort + this.tagName + '/list'
      }
      url.detail = function () {
        return this.ipAndPort + this.tagName + '/detail/'
      }
      url.delete = function () {
        return this.ipAndPort + this.tagName + '/delete/'
      }
      url.changeStatus = function () {
        return this.ipAndPort + this.tagName + '/changeStatus'
      }
      return url
    }()),
    menuUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/system/menu')
      url.saveOrUpdate = function () {
        return this.ipAndPort + this.tagName + '/saveOrUpdate'
      }
      url.list = function () {
        return this.ipAndPort + this.tagName + '/list'
      }
      url.getMenus = function () {
        return this.ipAndPort + this.tagName + '/getMenus/{menuId}'
      }
      url.treeSelect = function () {
        return this.ipAndPort + this.tagName + '/treeSelect'
      }
      url.delete = function () {
        return this.ipAndPort + this.tagName + '/delete/{menuId}'
      }
      return url
    }()),
    cameraUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/webcam')
      url.webcamBind = function () {
        return this.ipAndPort + this.tagName + '/webcamBind'
      }
      url.webcamUntie = function () {
        return this.ipAndPort + this.tagName + '/webcamUntie/'
      }
      url.deviceWebcam = function () {
        return this.ipAndPort + this.tagName + '/deviceWebcam/'
      }
      return url
    }()),
    workingHoursUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/workingHours')
      url.list = function () {
        return this.ipAndPort + this.tagName + '/list'
      }
      url.statistics = function () {
        return this.ipAndPort + this.tagName + '/statistics/'
      }
      return url
    }()),
    trajectoryUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/trajectory')
      url.deviceTrajectory = function () {
        return this.ipAndPort + this.tagName + '/deviceTrajectory'
      }
      url.deviceLastGps = function () {
        return this.ipAndPort + this.tagName + '/deviceLastGps'
      }
      return url
    }()),
    gasUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/gas')
      url.oxygen = function () {
        return this.ipAndPort + this.tagName + '/oxygen'
      }
      url.methane = function () {
        return this.ipAndPort + this.tagName + '/methane'
      }
      url.carbonMonoxide = function () {
        return this.ipAndPort + this.tagName + '/carbonMonoxide'
      }
      url.hydrogenSulfide = function () {
        return this.ipAndPort + this.tagName + '/hydrogenSulfide'
      }
      return url
    }()),
    deviceUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/device')
      url.saveOrUpdate = function () {
        return this.ipAndPort + this.tagName + '/saveOrUpdate'
      }
      url.list = function () {
        return this.ipAndPort + this.tagName + '/list'
      }
      url.info = function () {
        return this.ipAndPort + this.tagName + '/info'
      }
      url.delete = function () {
        return this.ipAndPort + this.tagName + '/delete'
      }
      url.export = function () {
        return this.ipAndPort + this.tagName + '/export'
      }
      url.deviceTypeTree = function () {
        return this.ipAndPort + this.tagName + '/deviceTypeTree'
      }
      url.statistics = function () {
        return this.ipAndPort + this.tagName + '/statistics'
      }
      url.untie = function () {
        return this.ipAndPort + this.tagName + '/untie'
      }
      url.alarms = function () {
        return this.ipAndPort + this.tagName + '/alarms'
      }
      url.alarmsExport = function () {
        return this.ipAndPort + this.tagName + '/alarmsExport'
      }
      return url
    }()),
    alarmUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/alarm')
      url.saveOrUpdate = function () {
        return this.ipAndPort + this.tagName + '/setting'
      }
      url.list = function () {
        return this.ipAndPort + this.tagName + '/list'
      }
      url.info = function () {
        return this.ipAndPort + this.tagName + '/info'
      }
      url.delete = function () {
        return this.ipAndPort + this.tagName + '/delete'
      }
      url.record = function () {
        return this.ipAndPort + this.tagName + '/record'
      }
      url.statistics = function () {
        return this.ipAndPort + this.tagName + '/statistics'
      }
      return url
    }()),
    videoUrl: (function () {
      let url = new SqUrl(deviceCommonName + '/webcam')
      url.deviceWebcam = function () {
        return this.ipAndPort + this.tagName + '/deviceWebcam/'
      }
      url.sipPtzStart = function () {
        return this.ipAndPort + this.tagName + '/ptzStart'
      }
      url.sipPtzStop = function () {
        return this.ipAndPort + this.tagName + '/ptzStop'
      }
      url.sipPtzTurn = function () {
        return this.ipAndPort + this.tagName + '/ptzMirror'
      }
      url.getAccessToken = function () {
        return this.ipAndPort + this.tagName + '/getAccessToken'
      }
      // url.close = function () {
      //   return videoPath + 'index/api/close_streams?secret=035c73f7-bb6b-4889-a715-d9eb2d1925cc&schema=fmp4&vhost=__defaultVhost__&app=rtp&'
      // }
      return url
    }()),
    // 云台控制
    controlUrl: (function () {
      let url = new SqUrl('/video/api/v1')
      url.sipPtz = function () {
        return this.ipAndPort + this.tagName + '/sipPtz'
      }
      return url
    }()),
    common: (function () {
      let url = new SqUrl('api')
      // url.getCompanyDetails = function () {
      //   return this.ipAndPort + this.tagName + '/captchaImage'
      // }
      // url.industryIsBooming = function () {
      //   return this.ipAndPort + '/xczx-server/ecologicallyLivable/industryIsBooming'
      // }
      // url.migration = function () {
      //   return this.ipAndPort + '/xczx-server/ecologicallyLivable/migration'
      // }
      // url.richLife = function () {
      //   return this.ipAndPort + '/xczx-server/ecologicallyLivable/richLife'
      // }
      return url
    }())
  },
  computed: {
  },
  methods: {

  }
})

export default Urls

// 项目中任何地方都可如此引用 this.$MyComm.deleteCookie('ms_username')
