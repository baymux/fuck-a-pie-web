<template>
    <div class="equipmentList">
      <div class="search">
        <span>
          <span>
          设备编号：
          <a-input style="width: 200px" v-model="keyword" @change="keyChange"/>
        </span>
        <span style="margin-left: 10px;">
          设备状态：
          <a-select style="width: 200px" v-model="deviceStatus" @change="keyChange">
            <a-select-option :value="0">
              工作
            </a-select-option>
            <a-select-option :value="1">
              离线
            </a-select-option>
            <a-select-option :value="2">
              停机
            </a-select-option>
          </a-select>
        </span>
          <a-button @click="resetAll" style="margin-left: 20px;">重置</a-button>
        </span>
        <span>
          <a-button @click="showAdd" style="margin-right: 10px;">添加设备</a-button>
          <a-modal
            width="60%"
            :title="modelTitle"
            :visible="showEquipment"
            @cancel="handleCancel2"
          >
            <div style="max-height: 500px;overflow: auto;">
              <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <div style="display: flex;justify-content: space-between;">
                  <div class="leftForm" style="width: 50%;">
                    <div style="width:90%;margin-bottom:20px;background: rgba(16,156,241,0.20);color: #448ACA;padding: 10px 10px;">
                      <span style="padding-left: 10px;border-left: 5px solid #428BCB;font-size: 18px;">基本信息</span>
                    </div>
                     <a-form-model-item label="设备编号" prop="deviceCode">
                    <a-input v-model="form.deviceCode" :disabled="checkStatus"/>
                  </a-form-model-item>
                  <a-form-model-item label="设备类型" prop="deviceType">
                    <a-tree-select
                      :disabled="checkStatus"
                      v-model="form.deviceType"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :tree-data="deviceTypeData"
                      placeholder="请选择设备类型"
                      tree-default-expand-all
                    >
                      </a-tree-select>
                  </a-form-model-item>
                  <a-form-model-item label="设备名称" prop="deviceName">
                    <a-input v-model="form.deviceName" :disabled="checkStatus"/>
                  </a-form-model-item>
                  <a-form-model-item label="SN码" prop="sn">
                    <a-input v-model="form.sn" :disabled="checkStatus"/>
                  </a-form-model-item>
                <a-form-model-item label="设备型号" prop="deviceModel">
                    <a-input v-model="form.deviceModel" :disabled="checkStatus"/>
                  </a-form-model-item>
                  <a-form-model-item label="设备厂商" prop="deviceManufacturerId" :disabled="checkStatus">
                      <a-tree-select
                        :disabled="checkStatus"
                        v-model="form.deviceManufacturerId"
                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                        :tree-data="treeData"
                        placeholder="请选择设备厂商"
                        tree-default-expand-all
                      >
                      </a-tree-select>
                  </a-form-model-item>
                  <a-form-model-item label="使用单位" prop="attributionUnitId" :disabled="checkStatus">
                    <a-tree-select
                      :disabled="checkStatus"
                      v-model="form.attributionUnitId"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :tree-data="treeData"
                      placeholder="请选择使用单位"
                      tree-default-expand-all
                    >
                      </a-tree-select>
                  </a-form-model-item>
                  <a-form-model-item label="出厂日期" prop="factoryTime">
                    <a-date-picker
                      :disabled="checkStatus"
                      v-model="form.factoryTime"
                      show-time
                      type="date"
                      placeholder="请选择出厂日期"
                      style="width: 100%;"
                    />
                  </a-form-model-item>
                    <a-form-model-item label="设备照片" prop="desc">
                    <uploadImg @getTreeData='testData'
                               :disabled="checkStatus"
                               :imgListData="{'img':imgList,'status': checkStatus}"></uploadImg>
                  </a-form-model-item>
                  </div>
                  <div class="rightForm" style="width: 50%;padding-left:10px;border-left: 1px solid #2d8cb6;">
                    <div style="width:90%;background: rgba(16,156,241,0.20);margin-bottom:20px;color: #448ACA;padding: 10px 10px;">
                      <span style="padding-left: 10px;border-left: 5px solid #428BCB;font-size: 18px;">设备负责人</span>
                    </div>
                    <a-form-model-item label="责任人" prop="devicePrincipal">
                    <a-input v-model="form.devicePrincipal" :disabled="checkStatus"/>
                  </a-form-model-item>
                <a-form-model-item label="联系电话" prop="contactPhone">
                    <a-input v-model="form.contactPhone" :disabled="checkStatus"/>
                  </a-form-model-item>
                  </div>
                </div>
                </a-form-model>
            </div>
            <template slot="footer">
              <a-button @click="handleCancel2">取消</a-button>
              <a-button type="primary" @click="addAndUpdateMethod"  v-show="footerStatus">确定</a-button>
            </template>
          </a-modal>
          <a-button @click="exportTableDataList">导出数据</a-button>
          <a-modal
            width="30%"
            title="导出数据"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
          >
          <div>
            <span>
              设备类型：
              <a-select default-value="1" style="width: 120px;margin-right: 10px">
                <a-select-option value="1">
                  大坑口
                </a-select-option>
                <a-select-option value="2">
                  小坑口
                </a-select-option>
              </a-select>
            </span>
            <span>
              设备编号：
              <a-select default-value="1" style="width: 120px">
                <a-select-option value="1">
                  BH-2020-98978
                </a-select-option>
              </a-select>
            </span>
            <div style="margin-top: 20px;">
              <a-button style="margin-right: 20px;">导出</a-button>
              <a-button type="primary">全部导出</a-button>
            </div>
          </div>
          </a-modal>
        </span>
      </div>
      <div class="tablePending">
        <div class="mapList">
          <div>
            <div class="title">设备类型</div>
            <div id="map1">
            </div>
          </div>
          <div>
            <div class="title">持有单位</div>
            <div id="map2">
            </div>
          </div>
          <div>
            <div class="title">工作状态</div>
            <div id="map3">
            </div>
          </div>
        </div>
        <a-table
          :pagination="pagination"
          @change="handleTableChange"
          :columns="columns"
          :data-source="tableData"
          :rowKey="(record,index)=>{return index}">
        <span slot="action" slot-scope="text, record">
        <span class="spanStyle" @click="getTableDataProfile(record.id, false)">编辑</span>
          <a-divider type="vertical" />
        <span  class="spanStyle" @click="getTableDataProfile(record.id, true)" style="background-color: #FFB946">查看</span>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确认删除吗?"
          @confirm="() => deleteTableDataList(record.id)"
        >
              <a href="javascript:;"  class="spanStyle"  style="background-color: #F7685B">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
        <span  class="spanStyle" @click="routerLink(record.id)">详情</span>
          <a-divider type="vertical"/>
        <span  class="spanStyle"  style="background-color: #109CF1" @click="showModel1(record.id)" v-if="record.deviceStatus === 0">
          设置
        </span>
          <span  class="spanStyle"  style="background-color: #ccc" v-else>
          设置
        </span>
      </span>
          <span slot="deviceType" slot-scope="text">{{text === 1 ? '标准型' : '标准型'}}</span>
          <span slot="deviceStatus"
                slot-scope="text"
                :style="{color: text === 0 ? '#2ED47A' : text === 1 ? '#F7685B' : '#C2CFE0'}">
            {{text === 0 ? '工作' : text === 1 ? '离线' : '停机'}}
          </span>
        </a-table>
        <a-modal
          style="position: relative"
          :title="modelTitle1"
          :visible="showEquipment1"
          @ok="addAndUpdateMethod1"
          @cancel="handleCancel1"
        >
          <a-form-model
            ref="ruleForm1"
            :model="form1"
            :rules="rules1"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
