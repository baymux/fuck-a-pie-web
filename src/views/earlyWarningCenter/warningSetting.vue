<template>
    <div class="warningSetting">
      <div class="search">
        <span>
          <span>
            关键字搜索：
            <a-input style="width: 220px;margin-right: 10px;" v-model="keyWord"/>
          </span>
<!--          TODO 暂时去掉-->
<!--          <span>-->
<!--            报警类型：-->
<!--            <a-select :default-value="1" style="width: 140px;">-->
<!--              <a-select-option :value="1">-->
<!--                气体报警-->
<!--              </a-select-option>-->
<!--              <a-select-option :value="2">-->
<!--                断电断网-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </span>-->
        </span>
        <span>
          <a-button style="margin-right: 10px;" @click="getTableDataList">搜索</a-button>
          <a-button @click="reset">重置</a-button>
        </span>
      </div>
      <div class="warningRuled">
        <a-button style="margin: 0 0 20px 0" @click="showModel">添加报警</a-button>
        <div class="tableWarning">
          <a-table
            :pagination="pagination"
            @change="handleTableChange"
            :columns="columns"
            :data-source="tableData"
            :rowKey="(record,index)=>{return index}">
        <span slot="action" slot-scope="text, record">
        <span @click="getTableDataProfile(record.id)" class="spanStyle">编辑</span>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确认删除吗?"
          @confirm="() => deleteTableDataList(record.id)"
        >
              <a href="javascript:;"  style="background-color: #F7685B;" class="spanStyle">删除</a>
          </a-popconfirm>
      </span>
            <span slot="alarmType" slot-scope="text, record">
              {{text === 1 ? '气体报警' : '断电断网'}}
            </span>
            <span slot="status" slot-scope="text, record">
              {{text ? '正常' : '暂停'}}
            </span>
            <span slot="fluctuate" slot-scope="text, record">
              ±{{text}}
            </span>
          </a-table>
        </div>
        <a-modal
          style="position: relative"
          :title="modelTitle"
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
              <a-switch checked-children="开" un-checked-children="关" v-model="form.status" />
            </a-form-model-item>
            <a-form-model-item label="生效时间">
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
            <a-input-number :min="0" :max="100" v-model="form.value" style="width: 100px;"/>
          </a-form-model-item>
            <a-form-model-item label="回差值">
              <a-input-number :min="0" :max="100" v-model="form.fluctuate" style="width: 100px;"/>
            </a-form-model-item>
            <a-form-model-item label="设置范围" prop="range">
              <a-select v-model="form.range">
                <a-select-option :value="1">
                  全部
                </a-select-option>
                <a-select-option :value="2">
                  单个设备
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="设备ID" prop="value" v-show="form.range === 2">
              <a-select v-model="form.deviceId">
                <a-select-option  v-for="item in selectData" :key="item.value">
                  {{item.text}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
          <div class="loading" v-show="modelStatus">
            <div class="example">
              <a-spin  tip="正在与设备通信，设置报警值..."/>
            </div>
          </div>
        </a-modal>
      </div>
    </div>
</template>

<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import moment from 'moment'
import {message} from 'antd'
export default {
  name: 'warningSetting',
  computed: {
    // modelStatus
  },
  data () {
    return {
      modelTitle: '新增报警设置',
      keyWord: '',
      modelStatus: false,
      selectData: [],
      moment: moment,
      tableData: [],
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        'id': undefined,
        'alarmName': '',
        'alarmType': 1,
        'type': 'o2',
        'op': 'gt',
        'value': undefined,
        'effectiveTime': undefined,
        'status': true,
        'range': '',
        fluctuate: 0,
        deviceId: ''
      },
      rules: {
        alarmName: [
          { required: true, message: '报警名称不能为空', trigger: 'change' }
        ],
        alarmType: [
          { required: true, message: '报警类型不能为空', trigger: 'change' }
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
      columns: [
        {
          dataIndex: 'alarmName',
          title: '报警名称',
          key: 'alarmName',
          scopedSlots: { customRender: 'alarmName' }
        },
        {
          title: '报警类型',
          dataIndex: 'alarmType',
          key: 'alarmType',
          scopedSlots: { customRender: 'alarmType' }
        },
        {
          title: '报警值',
          dataIndex: 'alarmValue',
          key: 'alarmValue',
          scopedSlots: { customRender: 'alarmValue' }
        },
        {
          title: '回差值',
          dataIndex: 'fluctuate',
          key: 'fluctuate',
          scopedSlots: { customRender: 'fluctuate' }
        },
        {
          title: '生效时间',
          key: 'effectiveTime',
          dataIndex: 'effectiveTime',
          scopedSlots: { customRender: 'effectiveTime' }
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted () {
    this.getDeviceDataList()
    this.getTableDataList()
  },
  methods: {
    // 重置
    reset () {
      this.keyWord = ''
      this.pageNumber = 1
      this.getTableDataList()
    },
    // 获取设备列表
    getDeviceDataList () {
      let url = Urls.deviceUrl.list()
      let data = {
        keyword: this.keyword,
        status: ''
      }
      SqTools.post(url, data)
        .then(res => {
          res.data.data.forEach(i => {
            this.selectData.push(
              {
                'text': i.deviceName,
                'value': i.id
              }
            )
          })
        })
    },
    showModel () {
      this.showEquipment = true
      this.modelTitle = '新建报警设置'
      this.resetForm()
    },
    handleOk () {
      this.showEquipment = false
    },
    handleCancel () {
      this.showEquipment = false
      this.resetForm()
    },
    addAndUpdateMethod () {
      let url = Urls.alarmUrl.saveOrUpdate()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.form.effectiveTime = this.form.effectiveTime ? this.moment(this.form.effectiveTime).format('YYYY-MM-DD  HH:mm:ss') : undefined
          let data = this.form
          this.modelStatus = true
          SqTools.post(url, data)
            .then(res => {
              this.modelStatus = false
              if (res.data.code === 20000) {
                message.success('操作成功！')
                this.showEquipment = false
                this.getTableDataList()
                this.resetForm()
              } else {
                message.error('操作失败！')
              }
            })
            .catch(err => {
              return err
            })
        } else {
          return false
        }
      })
    },
    getTableDataList () {
      let url = Urls.alarmUrl.list()
      let data = {
        'pageNum': this.pageNumber,
        'pageSize': this.pageSize,
        keyword: this.keyWord
      }
      SqTools.post(url, data)
        .then(res => {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.pagination = pagination
          // res.data.data.effectiveTime = moment(res.data.data.effectiveTime).format('YYYY-MM-DD')
          this.tableData = res.data.data
        })
    },
    deleteTableDataList (id) {
      let url = Urls.alarmUrl.delete()
      let data = {
        'id': id
      }
      SqTools.post(url, data)
        .then(res => {
          if (res.data.code === 20000) {
            message.success('操作成功！')
            this.getTableDataList()
          } else {
            message.error('操作失败！')
          }
        })
    },
    getTableDataProfile (id) {
      let url = Urls.alarmUrl.info()
      this.modelTitle = '编辑报警设置'
      let data = {
        'id': id
      }
      SqTools.post(url, data)
        .then(res => {
          this.showEquipment = true
          this.form = res.data.data
        })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.pageNumber = pagination.current
      this.getTableDataList()
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style scoped>
  .warningSetting{
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    padding: 30px;
    box-sizing: border-box;
  }
.search{
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
  .warningRuled{
    width: 100%;
    margin-top: 20px;
    box-sizing: border-box;
  }
  .spanStyle{
    padding: 4px 14px;
    background-color: #2ED47A;
    color: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 6px 18px 0px rgba(0,0,0,0.06);
    cursor: pointer;
  }
  .loading{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9999;
  }
  .example{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
