/*
 * @Author: chenmeifeng
 * @Date: 2024-03-29 10:37:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-29 17:48:29
 * @Description:
 */
import { EChartsOption } from "echarts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import { parseNum } from "@/utils/util-funs"

export function brand2DPie(params) {
  const { pieData, screenWidth, name } = params || { xAxis: [], series: [] }
  const option: EChartsOption = {
    grid: { left: "3%", right: "3%", top: "22%", bottom: "2%", containLabel: true },
    // dataZoom: baseDataZoom,
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
        const render = <ToolTipBox params={params} screenWidth={screenWidth} />
        const renderToString = ReactDOMServer.renderToString(render)
        return renderToString
      },
    },
    //你的代码
    color: [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#65aaff" },
        { offset: 1, color: "rgba(101, 170, 255, 0.5)" },
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#1ae6b4" },
        { offset: 1, color: "rgba(26, 230, 180, 0.5)" },
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#00e4ff" },
        { offset: 1, color: "rgba(0, 228, 255, 0.5)" },
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#ffcc85" },
        { offset: 1, color: "rgba(227, 183, 121, 0.5)" },
      ]),
    ],
    title: {
      text: `{a|${name || ""}}`,
      left: "center",
      top: "center",
      textStyle: {
        rich: {
          a: {
            fontSize: 25 * (screenWidth / 4513),
            color: "#fff",
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        minAngle: 5,
        startAngle: 10, //起始角度
        // labelLine: {
        //   show: true,
        //   length: 20 * (screenWidth / 4513),
        //   length2: 50 * (screenWidth / 4513),
        //   lineStyle: {
        //     // color: '#e6e6e6'
        //     width: 2,
        //   },
        // },
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
              fontSize: 20 * (screenWidth / 4513),
              color: "#ffffff",
              padding: [-20, -20, 0, 0],
            },
          },
        },
        center: ["50%", "50%"],
        radius: ["38%", "48%"],
        data: pieData,
      },
    ],
  }
  return option
}

const brandQuota = [
  { name: "装机台数(台)", key: "deviceQuantity" },
  { name: "装机容量(万kW)", key: "deviceCapacity" },
  { name: "装机容量占比(%)", key: "capacityCent" },
]
function ToolTipBox({ params, screenWidth }) {
  return (
    <div className="brand-tbox" style={{ fontSize: 10 * (screenWidth / 4513) + "px" }}>
      <div className="brand-tbox-title">{params?.data?.name || "-"}</div>
      <div className="brand-tbox-cnt">
        {brandQuota.map((i) => {
          return (
            <div className="brand-cnt-item" key={i.key}>
              <span className="cnt-item-value">{parseNum(params?.data?.[i.key]) || "-"}</span>
              <span className="cnt-item-name">{i.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