<!--            <a-form-model-item label="报警名称" prop="alarmName">-->
<!--              <a-input v-model="form1.alarmName"/>-->
<!--            </a-form-model-item>-->
            <a-form-model-item label="报警类型" prop="alarmType">
              <a-select v-model="form1.alarmType">
                <a-select-option :value="1">
                  气体报警
                </a-select-option>
                <a-select-option :value="2">
                  断网断电
                </a-select-option>
              </a-select>
            </a-form-model-item>
<!--            <a-form-model-item label="状态" prop="status">-->
<!--              <a-switch checked-children="开" un-checked-children="关" v-model="form1.status" />-->
<!--            </a-form-model-item>-->
<!--            <a-form-model-item label="生效时间">-->
<!--              <a-date-picker-->
<!--                v-model="form1.effectiveTime"-->
<!--                show-time-->
<!--                type="date"-->
<!--                placeholder="请选择生效时间"-->
<!--              />-->
<!--            </a-form-model-item>-->
            <a-form-model-item label="类型" prop="type">
              <a-select v-model="form1.type" style="width: 80px;">
                <a-select-option value="o2">
                  氧气
                </a-select-option>
                <a-select-option value="co">
                  一氧化碳
                </a-select-option>
                <a-select-option value="ch4">
                  甲烷
                </a-select-option>
                <a-select-option value="h2s">
                  硫化氢
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="操作符" prop="op">
              <a-select v-model="form1.op" style="width: 80px;">
                <a-select-option value="lt">
                  &lt;
                </a-select-option>
                <a-select-option value="gt">
                  &gt;
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="报警值" prop="value">
              <a-input-number :min="0" :max="100" v-model="form1.value" style="width: 100px;"/>
            </a-form-model-item>
            <a-form-model-item label="回差值">
              <a-input-number :min="0" :max="100" v-model="form1.fluctuate" style="width: 100px;"/>
            </a-form-model-item>
