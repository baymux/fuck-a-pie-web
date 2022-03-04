<template>
    <div class="equipmentBaseInfo">
      <div class="search">
<!--        <span>-->
<!--          选择时间：-->
<!--          <a-date-picker style="width: 200px;" placeholder="选择日期"/>-->
<!--        </span>-->
        <span>
          <a-button icon="arrow-left" @click="routerLink">返回</a-button>
        </span>
      </div>
      <div class="baseInfoMap">
        <div class="topTitle">
          <span>基本信息</span>
          <span>硬件信息</span>
          <span>摄像头信息</span>
          <span></span>
        </div>
        <div class="topMap">
          <div>
            <span>
                设备名称：
              <i>{{deviceInfo.deviceName}}</i>
              </span>
            <span>
                出厂时间：
              <i>{{deviceInfo.factoryTime}}</i>
                <span style="margin-left: 30px;">
                  设备类型：
                  <i>标准型</i>
                </span>
              </span>
            <span>
                设备编号：
              <i>{{deviceInfo.deviceCode}}</i>
              <span style="margin-left: 20px;">
                累计工时：
              <i>{{deviceInfo.workingHours}}h</i>
              </span>
              </span>
            <span>
                组织机构：
              <i>{{deviceInfo.deviceManufacturer}}</i>
              </span>
          </div>
          <div>
            <span></span>
            <span>
                硬件SN：
                <i v-if="buttonStatus">{{deviceInfo.sn ? deviceInfo.sn : deviceCode}}</i>
                <a-input v-else v-model="deviceCode" style="width: 140px"/>
                <a-button  v-if="buttonStatus" @click="buttonCancelClick" style="margin-left: 10px;">
                  解绑
                </a-button>
                <a-button v-else @click="buttonClick" style="margin-left: 10px;">
                  绑定
                </a-button>
              </span>
            <span>
                工作状态:
              <i>正常</i>
            </span>
            <span></span>
          </div>
          <div>
            <span></span>
            <span>
                摄像头编号：
              <i v-if="cameraStatus">{{cameraInfo.webcamId ? cameraInfo.webcamId : cameraId}}</i>
              <a-input v-else  style="width: 100px;" v-model="cameraId"/>
            </span>
            <span></span>
            <span>
              验证码：
              <i v-if="cameraStatus">******</i>
              <a-input v-else  style="width: 100px;" v-model="validateCode"/>
            </span>
            <span>
              <a-button  v-if="cameraStatus" @click="cameraCancelClick" style="margin-left: 4px;">
                解绑
              </a-button>
              <a-button v-else @click="cameraClick" style="margin-left: 4px;">
                绑定
              </a-button>
            </span>
            <span>
                工作状态:
              <i>{{cameraStatus ? (cameraStatus === 1 ? '在线' : "离线") : '--'}}</i>

              </span>
            <span></span>
          </div>
          <div>
              <div id="energyMap"></div>
          </div>
        </div>
        <div class="tableList">
          <div class="title">
            <span>工作时长</span>
<!--            <a-button style="float: right;">导出数据</a-button>-->
          </div>
          <div class="rightTop">
            <a-table
              :pagination="pagination1"
              :rowKey="(record,index)=>{return index}"
              @change="handleTableChange1"
              :columns="columns1"
              :data-source="data1">
              <span slot="workStatus" slot-scope="text">{{text === 0 ? '工作' : text === 1 ? '停机' : '离线'}}</span>
            </a-table>
          </div>
          <div class="title" style="margin-top: 30px;">
            <span>报警信息</span>
            <a-button style="float: right;" @click="exportWarningInfo">导出数据</a-button>
          </div>
          <div class="rightBottom">
            <a-table
              :pagination="pagination"
              :rowKey="(record,index)=>{return index}"
              @change="handleTableChange"
              :columns="columns"
              :data-source="data">
            </a-table>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import MapLoader from '../../utils/loadMap'
