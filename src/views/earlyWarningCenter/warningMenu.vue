<template>
<div class="warningMenu">
  <div class="left">
    <div class="operateStatus">
      <div class="operateList">
          <span
            :class="{activeSpanBg: spanStatus === item.path}"
            v-for="(item, index) in menuData" :key="item.name"
            v-show="index === 0"
            @click="routerLink(item.path)">
            {{item.meta.title}}
          </span>
      </div>
    </div>
  </div>
  <div class="contentRight">
    <keep-alive>
      <router-view :key="$route.fullPath"/>
    </keep-alive>
  </div>
</div>
</template>

<script>
export default {
  name: 'warningMenu',
  data () {
    return {
      spanStatus: '2-1',
      menuData: []
    }
  },
  watch: {
    $route () {
      this.spanStatus = this.$route.meta.index
    }
  },
  created () {
    let menu = JSON.parse(sessionStorage.getItem('menuList'))
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].name === '/warningCenter') {
        this.menuData = menu[i].children.reverse()
      }
    }
  },
  mounted () {
    this.getMenuColor()
  },
  methods: {
    routerLink (path) {
      this.$router.push({
        path: path // 跳转的路径
      })
    },
    getMenuColor () {
      this.spanStatus = this.$route.meta.index
    }
  }
}
</script>

<style scoped>
  .warningMenu{
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
  .contentRight{
    width: calc(80% - 20px);
    height: 100%;
  }
  .operateStatus{
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .operateList{
    width: 100%;
    max-height: 540px;
    overflow: auto;
    margin-top: 20px;
  }
  .operateList>span>img{
    width: 30px;
    height: 30px;
    float: left;
    margin: 10px 0 0 20px;
  }
  .operateList>span{
    display: block;
    width: 100%;
    height: 50px;
    background: rgba(82,125,237,0.05);
    border-radius: 5px;
    margin-top: 30px;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #527ded;
  }
  .operateList>span>i{
    color: #218BC1;
    width: 60px;
    height: 60px;
    float: left;line-height: 50px;

  }
  .activeSpanBg{
    background: #527ded !important;
    color: #ffffff !important;
  }
</style>
