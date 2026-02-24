/*
 * @Author: chenmeifeng
 * @Date: 2025-02-19 17:03:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-04 10:07:40
 * @Description:
 */
import "echarts-gl"
import wt from "@/assets/liaoning-screen/pie-wt.png"
import pvinv from "@/assets/liaoning-screen/pie-pv.png"
import bg from "@/assets/liaoning-screen/brand.png"
import ReactDOMServer from "react-dom/server"

import { judgeNull, parseNum } from "@/utils/util-funs"
//配置构建 pieData 饼图数据 internalDiameterRatio:透明的空心占比
export const getPie3D = (props) => {
  const {
    pieData,
    internalDiameterRatio,
    type = "wt",
    name,
    screenWidth,
  } = props || {
    pieData: [],
    internalDiameterRatio: 0.8,
    name: "",
    screenWidth: 0,
    type: "wt",
  }
  const series = []
  const brandImg = type === "wt" ? wt : pvinv
  let sumValue = 0
  let startValue = 0
  let endValue = 0
  const k = 1 - internalDiameterRatio
  pieData.sort((a, b) => {
    return b.value - a.value
  })

  // 为每一个饼图数据，生成一个 series-surface(参数曲面) 配置
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value
    const seriesItem = {
      //系统名称
      name: typeof pieData[i].name === "undefined" ? `series${i}` : pieData[i].name,
      type: "surface",
      //是否为参数曲面（是）
      parametric: true,
      //曲面图网格线（否）上面一根一根的
      wireframe: {
        show: false,
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k,
      },
      zlevel: 1,
      itemStyle: null,
    }

    //曲面的颜色、不透明度等样式。
    if (typeof pieData[i].itemStyle != "undefined") {
      const itemStyle = { color: "", opacity: null }
      typeof pieData[i].itemStyle.color != "undefined" ? (itemStyle.color = pieData[i].itemStyle.color) : null
      typeof pieData[i].itemStyle.opacity != "undefined" ? (itemStyle.opacity = pieData[i].itemStyle.opacity) : null
      seriesItem.itemStyle = itemStyle
    }
    series.push(seriesItem)
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value
    series[i].pieData.startRatio = startValue / sumValue
    series[i].pieData.endRatio = endValue / sumValue
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false,
      false,
      k,
      15, // 图形高度
    )
    startValue = endValue
    const bfb = fomatFloat(series[i].pieData.value / sumValue, 4)
  }
  // series.push({
  //   name: "pie2d",
  //   type: "pie",
  //   label: {
  //     show: false,
  //     opacity: 1,
  //     lineHeight: 12,
  //     textStyle: {
  //       fontSize: 12,
  //       color: "red",
  //     },
  //   },
  //   labelLine: {
  //     show: false,
  //     length: 20 * (screenWidth / 5440),
  //     length2: 50 * (screenWidth / 5440),
  //     lineStyle: {
  //       // color: '#e6e6e6'
  //       width: 2,
  //     },
  //   },
  //   startAngle: 300, //起始角度，支持范围[0, 360]。
  //   clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
  //   radius: ["46%", "48%"],
  //   center: ["50%", "50%"],
  //   data: pieData,
  //   itemStyle: {
  //     opacity: 0,
  //   },
  // })
  //(第二个参数可以设置你这个环形的高低程度)
  // const boxHeight = getHeight3D(series, 12) //通过传参设定3d饼/环的高度
  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  const option = {
    // radius: '100%',
    title: {
      text: `{a|${name || ""}}`,
      x: "center",
      y: "center",
      textStyle: {
        rich: {
          a: {
            fontSize: 25 * (screenWidth / 5440),
            color: "#fff",
          },
        },
      },
    },
    graphic: [
      {
        type: "image",
        left: "center",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: brandImg,
          width: 40,
          height: 40,
        },
      },
      {
        type: "image",
        left: "center",
        top: "31%",
        z: -11,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: bg,
          width: 190,
          height: 160,
        },
      },
    ],
    //移动上去提示的文本内容
    tooltip: {
      show: true,
      confine: true,
      backgroundColor: "rgba(0,0,0,0)",
      borderWidth: 0,
      shadowBlur: 0,
      padding: 0,
      shadowColor: "rgba(0, 0, 0, 0)",
      formatter: (params) => {
        const render = <ToolTipBox params={params} pieData={pieData} screenWidth={screenWidth} />
        const renderToString = ReactDOMServer.renderToString(render)
        return renderToString
      },
    },
    labelLine: {
      show: true,
      length: 30 * (screenWidth / 5440),
      length2: 140 * (screenWidth / 5440),
      lineStyle: {
        width: 4,
      },
    },
    label: {
      show: true,
      // position: "outside",
      padding: [30, -10],
      formatter: function (optionsData) {
        // console.log("optionsData", optionsData)
        return "{name|" + optionsData.name + "}"
      },
      rich: {
        name: {
          fontSize: 20 * (screenWidth / 5440),
          color: "#ffffff",
          padding: [-20, -20, 0, 0],
        },
        value: {
          fontSize: 28,
          color: "#ffffff",
          padding: [-40, 0, 0, 0],
        },
        vlaueA: {
          fontSize: 28,
          color: "#2CEDCD",
          padding: [-40, 0, 0, 10],
        },
      },
      textStyle: {
        color: "#fff",
        fontSize: 28,
      },
    },
    //这个可以变形
    xAxis3D: {
      min: -1,
      max: 1,
    },
    yAxis3D: {
      min: -1,
      max: 1,
    },
    zAxis3D: {
      min: -1,
      max: 1,
    },
    //此处是修改样式的重点
    grid3D: {
      show: false,
      boxHeight: 15, //圆环的高度
      //这是饼图的位置
      // top: '-20.5%',
      // left: '-15%',
      top: 0,
      left: "0",
      viewControl: {
        //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 40, //角度(这个很重要 调节角度的)
        distance: 200, //调整视角到主体的距离，类似调整zoom(这是整体大小)
        rotateSensitivity: 0, //设置为0无法旋转
        zoomSensitivity: 0, //设置为0无法缩放
        panSensitivity: 0, //设置为0无法平移
        autoRotate: false, //自动旋转
      },
    },
    series: series,
  }
  return option
}