<!--            <a-form-model-item label="设置范围" prop="range">-->
<!--              <a-select v-model="form1.range">-->
<!--                <a-select-option :value="1">-->
<!--                  全部-->
<!--                </a-select-option>-->
<!--                <a-select-option :value="2">-->
<!--                  单个设备-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </a-form-model-item>-->
<!--            <a-form-model-item label="设备ID" prop="value" v-show="form1.range === 2">-->
<!--              <a-select v-model="form1.deviceId">-->
<!--                <a-select-option  v-for="item in selectData" :key="item.value">-->
<!--                  {{item.text}}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </a-form-model-item>-->
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
import uploadImg from '../../components/layout/uploadImg'
import moment from 'moment'
import {message} from 'antd'
const echarts = require('echarts')
export default {
  name: 'equipmentList',
  components: {
    uploadImg
  },
  data () {
    let validatePhone1 = (rule, value, callback) => {
      // eslint-disable-next-line
      let reg = /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/
      if (value) {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的联系方式！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      footerStatus: true,
      modelTitle: '新增设备',
      moment: moment,
      deviceStatus: undefined,
      keyword: '',
      deviceTypeData: [],
      checkStatus: false,
      treeData: [
        {
          value: 0,
          title: '主目录',
          children: []
        }
      ],
      imgList: [],
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
      showEquipment: false,
      visible: false,
      columns: [
        {
          dataIndex: 'deviceCode',
          title: '设备编号',
          key: 'deviceCode',
          scopedSlots: { customRender: 'deviceCode' }
        },
        {
          title: '设备类型',
          dataIndex: 'deviceType',
          key: 'deviceType',
          scopedSlots: { customRender: 'deviceType' }
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          key: 'deviceName'
        },
        {
          title: '设备状态',
          key: 'deviceStatus',
          dataIndex: 'deviceStatus',
          scopedSlots: { customRender: 'deviceStatus' }
        },
        {
          title: 'SN码',
          key: 'sn',
          dataIndex: 'sn',
          scopedSlots: { customRender: 'sn' }
        },
        {
          title: '累计工时',
          key: 'workingHours',
          dataIndex: 'workingHours',
          scopedSlots: { customRender: 'workingHours' }
        },
        {
          title: '上次通讯时间',
          key: 'lastCoTime',
          dataIndex: 'lastCoTime',
          scopedSlots: { customRender: 'lastCoTime' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: {
        'id': undefined,
        'deviceCode': '',
        'sn': '',
        'deviceName': '',
        'deviceType': undefined,
        'deviceModel': '',
        'deviceManufacturerId': undefined,
        'attributionUnitId': undefined,
        'factoryTime': null,
        'devicePrincipal': '',
        'contactPhone': ''
      },
      rules: {
        deviceCode: [{ required: true, message: '设备编号不能为空！', trigger: 'change' }],
        deviceName: [{ required: true, message: '设备编名称不能为空！', trigger: 'change' }],
        deviceType: [{
          required: true,
          message: '设备类型不能为空！',
          trigger: 'change'
        }
        ],
        deviceModel: [
          { required: true, message: '设备型号不能为空！', trigger: 'change' }
        ],
        deviceManufacturerId: [{ required: true, message: '设备厂商不能为空！', trigger: 'change' }],
        attributionUnitId: [{ required: true, message: '使用单位不能为空！', trigger: 'change' }],
        factoryTime: [{ required: true, message: '出厂日期不能为空！', trigger: 'change' }],
        contactPhone: [{ validator: validatePhone1, trigger: 'change' }]
      },
      option: {
        color: ['#3BA1FF', '#F2647B', '#4ECB74', '#FBD437'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: 20,
          bottom: 20,
          textStyle: {
            color: '#6A707E'
          }
        },
        series: [{
          type: 'pie',
          roseType: 'radius',
          radius: ['30%', '60%'],
          data: [],
          label: {
            normal: {
              formatter: '{name|{b}}\n\n{font|{c}}{font|({d}%)}',
              rich: {
                name: {
                  fontSize: 12,
                  padding: [2, 0],
                  color: '#6A707E'
                },
                font: {
                  fontSize: 12,
                  padding: [1, 0],
                  color: '#6A707E'
                },
                hr: {
                  height: 0,
                  borderWidth: 1,
                  width: '100%',
                  borderColor: '#6A707E'
                }
              }
            }
          },
          labelLine: {
            lineStyle: {
              color: '#6A707E'
            }
          }
        }]
      },
      option1: {
        color: ['#3BA1FF', '#4ECB74', '#F2647B', '#FBD437'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: 20,
          bottom: 20,
          textStyle: {
            color: '#6A707E'
          }
        },
        series: [{
          type: 'pie',
          roseType: 'radius',
          radius: ['30%', '60%'],
          data: [],
          label: {
            normal: {
              formatter: '{name|{b}}\n\n{font|{c}}{font|({d}%)}',
              rich: {
                name: {
                  fontSize: 12,
                  padding: [2, 0],
                  color: '#6A707E'
                },
                font: {
                  fontSize: 12,
                  padding: [1, 0],
                  color: '#6A707E'
                },
                hr: {
                  height: 0,
                  borderWidth: 1,
                  width: '100%',
                  borderColor: '#6A707E'
                }
              }
            }
          },
          labelLine: {
            lineStyle: {
              color: '#6A707E'
            }
          }
        }]
      },
      option2: {
        color: ['#3BA1FF', '#4ECB74', '#F2647B', '#FBD437'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: 20,
          bottom: 20,
          textStyle: {
            color: '#6A707E'
          }
        },
        series: [{
          type: 'pie',
          roseType: 'radius',
          radius: ['30%', '60%'],
          data: [],
          label: {
            normal: {
              formatter: '{name|{b}}\n\n{font|{c}}{font|({d}%)}',
              rich: {
                name: {
                  fontSize: 12,
                  padding: [2, 0],
                  color: '#6A707E'
                },
                font: {
                  fontSize: 12,
                  padding: [1, 0],
                  color: '#6A707E'
                },
                hr: {
                  height: 0,
                  borderWidth: 1,
                  width: '100%',
                  borderColor: '#6A707E'
                }
              }
            }
          },
          labelLine: {
            lineStyle: {
              color: '#6A707E'
            }
          }
        }]
      },
      form1: {
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
      rules1: {
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
      modelTitle1: '新增报警设置',
      modelStatus: false,
      showEquipment1: false
    }
  },
  mounted () {
    this.getTableDataList()
    this.getMapData()
  },
  methods: {
    resetAll () {
      this.deviceStatus = undefined
      this.keyword = ''
      this.pageNumber = 1
      this.pagination.current = 1
      this.getTableDataList()
    },
    keyChange () {
      this.pageNumber = 1
      this.pagination.current = 1
      this.getTableDataList()
    },
    getSelectTree () {
      let url = Urls.organizationUrl.treeSelect()
      SqTools.post(url, {})
        .then(res => {
          this.treeData[0].children = res.data.data
        })
    },
    getDeviceType () {
      let url = Urls.deviceUrl.deviceTypeTree()
      SqTools.post(url, {})
        .then(res => {
          this.deviceTypeData = res.data.data
        })
    },
    testData (data) {
      this.imgList = data
    },
    showAdd () {
      this.showEquipment = true
      this.modelTitle = '新建设备'
      this.footerStatus = true
      this.getSelectTree()
      this.getDeviceType()
      this.resetForm()
    },
    handleOk () {
      this.visible = false
    },
    handleCancel () {
      this.visible = false
    },
    handleCancel2 () {
      this.showEquipment = false
      this.checkStatus = false
      this.resetForm()
    },
    routerLink (ID) {
      this.$router.push({
        path: '/equipmentBaseInfo', // 跳转的路径
        query: {
          id: ID
        }
      })
    },
    addAndUpdateMethod () {
      let url = Urls.deviceUrl.saveOrUpdate()
      let formData = new FormData()
      for (let i = 0; i < this.imgList.length; i++) {
        formData.append('imgs', this.imgList[i].file)
      }
      this.form.factoryTime = this.moment(this.form.factoryTime).format('YYYY-MM-DD HH:mm:ss')
      formData.append('deviceInfo', new Blob([JSON.stringify(this.form)],
        {
          type: 'application/json'
        }))
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          SqTools.post(url, formData)
            .then(res => {
              if (res.data.code === 20000) {
                this.showEquipment = false
                message.success('操作成功！')
                this.getTableDataList()
                this.resetForm()
              } else {
                message.error('操作失败！')
              }
            })
        } else {
          message.error('请填写完整信息！')
          return false
        }
      })
    },
    getTableDataList () {
      let url = Urls.deviceUrl.list()
      let data = {
        'pageNum': this.pageNumber,
        'pageSize': this.pageSize,
        keyword: this.keyword,
        status: this.deviceStatus
      }
      SqTools.post(url, data)
        .then(res => {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.pagination = pagination
          this.tableData = res.data.data
        })
    },
    deleteTableDataList (id) {
      let url = Urls.deviceUrl.delete()
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
    getTableDataProfile (id, status) {
      this.checkStatus = status
      if (status) {
        this.modelTitle = '查看设备'
        this.footerStatus = false
      } else {
        this.modelTitle = '编辑设备'
        this.footerStatus = true
      }
      this.getSelectTree()
      this.getDeviceType()
      let url = Urls.deviceUrl.info()
      let data = {
        'id': id
      }
      SqTools.post(url, data)
        .then(res => {
          this.showEquipment = true
          this.form = res.data.data
          this.imgList = res.data.data.imgs
        })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.pageNumber = pagination.current
      this.getTableDataList()
    },
    exportTableDataList () {
      let url = Urls.deviceUrl.export()
      let data = {
      }
      SqTools.getFile(url, data)
        .then(res => {
          // ArrayBuffer 转为 Blob
          let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

          let objectUrl = URL.createObjectURL(blob)
          window.location.href = objectUrl
        })
    },
    resetForm () {
      this.form.id = undefined
      this.form.deviceCode = ''
      this.form.sn = ''
      this.form.deviceName = ''
      this.form.deviceType = undefined
      this.form.deviceModel = ''
      this.form.deviceManufacturerId = undefined
      this.form.attributionUnitId = undefined
      this.form.factoryTime = null
      this.form.devicePrincipal = ''
      this.form.contactPhone = ''
      this.imgList = []
    },
    getMapData () {
      let url = Urls.deviceUrl.statistics()
      let data = {
      }
      SqTools.post(url, data)
        .then(res => {
          // let data = res.data.data.deviceTypes
          let myChart = echarts.init(document.getElementById('map2'))
          this.option.series[0].data = res.data.data.attributionUnits
          myChart.setOption(this.option)
          let myChart1 = echarts.init(document.getElementById('map3'))
          let data = []
          let colorList = []
          for (let i = 0; i < res.data.data.workStatus.length; i++) {
            data.push(
              {
                name: res.data.data.workStatus[i].name === 0 ? '工作' : res.data.data.workStatus[i].name === 1 ? '离线' : '停机',
                value: res.data.data.workStatus[i].value
              }
            )
            if (res.data.data.workStatus[i].name === 0) {
              colorList.push('#4ECB74')
            } else if (res.data.data.workStatus[i].name === 1) {
              colorList.push('#F2647B')
            } else {
              colorList.push('#C2CFE0')
            }
          }
          this.option1.series[0].data = data
          this.option1.color = colorList
          myChart1.setOption(this.option1)
          let myChart2 = echarts.init(document.getElementById('map1'))
          this.option2.series[0].data = res.data.data.deviceTypes
          myChart2.setOption(this.option2)
        })
    },
    showModel1 (id) {
      this.showEquipment1 = true
      this.modelTitle1 = '新建报警设置'
      this.form1.deviceId = id
    },
    handleOk1 () {
      this.showEquipment1 = false
    },
    handleCancel1 () {
      this.showEquipment1 = false
    },
    addAndUpdateMethod1 () {
      let url = Urls.alarmUrl.saveOrUpdate()
      this.$refs.ruleForm1.validate(valid => {
        if (valid) {
          // this.form1.effectiveTime = this.form1.effectiveTime ? this.moment(this.form1.effectiveTime).format('YYYY-MM-DD  HH:mm:ss') : undefined
          let data = this.form1
          this.modelStatus = true
          SqTools.post(url, data)
            .then(res => {
              this.modelStatus = false
              if (res.data.code === 20000) {
                message.success('操作成功！')
                this.showEquipment1 = false
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
    }
  }
}
</script>

<style scoped>
  .equipmentList{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    padding: 20px 30px;
    box-sizing: border-box;
  }
  .search{
    width: 100%;
    height: 60px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tablePending{
    width: 100%;
    height: calc(100% - 100px);
    margin-top: 40px;
  }
  .mapList{
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: space-between;
    align-items:center ;
    margin-bottom: 40px;
  }
  .mapList>div{
    width: calc(33% - 10px);
    height: 200px;
  }
  .mapList>div>div:nth-child(2){
    width: 100%;
    height: calc(100% - 35px);
  }
  .title{
    color: #6A707E;
    font-size: 18px;
    font-weight: 700;
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
