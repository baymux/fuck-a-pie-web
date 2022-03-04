<template>
    <div class="commonMenu">
      <div class="left">
        <div class="operateStatus">
          <div class="operateList">
            <span
              @click="changSpanStatus(item.path)"
              v-for="item in menuData"
              :key="item.meta.title"
              :class="{activeSpanBg: spanStatus === item.path}">
              {{item.meta.title}}
            </span>
          </div>
      </div>
      </div>
      <div class="right">
        <keep-alive>
          <router-view :key="$route.fullPath"/>
        </keep-alive>
      </div>
    </div>
</template>

<script>
export default {
  name: 'commonMenu',
  data () {
    return {
      menuData: [],
      spanStatus: this.$route.meta.index
    }
  },
  created () {
    let menu = JSON.parse(sessionStorage.getItem('menuList'))
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].name === '/system') {
        this.menuData = menu[i].children
      }
    }
  },
  watch: {
    $route () {
      this.spanStatus = this.$route.meta.index
    }
  },
  methods: {
    changSpanStatus (pathLink) {
      this.spanStatus = this.$route.meta.index
      this.$router.push(
        {
          path: pathLink
        }
      )
    }
  }
}
</script>

<style scoped>
  .commonMenu{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .left{
    width: 20%;
    height: 100%;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
  }
  .operateStatus{
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .right{
    width: calc(80% - 20px);
    height: 100%;
    position: relative;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 4px 35px 0px rgba(0,0,0,0.14);
    padding: 30px;
    box-sizing: border-box;
  }
  .operateList{
    width: 100%;
    max-height: 540px;
    overflow: auto;
    margin-top: 70px;
  }
  .operateList>span{
    display: block;
    width: 100%;
    height: 50px;
    background: rgba(82,125,237,0.05);
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #527DED;
  }
  .operateList>span>img{
    width: 30px;
    height: 30px;
    float: left;
    margin: 10px 0 0 20px;
  }
  .activeSpanBg{
    background: #527ded !important;
    color: #ffffff !important;
  }
</style>
