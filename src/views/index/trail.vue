<template>
    <div class="trail">
      <div class="trailLeft">
        <div id="trailLeft"></div>
      </div>
      <div class="trailRight">
        <a-tabs @change="callback"  type="card">
          <a-tab-pane key="11" tab="全部">
            <div id="trailRight">
              <a-table
                :columns="columns"
                :data-source="data"
                :pagination="pagination"
                :rowKey="(record,index)=>{return index}"
                @change="handleTableChange"
              >
                <span slot="startTime" slot-scope="text, record">
                  {{record.startTime}} -- {{record.endTime ? record.endTime : '至今'}}
                </span>
                <span slot="workStatus" slot-scope="text, record">
                  {{text === 1 ? '停机' : text === 2 ? '离线' : '工作'}}
                </span>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane key="0" tab="工作">
            <div id="trailRight2">
              <a-table
                :columns="columns"
                :data-source="data"
                :pagination="pagination"
                :rowKey="(record,index)=>{return index}"
                @change="handleTableChange"
              >
                <span slot="startTime" slot-scope="text, record">
                  {{record.startTime}} -- {{record.endTime ? record.endTime : '至今'}}
                </span>
                <span slot="workStatus" slot-scope="text, record">
                  {{text === 1 ? '停机' : text === 2 ? '离线' : '工作'}}
                </span>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane key="1" tab="停机">
            <div id="trailRight3">
              <a-table
                :columns="columns"
                :data-source="data"
                :pagination="pagination"
                :rowKey="(record,index)=>{return index}"
                @change="handleTableChange"
              >
                <span slot="startTime" slot-scope="text, record">
                  {{record.startTime}} -- {{record.endTime}}
                </span>
                <span slot="workStatus" slot-scope="text, record">
                   {{text === 1 ? '停机' : text === 2 ? '离线' : '工作'}}
                </span>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="离线">
            <div id="trailRight4">
              <a-table
                :columns="columns"
                :data-source="data"
                :pagination="pagination"
                :rowKey="(record,index)=>{return index}"
                @change="handleTableChange"
              >
                <span slot="startTime" slot-scope="text, record">
                  {{record.startTime}} -- {{record.endTime}}
                </span>
                <span slot="workStatus" slot-scope="text, record">
                   {{text === 1 ? '停机' : text === 2 ? '离线' : '工作'}}
                </span>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
</template>

