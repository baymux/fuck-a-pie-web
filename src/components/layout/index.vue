<template>
  <div class="wrapper">
    <div class="container">
      <div style="margin: 0 auto;">
        <div style="position: relative;">
          <div class="dashboard-container" style="width: 1920px;height: 1080px;" :style="transformStyle">
            <layout></layout>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getComputedStyle} from '../../utils'
import {debounce} from 'lodash'
import layout from './layout'
export default {
  name: 'index',
  components: {
    layout
  },
  data () {
    return {
      scaleX: 1,
      scaleY: 1,
      marginHorizontal: 0
    }
  },
  created () {

  },
  mounted () {
    this.init()
  },
  computed: {
    transformStyle: function () {
      return {
        transform: `scale(${this.scaleX}, ${this.scaleY})`
      }
    },
    marginStyle: function () {
      return {
        margin: `0px ${this.marginHorizontal}px`
      }
    }
  },

  watch: {},

  methods: {
    init () {
      this.listenResize()
    },
    initScale () {
      let $container = document.querySelector('.container')
      let containerWidth = getComputedStyle($container, 'width').replace('px', '')
      let containerHeight = getComputedStyle($container, 'height').replace('px', '')
      containerWidth = Number(containerWidth)
      containerHeight = Number(containerHeight)
      containerWidth = isNaN(containerWidth) ? 0 : containerWidth
      containerHeight = isNaN(containerHeight) ? 0 : containerHeight

      let defaultHeight = 1080
      let defaultWidth = 1920
      // sacle 缩放比例。
      let scale = 1
      if (containerHeight < defaultHeight) {
        scale = containerHeight / defaultHeight
      }
      let scale1 = 1
      if (containerWidth < defaultWidth) {
        scale1 = containerWidth / defaultWidth
      }

      this.scaleX = scale1
      this.scaleY = scale

      // let marginWidth = defaultWidth * scale
      //
      // this.marginHorizontal = 0
      // if (containerWidth > marginWidth) {
      //   marginWidth = (containerWidth - marginWidth) / 2
      //   this.marginHorizontal = marginWidth
      // }
    },
    listenResize () {
      this.initScale()
      window.addEventListener('resize', debounce(() => {
        this.initScale()
      }, 300))
    }
  },

  destroyed () {

  }
}
</script>

<style>

  .wrapper {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .container {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #527DED;

  }
  .dashboard-container {
    position: relative;
    user-select: none;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .5);
    transition: all .3s linear;
    overflow: hidden;
  }

</style>