const echarts = require('echarts')
export default {
  name: 'equipmentBaseInfo',
  data () {
    return {
      placeName: '23414',
      pageSize: 3,
      pageNumber: 1,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 3,
        showQuickJumper: false,
        showSizeChanger: false,
        pageSizeOptions: ['3'],
        showTotal: total => `共有 ${total} 条数据`
      },
      pageSize1: 3,
      pageNumber1: 1,
      pagination1: {
        total: 0,
        current: 1,
        pageSize: 3,
        showQuickJumper: false,
        showSizeChanger: false,
        pageSizeOptions: ['3'],
        showTotal: total => `共有 ${total} 条数据`
      },
      deviceCode: undefined,
      cameraId: undefined,
      validateCode: undefined,
      cameraInfo: {},
      cameraStatus: 0,
      buttonStatus: 0,
      deviceInfo: {},
      columns: [
        {
          title: '报警信息',
          dataIndex: 'alarmInfo',
          key: 'alarmInfo',
          scopedSlots: { customRender: 'alarmInfo' }
        },
        {
          title: '开始时间',
          dataIndex: 'alarmStartTime',
          key: 'alarmStartTime'
        },
        {
          title: '结束时间',
          dataIndex: 'alarmEndTime',
          key: 'alarmEndTime'
        },
        {
          title: '时长',
          dataIndex: 'alarmDuration',
          key: 'alarmDuration'
        }
      ],
      data: [],
      columns1: [
        {
          title: '工作状态',
          dataIndex: 'workStatus',
          key: 'workStatus',
          slots: { title: 'workStatus' },
          scopedSlots: { customRender: 'workStatus' }
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          key: 'startTime'
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          key: 'endTime'
        },
        {
          title: '时长',
          dataIndex: 'timeDiff',
          key: 'timeDiff'
        }
      ],
      data1: []
    }
  },
  created () {
    this.getWarningInfo()
    this.getTableList()
    this.getPosition()
  },
  mounted () {
    this.getTableDataProfile()
    this.getCameraInfo()
    this.getEnergy()
  },
  methods: {
    exportWarningInfo () {
      let url = Urls.deviceUrl.alarmsExport()
      let data = {
        'deviceId': parseInt(this.$route.query.id)
      }
      SqTools.getFile(url, data)
        .then(res => {
          // ArrayBuffer 转为 Blob
          let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})

          let objectUrl = URL.createObjectURL(blob)
          window.location.href = objectUrl
        })
    },
    getPosition (lat, lon) {
      // eslint-disable-next-line
      let that = this
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
              console.log(result)
              that.placeName = result.regeocode.formattedAddress
              return '12343124'
            }
          })
        })
      })
    },
    getWarningInfo () {
      let url = Urls.deviceUrl.alarms()
      let data = {
        'deviceId': parseInt(this.$route.query.id),
        'pageNum': this.pageNumber,
        'pageSize': this.pageSize
      }
      SqTools.post(url, data)
        .then(res => {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.pagination = pagination
          this.data = res.data.data
        })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.pageNumber = pagination.current
      this.getWarningInfo()
    },
    getTableList () {
      let url = Urls.workingHoursUrl.list()
      let data = {
        'pageNum': this.pageNumber1,
        'pageSize': this.pageSize1,
        'deviceId': parseInt(this.$route.query.id),
        startTime: '',
        endTime: ''
      }
      SqTools.post(url, data)
        .then(res => {
          const pagination = { ...this.pagination1 }
          pagination.total = res.data.total
          this.pagination1 = pagination
          let dd = this.getPosition(28.16, 112.52)
          console.log(dd)
          this.data1 = res.data.data
        })
    },
    handleTableChange1 (pagination) {
      this.pagination1.current = pagination.current
      this.pagination1.pageSize = pagination.pageSize
      this.pageNumber1 = pagination.current
      this.getTableList()
    },
    getEnergy () {
      let myChart = echarts.init(document.getElementById('energyMap'))
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
          x: '44%',
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
              '50%',
              '50%'
            ],
            radius: [
              '80%',
              '80%'
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
    },
    getCameraInfo () {
      let url = Urls.cameraUrl.deviceWebcam() + parseInt(this.$route.query.id)
      SqTools.post(url)
        .then(res => {
          this.cameraInfo = res.data.data
          this.cameraStatus = res.data.data.status ? 1 : 0
        })
    },
    cameraCancelClick () {
      let url = Urls.cameraUrl.webcamUntie() + parseInt(this.$route.query.id)
      SqTools.post(url)
        .then(res => {
          if (res.data.code === 20000) {
            this.cameraStatus = 0
            this.$message.success('操作成功！')
          } else {
            this.$message.error('操作失败！')
          }
        })
    },
    getImgData (imgListData) {
      let imgList = []
      if (imgListData.length) {
        for (let i = 0; i < imgListData.length; i++) {
          let file = new File([imgListData[i]], '', {
            type: 'image/jpeg'
          })
          // options属性： 包含type 和 lastModified
          file.src = 'data:image/jpeg;base64,' + imgListData[i]
          // file.type = 'image/jpeg'
          imgList.push(
            {
              file: file
            }
          )
        }
      }
      return imgList
    },
    cameraClick () {
      let url = Urls.cameraUrl.webcamBind()
      let data = {
        'deviceId': parseInt(this.$route.query.id),
        'webcamId': this.cameraId,
        'validateCode': this.validateCode
      }
      SqTools.post(url, data)
        .then(res => {
          if (res.data.code === 20000) {
            this.cameraStatus = 1
            console.log(this.cameraStatus)
            this.$message.success('操作成功！')
            this.getCameraInfo()
          } else {
            this.$message.error('操作失败！')
          }
        })
    },
    buttonClick () {
      let url = Urls.deviceUrl.saveOrUpdate()
      // let imgList = this.getImgData(this.deviceInfo.imgs)
      this.deviceInfo.sn = this.deviceCode
      // console.log(imgList, this.deviceInfo)
      let formData = new FormData()
      // for (let i = 0; i < imgList.length; i++) {
      //   formData.append('imgs', imgList[i].file)
      // }
      formData.append('deviceInfo', new Blob([JSON.stringify(this.deviceInfo)],
        {
          type: 'application/json'
        }))
      SqTools.post(url, formData)
        .then(res => {
          if (res.data.code === 20000) {
            this.buttonStatus = 1
            this.$message.success('操作成功！')
            this.getTableDataList()
          } else {
            this.$message.error('操作失败！')
          }
          console.log(res)
        })
    },
    buttonCancelClick () {
      let url = Urls.deviceUrl.untie()
      let data = {
        id: parseInt(this.$route.query.id)
      }
      SqTools.post(url, data)
        .then(res => {
          if (res.data.code === 20000) {
            this.buttonStatus = 0
            this.$message.success('操作成功！')
          } else {
            this.$message.error('操作失败！')
          }
        })
    },
    routerLink () {
      this.$router.push({
        path: '/equipmentList'
      })
    },
    getTableDataProfile () {
      let url = Urls.deviceUrl.info()
      let data = {
        'id': parseInt(this.$route.query.id)
      }
      SqTools.post(url, data)
        .then(res => {
          this.deviceInfo = res.data.data
          this.buttonStatus = res.data.data.sn ? 1 : 0
        })
    }
  }
}
</script>

