<template>
  <div class="common">
    <div class="header">
    </div>
    <div class="index">
      <div class="search">
        <span>
          <span style="color: #fff; margin-left: 30px;">
            关键字搜索:
            <a-input style="width: 220px; margin-right: 10px; outline-color: #a0d911" v-model="keyword"/>
          </span>
        </span>
        <span>
          <span style="color: #fff; margin-left: 30px;">
            标题:
            <a-input style="width: 220px; margin-right: 10px; outline-color: #a0d911" v-model="keyword"/>
          </span>
        </span>
        <span>
          <span style="color: #fff; margin-left: 30px;">
            标签:
            <a-select
              label-in-value
              :default-value="{ key: '地图' }"
              style="width: 220px"
              @change="handleChange"
            ></a-select>
          </span>
        </span>
      </div>
      <div class="tableDiv">
        <div class="imgShow">
          <vue-seamless-scroll :data="imgList" class="seamless-warp2">
            <ul class="item" style="padding-left: 50px; padding-right:50px">
              <td style="padding-left: 30px" v-for="item in imgList" :key="item.path">
                <img style="width: 250px; height: 160px" :src="item.path" alt="">
              </td>
            </ul>
          </vue-seamless-scroll>
        </div>
        <a-pagination style="position:absolute;right:60px; bottom: 100px; color: #fff;" show-quick-jumper :default-current="2" :total="500" @change="onChange" />
      </div>
    </div>
  </div>

</template>

<script>

import {DatePicker} from 'antd'

const {RangePicker} = DatePicker
export default {
  name: 'index',

  data () {
    return {
      keyword: undefined,
      imgList: [
        {
          path: require('../assets/images/img.png')
        },
        {
          path: require('../assets/images/img2.png')
        }
      ]
    }
  },
  components: {
    RangePicker
  },
  mounted () {
  },
  methods: {
    handleChange (value) {
      console.log(value) // { key: "lucy", label: "Lucy (101)" }
    },
    onChange (pageNumber) {
      console.log('Page: ', pageNumber)
    }
  }
}
</script>

<style scoped>
.common {
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.header {
  width: 100%;
  height: 5%;
  position: relative;
  /*background-image: url("../assets/images/header.png");*/
  /*background-size: 100% 100%;*/
  background-repeat: no-repeat;
  background-position: bottom;
  text-align: center;
}

.index {
  width: 100%;
  height: 95%;
}

.search {
  width: 100%;
  height: 20%;
}

.ant-input {
  background-color: #fff;
}

.tableDiv {
  width: 100%;
  height: 80%;
  padding-left: 60px;
  padding-right: 60px;
}

</style>
