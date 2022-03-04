<template>
    <div class="login">
      <div class="content">
        <h1 style="margin-bottom: 30px;">用户登录</h1>
        <a-input
          placeholder="请输入用户名"
          auto-complete="off"
          v-model="userName"
          @blur="onBlur(1)"
        />
        <a-input
          type="password"
          placeholder="请输入密码"
          auto-complete="off"
          style="margin: 10px 0"
          v-model="userPassword"
          @blur="onBlur(2)"
        />
<!--        <a-input
          placeholder="请输入验证码"
          style="width: calc(100% - 150px);vertical-align: middle;"
          auto-complete="off"
          v-model="userCode"
          @blur="onBlur(3)"
        />
        <img :src="codeUrl" @click="getVerificationCode" alt style="margin-left: 10px;height: 44px;" />-->
        <span style="width: 100%;display: inline-block;color: red;">{{errorInfo}}</span>
<!--        <span class="savePassword">-->
<!--          <a-checkbox>记住密码</a-checkbox>-->
<!--        </span>-->
        <span class="checkLogin">
          <a-button block @click="getLoginUser">登录</a-button>
        </span>
      </div>
    </div>
</template>

<script>
import SqTools from '../../assets/js/SqTools'
import Urls from '../../assets/js/Urls'

export default {
  name: 'login',
  data () {
    return {
      userName: '',
      userPassword: '',
      userCode: '',
      userUuid: '',
      codeUrl: '',
      errorInfo: ''
    }
  },
  mounted () {
    this.getVerificationCode()
    window.addEventListener('keydown', this.keyDown)
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyDown, false)
  },
  methods: {
    keyDown (e) {
      // 如果是回车则执行登录方法
      if (e.keyCode === 13) {
        this.getLoginUser()
      }
    },
    getRouterList () {
      let url = Urls.loginUrl.getRouters()
      SqTools.get(url, 1)
        .then(res => {
          sessionStorage.setItem('menuList', JSON.stringify(res.data.data))
          this.getUserInfo()
        })
    },
    getVerificationCode () {
      let url = Urls.loginUrl.captchaImage()
      SqTools.get(url)
        .then(res => {
          this.codeUrl = 'data:image/png;base64,' + res.data.img
          this.userUuid = res.data.uuid
        })
    },
    getLoginUser () {
      if (this.userName && this.userPassword) {
        let url = Urls.loginUrl.login()
        let data = {
          'userName': this.userName,
          'password': this.userPassword
        }
        SqTools.post(url, data, 1)
          .then(res => {
            if (res.data.code === 20000) {
              sessionStorage.setItem('token', res.data.data.token)
              this.getRouterList()
            } else {
              this.errorInfo = res.data.msg
              // this.getVerificationCode()
            }
          })
      }
    },
    onBlur (type) {
      if (type === 1 && !this.userName) {
        this.errorInfo = '用户名不能为空！'
      } else if (type === 2 && !this.userPassword) {
        this.errorInfo = '密码不能为空！'
      } else if (type === 3 && !this.userCode) {
        this.errorInfo = '验证码不能为空！'
      }
    },
    getUserInfo () {
      let url = Urls.loginUrl.getInfo()
      SqTools.get(url, 1)
        .then(res => {
          this.$router.push({
            path: '/index' // 跳转的路径
          })
          sessionStorage.setItem('realName', res.data.user.nickName)
          sessionStorage.setItem('organizationName', res.data.user.organizationName)
        })
    }
  }
}
</script>

<style scoped>
.login{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
}
.content {
  width: 26%;
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
  padding: 30px;
  margin-right: 230px;
  box-sizing: border-box;
  height: 423px;
  color: #ffffff;
}
.checkNumber span {
  border-left: 1px solid #d9d9d9;
}
  .content>>>.ant-input {
    height: 44px;
  }
  .content>>>.ant-btn {
    height: 44px;
    color: #ffffff;
    background-color: #527DED;
    border: 1px solid #527DED;
    margin-top: 10px;
  }
</style>
