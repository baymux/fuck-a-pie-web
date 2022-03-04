<template>
    <div class="dieselEngineParameters">
      <div class="selectType">
        <span>
          实时数据：
          <a-radio-group button-style="solid" @change="changeRate" v-model="rate">
            <a-radio-button :value="1000">
              1s
            </a-radio-button>
            <a-radio-button :value="5000">
              暂停
            </a-radio-button>
            <a-radio-button :value="15000">
              15s
            </a-radio-button>
          </a-radio-group>
        </span>
        <span style="margin-left: 20px;">
          历史数据：
          <a-radio-group button-style="solid" @change="onChange" v-model="timeType">
            <a-radio-button :value="1">
              三十分钟
            </a-radio-button>
            <a-radio-button :value="2">
              一小时
            </a-radio-button>
            <a-radio-button :value="3">
              十二小时
            </a-radio-button>
          </a-radio-group>
          <a-range-picker style="width: 300px;" @change="onChangeDate"/>
        </span>
      </div>
      <div class="mapList">
        <div id="leftTop"></div>
        <div id="rightTop"></div>
        <div id="leftBottom"></div>
        <div id="rightBottom"></div>
      </div>
    </div>
</template>

<script>
import Urls from '../../assets/js/Urls'
import SqTools from '../../assets/js/SqTools'
import store from '../../store/index'
const echarts = require('echarts')
let myChart1
let myChart2
let myChart3
let myChart4
var data = []
var data1 = []
var data11 = []
var data12 = []
var data21 = []
var data22 = []
var data31 = []
var data32 = []
export default {
  name: 'dieselEngineParameters',
  data () {
    return {
      timer: null, // 定时器名称
      timer2: null, // 定时器名称
      timer3: null, // 定时器名称
      timer4: null, // 定时器名称
      type: 1,
      rate: 5000,
      timeType: undefined,
      startTime: '',
      endTime: '',
      oxygenData: '',
      methaneData: '',
      carbonMonoxideData: '',
      hydrogenSulfideData: ''
    }
  },
  created () {
    // sessionStorage监听，调用函数
    window.addEventListener('setItem', () => {
      if (store.state.componentStatus === 5) {
        this.rate = 5000
        data = []
        data1 = []
        data11 = []
        data12 = []
        data21 = []
        data22 = []
        data31 = []
        data32 = []
        clearInterval(this.timer)
        this.timer = null
        clearInterval(this.timer2)
        this.timer2 = null
        clearInterval(this.timer3)
        this.timer3 = null
        clearInterval(this.timer4)
        this.timer4 = null
        this.getGasOxygenData()
        this.getGasMethaneData()
        this.getGasCarbonMonoxideData()
        this.getGasHydrogenSulfideData()
      }
    })
    if (store.state.componentStatus === 5) {
      this.getGasOxygenData()
      this.getGasMethaneData()
      this.getGasCarbonMonoxideData()
      this.getGasHydrogenSulfideData()
    }
  },
  mounted () {
  },
  activated () {
  },
  destroyed () {
  },
  methods: {
    changeRate () {
      this.timeType = undefined
      data = []
      data1 = []
      data11 = []
      data12 = []
      data21 = []
      data22 = []
      data31 = []
      data32 = []
      clearInterval(this.timer)
      this.timer = undefined
      clearInterval(this.timer2)
      this.timer2 = undefined
      clearInterval(this.timer3)
      this.timer3 = undefined
      clearInterval(this.timer4)
      this.timer4 = undefined
      this.type = 1
      this.timeType = undefined
      this.startTime = ''
      this.endTime = ''
      this.getGasOxygenData()
      this.getGasMethaneData()
      this.getGasCarbonMonoxideData()
      this.getGasHydrogenSulfideData()

      if (this.rate !== 5000) {
        this.getGasOxygenDataRefresh()
        this.getGasMethaneDataRefresh()
        this.getGasCarbonMonoxideDataRefresh()
        this.getGasHydrogenSulfideDataRefresh()
      }
    },
    onChangeDate (date, dateString) {
      this.timeType = 4
      this.type = 2
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.getGasOxygenData()
      this.getGasOxygenDataRefresh()
      this.getGasMethaneData()
      this.getGasCarbonMonoxideData()
      this.getGasHydrogenSulfideData()
      this.getGasMethaneDataRefresh()
      this.getGasCarbonMonoxideDataRefresh()
      this.getGasHydrogenSulfideDataRefresh()
    },
    onChange (e) {
      data = []
      data1 = []
      data11 = []
      data12 = []
      data21 = []
      data22 = []
      data31 = []
      data32 = []
      this.type = 2
      this.rate = undefined
      this.timeType = e.target.value
      this.startTime = ''
      this.endTime = ''
      this.getGasOxygenData()
      this.getGasOxygenDataRefresh()
      this.getGasMethaneData()
      this.getGasCarbonMonoxideData()
      this.getGasHydrogenSulfideData()
      this.getGasMethaneDataRefresh()
      this.getGasCarbonMonoxideDataRefresh()
      this.getGasHydrogenSulfideDataRefresh()
    },
    getDateData () {
      let date = new Date()
      // this.y = date.getFullYear()
      // this.m = date.getMonth() + 1
      // this.d = date.getDate()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let seconds = date.getSeconds()
      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds
      return hours + ':' + minutes + ':' + seconds
    },
    getGasOxygenData () {
      this.$nextTick(() => {
        let color = [
          '#1AE496',
          '#109CF1',
          '#FFC005',
          '#FF515A',
          '#8B5CFF',
          '#39D5E6'
        ]
        const hexToRgba = (hex, opacity) => {
          let rgbaColor = ''
          let reg = /^#[\da-f]{6}$/i
          if (reg.test(hex)) {
            rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
              '0x' + hex.slice(3, 5)
            )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
          }
          return rgbaColor
        }
        if (myChart1 !== null && myChart1 !== '' && myChart1 !== undefined) {
          myChart1.dispose()
        }
        myChart1 = echarts.init(document.getElementById('leftTop'))
        let url = Urls.gasUrl.oxygen()
        let data11 = {
          'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
          startTime: this.startTime,
          endTime: this.endTime,
          searchType: this.type,
          timeType: this.timeType
        }
        SqTools.post(url, data11)
          .then(res => {
            let maxData = [0]
            let minData = [0]
            if (this.type === 2) {
              data = res.data.data.map(i => i.reportTime)
              data1 = res.data.data.map(i => i.currentValue)
              maxData[0] = res.data.data.length ? res.data.data[0].alarmHigh : 0
              minData[0] = res.data.data.length ? res.data.data[0].alarmLower : 0
              // this.oxygenData = 0
            } else {
              let dd = this.getDateData()
              data.push(dd)
              data1.push(res.data.data.currentValue)
              this.oxygenData = res.data.data.currentValue
              maxData[0] = res.data.data.alarmHigh
              minData[0] = res.data.data.alarmLower
            }
            let colorName = this.oxygenData < minData[0] || this.oxygenData > maxData[0] ? '#F7434D' : '#4DDB8E'
            let option = {
              title: {
                text: '{a|当前氧气含量：}{c|' + this.oxygenData + '%}',
                textStyle: {
                  rich: {
                    a: {
                      fontSize: 16,
                      color: '#1D2343'
                    },
                    c: {
                      fontSize: 20,
                      color: colorName
                    }
                  }
                },
                top: '10',
                left: 'center'
              },
              color: color,
              tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                  let resultTooltip = "<div style='background:#fff;border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;color: #333;'>" +
                    "<div style='text-align:left;'>" + params[0].name + '</div>' +
                    "<div style='padding-top:5px;'>"
                  params.forEach(v => {
                    resultTooltip += `
                <div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                <span style="width: 220px;display: inline-block;">${v.seriesName}</span>
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}%</span>
                </div>
               `
                  })
                  resultTooltip += '</div>'
                  return resultTooltip
                },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                axisPointer: {
                  lineStyle: {
                    type: 'linear',
                    color: {
                      // type: 'solid',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0,
                        color: 'rgba(0,0,0,0.1)'
                      }, {
                        offset: 0.5,
                        color: 'rgba(0,0,0,0.25)'
                      }, {
                        offset: 1,
                        color: 'rgba(0,0,0,0.1)'
                      }],
                      global: false
                    }
                  }
                }
              },
              grid: {
                top: '16%',
                left: '4%',
                right: '18%',
                bottom: '10',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                // boundaryGap: false,
                axisLabel: {
                  formatter: '{value}',
                  textStyle: {
                    color: '#1D2343'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#C5C5C5'
                  }
                },
                data: data
              }],
              yAxis: [{
                type: 'value',
                nameTextStyle: {
                  color: '#1D2343',
                  fontSize: 12
                },
                min: 0,
                max: 30,
                axisLabel: {
                  formatter: '{value}%',
                  textStyle: {
                    color: '#1D2343'
                  }
                },
                splitLine: {
                  lineStyle: {
                    type: 'dashed',
                    color: '#E8E8E8'
                  }
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                }
              }],
              series: [{
                name: '氧气',
                type: 'line',
                smooth: true,
                // showSymbol: false,
                symbolSize: 4,
                zlevel: 3,
                itemStyle: {
                  normal: {
                    color: color[1]
                  }
                },
                lineStyle: {
                  normal: {
                    color: color[1],
                    shadowBlur: 3,
                    shadowColor: hexToRgba(color[1], 0.5),
                    shadowOffsetY: 8
                  }
                },
                data: data1
              }, {
                name: '最大值 ',
                type: 'line',
                data: maxData,
                symbolSize: 0,
                markLine: {
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        color: '#F7434D'
                      }
                    }
                  },
                  data: [{
                    type: 'average',
                    name: '最大值',
                    label: {
                      textStyle: {
                        color: '#fff'
                      },
                      padding: [4, 4],
                      fontSize: 12,
                      borderRadius: 4,
                      backgroundColor: '#F7434D',
                      right: '0',
                      formatter: '预警：' + maxData[0] + '%'
                    }
                  }]
                }
              }, {
                name: '最小值 ',
                type: 'line',
                data: minData,
                symbolSize: 0,
                markLine: {
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        color: '#F7434D'
                      }
                    }
                  },
                  data: [{
                    type: 'average',
                    name: '最小值',
                    label: {
                      textStyle: {
                        color: '#fff'
                      },
                      padding: [4, 4],
                      fontSize: 12,
                      borderRadius: 4,
                      backgroundColor: '#F7434D',
                      right: '0',
                      formatter: '预警：' + minData[0] + '%'
                    }
                  }]
                }
              }]
            }
            myChart1.setOption(option)
          })
      })
    },
    getGasOxygenDataRefresh () {
      if (this.type === 1) {
        let url = Urls.gasUrl.oxygen()
        let data11 = {
          'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
          startTime: this.startTime,
          endTime: this.endTime,
          searchType: this.type,
          timeType: this.timeType
        }
        let rateValue = this.rate
        this.timer = setInterval(() => {
          SqTools.post(url, data11)
            .then(res => {
              // data.push(res.data.data.reportTime.slice(-8))
              let dd = this.getDateData()
              if (data.length > 8) {
                data.shift()
                data1.shift()
              }
              data.push(dd)
              data1.push(res.data.data.currentValue)
              this.oxygenData = res.data.data.currentValue

              // let a = 0
              if (!myChart1) {
                return
              }
              // 更新数据
              var option = myChart1.getOption()
              option.xAxis[0].data = data
              option.series[0].data = data1
              option.title[0].text = '{a|当前氧气含量：}{c|' + this.oxygenData + '%}'
              let colorName = this.oxygenData < res.data.data.alarmLower || this.oxygenData > res.data.data.alarmHigh ? '#F7434D' : '#4DDB8E'
              option.title[0].textStyle.rich.c.color = colorName
              option.series[1].data = [res.data.data.alarmHigh]
              option.series[2].data = [res.data.data.alarmLower]
              myChart1.setOption(option)
            })
        }, rateValue)
        this.$once('hook:beforeDestroy', () => {
          data = []
          data1 = []
          clearInterval(this.timer)
        })
      } else {
        clearInterval(this.timer)
        this.timer = undefined
      }
    },
    getGasMethaneData () {
      this.$nextTick(() => {
        if (myChart2 !== null && myChart2 !== '' && myChart2 !== undefined) {
          myChart2.dispose()
        }

        myChart2 = echarts.init(document.getElementById('rightTop'))
        let color = [
          '#1AE496',
          '#109CF1',
          '#FFC005',
          '#FF515A',
          '#8B5CFF',
          '#39D5E6'
        ]
        const hexToRgba = (hex, opacity) => {
          let rgbaColor = ''
          let reg = /^#[\da-f]{6}$/i
          if (reg.test(hex)) {
            rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
              '0x' + hex.slice(3, 5)
            )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
          }
          return rgbaColor
        }

        let url = Urls.gasUrl.methane()
        let data111 = {
          'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
          startTime: this.startTime,
          endTime: this.endTime,
          searchType: this.type,
          timeType: this.timeType
        }
        let maxData = [0]
        SqTools.post(url, data111)
          .then(res => {
            if (this.type === 2) {
              data11 = res.data.data.map(i => i.reportTime)
              data12 = res.data.data.map(i => i.currentValue)
              maxData[0] = res.data.data.length ? res.data.data[0].alarmHigh : 0
              // this.oxygenData = 0
            } else {
              let dd = this.getDateData()
              data11.push(dd)
              data12.push(res.data.data.currentValue)
              this.methaneData = res.data.data.currentValue
              maxData[0] = res.data.data.alarmHigh
            }
            let colorName = this.methaneData > maxData[0] ? '#F7434D' : '#4DDB8E'
            let option = {
              title: {
                text: '{a|当前甲烷含量：}{c|' + this.methaneData + '%}',
                textStyle: {
                  rich: {
                    a: {
                      fontSize: 16,
                      color: '#1D2343'
                    },

                    c: {
                      fontSize: 20,
                      color: colorName
                      // padding: [5,0]
                    }
                  }
                },
                top: '10',
                left: 'center'
              },
              color: color,
              tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                  let resultTooltip = "<div style='background:#fff;border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;color: #333;'>" +
                    "<div style='text-align:left;'>" + params[0].name + '</div>' +
                    "<div style='padding-top:5px;'>"
                  params.forEach(v => {
                    resultTooltip += `
                <div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                <span style="width: 220px;display: inline-block;">${v.seriesName}</span>
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}%</span>
                </div>
               `
                  })
                  resultTooltip += '</div>'
                  return resultTooltip
                },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                axisPointer: {
                  lineStyle: {
                    type: 'linear',
                    color: {
                      // type: 'solid',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0,
                        color: 'rgba(0,0,0,0.1)'
                      }, {
                        offset: 0.5,
                        color: 'rgba(0,0,0,0.25)'
                      }, {
                        offset: 1,
                        color: 'rgba(0,0,0,0.1)'
                      }],
                      global: false
                    }
                  }
                }
              },
              grid: {
                top: '16%',
                left: '4%',
                right: '18%',
                bottom: '10',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                // boundaryGap: false,
                axisLabel: {
                  formatter: '{value}',
                  textStyle: {
                    color: '#1D2343'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#C5C5C5'
                  }
                },
                data: data11
              }],
              yAxis: [{
                type: 'value',
                // max: 4.4,
                nameTextStyle: {
                  color: '#1D2343',
                  fontSize: 12
                },
                axisLabel: {
                  formatter: '{value}%',
                  textStyle: {
                    color: '#1D2343'
                  }
                },
                splitLine: {
                  lineStyle: {
                    type: 'dashed',
                    color: '#E8E8E8'
                  }
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                }
              }],
              series: [{
                name: '甲烷',
                type: 'line',
                smooth: true,
                // showSymbol: false,
                symbolSize: 4,
                zlevel: 3,
                itemStyle: {
                  normal: {
                    color: color[1]
                  }
                },
                lineStyle: {
                  normal: {
                    color: color[1],
                    shadowBlur: 3,
                    shadowColor: hexToRgba(color[1], 0.5),
                    shadowOffsetY: 8
                  }
                },
                data: data12
              }, {
                name: '最大值 ',
                type: 'line',
                data: maxData,
                symbolSize: 0,
                markLine: {
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        color: '#FF0000'
                      }
                    }
                  },
                  data: [{
                    type: 'average',
                    name: '最大值',
                    label: {
                      textStyle: {
                        color: '#fff'
                      },
                      padding: [4, 4],
                      fontSize: 12,
                      borderRadius: 4,
                      backgroundColor: '#F7434D',
                      right: '0',
                      formatter: '预警：' + maxData[0] + '%'
                    }
                  }]
                }
              }]
            }
            myChart2.setOption(option)
          })
      })
    },
    getGasMethaneDataRefresh () {
      if (this.type === 1) {
        let url = Urls.gasUrl.methane()
        let data111 = {
          'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
          startTime: this.startTime,
          endTime: this.endTime,
          searchType: this.type,
          timeType: this.timeType
        }
        let rateValue = this.rate
        this.timer2 = setInterval(() => {
          SqTools.post(url, data111)
            .then(res => {
              let dd = this.getDateData()
              if (data11.length > 8) {
                data11.shift()
                data12.shift()
              }
              data11.push(dd)
              data12.push(res.data.data.currentValue)
              if (!myChart2) {
                return
              }
              // 更新数据
              var option = myChart2.getOption()
              option.xAxis[0].data = data11
              option.series[0].data = data12
              this.methaneData = res.data.data.currentValue
              let colorName = this.methaneData > res.data.data.alarmHigh ? '#F7434D' : '#4DDB8E'
              option.title[0].textStyle.rich.c.color = colorName
              option.series[1].data = [res.data.data.alarmHigh]
              option.title[0].text = '{a|当前甲烷含量：}{c|' + this.methaneData + '%}'
              myChart2.setOption(option)
            })
        }, rateValue)
        this.$once('hook:beforeDestroy', () => {
          data11 = []
          data12 = []
          clearInterval(this.timer2)
        })
      } else {
        clearInterval(this.timer2)
        this.timer2 = undefined
      }
    },
    getGasCarbonMonoxideData () {
      this.$nextTick(() => {
        if (myChart3 !== null && myChart3 !== '' && myChart3 !== undefined) {
          myChart3.dispose()
        }
        myChart3 = echarts.init(document.getElementById('leftBottom'))
        let color = [
          '#1AE496',
          '#109CF1',
          '#FFC005',
          '#FF515A',
          '#8B5CFF',
          '#39D5E6'
        ]
        const hexToRgba = (hex, opacity) => {
          let rgbaColor = ''
          let reg = /^#[\da-f]{6}$/i
          if (reg.test(hex)) {
            rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
              '0x' + hex.slice(3, 5)
            )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
          }
          return rgbaColor
        }
        let url = Urls.gasUrl.carbonMonoxide()
        let data11 = {
          'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
          startTime: this.startTime,
          endTime: this.endTime,
          searchType: this.type,
          timeType: this.timeType
        }
        SqTools.post(url, data11)
          .then(res => {
            let maxData = [0]
            if (this.type === 2) {
              data21 = res.data.data.map(i => i.reportTime)
              data22 = res.data.data.map(i => i.currentValue)
              maxData[0] = res.data.data.length ? res.data.data[0].alarmHigh : 0
            } else {
              let dd = this.getDateData()
              data21.push(dd)
              data22.push(res.data.data.currentValue)
              this.carbonMonoxideData = res.data.data.currentValue
              maxData[0] = res.data.data.alarmHigh
            }
            let colorName = this.carbonMonoxideData > maxData[0] ? '#F7434D' : '#4DDB8E'
            let option = {
              title: {
                text: '{a|当前一氧化碳含量：}{c|' + this.carbonMonoxideData + 'PPM}',
                textStyle: {
                  rich: {
                    a: {
                      fontSize: 16,
                      color: '#1D2343'
                    },

                    c: {
                      fontSize: 20,
                      color: colorName
                      // padding: [5,0]
                    }
                  }
                },
                top: '10',
                left: 'center'
              },
              color: color,
              tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                  let resultTooltip = "<div style='background:#fff;border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;color: #333;'>" +
                    "<div style='text-align:left;'>" + params[0].name + '</div>' +
                    "<div style='padding-top:5px;'>"
                  params.forEach(v => {
                    resultTooltip += `
                <div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                <span style="width: 220px;display: inline-block;">${v.seriesName}</span>
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}PPM</span>
                </div>
               `
                  })
                  resultTooltip += '</div>'
                  return resultTooltip
                },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                axisPointer: {
                  lineStyle: {
                    type: 'linear',
                    color: {
                      // type: 'solid',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0,
                        color: 'rgba(0,0,0,0.1)'
                      }, {
                        offset: 0.5,
                        color: 'rgba(0,0,0,0.25)'
                      }, {
                        offset: 1,
                        color: 'rgba(0,0,0,0.1)'
                      }],
                      global: false
                    }
                  }
                }
              },
              grid: {
                top: '16%',
                left: '4%',
                right: '18%',
                bottom: '10',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                // boundaryGap: false,
                axisLabel: {
                  formatter: '{value}',
                  textStyle: {
                    color: '#1D2343'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#C5C5C5'
                  }
                },
                data: data21
              }],
              yAxis: [{
                type: 'value',
                // max: 500,
                name: 'PPM',
                nameTextStyle: {
                  color: '#1D2343',
                  fontSize: 12
                },
                axisLabel: {
                  formatter: '{value}',
                  textStyle: {
                    color: '#1D2343'
                  }
                },
                splitLine: {
                  lineStyle: {
                    type: 'dashed',
                    color: '#E8E8E8'
                  }
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                }
              }],
              series: [{
                name: '一氧化碳',
                type: 'line',
                smooth: true,
                // showSymbol: false,
                symbolSize: 4,
                zlevel: 3,
                itemStyle: {
                  normal: {
                    color: color[1]
                  }
                },
                lineStyle: {
                  normal: {
                    color: color[1],
                    shadowBlur: 3,
                    shadowColor: hexToRgba(color[1], 0.5),
                    shadowOffsetY: 8
                  }
                },
                data: data22
              }, {
                name: '最大值 ',
                type: 'line',
                data: maxData,
                symbolSize: 0,
                markLine: {
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        color: '#FF0000'
                      }
                    }
                  },
                  data: [{
                    type: 'average',
                    name: '最大值',
                    label: {
                      textStyle: {
                        color: '#fff'
                      },
                      padding: [4, 4],
                      fontSize: 12,
                      borderRadius: 4,
                      backgroundColor: '#F7434D',
                      right: '0',
                      formatter: '预警：' + maxData[0] + 'PPM'
                    }
                  }]
                }
              }]
            }
            myChart3.setOption(option)
          })
      })
    },
    getGasCarbonMonoxideDataRefresh () {
      if (this.type === 1) {
        let url = Urls.gasUrl.carbonMonoxide()
        let data11 = {
          'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
          startTime: this.startTime,
          endTime: this.endTime,
          searchType: this.type,
          timeType: this.timeType
        }
        this.timer3 = setInterval(() => {
          SqTools.post(url, data11)
            .then(res => {
              let dd = this.getDateData()
              if (data21.length > 8) {
                data21.shift()
                data22.shift()
              }
              data21.push(dd)
              data22.push(res.data.data.currentValue)
              if (!myChart3) {
                return
              }
              // 更新数据
              var option = myChart3.getOption()
              option.xAxis[0].data = data21
              option.series[0].data = data22
              this.carbonMonoxideData = res.data.data.currentValue
              let colorName = this.carbonMonoxideData > res.data.data.alarmHigh ? '#F7434D' : '#4DDB8E'
              option.title[0].textStyle.rich.c.color = colorName
              option.series[1].data = [res.data.data.alarmHigh]
              option.title[0].text = '{a|当前一氧化碳含量：}{c|' + this.carbonMonoxideData + 'PPM}'
              myChart3.setOption(option)
            })
        }, this.rate)
        this.$once('hook:beforeDestroy', () => {
          data21 = []
          data22 = []
          clearInterval(this.timer3)
        })
      } else {
        clearInterval(this.timer3)
        this.timer3 = undefined
      }
    },
    getGasHydrogenSulfideData () {
      this.$nextTick(() => {
        if (myChart4 !== null && myChart4 !== '' && myChart4 !== undefined) {
          myChart4.dispose()
        }

        myChart4 = echarts.init(document.getElementById('rightBottom'))
        let color = [
          '#1AE496',
          '#109CF1',
          '#FFC005',
          '#FF515A',
          '#8B5CFF',
          '#39D5E6'
        ]
        const hexToRgba = (hex, opacity) => {
          let rgbaColor = ''
          let reg = /^#[\da-f]{6}$/i
          if (reg.test(hex)) {
            rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
              '0x' + hex.slice(3, 5)
            )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
          }
          return rgbaColor
        }
        let url = Urls.gasUrl.hydrogenSulfide()
        let data11 = {
          'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
          startTime: this.startTime,
          endTime: this.endTime,
          searchType: this.type,
          timeType: this.timeType
        }
        SqTools.post(url, data11)
          .then(res => {
            let maxData = [0]
            if (this.type === 2) {
              data31 = res.data.data.map(i => i.reportTime)
              data32 = res.data.data.map(i => i.currentValue)
              maxData[0] = res.data.data.length ? res.data.data[0].alarmHigh : 0
            } else {
              let dd = this.getDateData()
              data31.push(dd)
              data32.push(res.data.data.currentValue)
              this.hydrogenSulfideData = res.data.data.currentValue
              maxData[0] = res.data.data.alarmHigh
            }
            let colorName = this.hydrogenSulfideData > maxData[0] ? '#F7434D' : '#4DDB8E'
            let option = {
              title: {
                text: '{a|当前硫化氢含量：}{c|' + this.hydrogenSulfideData + 'PPM}',
                textStyle: {
                  rich: {
                    a: {
                      fontSize: 16,
                      color: '#1D2343'
                    },

                    c: {
                      fontSize: 20,
                      color: colorName
                      // padding: [5,0]
                    }
                  }
                },
                top: '10',
                left: 'center'
              },
              color: color,
              tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                  let resultTooltip = "<div style='background:#fff;border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;color: #333;'>" +
                    "<div style='text-align:left;'>" + params[0].name + '</div>' +
                    "<div style='padding-top:5px;'>"
                  params.forEach(v => {
                    resultTooltip += `
                <div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                <span style="width: 220px;display: inline-block;">${v.seriesName}</span>
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}PPM</span>
                </div>
               `
                  })
                  resultTooltip += '</div>'
                  return resultTooltip
                },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                axisPointer: {
                  lineStyle: {
                    type: 'linear',
                    color: {
                      // type: 'solid',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0,
                        color: 'rgba(0,0,0,0.1)'
                      }, {
                        offset: 0.5,
                        color: 'rgba(0,0,0,0.25)'
                      }, {
                        offset: 1,
                        color: 'rgba(0,0,0,0.1)'
                      }],
                      global: false
                    }
                  }
                }
              },
              grid: {
                top: '16%',
                left: '4%',
                right: '18%',
                bottom: '10',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                // boundaryGap: false,
                axisLabel: {
                  formatter: '{value}',
                  textStyle: {
                    color: '#1D2343'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#C5C5C5'
                  }
                },
                data: data31
              }],
              yAxis: [{
                type: 'value',
                name: 'PPM',
                nameTextStyle: {
                  color: '#1D2343',
                  fontSize: 12
                },
                axisLabel: {
                  formatter: '{value}',
                  textStyle: {
                    color: '#1D2343'
                  }
                },
                splitLine: {
                  lineStyle: {
                    type: 'dashed',
                    color: '#E8E8E8'
                  }
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                }
              }],
              series: [{
                name: '硫化氢',
                type: 'line',
                smooth: true,
                // showSymbol: false,
                symbolSize: 4,
                zlevel: 3,
                itemStyle: {
                  normal: {
                    color: color[1]
                  }
                },
                lineStyle: {
                  normal: {
                    color: color[1],
                    shadowBlur: 3,
                    shadowColor: hexToRgba(color[1], 0.5),
                    shadowOffsetY: 8
                  }
                },
                data: data32
              }, {
                name: '最大值 ',
                type: 'line',
                data: maxData,
                symbolSize: 0,
                markLine: {
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        color: '#FF0000'
                      }
                    }
                  },
                  data: [{
                    type: 'average',
                    name: '最大值',
                    label: {
                      textStyle: {
                        color: '#fff'
                      },
                      padding: [4, 4],
                      fontSize: 12,
                      borderRadius: 4,
                      backgroundColor: '#F7434D',
                      right: '0',
                      formatter: '预警：' + maxData[0] + 'PPM'
                    }
                  }]
                }
              }]
            }
            myChart4.setOption(option)
          })
      })
    },
    getGasHydrogenSulfideDataRefresh () {
      if (this.type === 1) {
        let url = Urls.gasUrl.hydrogenSulfide()
        let data11 = {
          'deviceId': parseInt(sessionStorage.getItem('spanStatus')),
          startTime: this.startTime,
          endTime: this.endTime,
          searchType: this.type,
          timeType: this.timeType
        }
        this.timer4 = setInterval(() => {
          SqTools.post(url, data11)
            .then(res => {
              let dd = this.getDateData()
              if (data31.length > 8) {
                data31.shift()
                data32.shift()
              }
              data31.push(dd)
              data32.push(res.data.data.currentValue)
              if (!myChart4) {
                return
              }
              // 更新数据
              var option = myChart4.getOption()
              option.xAxis[0].data = data31
              option.series[0].data = data32
              this.hydrogenSulfideData = res.data.data.currentValue
              let colorName = this.hydrogenSulfideData > res.data.data.alarmHigh ? '#F7434D' : '#4DDB8E'
              option.title[0].textStyle.rich.c.color = colorName
              option.series[1].data = [res.data.data.alarmHigh]
              option.title[0].text = '{a|当前硫化氢含量：}{c|' + this.hydrogenSulfideData + 'PPM}'
              myChart4.setOption(option)
            })
        }, this.rate)
        this.$once('hook:beforeDestroy', () => {
          data31 = []
          data32 = []
          clearInterval(this.timer4)
        })
      } else {
        clearInterval(this.timer4)
        this.timer4 = undefined
      }
    }
  }
}
</script>

<style scoped>
  .dieselEngineParameters{
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .selectType{
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .mapList{
    width: 100%;
    height: calc(100% - 70px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .selectType>span{
    width: 40%;
  }
  .mapList>div{
    width: 50%;
    height: 50%;
  }
  .selectType>>>.ant-select-selection-selected-value {
    color: #fff;
  }
  .selectType>>>.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: #EFEFEF;
    background: #109CF1;
    border-color: #109CF1;
  }
  .selectType>>>.ant-radio-button-wrapper {
    color: #7B7B7B;
    background: transparent;
    border: 1px solid #EFEFEF;
  }
  .selectType>>>.ant-radio-button-wrapper:not(:first-child)::before {
    background-color: #EFEFEF;
  }
  .selectType>>>.ant-btn {
    background: transparent;
    border-color: #448aca;
    color: #ffffff;
  }
  .selectType>>>.ant-calendar-range-picker-input {
    color: #7B7B7B !important;
  }
  .selectType>>>.ant-input{
    background-color: transparent;
    border: 1px solid #EFEFEF;
  }
</style>
