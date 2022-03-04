<template>
   <div class="role">
     <div class="newUser">
       <a-button @click="showAdd">新增</a-button>
       <a-modal
         width="40%"
         :title="modelTitle"
         :visible="showEquipment"
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
             <a-form-model-item label="角色名称" placeholder="请选择设备编号" prop="roleName">
               <a-input v-model="form.roleName" :disabled="checkStatus"/>
             </a-form-model-item>
             <a-form-model-item label="权限标识" placeholder="请选择设备编号" prop="roleKey">
               <a-input v-model="form.roleKey" :disabled="checkStatus"/>
             </a-form-model-item>
             <a-form-model-item label="菜单权限" prop="menuIds">
               <a-tree
                 :disabled="checkStatus"
                 v-model="form.menuIds"
                 checkable
                 :replaceFields = 'replaceFields'
                 :tree-data="treeData"
                 @select="onCheck"
               />
             </a-form-model-item>
             <a-form-model-item label="显示顺序" prop="roleSort">
               <a-input-number v-model="form.roleSort" :disabled="checkStatus"/>
             </a-form-model-item>
             <a-form-model-item label="状态" placeholder="请选择设备编号" prop="status">
               <a-switch checked-children="开" un-checked-children="关" default-checked :disabled="checkStatus"/>
             </a-form-model-item>
           </a-form-model>
         </div>
         <template slot="footer">
           <a-button @click="handleCancel">取消</a-button>
           <a-button type="primary" @click="addAndUpdateMethod"  v-show="footerStatus">确定</a-button>
         </template>
       </a-modal>
     </div>
     <a-table
       :pagination="pagination"
       @change="handleTableChange"
       :columns="columns"
       :data-source="tableData"
       :rowKey="(record,index)=>{return index}">
       <span slot="dataScope" slot-scope="text">
         {{parseInt(text) === 1 ? '全部数据' : parseInt(text) === 2 ? '自定义数据' : parseInt(text) === 3 ? '本组织数据' : '本组织及以下数据'}}
       </span>
       <span slot="action" slot-scope="text, record">
        <span class="spanStyle" @click="getTableDataProfile(record.roleId)" v-show="record.roleId !== 1 && record.roleId !== 2">编辑</span>
         <a-divider type="vertical"  v-show="record.roleId !== 1 && record.roleId !== 2"/>
        <span class="spanStyle"  style="background-color: #FFB946;"  @click="getTableDataProfile(record.roleId, true)">查看</span>
        <a-divider type="vertical"  v-show="record.roleId !== 1 && record.roleId !== 2"/>
        <a-popconfirm
          v-show="record.roleId !== 1 && record.roleId !== 2"
          title="确认删除吗?"
          @confirm="() => deleteTableDataList(record.roleId)"
        >
              <a href="javascript:;"  style="background-color: #F7685B;" class="spanStyle">删除</a>
          </a-popconfirm>
      </span>
       <span slot="cancel" slot-scope="text, record">
            <a-button @click="buttonControlARole(record)"  v-if="record.roleId !== 1 && record.roleId !== 2">
              {{record.status === 0 ? '启用' : '停用'}}
            </a-button>
         <span v-else>不允许操作</span>
          </span>
     </a-table>
   </div>
</template>

<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import {message} from 'antd'
export default {
  name: 'role',
  data () {
    return {
      footerStatus: true,
      modelTitle: '新增角色',
      replaceFields: {
        key: 'value'
      },
      allSelectMenu: [],
      treeData: [
      ],
      checkStatus: false,
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
          title: '角色名称',
          dataIndex: 'roleName',
          key: 'roleName',
          scopedSlots: { customRender: 'roleName' }
        },
        {
          title: '权限标识',
          dataIndex: 'roleKey',
          key: 'roleKey'
        },
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
        'roleName': '',
        'roleKey': '',
        'roleSort': 1,
        'dataScope': 1,
        'menuCheckStrictly': 0,
        'deptCheckStrictly': 0,
        'status': 0,
        'menuIds': []
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称！', trigger: 'blur' }
        ],
        roleKey: [{ required: true, message: '请输入权限标识！', trigger: 'change' }],
        menuIds: [{ required: true, message: '请选择所属菜单', trigger: 'change' }],
        roleSort: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        dataScope: [{required: true, message: 'Please select at least one activity type', trigger: 'change'}],
        menuCheckStrictly: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
        deptCheckStrictly: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
        status: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getTableDataList()
  },
  methods: {
    buttonControlARole (key) {
      let data = {
        roleId: key.roleId,
        status: key.status === 0 ? 1 : 0
      }
      let url = Urls.roleUrl.changeStatus()
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
    onCheck (checkedKeys, info) {
      if (info.halfCheckedKeys.length > 0) {
        this.allSelectMenu = info.halfCheckedKeys
      }
      this.form.menuIds = checkedKeys
    },
    showAdd () {
      this.showEquipment = true
      this.modelTitle = '新增角色'
      this.footerStatus = true
      this.resetForm()
      this.getTreeList()
    },
    handleCancel () {
      this.showEquipment = false
      this.checkStatus = false
      this.resetForm()
    },
    getTreeList () {
      let url = Urls.menuUrl.treeSelect()
      let data = {
        'menuName': '',
        'visible': 0,
        'status': '0'
      }
      SqTools.post(url, data)
        .then(res => {
          this.treeData = res.data.data
        })
    },
    addAndUpdateMethod () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let url = Urls.roleUrl.saveOrUpdate()
          if (this.allSelectMenu.length) {
            let dd = []
            dd = this.form.menuIds
            this.allSelectMenu.map(i => {
              dd.push(i)
            })
            this.form.menuIds = dd
          }
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
          message.error('请填写完成信息！')
          return false
        }
      })
    },
    getTableDataList () {
      let url = Urls.roleUrl.list()
      let data = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize,
        'roleName': '超级管理员',
        'status': 0,
        'roleKey': 'superAdmin',
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
      let url = Urls.roleUrl.delete() + id
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
        this.modelTitle = '查看角色'
        this.footerStatus = false
      } else {
        this.modelTitle = '编辑角色'
        this.footerStatus = true
      }
      let url = Urls.roleUrl.detail() + id
      SqTools.post(url, {})
        .then(res => {
          this.showEquipment = true
          this.getTreeList()
          this.form = res.data.data
          this.form.dataScope = parseInt(this.form.dataScope)
          this.form.delFlag = parseInt(this.form.delFlag)
          this.form.status = parseInt(this.form.status)
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
  .role{
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
</style>