//获取3d丙图的最高扇区的高度
function getHeight3D(series, height) {
  series.sort((a, b) => {
    return b.pieData?.value - a.pieData?.value
  })
  return (height * 25) / series?.[0]?.pieData?.value
}

// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
  // 计算
  const midRatio = (startRatio + endRatio) / 2
  const startRadian = startRatio * Math.PI * 2
  const endRadian = endRatio * Math.PI * 2
  const midRadian = midRatio * Math.PI * 2
  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false
  }
  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== "undefined" ? k : 1 / 3
  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
  const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0
  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  const hoverRate = isHovered ? 1.05 : 1
  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },
    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },
    x: function (u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
    },
    y: function (u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
    },
    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u)
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u) * h * 0.1
      }
      return Math.sin(v) > 0 ? 1 * h * 0.1 : -1
    },
  }
}

//这是一个自定义计算的方法
function fomatFloat(num, n) {
  let f = parseFloat(num)
  if (isNaN(f)) {
    return false
  }
  f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n) // n 幂
  let s = f.toString()
  let rs = s.indexOf(".")
  //判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length
    s += "."
  }
  while (s.length <= rs + n) {
    s += "0"
  }
  return s
}
const brandQuota = [
  { name: "装机台数(台)", key: "deviceQuantity" },
  { name: "装机容量(MW)", key: "deviceCapacity", calculate: 1000 },
  { name: "装机容量占比(%)", key: "capacityCent", calculate: 0.01 },
]
function ToolTipBox({ params, pieData, screenWidth }) {
  const info = pieData?.find((i) => i.name === params?.seriesName) || null
  return (
    <div className="brand-tbox" style={{ fontSize: 10 * (screenWidth / 5440) + "px" }}>
      <div className="brand-tbox-title">{params?.seriesName || "-"}</div>
      <div className="brand-tbox-cnt">
        {brandQuota.map((i) => {
          return (
            <div className="brand-cnt-item" key={i.key}>
              <span className="cnt-item-value">{judgeNull(info?.[i.key], i.calculate, 2, "-")}</span>
              <span className="cnt-item-name">{i.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