<style scoped>
  .equipmentBaseInfo{
    width: 100%;
    height: 100%;
  }
  .search{
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }
  .search>span>i{
    vertical-align: middle;
    font-size: 14px;
  }
  .baseInfoMap{
    width: 100%;
    height: calc(100% - 80px);
    margin-top: 20px;
  }
  .topTitle{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .topTitle>span{
    width: calc(22% - 15px);
    font-size: 18px;
    font-weight: 700;
    color: #6a707e;
  }
  .topMap{
    width: 100%;
    height: 144px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .topMap>div{
    width: calc(22% - 15px);
    height: 100%;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    padding: 16px 10px 16px 20px;
    box-sizing: border-box;
  }
  .topMap>div>span{
    color: #1D2343;
  }
  .topMap>div>span i{
    color: rgba(29,35,67,0.63);
  }
  .tableList{
    width: 100%;
    height: calc(100% - 212px);
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    padding: 30px;
    box-sizing: border-box;
    margin-top: 20px;
  }
  .title>span{
    font-size: 18px;
    font-weight: 700;
    color: #6a707e;
  }
  .rightBottom,.rightTop{
    width: 100%;
    height: calc(50% - 54px);
    margin-top: 14px;
  }
  #energyMap{
    width: 100%;
    height: 100px;
  }
</style>
