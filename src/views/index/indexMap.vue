<template>
    <div class="indexMap">
      <div class="title">
        设备位置
      </div>
      <div id="map"></div>
    </div>
</template>

<script>
import MapLoader from '../../utils/loadMap.js'
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
export default {
  name: 'indexMap',
  data () {
    return {
      deviceSrc: require('../../assets/images/test11.png')
    }
  },
  mounted () {
    this.getPositionCode()
  },
  methods: {
    getPositionCode () {
      let url = Urls.trajectoryUrl.deviceLastGps()
      let data = {
      }
      SqTools.post(url, data)
        .then(res => {
          this.loadMap(res.data.data)
        })
    },
    loadMap (points) {
      let that = this
      MapLoader().then(AMap => {
        that.map = new AMap.Map('map', {
          resizeEnable: true,
          zoom: 4
          // layers: [new AMap.TileLayer.Satellite()]
          // mapStyle: 'amap://styles/darkblue' // 设置地图的显示样式
        })
        let icon = new AMap.Icon({
          size: new AMap.Size(40, 50), // 图标尺寸
          image: this.deviceSrc, // Icon的图像
          // imageOffset: new AMap.Pixel(0, -60), // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(40, 50) // 根据所设置的大小拉伸或压缩图片
        })
        let cluster = []
        let markers = []
        for (let i = 0; i < points.length; i += 1) {
          let marker = new AMap.Marker({
            position: [points[i].lon, points[i].lat],
            icon: icon
          })
          let content = "<div class='info'>" + points[i].deviceName + '</div>'
          marker.setLabel({
            offset: new AMap.Pixel(0, -10), // 设置文本标注偏移量
            content: content, // 设置文本标注内容
            direction: 'top' // 设置文本标注方位
          })
          markers.push(marker)
        }

        let count = markers.length
        let _renderClusterMarker = function (context) {
          var factor = Math.pow(context.count / count, 1 / 18)
          var div = document.createElement('div')
          var Hue = 180 - factor * 180
          var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
          var fontColor = 'hsla(' + Hue + ',100%,20%,1)'
          var borderColor = 'hsla(' + Hue + ',100%,40%,1)'
          var shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
          div.style.backgroundColor = bgColor
          var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
          div.style.width = div.style.height = size + 'px'
          div.style.border = 'solid 1px ' + borderColor
          div.style.borderRadius = size / 2 + 'px'
          div.style.boxShadow = '0 0 1px ' + shadowColor
          div.innerHTML = context.count
          div.style.lineHeight = size + 'px'
          div.style.color = fontColor
          div.style.fontSize = '14px'
          div.style.textAlign = 'center'
          context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
          context.marker.setContent(div)
        }

        addCluster(2)

        function addCluster (tag) {
          if (cluster) {
            // cluster.setMap(null)
          }
          if (tag === 2) { // 完全自定义
            that.map.plugin(['AMap.MarkerClusterer'], function () {
              cluster = new AMap.MarkerClusterer(that.map, markers, {
                gridSize: 80,
                renderClusterMarker: _renderClusterMarker
              })
            })
          } else if (tag === 1) { // 自定义图标
            let sts = [{
              url: 'https://a.amap.com/jsapi_demos/static/images/blue.png',
              size: new AMap.Size(32, 32),
              offset: new AMap.Pixel(-16, -16)
            }, {
              url: 'https://a.amap.com/jsapi_demos/static/images/green.png',
              size: new AMap.Size(32, 32),
              offset: new AMap.Pixel(-16, -16)
            }, {
              url: 'https://a.amap.com/jsapi_demos/static/images/orange.png',
              size: new AMap.Size(36, 36),
              offset: new AMap.Pixel(-18, -18)
            }, {
              url: 'https://a.amap.com/jsapi_demos/static/images/red.png',
              size: new AMap.Size(48, 48),
              offset: new AMap.Pixel(-24, -24)
            }, {
              url: 'https://a.amap.com/jsapi_demos/static/images/darkRed.png',
              size: new AMap.Size(48, 48),
              offset: new AMap.Pixel(-24, -24)
            }]
            that.map.plugin(['AMap.MarkerClusterer'], function () {
              cluster = new AMap.MarkerClusterer(that.map, markers, {
                styles: sts,
                gridSize: 80
              })
            })
          } else { // 默认样式
            that.map.plugin(['AMap.MarkerClusterer'], function () {
              cluster = new AMap.MarkerClusterer(that.map, markers, {gridSize: 80})
            })
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
.indexMap{
  width: 100%;
  height: 100%;
}
.title{
  font-size: 18px;
  font-weight: 700;
  color: #6a707e;
  margin-bottom: 20px;
}
#map{
    width: 100%;
  height: calc(100% - 47px);
  border-radius: 30px;
  }
.indexMap>>>.amap-marker-label {
  border: 1px solid #1890ff;
  background-color: #1890ff;
  color: #ffffff;
}
  .info{
    width: 40px;
    height: 10px;
    background-color: #1890ff;
    border-color: #1890ff;
    color: #ffffff;
  }
</style>
