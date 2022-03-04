<template>
    <div class="mileage">
      <div class="title">
          <span>
            设备日放线总里数
          </span>
      </div>
      <div class="tab">
        <span>
          <p>累计放线总里程</p>
          <span>
            <i>累计油耗量</i>
            <i>0L</i>
          </span>
          <span>
            <i>累计油耗量</i>
            <i>0L</i>
          </span>
        </span>
        <span>
          <p>累计放线总里程</p>
          <span>
            <i>累计油耗量</i>
            <i>0L</i>
          </span>
          <span>
            <i>累计油耗量</i>
            <i>0L</i>
          </span>
        </span>
        <span>
          <p>累计放线总里程</p>
          <span>
            <i>累计油耗量</i>
            <i>0L</i>
          </span>
          <span>
            <i>累计油耗量</i>
            <i>0L</i>
          </span>
        </span>
      </div>
      <div id="map"></div>
    </div>
</template>

<script>
const echarts = require('echarts')
export default {
  name: 'mileage',
  mounted () {
    this.map()
  },
  methods: {
    map () {
      let myChart = echarts.init(document.getElementById('map'))
      let color = [
        '#1AE496',
        '#39D5E6',
        '#FFC005',
        '#FF515A',
        '#8B5CFF',
        '#39D5E6'
      ]
      let echartData = [{
        name: '1',
        value2: 36
      },
      {
        name: '2',
        value2: 28
      },
      {
        name: '3',
        value2: 28
      },
      {
        name: '4',
        value2: 23
      },
      {
        name: '5',
        value2: 18
      },
      {
        name: '6',
        value2: 19
      }
      ]

      let xAxisData = echartData.map(v => v.name)
      // let yAxisData2 = echartData.map(v => v.value2)
      let yData = [
        0.42,
        0.38,
        0.57,
        0.71,
        0.85,
        0.90
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

      let option = {
        color: color,
        legend: {
          top: 0,
          right: 20,
          icon: 'line',
          itemWidth: 10,
          itemHeight: 10,
          // padding: [5, 10],
          textStyle: {
            fontSize: 14,
            color: '#fff',
            padding: [3, 0, 0, 0]
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let resultTooltip = "<div style='background:#fff;border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;color: #333;'>" +
              "<div style='text-align:left;'>2020年" + params[0].name + '月' + '</div>' +
              "<div style='padding-top:5px;'>"
            params.forEach(v => {
              resultTooltip += `
                <div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                <span style="width: 220px;display: inline-block;">${v.seriesName}</span>
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}</span>
                </div>
               `
            })
            resultTooltip += '</div>'
            return resultTooltip
          },
          extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
          axisPointer: { // 轴指示器
            type: 'shadow',
            z: 1,
            shadowStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(18,155,249,0)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(18,155,249,1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 5
            }
          }
        },
        grid: {
          top: '18%',
          left: '20',
          right: '6%',
          bottom: '20',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          // boundaryGap: false,
          axisLabel: {
            formatter: '{value}月',
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#D9D9D9'
            }
          },
          data: xAxisData
        }],
        yAxis: [{
          type: 'value',
          name: '油耗(L)',
          nameTextStyle: {
            color: '#ffffff',
            fontSize: 12
          },
          axisLabel: {
            formatter: '{value}%',
            textStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#2C4C92'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }],
        series: [ {
          name: '城市',
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
          data: yData
        }]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
  .mileage{
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .title>span{
    font-size: 22px;
    font-weight: 400;
    color: #34d9fc;
    line-height: 47px;
    padding: 4px 10px;
    border-left: 4px solid #34d9fc;
    box-sizing: border-box;
  }
  .tab{
    width: 100%;
    padding: 20px 10px;
    box-sizing: border-box;
  }
  .tab>span{
    width: 236px;
    height: 124px;
    opacity: 1;
    background: linear-gradient(#e8c7b5 0%, #e27144 100%);
    border-radius: 10px;
    display: inline-block;
    text-align: right;
    margin-right: 20px;
  }
  .tab>span:nth-child(2){
    background: linear-gradient(#a5d5e3 0%, #209cbb 100%);
  }
  .tab>span:nth-child(3){
    background: linear-gradient(#a5d5e3 0%, #20bb98 100%);
  }
  .tab>span>p{
    font-size: 16px;
    text-align: center;
    color: #ffffff;
    line-height: 47px;
    border-bottom: 1px solid #ffffff;
    margin: 0;
  }
  .tab>span>span{
    width: 50%;
    text-align: center;
    display: block;
    float: left;
    box-sizing: border-box;
  }
  .tab>span>span:last-child{
    border-left: 1px solid #ffffff;
  }
  .tab>span>span i{
    display: block;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    line-height: 37px;
  }
  #map{
    width: 100%;
    height: calc(100% - 212px);
  }
</style>