<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import store from '../../store/index'
const echarts = require('echarts')
export default {
  name: 'trail',
  data () {
    return {
      menuId: parseInt(sessionStorage.getItem('spanStatus')),
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
      tabStatus: '11',
      columns: [
        {
          title: '时间',
          dataIndex: 'startTime',
          key: 'startTime',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '状态',
          dataIndex: 'workStatus',
          key: 'workStatus',
          scopedSlots: { customRender: 'workStatus' }
        },
        {
          title: '时长',
          dataIndex: 'timeDiff',
          key: 'timeDiff'
        }
      ],
      data: []
    }
  },
  created () {
    // sessionStorage监听，调用函数
    window.addEventListener('setItem', () => {
      if (store.state.componentStatus === 2) {
        this.getDeviceInfo()
        this.getTableList()
      }
    })
  },
  mounted () {
    this.getDeviceInfo()
    this.getTableList()
  },
  methods: {
    callback (key) {
      this.pageNumber = 1
      this.tabStatus = key
      this.getTableList()
    },
    trailLeftMap (xData, yData, data) {
      this.$nextTick(() => {
        let myChart = echarts.init(document.getElementById('trailLeft'))
        let color = ['#2ED47A', '#C2CFE0', '#F7685B', '#FDB36A', '#FD866A', '#9E87FF', '#58D5FF']
        let option = {
          color: color,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: '20%',
            bottom: '5%',
            textStyle: {
              color: '#192A3E'
            },
            data: data.map(item => item.name),
            formatter: function (name) {
              if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                  if (name === data[i].name) {
                    return (
                      name + '      ' + name + '时长(h) :' + '   ' + data[i].value
                    )
                  }
                }
              }
            }
          },
          grid: {
            'containLabel': true,
            top: '16%',
            right: '5%',
            left: '40%',
            bottom: '10'
          },
          xAxis: [{
            type: 'category',
            data: xData,
            axisLine: {
              lineStyle: {
                color: '#C5C5C5'
              }
            },
            axisLabel: {
              margin: 10,
              color: '#1D2343',
              textStyle: {
                fontSize: 14
              }
            }
          }],
          yAxis: [{
            name: '单位：小时',
            'nameTextStyle': {
              'color': '#1D2343',
              'fontSize': 14
            },
            axisLabel: {
              formatter: '{value}',
              color: '#1D2343'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#C5C5C5'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#E8E8E8',
                type: 'dashed'
              }
            }
          }],
          series: [{
            type: 'bar',
            data: yData,
            barWidth: '20px',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#3AA0FE' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#3AA0FE' // 100% 处的颜色
                }], false)
              }
            }
          },
          {
            type: 'pie',
            center: ['12%', '50%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data,
            roundCap: 1 // 可选项为1和2，不填则采用原有拼接方式
          }]
        }
        myChart.setOption(option)
      })
    },
    getDeviceInfo () {
      let url = Urls.workingHoursUrl.statistics()
      let data = {
        'deviceId': parseInt(sessionStorage.getItem('spanStatus'))
      }
      SqTools.post(url, data)
        .then(res => {
          let xData = res.data.data.timeByDay.map(v => v.date)
          let yData = res.data.data.timeByDay.map(v => v.times)
          let data = []
          for (let i = 0; i < res.data.data.timeByStatus.length; i++) {
            if (res.data.data.timeByStatus[i].workStatus === 2) {
              res.data.data.timeByStatus[i].workStatus = '离线'
            } else if (res.data.data.timeByStatus[i].workStatus === 1) {
              res.data.data.timeByStatus[i].workStatus = '停机'
            } else {
              res.data.data.timeByStatus[i].workStatus = '工作'
            }
            data.push(
              {
                name: res.data.data.timeByStatus[i].workStatus,
                value: res.data.data.timeByStatus[i].times
              }
            )
          }
          this.trailLeftMap(xData, yData, data)
        })
    },
    getTableList (startTime, endTime) {
      let url = Urls.workingHoursUrl.list()
      let data = {
        'pageNum': this.pageNumber,
        'pageSize': this.pageSize,
        'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
        startTime: startTime,
        endTime: endTime,
        workStatus: this.tabStatus === '11' ? undefined : parseInt(this.tabStatus)
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
      this.getTableList()
    }
  }
}
</script>

<style scoped>
.trail{
  width: 100%;
  height: 100%;
}
.trail>div{
  width: 100%;
  height: 50%;
  padding: 20px;
  box-sizing: border-box;
}
.title>span{
  font-size: 22px;
  font-weight: 400;
  color: #34d9fc;
  line-height: 47px;
  padding: 4px 10px;
  border-left: 4px solid #34d9fc;
  box-sizing: border-box;
}
  #trailLeft{
    width: 100%;
    height: 100%;
  }
  .trailRight>>>.ant-table-thead > tr > th {
    color: #ffffff;
    font-weight: 500;
    text-align: center;
    background: #109CF1;
    border-bottom: 1px solid #109CF1;
  }
.trailRight>>>.ant-table-tbody > tr > td {
  color: #323C47;
  font-weight: 500;
  text-align: center;
  background: transparent;
  border-bottom: 1px solid #F1F1F1;
}
  .trailRight>>>.ant-table-thead > tr > th,
  .trailRight>>>.ant-table-tbody > tr > td {
    padding: 12px 16px;
    overflow-wrap: break-word;
  }
</style>
