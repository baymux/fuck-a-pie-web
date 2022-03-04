<template>
    <div class="user">
      <div class="menuList">
        <a-tree
          default-expand-all
          :show-line="showLine"
          :show-icon="showIcon"
          :tree-data="treeData"
          @select="onSelect"
        >
        </a-tree>
      </div>
      <div class="content">
        <div class="newUser">
          <a-button @click="showAdd" v-show="form.organizationId || form.organizationId === 0">新增</a-button>
          <a-modal
            width="40%"
            :title="modelTitle"
            :visible="showEquipment"
            @ok="addAndUpdateMethod"
            @cancel="handleCancel"
          >
            <div>
              <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item label="用户昵称" prop="nickName">
                  <a-input v-model="form.nickName" :disabled="checkStatus"/>
                </a-form-model-item>
                <a-form-model-item label="用户名" prop="userName">
                  <a-input v-model="form.userName" :disabled="checkStatus"/>
                </a-form-model-item>
                <a-form-model-item label="用户密码" prop="password">
                  <a-tooltip placement="right">
                    <template slot="title">
                      <span>密码8-20个字符，包含大小写字母、数字和特殊字符</span>
                    </template>
                    <a-input-password v-model="form.password" :disabled="checkStatus"/>
                  </a-tooltip>
                </a-form-model-item>
                <a-form-model-item label="联系方式" placeholder="请选择设备编号" prop="phone">
                  <a-input v-model="form.phone" :disabled="checkStatus"/>
                </a-form-model-item>
                <a-form-model-item label="用户类型" prop="userType">
                  <a-select v-model="form.userType" :disabled="checkStatus">
                    <a-select-option :value="0">
                      系统用户
                    </a-select-option>
                    <a-select-option :value="1">
                      临时用户
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="角色" prop="roleId">
                  <a-select v-model="form.roleIds" :disabled="checkStatus">
                    <a-select-option v-for="item in roleData" :key="item.roleId" :value="item.roleId">
                      {{item.roleName}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="状态" placeholder="请选择设备编号" prop="status">
                  <a-switch checked-children="开" un-checked-children="关" default-checked :disabled="checkStatus" v-model="form.status"/>
                </a-form-model-item>
              </a-form-model>
            </div>
            <template slot="footer">
              <a-button @click="handleCancel">取消</a-button>
              <a-button type="primary" @click="addAndUpdateMethod"  v-show="footerStatus">确定</a-button>
            </template>
          </a-modal>
          <a-input-search v-model="userName" @change="searchName" placeholder="请输入用户名" style="width: 300px;float: right;margin-bottom: 20px;"/>
        </div>
        <a-table
          :pagination="pagination"
          @change="handleTableChange"
          :columns="columns"
          :data-source="tableData"
          :rowKey="(record,index)=>{return index}">
        <span slot="action" slot-scope="text, record">
        <span class="spanStyle" @click="getTableDataProfile(record.userId)"  v-show="record.roles[0].roleName !== '管理员' && record.roles[0].roleName !== '超级管理员'">编辑</span>
          <a-divider type="vertical"  v-show="record.roles[0].roleName !== '管理员' && record.roles[0].roleName !== '超级管理员'"/>
        <span class="spanStyle"  style="background-color: #FFB946;"  @click="getTableDataProfile(record.userId, true)" >查看</span>
        <a-divider type="vertical"  v-show="record.roles[0].roleName !== '管理员' && record.roles[0].roleName !== '超级管理员'"/>
        <a-popconfirm
          v-show="record.roles[0].roleName !== '管理员' && record.roles[0].roleName !== '超级管理员'"
          title="确认删除吗?"
          @confirm="() => deleteTableDataList(record.userId)"
        >
              <a href="javascript:;"  style="background-color: #F7685B;" class="spanStyle">删除</a>
          </a-popconfirm>
      </span>
          <span slot="organizationName" slot-scope="text, record">{{record.dept.organizationName}}</span>
          <span slot="roleName" slot-scope="text, record">{{record.roles[0].roleName}}</span>
          <span slot="cancel" slot-scope="text, record">
            <a-button @click="buttonControlARole(record)"  v-if="record.roles[0].roleName !== '管理员' && record.roles[0].roleName !== '超级管理员'">
              {{record.status === 0 ? '启用' : '停用'}}
            </a-button>
            <span v-else>不允许操作</span>
          </span>
        </a-table>
      </div>
    </div>
</template>

<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import {message} from 'antd'
export default {
  name: 'user',
  data () {
    let validatePass = (rule, value, callback) => {
      let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}/
      if (value === '') {
        callback(new Error('请输入密码！'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确格式的密码！'))
      } else {
        callback()
      }
    }
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
    return {
      footerStatus: true,
      modelTitle: '新增用户',
      showLine: true,
      showIcon: false,
      checkStatus: false,
      roleData: [],
      treeData: [
        {
          value: 0,
          title: '主目录',
          children: []
        }
      ],
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
      columns: [
        {
          title: '用户名',
          dataIndex: 'userName',
          key: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '组织机构',
          dataIndex: 'organizationName',
          key: 'organizationName',
          scopedSlots: { customRender: 'organizationName' }
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
          scopedSlots: { customRender: 'roleName' }
        },
        // {
        //   title: '联系方式',
        //   dataIndex: 'phone',
        //   key: 'phone',
        //   scopedSlots: { customRender: 'phone' }
        // },
        {
          title: '状态',
          dataIndex: 'cancel',
          key: 'cancel',
          scopedSlots: { customRender: 'cancel' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: {
        'organizationId': undefined,
        'userName': '',
        'nickName': '',
        'password': '',
        'userType': 0,
        'phone': '',
        'status': true,
        'roleIds': undefined
      },
      userName: '',
      rules: {
        // organizationId: [{ required: true, message: '请选择所属组织机构！', trigger: 'change' }],
        userName: [{ required: true, message: '请填写用户名！', trigger: 'change' }],
        password: [{ required: true, validator: validatePass, trigger: 'change' }],
        phone: [{ validator: validatePhone, trigger: 'change' }],
        status: [{ required: true, trigger: 'blur' }]
      },
      selectTreeValue: undefined
    }
  },
  mounted () {
    this.getTableDataList()
    this.getSelectTree()
  },
  methods: {
    buttonControlARole (key) {
      let data = {
        userId: key.userId,
        status: key.status === 0 ? 1 : 0
      }
      let url = Urls.userUrl.changeStatus()
      SqTools.post(url, data)
        .then(res => {
          if (res.data.code === 20000) {
            message.success('操作成功！')
            this.getTableDataList()
          } else {
            message.error('操作失败！')
          }
          console.log(res)
        })
    },
    searchName () {
      this.pageNumber = 1
      this.getTableDataList()
    },
    onSelect (selectedKeys, info) {
      console.log(selectedKeys)
      this.form.organizationId = info.node.value
      this.getTableDataList()
    },
    showAdd () {
      this.showEquipment = true
      this.modelTitle = '新建用户'
      this.footerStatus = true
      this.getRoleList()
      this.resetForm()
    },
    handleCancel () {
      this.showEquipment = false
      this.checkStatus = false
      this.resetForm()
    },
    getRoleList () {
      let url = Urls.roleUrl.list()
      let data = {
        // "pageNum": 1,
        // "pageSize": 10,
        'roleName': '',
        'status': 0,
        'roleKey': '',
        'params': {
          'beginTime': '',
          'endTime': ''
        }
      }
      SqTools.post(url, data)
        .then(res => {
          this.roleData = res.data.data
        })
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
          let url = Urls.userUrl.saveOrUpdate()
          this.form.roleIds = [this.form.roleIds]
          this.form.status = this.form.status === true ? 1 : 0
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
            })
        } else {
          message.error('请填写完成信息！')
          return false
        }
      })
    },
    getTableDataList () {
      let url = Urls.userUrl.users()
      let data = {
        'pageNum': this.pageNumber,
        'pageSize': this.pageSize,
        'userName': this.userName,
        'status': undefined,
        'phone': '',
        organizationId: this.form.organizationId,
        'params': {
          'beginTime': '',
          'endTime': ''
        }
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
      let url = Urls.userUrl.delete()
      SqTools.post(url, {'userIds': id})
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
        this.modelTitle = '查看用户'
        this.footerStatus = false
      } else {
        this.modelTitle = '编辑用户'
        this.footerStatus = true
      }
      let url = Urls.userUrl.detail() + id
      SqTools.post(url, {})
        .then(res => {
          this.showEquipment = true
          this.getRoleList()
          this.form = res.data.data
          if (this.form.status === 1) {
            this.form.status = true
          } else {
            this.form.status = false
          }
          this.form.roleIds = res.data.data.roleIds[0]
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
  .user{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  .menuList{
    width: 200px;
    height: 100%;
    border-right: 1px dashed #109CF1;
  }
  .content{
    width: calc(100% - 20px);
    padding-left: 20px;
    box-sizing: border-box;
  }
  .user>>>.ant-tree.ant-tree-show-line li span.ant-tree-switcher {
    background: transparent;
  }
  .user>>>.ant-tree li .ant-tree-node-content-wrapper {
    color: #4F4F4F;
    font-size: 16px;
  }
  .user>>>.ant-tree li .ant-tree-node-content-wrapper:hover {
    background-color: #109CF1;
    color: #ffffff;
  }
  .user>>>.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #109CF1;
    color: #ffffff;
  }
  .spanStyle{
    padding: 4px 14px;
    background-color: #2ED47A;
    color: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 6px 18px 0px rgba(0,0,0,0.06);
    cursor: pointer;
  }
</style>
