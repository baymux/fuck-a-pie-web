<template>
  <div class="organization">
    <div class="newUser">
      <a-button @click="showAdd">新增</a-button>
      <a-modal
        width="40%"
        :title="modelTitle"
        :visible="showEquipment"
        @cancel="handleCancel2"
      >
        <div class="modelDiv">
          <a-form-model
            ref="ruleForm"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :model="form"
            :rules="rules"
            width="50%"
          >
            <a-row>
              <a-col span="12">
                <a-form-model-item label="父组织机构" prop="parentId">
                  <a-tree-select
                    :disabled="checkStatus"
                    v-model="form.parentId"
                    style="width: 208px;"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :tree-data="treeData"
                    placeholder="Please select"
                    tree-default-expand-all
                  >
                  </a-tree-select>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="组织机构名称" prop="organizationName">
                  <a-input v-model="form.organizationName" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="组织机构类型" prop="organizationType">
                  <a-select v-model="form.organizationType" :disabled="checkStatus" style="width: 208px;">
                    <a-select-option :value="1">
                      厂商
                    </a-select-option>
                    <a-select-option :value="2">
                      公司
                    </a-select-option>
                    <a-select-option :value="3">
                      项目
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="联系人" prop="contactPerson">
                  <a-input v-model="form.contactPerson" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="联系电话" prop="tel">
                  <a-input v-model="form.tel" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="显示顺序" prop="orderNum">
                  <a-input-number v-model="form.orderNum" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="详细地址" prop="address">
                  <a-textarea v-model="form.address" :auto-size="{ minRows: 3, maxRows: 5 }" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="简介" prop="organizationIntroduction">
                  <a-textarea v-model="form.organizationIntroduction" :auto-size="{ minRows: 3, maxRows: 5 }" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="统一社会信用代码" prop="socialCreditCode" v-show="form.organizationType === 2">
                  <a-input v-model="form.socialCreditCode" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="组织机构代码" prop="organizationCode" v-show="form.organizationType === 2">
                  <a-input v-model="form.organizationCode" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="注册时间" prop="registrationTime" v-show="form.organizationType === 2">
                  <a-date-picker
                    v-model="form.registrationTime"
                    show-time
                    type="date"
                    style="width: 208px;"
                    placeholder="请选择注册时间"
                    :disabled="checkStatus"
                  />
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="经营范围" prop="businessScope" v-show="form.organizationType === 2">
                  <a-input v-model="form.businessScope" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="法人姓名" prop="legalPersonName" v-show="form.organizationType === 2">
                  <a-input v-model="form.legalPersonName" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="法人电话" prop="legalPersonPhone" v-show="form.organizationType === 2">
                  <a-input v-model="form.legalPersonPhone" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="项目编码" prop="projectCode" v-show="form.organizationType === 3">
                  <a-input v-model="form.projectCode" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="项目造价" prop="projectCost" v-show="form.organizationType === 3">
                  <a-input v-model="form.projectCost" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="施工许可证" prop="constructionPermit" v-show="form.organizationType === 3">
                  <a-input v-model="form.constructionPermit" style="width: 208px;" :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="开工日期" prop="startDate" v-show="form.organizationType === 3">
                  <a-date-picker
                    v-model="form.startDate"
                    show-time
                    type="date"
                    style="width: 208px;"
                    placeholder="请选择开工日期"
                    :disabled="checkStatus"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-form-model-item label="状态" prop="status" style="justify-content: flex-start;padding-left: 36px;">
                  <a-switch checked-children="正常" un-checked-children="停用" default-checked :disabled="checkStatus"/>
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item label="竣工日期" prop="completionDate" v-show="form.organizationType === 3">
                  <a-date-picker
                    v-model="form.completionDate"
                    show-time
                    type="date"
                    style="width: 208px;"
                    placeholder="请选择竣工日期"
                    :disabled="checkStatus"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <template slot="footer">
          <a-button @click="handleCancel2">取消</a-button>
          <a-button type="primary" @click="addAndUpdateMethod"  v-show="footerStatus">确定</a-button>
        </template>
      </a-modal>
<!--      <a-input-search placeholder="请输入关键字" style="width: 300px;float: right;"/>-->
    </div>
    <a-table
      :pagination=false
      childrenColumnName="children"
     :columns="columns"
     :data-source="tableData"
     :rowKey="(record,index)=>{return index}"
    >
      <span slot="organizationType" slot-scope="text, record">{{text === 1 ? '厂商' : text === 2 ? '公司 ' : '项目'}}</span>
      <span slot="action" slot-scope="text, record">
        <span class="spanStyle" @click="getTableDataProfile(record.organizationId, false)">编辑</span>
        <a-divider type="vertical" />
        <span class="spanStyle" @click="getTableDataProfile(record.organizationId, true)" style="background-color: #FFB946;">查看</span>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确认删除吗?"
          @confirm="() => deleteTableDataList(record.organizationId)"
        >
              <a href="javascript:;"  style="background-color: #F7685B;" class="spanStyle">删除</a>
          </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
