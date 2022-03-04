<template>
  <div id="trajectory"></div>
</template>

<script>
import MapLoader from '../../utils/loadMap.js'
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import store from '../../store/index'
export default {
  name: 'trajectory',
  data () {
    return {
      deviceSrc: require('../../assets/images/test11.png'),
      positionSrc: require('../../assets/images/position.png')
    }
  },
  created () {
    window.addEventListener('setItem', () => {
      if (store.state.componentStatus === 1) {
        this.getPositionCode()
      }
    })
    this.getPositionCode()
  },
  mounted () {
    // this.loadMap()
  },
  destroyed () {
    this.getPositionCode()
  },
  methods: {
    getPositionCode () {
      let url = Urls.trajectoryUrl.deviceTrajectory()
      let data = {
        'deviceId': parseInt(sessionStorage.getItem('spanStatus'))
      }
      SqTools.post(url, data)
        .then(res => {
          this.loadMap(res.data.data)
        })
    },
    loadMap (lineArr) {
      let that = this
      // let deviceThis = this
      MapLoader().then(AMap => {
        let centerId = lineArr.length > 0 ? [lineArr[0].lon, lineArr[0].lat] : [116.478935, 39.997761]
        that.map = new AMap.Map('trajectory', {
          resizeEnable: true,
          // mapStyle: 'amap://styles/blue', // 设置地图的显示样式
          center: centerId,
          zoom: 17
        })
        let markers = []
        that.map.remove(markers)
        let icon = new AMap.Icon({
          size: new AMap.Size(44, 44), // 图标尺寸
          image: that.positionSrc, // Icon的图像
          // imageOffset: new AMap.Pixel(0, -60), // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(44, 44) // 根据所设置的大小拉伸或压缩图片
        })
        let icon1 = new AMap.Icon({
          size: new AMap.Size(60, 60), // 图标尺寸
          image: that.deviceSrc, // Icon的图像
          // imageOffset: new AMap.Pixel(0, -60), // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(60, 60), // 根据所设置的大小拉伸或压缩图片
          // offset: new AMap.Pixel(-26, -13),
          angle: -160
        })
        if (lineArr.length > 0) {
          for (let i = 0; i < lineArr.length; i += 1) {
            var marker = new AMap.Marker({
              position: [lineArr[i].lon, lineArr[i].lat],
              icon: lineArr.length - 1 === i ? icon1 : icon,
              // icon: icon,
              offset: new AMap.Pixel(-13, -30),
              map: that.map
            })

            // marker.setMap(that.map)

            // 设置鼠标划过点标记显示的文字提示
            let title = lineArr[i].positionTime
            marker.setTitle(title)

            markers.push(marker)
          }
        }
      }, e => {
        console.log('地图加载失败', e)
      })
    }
  }
}
</script>

<style scoped>
#trajectory{
  width: 100%;
  height: 100%;
  border-radius: 30px;
}
</style>
