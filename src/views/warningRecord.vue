<template>
    <div class="warningRecord">
      <div class="tabDiv">
        <span v-for="item in tabData" :key="item.index">
          <img :src="item.imgPath" alt="">
          <span>
             <span>
                <b class="count">{{summaryData[item.index].count || 0}}</b>
                <i class="countName">次</i>
              </span>
              <b class="countType">{{summaryData[item.index].alarmName || 0}}</b>
          </span>
        </span>
      </div>
      <div class="tableDiv">
        <div class="search">
        <span>
          报警类型：
          <a-select style="width: 200px;margin-right: 10px;" v-model="alermType" @change="onChange">
            <a-select-option :value="1">
              气体
            </a-select-option>
              <a-select-option :value="2">
              断电断网
            </a-select-option>
          </a-select>
        </span>
        <a-range-picker
          v-model="timeValue"
          @change="timeRange"
          placehlder="请选择开始日期"
          format="YYYY-MM-DD" />
          <a-button style="margin-left: 20px;" @click="resetAll">重置</a-button>
        </div>
        <a-table
          :columns="columns"
          :rowKey="(record,index)=>{return index}"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <span slot="alarmType" slot-scope="text">{{text === 1 ? '气体' : '断电断网'}}</span>
          <span slot="alarmEndTime" slot-scope="text">{{text ? text : '--'}}</span>
        </a-table>
      </div>
    </div>
</template>

<script>
import Urls from '../assets/js/Urls'
import SqTools from '../assets/js/SqTools'
import { DatePicker } from 'antd'

const { RangePicker } = DatePicker
export default {
  name: 'warningRecord',
  data () {
    return {
      timeValue: undefined,
      alermType: undefined,
      dateStart: undefined,
      dateEnd: undefined,
      summaryData: [],
      pageSize: 10,
      pageNumber: 1,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: false,
        showSizeChanger: false,
        pageSizeOptions: ['10'],
        showTotal: total => `共有 ${total} 条数据`
      },
      processingStatus: 0,
      tableData: [],
      tabData: [
        {
          index: 0,
          imgPath: require('../assets/images/tabCard/o2Low.png'),
          name: '氧气高',
          number: 0
        },
        {
          index: 1,
          imgPath: require('../assets/images/tabCard/o2Low.png'),
          name: '氧气低',
          number: 0
        },
        {
          index: 2,
          imgPath: require('../assets/images/tabCard/co.png'),
          name: '一氧化碳高',
          number: 0
        },
        {
          index: 3,
          imgPath: require('../assets/images/tabCard/ch4.png'),
          name: '硫化氢高',
          number: 0
        },
        {
          index: 4,
          imgPath: require('../assets/images/tabCard/h2s.png'),
          name: '甲烷高',
          number: 0
        }
      ],
      columns: [
        {
          dataIndex: 'deviceCode',
          title: '设备编号',
          key: 'deviceCode',
          scopedSlots: { customRender: 'deviceCode' }
        },
        {
          title: '报警类型',
          dataIndex: 'alarmType',
          key: 'alarmType',
          scopedSlots: { customRender: 'alarmType' }
        },
        {
          title: '报警信息',
          dataIndex: 'alarmInfo',
          key: 'alarmInfo'
        },
        {
          title: '开始时间',
          key: 'alarmStartTime',
          dataIndex: 'alarmStartTime',
          scopedSlots: { customRender: 'alarmStartTime' }
        },
        {
          title: '结束时间',
          key: 'alarmEndTime',
          dataIndex: 'alarmEndTime',
          scopedSlots: { customRender: 'alarmEndTime' }
        },
        {
          title: '持续时间',
          key: 'alarmDuration',
          dataIndex: 'alarmDuration',
          scopedSlots: { customRender: 'alarmDuration' }
        }
      ]
    }
  },
  components: {
    RangePicker
  },
  mounted () {
    this.getTableDataList()
    this.getDataSummary()
  },
  methods: {
    resetAll () {
      this.pageNumber = 1
      this.pagination.current = 1
      this.alermType = undefined
      this.timeValue = undefined
      this.dateStart = undefined
      this.dateEnd = undefined
      this.getTableDataList()
    },
    onChange () {
      this.pageNumber = 1
      this.getTableDataList()
    },
    timeRange (date, dateString) {
      this.pageNumber = 1
      this.dateStart = dateString[0]
      this.dateEnd = dateString[1]
      this.getTableDataList()
    },
    callback (key) {
      this.processingStatus = key
      this.getTableDataList()
    },
    getDataSummary () {
      let url = Urls.alarmUrl.statistics()
      let data = {
      }
      SqTools.post(url, data)
        .then(res => {
          this.summaryData = res.data.data
        })
    },
    getTableDataList () {
      let url = Urls.alarmUrl.record()
      let data = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize,
        'processingStatus': this.processingStatus,
        'alarmType': this.alermType,
        'beginTime': this.dateStart,
        'endTime': this.dateEnd
      }
      SqTools.post(url, data)
        .then(res => {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.pagination = pagination
          this.tableData = res.data.data
        })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.pageNumber = pagination.current
      // this.pageSize = pagination.pageSize
      this.getTableDataList()
    }
  }
}
</script>

<style scoped>
  .warningRecord{
    width: 100%;
    height: 100%;
  }
  .tabDiv{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tabDiv>span{
    width: calc(20% - 15px);
    height: 100px;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    position: relative;
  }
  .tabDiv>span>img{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    z-index: 2;
  }
  .tabDiv>span>span{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 44;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    padding: 16px 30px;
    box-sizing: border-box;
  }
  .search{
    width: 100%;
    height: 60px;
  }
  .count{
    font-size: 48px;
    font-weight: 700;
    color: #ffffff;
  }
  .countName{
    color: #ffffff;
  }
  .countType{
    font-size: 16px;
    font-weight: 700;
    color: #404040;
  }
  .tableDiv{
    width: 100%;
    height: calc(100% - 160px);
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    margin-top: 60px;
    padding: 30px;
    box-sizing: border-box;
  }
</style>