import SqTools from '../../assets/js/SqTools'
import Urls from '../../assets/js/Urls'
import {message} from 'antd'
export default {
  name: 'organization',
  data () {
    let validatePhone = (rule, value, callback) => {
      // eslint-disable-next-line
      let reg = /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/
      if (value === '') {
        callback(new Error('请输入联系方式！'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的联系方式！'))
      } else {
        callback()
      }
    }
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
      modelTitle: '新增组织机构',
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      checkStatus: false,
      treeData: [
        {
          value: 0,
          title: '主目录',
          children: []
        }
      ],
      showEquipment: false,
      columns: [
        {
          title: '组织机构名称',
          dataIndex: 'organizationName',
          key: 'organizationName',
          scopedSlots: { customRender: 'organizationName' }
        },
        {
          title: '组织机构类型',
          dataIndex: 'organizationType',
          key: 'organizationType',
          scopedSlots: { customRender: 'organizationType' }
        },
        {
          title: '联系人',
          dataIndex: 'contactPerson',
          key: 'contactPerson'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      form: {
        'organizationId': undefined,
        'parentId': 0,
        'organizationName': '',
        'organizationType': 1,
        'contactPerson': '',
        'tel': '',
        'orderNum': 0,
        'status': 0,
        'address': '',
        'organizationIntroduction': '',
        socialCreditCode: '',
        organizationCode: '',
        registrationTime: null,
        businessScope: '',
        legalPersonName: '',
        legalPersonPhone: '',
        projectCode: '',
        projectCost: '',
        constructionPermit: '',
        startDate: null,
        completionDate: null
      },
      rules: {
        // parentId: [{ required: true, message: 'Please input Activity name', trigger: 'change' }],
        organizationName: [{ required: true, message: '请输入组织机构名称', trigger: 'change' }],
        organizationType: [{ required: true, message: '请输入组织机构类型', trigger: 'change' }],
        contactPerson: [{required: true, message: '请输入联系人名称', trigger: 'change'}],
        tel: [{ required: true, validator: validatePhone, trigger: 'change' }],
        orderNum: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
        status: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
        legalPersonPhone: [{ validator: validatePhone1, trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.getTableDataList()
  },
  methods: {
    handleTree (data, id, parentId, children) {
      let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
      }

      var childrenListMap = {}
      var nodeIds = {}
      var tree = []

      for (let d of data) {
        let parentId = d[config.parentId]
        if (childrenListMap[parentId] == null) {
          childrenListMap[parentId] = []
        }
        nodeIds[d[config.id]] = d
        childrenListMap[parentId].push(d)
      }

      for (let d of data) {
        let parentId = d[config.parentId]
        if (nodeIds[parentId] == null) {
          tree.push(d)
        }
      }

      for (let t of tree) {
        adaptToChildrenList(t)
      }

      function adaptToChildrenList (o) {
        if (childrenListMap[o[config.id]] !== null) {
          o[config.childrenList] = childrenListMap[o[config.id]]
        }
        if (o[config.childrenList]) {
          for (let c of o[config.childrenList]) {
            adaptToChildrenList(c)
          }
        }
      }
      return tree
    },
    showAdd () {
      this.showEquipment = true
      this.getSelectTree()
      this.resetForm()
      this.modelTitle = '新建组织机构'
      this.footerStatus = true
    },
    handleCancel2 () {
      this.showEquipment = false
      this.checkStatus = false
      this.resetForm()
    },
    getSelectTree () {
      let url = Urls.organizationUrl.treeSelect()
      SqTools.post(url, {})
        .then(res => {
          this.treeData[0].children = res.data.data
        })
    },
    addAndUpdateMethod () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let url = Urls.organizationUrl.saveOrUpdate()
          let data = this.form
          SqTools.post(url, data)
            .then(res => {
              if (res.data.code === 20000) {
                this.showEquipment = false
                message.success('操作成功！')
                this.getTableDataList()
              } else {
                message.error('操作失败！')
              }
              console.log(res)
            })
        } else {
          message.error('请填写完整信息！')
          return false
        }
      })
    },
    getTableDataList () {
      let url = Urls.organizationUrl.list()
      // let data = {
      //   'parentId': 1,
      //   'organizationName': '思极飞天',
      //   'status': 0
      // }
      SqTools.post(url, {})
        .then(res => {
          this.tableData = this.handleTree(res.data.data, 'organizationId')
        })
    },
    deleteTableDataList (id) {
      let url = Urls.organizationUrl.remove() + id
      SqTools.post(url, {})
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
        this.modelTitle = '查看组织机构'
        this.footerStatus = false
      } else {
        this.modelTitle = '编辑组织机构'
        this.footerStatus = true
      }
      let url = Urls.organizationUrl.organizationId() + id
      SqTools.post(url, {})
        .then(res => {
          this.showEquipment = true
          this.getSelectTree()
          this.form = res.data.data
        })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style scoped>
  .organization{
    width: 100%;
    height: 100%;
  }
  .newUser{
    margin-bottom: 20px;
  }
  .spanStyle{
    padding: 4px 14px;
    background-color: #2ED47A;
    color: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 6px 18px 0px rgba(0,0,0,0.06);
    cursor: pointer;
  }
  .modelDiv{
    width: 100%;
    max-height: 500px;
    overflow: auto;
  }
</style>
