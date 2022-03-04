<template>
    <div class="indexMenu">
      <div class="left">
        <div class="title">
          设备列表
        </div>
        <div class="leftMenuList">
          <div class="search">
            <a-input-search
              placeholder="请输入设备编号"
              enter-button="搜索"
              size="large"
              v-model="keyword"
              @search="getTableDataList"
            >
              <a-icon slot="prefix" type="search" />
            </a-input-search>
          </div>
          <div class="operateStatus">
            <div class="statusSpan">
            <span
              @click="changSpanStatus(10)"
              :class="{activeAllSpanBg: spanStatus === 10}">
              全部
            </span>
              <span @click="changSpanStatus(0)" :class="{activeFirstSpanBg: spanStatus === 0}"
              >工作</span>
              <span @click="changSpanStatus(1)" :class="{activeSecondSpanBg: spanStatus === 1}"
              >离线</span>
              <span @click="changSpanStatus(2)" :class="{activeThirdSpanBg: spanStatus === 2}"
              >停机</span>
            </div>
            <div class="operateList" v-if="tableData.length">
            <span
              @click="routerLink(item.id)"
              v-for="item in tableData"
              :key="item.id"
              :class="{activeSpanBg: spanImgStatus === item.id}"
            >
              <i :style="{backgroundColor: item.deviceStatus === 0 ? '#2ED47A' : item.deviceStatus === 1 ? '#F7685B' : '#C2CFE0'}"></i>
              <b>{{item.deviceName}}</b>
            </span>
            </div>
            <a-empty   :image="simpleImage" v-else style="margin-top: 100px;"/>
          </div>
          <div class="nowDeviceNumber">
            <a-icon type="exclamation-circle" />
            当前设备{{deviceNumber}}台
          </div>
        </div>
      </div>
      <div class="contentRight">
        <keep-alive>
          <router-view :key="$route.fullPath" ref="myChild"/>
        </keep-alive>
      </div>
    </div>
</template>

<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import { Empty } from 'antd'
export default {
  name: 'indexMenu',
  data () {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      deviceNumber: 0,
      tableData: [],
      placement: 'left',
      spanStatus: 10, // 默认全选
      spanImgStatus: parseInt(sessionStorage.getItem('spanStatus')),
      keyword: ''
    }
  },
  created () {
    window.addEventListener('setItem', () => {
      this.spanImgStatus = parseInt(sessionStorage.getItem('spanStatus'))
    })
  },
  mounted () {
    this.getTableDataList()
  },
  watch: {
    $route () {
      this.spanStatus = this.$route.meta.index
      if (this.$route.path === '/index') {
        sessionStorage.setItem('spanStatus', undefined)
        this.spanImgStatus = undefined
      } else {
        this.spanImgStatus = parseInt(sessionStorage.getItem('spanStatus'))
      }
    }
  },
  methods: {
    changSpanStatus (index) {
      this.spanStatus = index
      this.getTableDataList()
    },
    routerLink (index) {
      sessionStorage.setItem('spanStatus', index)
      this.resetSetItem('watchStorage', index)
      this.spanImgStatus = index
      // 逻辑待修改
      let menuRouter = this.$route.name
      if (menuRouter === 'index') {
        this.$router.push(
          {
            path: '/operateProfile'
          }
        )
        this.$refs['myChild'].getDeviceInfo()
      } else {
        this.$refs['myChild'].getDeviceInfo()
      }
      // if (menuRouter === 'index') {
      //   this.$router.push(
      //     {
      //       path: '/operateProfile'
      //     }
      //   )
      // }
      // this.$refs.myChild.getDeviceInfo()
    },
    getTableDataList () {
      let url = Urls.deviceUrl.list()
      let data = {
        keyword: this.keyword,
        status: this.spanStatus === 10 ? undefined : this.spanStatus
      }
      SqTools.post(url, data)
        .then(res => {
          this.tableData = res.data.data
          this.deviceNumber = res.data.total
        })
    }
  }
}
</script>

<style scoped>
  .indexMenu{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .left{
    width: 28%;
    height: 100%;
    position: relative;
  }
  .contentRight{
    width: calc(72% - 20px);
    height: 100%;
    position: relative;
  }
  .title{
    font-size: 18px;
    font-weight: 700;
    color: #6a707e;
    margin-bottom: 20px;
  }
  .leftMenuList{
    width: 100%;
    height: calc(100% - 47px);
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    padding: 30px 0;
    box-sizing: border-box;
  }
  .search{
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .operateStatus{
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .statusSpan{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .statusSpan>span{
    width: 80px;
    height: 34px;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    color: #109CF1;
    border: 1px solid #109CF1;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .statusSpan>span:nth-child(2){
    color: #2ED47A;
    border: 1px solid #2ED47A;
  }
  .statusSpan>span:nth-child(3){
    color: #F7685B;
    border: 1px solid #F7685B;
  }
  .statusSpan>span:nth-child(4){
    color: #C2CFE0;
    border: 1px solid #C2CFE0;
  }
  .activeAllSpanBg{
    background-color: #109CF1;
    color: #ffffff !important;
  }
  .activeFirstSpanBg{
    background-color: #2ED47A;
    color: #ffffff !important;
  }
  .activeSecondSpanBg{
    background-color: #F7685B;
    color: #ffffff !important;
  }
  .activeThirdSpanBg{
    background-color: #C2CFE0;
    color: #ffffff !important;
  }
  .operateList{
    width: 100%;
    max-height: 610px;
    overflow: auto;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .operateList>span{
    display: block;
    width: calc(50% - 5px);
    height: 45px;
    background: rgba(82,125,237,0.05);
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
    line-height: 45px;
    color: #527ded;
  }
  .operateList>span>b{
    font-weight: normal;
    display: inline-block;
  }
  .operateList>span>i{
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    margin-right: 6px;
  }
  .operateList::-webkit-scrollbar {
    width:4px;
  }
  /* 滚动槽 */
  .operateList::-webkit-scrollbar-track {
    -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
    border-radius:10px;
  }
  /* 滚动条滑块 */
  .operateList::-webkit-scrollbar-thumb {
    border-radius:10px;
    background:#fff;
    -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
  }
  .operateList::-webkit-scrollbar-thumb:window-inactive {
    background:#fff;
  }
  .rightDrawer{
    position: absolute;
    left: 0px;
    top: 50%;
    z-index: 99;
  }
  .nowDeviceNumber{
    width: 90%;
    font-size: 12px;
    color: #90a0b7;
    position: absolute;
    bottom: 20px;
    left: 5%;
    text-align: left;
  }
  .activeSpanBg{
    background-color: #527DED !important;
    color: #ffffff !important;
  }
  .indexMenu>>>.ant-btn {
     background: #109CF1;
     border: 1px solid #109CF1;
     color: #ffffff;
    font-weight: 400;
  }
</style>
