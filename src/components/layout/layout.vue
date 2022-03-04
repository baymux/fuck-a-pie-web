<template>
  <div class="layout">
    <a-layout>
      <a-layout-sider>
        <commonMenu></commonMenu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header>
          <span class="headerName">深基坑作业智能一体化平台</span>
          <span class="userSetting">
            <a-dropdown>
              <a-avatar size="large" icon="user" />
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="logout">退出</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <span class="userInfo">
              <i>{{userName}}</i>
              <i style="color: #C8C8C8">{{organizationName}}</i>
            </span>
          </span>
        </a-layout-header>
        <a-layout-content>
          <keep-alive>
            <router-view :key="$route.fullPath"/>
          </keep-alive>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import commonMenu from './commonMenu'
export default {
  name: 'layout',
  components: {
    commonMenu
  },
  data () {
    return {
      userName: sessionStorage.getItem('realName'),
      organizationName: sessionStorage.getItem('organizationName')
    }
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push({
        path: '/login' // 跳转的路径
      })
      // location.reload()
    }
  }
}
</script>
<style scoped>
  .layout{
    width: 100%;
    height: 100%;
  }
  .layout>>>.ant-layout.ant-layout-has-sider {
    box-sizing: border-box;
    height: 100%;
    background-color: #527DED;
  }
  .layout>>>.ant-layout-sider {
    position: relative;
    min-width: 0;
    background: #527DED;
    transition: all .2s;
    height: 100%;
    width: 120px !important;
    max-width: 120px !important;
    min-width: 120px !important;
    flex: 0 0 120px;
  }
  .layout>>>.ant-layout-header {
    height: 72px;
     padding: 0;
    line-height: 72px;
    background: #ffffff;
    border-top-left-radius: 50px;
    box-shadow: 0px 4px 4px 0px rgba(221,221,221,0.25);
  }
  .layout>>>.ant-layout {
    background: #527DED;
  }
  .layout>>>.ant-layout-content {
   background-color: #F1F2F4;
    border-bottom-left-radius: 50px;
    padding: 40px;
    box-sizing: border-box;
  }
  .headerName{
    font-size: 32px;
    font-weight: 700;
    color: #000000;
    background-color: transparent;
    margin-left: 50px;
  }
  .userSetting{
    float: right;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    margin-right: 60px;
  }
  .userInfo{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    line-height: 22px;
    margin-left: 20px;
  }
  .userInfo>i{
    font-style: normal;
    color: #192a3e;
    /*display: block;*/
  }
</style>
