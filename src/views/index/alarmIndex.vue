<template>
    <div class="alarmIndex">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :rowKey="(record,index)=>{return index}"
        @change="handleTableChange"
      >
      </a-table>
      <a-modal
        title="新增报警"
        :visible="showEquipment"
        @ok="addAndUpdateMethod"
        @cancel="handleCancel"
      >
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="报警名称" prop="alarmName">
            <a-input v-model="form.alarmName"/>
          </a-form-model-item>
          <a-form-model-item label="报警类型" prop="alarmType">
            <a-select v-model="form.alarmType">
              <a-select-option :value="1">
                气体报警
              </a-select-option>
              <a-select-option :value="2">
                断网断电
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-switch checked-children="开" un-checked-children="关" v-model="form.status"/>
          </a-form-model-item>
          <a-form-model-item label="生效时间" prop="effectiveTime">
            <a-date-picker
              v-model="form.effectiveTime"
              show-time
              type="date"
              placeholder="请选择生效时间"
            />
          </a-form-model-item>
          <a-form-model-item label="类型" prop="type">
            <a-select v-model="form.type" style="width: 80px;">
              <a-select-option value="o2">
                氧气
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="操作符" prop="op">
            <a-select v-model="form.op" style="width: 80px;">
              <a-select-option value="lt">
                &lt;
              </a-select-option>
              <a-select-option value="gt">
                &gt;
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="报警值" prop="value">
            <a-input v-model="form.value" style="width: 100px;"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
</template>

<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import moment from 'moment'
import {message} from 'antd'
import store from '../../store/index'
export default {
  name: 'alarmIndex',
  data () {
    return {
      moment: moment,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
        'alarmName': '',
        'alarmType': 1,
        'type': 'o2',
        'op': 'gt',
        'value': undefined,
        'effectiveTime': null,
        'status': true
      },
      rules: {
        alarmName: [
          { required: true, message: '报警名称不能为空', trigger: 'change' }
        ],
        alarmType: [
          { required: true, message: '报警类型不能为空', trigger: 'change' }
        ],
        effectiveTime: [
          { required: true, message: '生效时间不能为空', trigger: 'change' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'change' }
        ],
        op: [
          { required: true, message: '操作符不能为空', trigger: 'change' }
        ],
        value: [
          { required: true, message: '报警值不能为空', trigger: 'change' }
        ]
      },
      showEquipment: false,
      pageSize: 8,
      pageNumber: 1,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 8,
        showQuickJumper: false,
        showSizeChanger: false,
        pageSizeOptions: ['5'],
        showTotal: total => `共有 ${total} 条数据`
      },
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
      data: []
    }
  },
  created () {
    // sessionStorage监听，调用函数
    window.addEventListener('setItem', () => {
      if (store.state.componentStatus === 6) {
        this.getTableData()
      }
    })
    this.getTableData()
  },
  destroyed () {
    this.getTableData()
  },
  methods: {
    addAndUpdateMethod () {
      let url = Urls.alarmUrl.saveOrUpdate()
      this.form.effectiveTime = this.moment(this.form.effectiveTime).format('YYYY-MM-DD')
      this.form.status = this.form.status === true ? 1 : 0
      let data = this.form
      SqTools.post(url, data)
        .then(res => {
          if (res.data.code === 20000) {
            this.showEquipment = false
            message.success('操作成功！')
          } else {
            message.error('操作失败！')
          }
        })
    },
    showModel () {
      this.showEquipment = true
      this.resetForm()
    },
    handleCancel () {
      this.showEquipment = false
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.pageNumber = pagination.current
      this.getTableData()
    },
    getTableData () {
      let url = Urls.deviceUrl.alarms()
      let data11 = {
        'pageNum': this.pageNumber,
        'pageSize': this.pageSize,
        'deviceId': parseInt(sessionStorage.getItem('spanStatus'))
      }
      SqTools.post(url, data11)
        .then(res => {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.pagination = pagination
          this.data = res.data.data
        })
    },
    resetForm () {
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields()
      } else {
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields()
        })
      }
      // this.$nextTick(() => {
      //   this.$refs.ruleForm.resetFields()
      // })
    }
  }
}
</script>

<style scoped>
  .alarmIndex{
    width: 100%;
    height: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
  }
  .alarmIndex>>>.ant-btn{
    margin-left: 20px;
  }
</style>
