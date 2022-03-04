<template>
    <div class="operateProfile">
      <div class="operation">
        <div class="title">操作</div>
        <div class="title">设备信息</div>
      </div>
      <div class="operateTop">
        <div class="profile">
          <span
            v-for="item in spanData"
            :key="item.key"
            @click="changSpanStatus(item.key)"
            :class="{activeSpan: spanStatus === item.key}">
            {{item.name}}
          </span>
        </div>
        <div class="baseInfo">
          <div class="baseInfoLeft">
            <p>基本信息</p>
            <div class="info">
              <span>设备名称：
                <i style="width: 170px;display: inline-block;">{{deviceData.deviceName ? deviceData.deviceName : '--'}}</i>
                <span>设备类型：
                <i>{{deviceData.deviceType === 1 ? '标准型' : '标准型'}}</i>
                </span>
              </span>
              <span>
                硬件SN码：
                <i style="width: 140px;display: inline-block;">{{deviceData.sn ? deviceData.sn : '--'}}</i>
                <span style="margin-left: 0px">设备编号：
                <i>{{deviceData.deviceCode ? deviceData.deviceCode : '--'}}</i>
              </span>
              </span>
              <span>持有单位：
                <i>{{deviceData.attributionUnit ? deviceData.attributionUnit : '--'}}</i>
              </span>
              <span>当前位置：
                <i>{{placeName ? placeName : '--'}}</i>
              </span>
            </div>
          </div>
          <div class="baseInfoMiddle">
            <p>设备负责人</p>
            <div class="info" style="margin-top: 20px;">
              <span>姓名：
                <i>{{deviceData.devicePrincipal ? deviceData.devicePrincipal : '--'}}</i>
              </span>
              <span>联系方式：
                <i>{{deviceData.contactPhone ? deviceData.contactPhone : '--'}}</i>
                </span>
            </div>
          </div>
          <div class="baseInfoRight">
            <div class="info">
              <span style="margin-top: 16px;">状态：
              <i>{{deviceData.deviceStatus === 1 ? '停机' : deviceData.deviceStatus === 2 ? '离线' : '工作'}}</i>
              </span>
              <span>
              <div id="circleEnergy"></div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="operateBottom">
        <trail v-if="spanStatus === 2" ref="child"></trail>
        <mileage v-else-if="spanStatus === 4"></mileage>
        <dieselEngineParameters v-else-if="spanStatus === 5"></dieselEngineParameters>
        <alarmIndex v-else-if="spanStatus === 6"></alarmIndex>
        <videoMap v-else-if="spanStatus === 7"></videoMap>
        <trajectory v-else-if="spanStatus === 1"></trajectory>
      </div>
    </div>
</template>

