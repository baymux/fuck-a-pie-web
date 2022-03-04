<template>
  <div class="videoMap">
    <!--    <div id="map" class="prism-player" v-show="divStatus"></div>-->
    <!--    <video  controls autoplay id="videoElement" style="width: 100%;height: 100%;"></video>-->
    <!--    <video id="hlsVideo" ref="hlsVideo" controls preload="true"></video>-->
    <!--    webrtc视频流播放-->
    <!--    <video id="video-webrtc" controls style="width: 100%;height: 90%;"></video>-->
    <!--    <div style="position: absolute;bottom: 30px;left: 50%;margin-left: -142px;">-->
    <!--      <a-button @mouseup="getStop" @mousedown="getSipPtz('left')">左<a-icon type="arrow-left" /></a-button>-->
    <!--      <a-button @mouseup="getStop"  @mousedown="getSipPtz('right')">右<a-icon type="arrow-right" /></a-button>-->
    <!--      <a-button @mouseup="getStop"  @mousedown="getSipPtz('up')">上<a-icon type="arrow-up" /></a-button>-->
    <!--      <a-button @mouseup="getStop"  @mousedown="getSipPtz('down')">下<a-icon type="arrow-down" /></a-button>-->
    <!--    </div>-->
    <!--    1.0版视频播放-->
    <!--    <img src="../../assets/images/video.jpg" alt="" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;">-->
    <!--    <div id="jswebrtc" class="jswebrtc" data-url="webrtc://192.168.1.111:1985/live/34020000001320000010@34020000001320000011" style="width: 100%;height: 400px;"></div>-->
<!--    <video controls autoplay id="videoElement" style="width: 100%;height: calc(100% - 40px);"
           v-show="divStatus"></video>-->
<!--    <video
      id="video"
      preload="auto"
      muted
      class="video-js vjs-default-skin"
      style="width: 100%; height: 95%; object-fit: fill"
      v-if="videoBoolen"
    >
      <source :src="videoSrc" type="application/x-mpegURL" />
    </video>-->
    <div class="ezVideo"  v-if="divStatus">
      <div id="video-container" style="width:100%; height:95%; object-fit: fill"></div>
    </div>
    <div style="display: flex;justify-content: center;align-items: center;height: 100%;" v-show="videoStatus">
      <img src="../../assets/images/videoCancel.png" alt="">
    </div>
    <div style="display: flex;justify-content: center;align-items: center;height: 100%;"
         v-show="!divStatus && !videoStatus">
      <img src="../../assets/images/videoNo.png" alt="">
    </div>
    <div style="position: absolute;bottom: 20px;left: 50%;margin-left: -142px;" v-show="divStatus">
      <a-button @mouseup="getStop('2')" @mousedown="getSipPtz('2')">左
        <a-icon type="arrow-left"/>
      </a-button>
      <a-button @mouseup="getStop('3')" @mousedown="getSipPtz('3')">右
        <a-icon type="arrow-right"/>
      </a-button>
      <a-button @mouseup="getStop('0')" @mousedown="getSipPtz('0')">上
        <a-icon type="arrow-up"/>
      </a-button>
      <a-button @mouseup="getStop('1')" @mousedown="getSipPtz('1')">下
        <a-icon type="arrow-down"/>
      </a-button>
      <a-button @click="getTurnSipPtz">翻转
        <a-icon type="arrow-down"/>
      </a-button>
    </div>
    <!--    flv.js-->
  </div>
</template>
<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
// import JSWebrtc from '../../assets/js/jswebrtc.min.js'
// import flvjs from '../../assets/js/flv.js'
import store from '../../store/index'
import 'video.js/dist/video-js.css'
// import videojs from 'video.js'
import 'videojs-contrib-hls'
import EZUIKit from 'ezuikit-js'
var player = null

