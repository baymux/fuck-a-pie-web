<template>
  <div class="commonMenu">
    <span :class="{activeSpanStatic: menuColor === index}"
          @click="routerLink(item.path)"
          v-for="(item, index) in spanMenuData"
          :key="index">
        <img :src="spanActiveImgList[index].imgName" alt="" v-if="menuColor === index">
        <img :src="spanImgList[index].imgName" alt="" v-else>
        <i style="width: 56px;">{{item.meta.title}}</i>
      </span>
  </div>
</template>

<script>
export default {
  name: 'commonMenu',
  data () {
    return {
      spanImgList: [
        {
          imgName: require('../../assets/images/menuImg/index.svg')
        },
        {
          imgName: require('../../assets/images/menuImg/oprerate.svg')
        },
        {
          imgName: require('../../assets/images/menuImg/warning.svg')
        },
        {
          imgName: require('../../assets/images/menuImg/setting.svg')
        }
      ],
      spanActiveImgList: [
        {
          imgName: require('../../assets/images/menuImg/activeIndex.svg')
        },
        {
          imgName: require('../../assets/images/menuImg/activeOperate.svg')
        },
        {
          imgName: require('../../assets/images/menuImg/activeWarning.svg')
        },
        {
          imgName: require('../../assets/images/menuImg/activeSet.svg')
        }
      ],
      spanMenuData: JSON.parse(sessionStorage.getItem('menuList')),
      menuColor: this.$route.meta.menuIndex,
      menuIndexColor: '0'
    }
  },
  created () {
    this.spanMenuData = JSON.parse(sessionStorage.getItem('menuList'))
  },
  watch: {
    $route () {
      this.menuColor = this.$route.meta.menuIndex
      this.spanMenuData = JSON.parse(sessionStorage.getItem('menuList'))
    }
  },
  mounted () {
  },
  methods: {
    routerLink (path) {
      this.$router.push({
        path: path // 跳转的路径
      })
    }
  }
}
</script>

<style scoped>
  .commonMenu{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .commonMenu span{
    text-align: center;
    color: #ffffff;
    padding: 6px 8px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-bottom: 30px;
  }
  .activeSpanStatic{
    color: #527DED !important;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
  }
  .commonMenu span img{
   width: 42px;
  }
  .commonMenu span i{
    display: block;
  }
</style>