<script>
import trajectory from './trajectory'
import trail from './trail'
import mileage from './mileage'
import dieselEngineParameters from './dieselEngineParameters'
import alarmIndex from './alarmIndex'
import videoMap from './videoMap'
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import MapLoader from '../../utils/loadMap'
import store from '../../store/index'
const echarts = require('echarts')
export default {
  name: 'operateProfile',
  components: {
    trajectory,
    trail,
    mileage,
    dieselEngineParameters,
    alarmIndex,
    videoMap
  },
  data () {
    return {
      placeName: '',
      deviceData: {},
      spanStatus: 1,
      spanData: [
        {
          key: 1,
          name: '轨迹'
        },
        {
          key: 2,
          name: '工时'
        },
        {
          key: 5,
          name: '参数'
        },
        {
          key: 6,
          name: '报警'
        },
        {
          key: 7,
          name: '视频'
        }
      ],
      value: 1
    }
  },
  created () {
    this.getDeviceInfo()
  },
  watch: {
  },
  mounted () {
    this.getEnergy()
  },
  methods: {
    getPosition (lat, lon) {
      // eslint-disable-next-line
      let that = this
      if (lat && lon) {
        MapLoader().then(AMap => {
          AMap.plugin(['AMap.Geocoder'], function () {
            var geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              // radius: 30 // 以给定坐标为中心点，单位：米,范围0-3000
            })
            var lnglat = [lon, lat]// 这里是需要转化的经纬度

            geocoder.getAddress(lnglat, function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                // result为对应的地理位置详细信息
                that.placeName = result.regeocode.formattedAddress
              }
            })
          })
        })
      }
    },
    changSpanStatus (index) {
      this.spanStatus = index
      store.commit('changeComponentStatus', index)
    },
    onChange (date, dateString) {
      this.$refs.child.pageNumber = 1
      this.$refs.child.pagination.current = 1
      this.$refs.child.getTableList(dateString[0], dateString[1])
    },
    getDeviceInfo () {
      let url = Urls.deviceUrl.info()
      let data = {
        'id': parseInt(sessionStorage.getItem('spanStatus'))
      }
      SqTools.post(url, data)
        .then(res => {
          this.deviceData = res.data.data
          if (res.data.data.currentPlace) {
            this.getPosition(res.data.data.currentPlace.lat, res.data.data.currentPlace.lon)
          } else {
            this.placeName = '--'
          }
        })
    },
    getEnergy () {
      let myChart = echarts.init(document.getElementById('circleEnergy'))
      let option = {
        title: [{
          text: '电池电量:',
          show: true,
          textStyle: {
            color: '#1D2343',
            fontSize: 14,
            fontWeight: 500
          },
          top: '38%',
          left: '0'
        },
        {
          text: '25%',
          x: '58%',
          top: '38%',
          textStyle: {
            fontSize: '18',
            color: '#273B4A',
            fontWeight: '800'
          }
        }],
        series: [
          {
            center: [
              '70%',
              '50%'
            ],
            radius: [
              '60%',
              '60%'
            ],
            clockWise: false,
            hoverAnimation: false,
            type: 'pie',
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  textStyle: {
                    fontSize: 14,
                    color: '#273B4A'
                  },
                  position: 'center'
                },
                labelLine: {
                  show: false
                },
                color: '#25d055',
                borderColor: '#25d055',
                borderWidth: 12
              }
            },
            data: [
              {
                value: '20',
                name: '20%'
              },
              {
                name: ' ',
                value: 80,
                itemStyle: {
                  normal: {
                    label: {
                      'show': false
                    },
                    labelLine: {
                      'show': false
                    },
                    color: '#D6D6D6',
                    borderColor: '#D6D6D6',
                    borderWidth: 5
                  }
                }
              }
            ]
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
  .operateProfile{
    width: 100%;
    height: 100%;
  }
  .operation{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title{
    font-size: 18px;
    font-weight: 700;
    color: #6a707e;
    margin-bottom: 20px;
    width: 240px;
  }
  .title:nth-child(2){
    width: calc(100% - 260px);
  }
.operateTop{
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.profile{
  width: 240px;
  height: 100%;
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
  text-align: left;
  padding: 10px;
  box-sizing: border-box;
}
  .profile>span{
    width: 60px;
    height: 38px;
    display: inline-block;
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.14);
    color: #109CF1;
    line-height: 38px;
    margin-top: 16px;
    margin-left: 6px;
    text-align: center;
  }
  .operateBottom{
    width: 100%;
    height: calc(100% - 207px);
    margin-top: 20px;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    background-color: #FFFFFF;
  }
  .baseInfo{
   width: calc(100% - 260px);
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }
  .baseInfo .title>span{
    font-size: 22px;
    font-weight: 400;
    color: #34d9fc;
    line-height: 42px;
    padding: 0 10px;
    border-left: 4px solid #34d9fc;
  }
  .info{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    color: rgba(29,35,67,0.75);
  }
  .info>span{
    width: 100%;
    color: #1D2343;
    /*text-align: left;*/
    /*font-size: 16px;*/
    /*font-weight: 400;*/
    /*color: #34d9fc;*/
    /*line-height: 26px;*/
  }
  .info>span i{
    color: rgba(29,35,67,0.63);
  }
  .baseInfoRight{
    width: 20%;
  }
  .baseInfoLeft{
    width: 462px;
    height: 100%;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    padding: 10px 10px 10px 20px;
    box-sizing: border-box;
  }
  .baseInfoLeft>p, .baseInfoMiddle>p{
    font-size: 14px;
    color: #1D2343;
    margin-bottom: 0;
    line-height: 30px;
    font-weight: bold;
  }
  .baseInfoMiddle{
    width: 240px;
    height: 100%;
    opacity: 1;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    padding: 10px 10px 10px 20px;
    box-sizing: border-box;
  }
  .baseInfoRight{
    width: 200px;
    height: 146px;
    opacity: 1;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    padding: 10px 10px 10px 20px;
    box-sizing: border-box;
  }
  #circleEnergy{
    width: 100%;
    display: inline-block;
    height: 100px;
  }
  .activeSpan{
    background-color: #109CF1 !important;
    color: #ffffff !important;
  }
</style>
