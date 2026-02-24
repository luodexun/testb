/*
 * @Author: chenmeifeng
 * @Date: 2024-06-27 11:33:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-17 17:32:57
 * @Description:
 */
import { EChartsOption } from "echarts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import brandImg from "@/assets/shanxi-screen/elec-pie.png"
import { parseNum } from "@/utils/util-funs"
const colorList = {
  month: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
    {
      offset: 1,
      color: "rgba(209, 143, 254, 1)",
    },
    {
      offset: 0,
      color: "rgba(255, 160, 17, 1)",
    },
  ]),
  year: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
    {
      offset: 1,
      color: "rgba(0, 194, 255, 1)",
    },
    {
      offset: 0,
      color: "rgba(185, 50, 251, 0.65)",
    },
  ]),
}
export function brand2DPie(params) {
  const { monthRate, yearRate } = params || { monthRate: 0, yearRate: 0 }
  const option: EChartsOption = {
    grid: { left: "3%", right: "3%", top: "8%", bottom: "8%", containLabel: true },
    backgroundColor: "RGBA(117, 119, 146, 0)",
    // dataZoom: baseDataZoom,
    //你的代码
    color: [
      "RGBA(8, 162, 255, 1)",
      "RGBA(209, 86, 255, 1)",
      "RGBA(209, 86, 255, 0.8)",
      "RGBA(255, 162, 243, 1)",
      "RGBA(255, 243, 166, 1)",
      "RGBA(254, 194, 109, 1)",
      "RGBA(254, 194, 109, 0.5)",
      "RGBA(208, 252, 197, 1)",
      "RGBA(15, 253, 253, 1)",
      "RGBA(69, 113, 255, 1)",
      "RGBA(69, 113, 255, 0.5)",
    ],
    // title: {
    //   text: `{a|${name || ""}}`,
    //   left: "center",
    //   top: "center",
    //   textStyle: {
    //     rich: {
    //       a: {
    //         fontSize: 25 * (screenWidth / 4513),
    //         color: "#fff",
    //       },
    //     },
    //   },
    // },
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
          width: 170,
          height: 170,
        },
      },
    ],
    series: [
      {
        name: "年发电量完成率",
        type: "pie",
        radius: ["59%", "68%"],
        center: "center",
        startAngle: 90,
        labelLine: {
          length: 10,
          length2: 125,
          // minTurnAngle: 140,
          lineStyle: {
            color: "rgba(75, 212, 255, 1)",
            width: 1,
          },
        },
        label: commonLable() as any,
        data: commonSeriesPart(yearRate, "年发电量完成率", "year"),
        // No encode specified, by default, it is '2012'.
      },
      {
        type: "pie",
        name: "月发电量完成率",
        radius: ["28%", "38%"],
        center: "center",
        startAngle: 90,
        labelLine: {
          length: 50,
          length2: 125,
          // minTurnAngle: 140,
          // maxSurfaceAngle: 180,
          lineStyle: {
            color: "rgba(75, 212, 255, 1)",
            width: 1,
          },
        },
        label: commonLable() as any,
        data: commonSeriesPart(monthRate, "月发电量完成率", "month"),
        // No encode specified, by default, it is '2012'.
      },
    ],
  }
  return option
}

const commonSeriesPart = (value, name, type) => {
  return [
    {
      value: value,
      name: name,
      itemStyle: {
        color: colorList[type],
      },
    },
    {
      value: 100 - value,
      name: "",
      label: {
        show: false,
      },
      itemStyle: {
        color: "RGBA(117, 119, 146, 1)",
      },
    },
  ]
}

const commonLable = () => {
  const result = {
    show: true,
    position: "outside",
    // alignTo: 'labelLine',
    backgroundColor: "rgba(75, 212, 255, 1)",
    height: 0,
    width: 0,
    lineHeight: 0,
    distanceToLabelLine: 0,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(75, 212, 255, 1)",
    padding: [3, -3, 3, -3],
    formatter: function (params) {
      return `{a|${params.name}}{b|${params.value}%}`
    },
    rich: {
      a: {
        padding: [20, -95, 40, -95],
        fontSize: "14px",
        color: "#ffffff",
      },
      b: {
        padding: [50, -0, 30, -0],
        fontSize: "14px",
        fontWeight: "bold",
        color: "RGBA(22, 175, 250, 1)",
      },
    },
  }
  return result
}