export default {
  name: 'videoMap',
  data () {
    return {
      webcamId: undefined,
      videoBoolen: false,
      videoSrc: '',
      divStatus: true,
      videoStatus: false,
      ssrc: undefined,
      deviceId: parseInt(sessionStorage.getItem('spanStatus'))
    }
  },
  created () {
    // sessionStorage监听，调用函数
    window.addEventListener('setItem', () => {
      this.deviceId = sessionStorage.getItem('watchStorage')
      if (store.state.componentStatus === 7) {
        this.$nextTick(() => {
          this.player = undefined
          this.createVideo()
        })
      }
    })
    // this.createVideo()
    // this.destroyVideo()
    // this.getDeviceInfo()
  },
  mounted () {
    // this.createVideo()
    // this.getAnswer()
    this.$nextTick(() => {
      this.createVideo()
    })
  },
  beforeDestroy () {
    this.createVideo()
    this.player = undefined
    // this.getDeviceInfo()
    // this.destroyVideo()
  },
  destroyed () {
  },
  methods: {
    getStop (position) {
      let url = Urls.videoUrl.sipPtzStop()
      let data = {
        'webcamId': this.webcamId,
        'channelNo': '1',
        'direction': position
      }
      SqTools.post(url, data)
        .then(res => {
        })
    },
    // 云台控制
    getSipPtz (position) {
      let url = Urls.videoUrl.sipPtzStart()
      let data = {
        'webcamId': this.webcamId,
        'channelNo': '1',
        'direction': position,
        'speed': '1'
      }
      SqTools.post(url, data)
        .then(res => {
        })
    },
    // 翻转
    getTurnSipPtz () {
      let url = Urls.videoUrl.sipPtzTurn()
      let data = {
        'webcamId': this.webcamId,
        'channelNo': '1',
        'command': '2'
      }
      SqTools.post(url, data)
        .then(res => {
        })
    },
    // 视频获取
    getVideo (videoParams) {
      let url = Urls.videoUrl.getAccessToken()
      SqTools.post(url, {})
        .then(res => {
          if (res.data.data) {
            // eslint-disable-next-line
            player = new EZUIKit.EZUIKitPlayer({
              autoplay: true,
              id: 'video-container',
              accessToken: res.data.data.accessToken,
              url: 'ezopen://open.ys7.com/' + videoParams + '/1.live',
              template: 'voice', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
              // 视频上方头部控件
              header: ['capturePicture', 'save', 'zoom'], // 如果templete参数不为simple,该字段将被覆盖
              plugin: ['talk'], // 加载插件，talk-对讲
              // 视频下方底部控件
              footer: ['talk', 'hd', 'fullScreen'], // 如果template参数不为simple,该字段将被覆盖
              audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
              openSoundCallBack: data => console.log('开启声音回调', data),
              closeSoundCallBack: data => console.log('关闭声音回调', data),
              startSaveCallBack: data => console.log('开始录像回调', data),
              stopSaveCallBack: data => console.log('录像回调', data),
              capturePictureCallBack: data => console.log('截图成功回调', data),
              fullScreenCallBack: data => console.log('全屏回调', data),
              getOSDTimeCallBack: data => console.log('获取OSDTime回调', data),
              width: 1158.39,
              height: 583
            })
          }
        })
    },
    // webrtc---测试
    // getAnswer () {
    //   var video = document.getElementById('video-webrtc')
    //   var url = 'webrtc://1.116.210.225:1985/live/34020000001320000010@34020000001320000011'
    //   // eslint-disable-next-line
    //   var player = new JSWebrtc.Player(url, {
    //     video: video,
    //     autoplay: true,
    //     onPlay: (obj) => {
    //       console.log('start play')
    //     }
    //   })
    // },
    // // // 测试 flv.min.js
    createVideo () {
      let url = Urls.videoUrl.deviceWebcam() + this.deviceId
      SqTools.post(url, {})
        .then(res => {
          if (res.data.data) {
            if (res.data.data.isUntie && res.data.data.status === 0) {
              this.divStatus = false
              this.videoStatus = true
            } else if (res.data.data.isUntie && res.data.data.status === 1) {
              this.videoStatus = false
              this.divStatus = true
              this.videoSrc = res.data.data.url
              this.webcamId = res.data.data.webcamId
              this.getVideo(res.data.data.webcamId)
              this.videoBoolen = true
              setTimeout(() => {
                this.getMuVideo()
              }, 1000)
            } else {
              this.divStatus = false
              this.videoStatus = false
              console.log(3)
            }
          } else {
            this.divStatus = false
            this.videoStatus = false
            console.log(4)
          }
        })
    },
    change () {
      player.stop()
    }
    // getFlvVideo (flvUrl) {
    //   if (flvjs.isSupported()) {
    //     var videoElement = document.getElementById('videoElement')
    //     var flvPlayer = flvjs.createPlayer({
    //       type: 'flv',
    //       url: flvUrl // 你的url地址
    //     })
    //     flvPlayer.attachMediaElement(videoElement)
    //     flvPlayer.load()
    //     flvPlayer.play()
    //   }
    // },
    // updateVideo (ssrc) {
    //   let hexSsrc = parseInt(ssrc).toString(16)
    //   let hexSsrcSize = 8 - hexSsrc.length
    //   for (var i = 0; i < hexSsrcSize; i++) {
    //     hexSsrc = '0' + hexSsrc
    //   }
    //   this.ssrc = hexSsrc.toLocaleUpperCase()
    //   let url = Urls.videoUrl.close() + 'stream=' + this.ssrc + '&force=1'
    //   SqTools.get(url)
    //     .then(res => {
    //       this.getVideoUrlBySsrc(this.ssrc)
    //     })
    // },
    // destroyVideo () {
    //   let url = Urls.videoUrl.close() + 'stream=' + this.ssrc + '&force=1'
    //   SqTools.get(url)
    //     .then(res => {
    //     })
    // },
    // getVideoUrlBySsrc (ssrc) {
    //   // let hexSsrc = parseInt(ssrc).toString(16)
    //   // let hexSsrcSize = 8 - hexSsrc.length
    //   // for (var i = 0; i < hexSsrcSize; i++) {
    //   //   hexSsrc = '0' + hexSsrc
    //   // }
    //   // this.ssrc = hexSsrc.toLocaleUpperCase()
    //   let videoUrl = Urls.videoPath + 'rtp/' + ssrc + '/hls.m3u8'
    //   // eslint-disable-next-line
    //   new Aliplayer({
    //     'id': 'map',
    //     'source': videoUrl,
    //     'width': '100%',
    //     'height': '100%',
    //     'autoplay': true,
    //     'isLive': true,
    //     'rePlay': false,
    //     'playsinline': true,
    //     'preload': true,
    //     'controlBarVisibility': 'hover',
    //     'useH5Prism': true
    //   }, function (player) {
    //   }
    //   )
    // },
    // getVideo (id) {
    //   let url = Urls.videoUrl.play() + '/' + id + '/' + id
    //   SqTools.get(url, {})
    //     .then(res => {
    //       this.updateVideo(res.data.ssrc)
    //     })
    // },
    // getDeviceInfo () {
    //   let url = Urls.cameraUrl.deviceWebcam() + this.deviceId
    //   SqTools.post(url, {})
    //     .then(res => {
    //       if (res.data.data.webcamId) {
    //         console.log(res.data.data)
    //         // this.getVideo(res.data.data.webcamId)
    //         this.divStatus = true
    //       } else {
    //         this.divStatus = false
    //         // this.$message.warning('暂无摄像头绑定！')
    //       }
    //     })
    // }
  }
}
</script>

<style scoped>
.videoMap {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  position: relative;
}

#videoElement {
  width: 100%;
  height: 100%;
}
</style>
