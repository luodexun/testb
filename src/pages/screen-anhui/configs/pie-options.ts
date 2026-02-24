/*
 * @Author: chenmeifeng
 * @Date: 2024-06-27 11:33:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-30 15:03:30
 * @Description:
 */
import { EChartsOption } from "echarts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import brandImg from "@/assets/anhui-screen/elec-bg.png"
import { parseNum } from "@/utils/util-funs"
const commonTextStyle = {
  a_style: {
    fontSize: 16,
    color: "rgba(0, 255, 201, 1)",
  },
  b_style: {
    padding: [5, 0, 5, 0],
    fontSize: 20,
    fontWeight: 400,
    color: "#fff",
  },

  c_style: {
    color: "rgba(255, 255, 255, 0.5)",
  },
}
export function brand2DPie(params) {
  const {
    monthlyProduction = 0,
    dailyProduction = 0,
    monthRate = 0,
    yearlyProduction = 0,
    yearRate = 0,
  } = params || {
    monthlyProduction: 0,
    dailyProduction: 0,
    monthRate: 0,
    yearlyProduction: 0,
    yearRate: 0,
  }
  const option: EChartsOption = {
    grid: { left: "3%", right: "3%", top: "2%", bottom: "2%", containLabel: true },
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
    graphic: [
      {
        type: "image",
        left: "5%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: brandImg,
          width: 130,
          height: 130,
        },
      },
      {
        type: "image",
        left: "35%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: brandImg,
          width: 130,
          height: 130,
        },
      },
      {
        type: "image",
        left: "65%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: brandImg,
          width: 130,
          height: 130,
        },
      },
    ],
    series: [
      {
        name: "日发电量",
        type: "pie",
        radius: ["51.5%", "58.5%"],
        center: ["17.5%", "50%"],
        labelLine: {
          show: false,
        },
        data: commonSeriesPart(100),
        label: {
          position: "center",
          formatter: `{a_style|{a}}\n{b_style|${dailyProduction}}\n{c_style|万kWh}`,
          rich: commonTextStyle,
        },
        // No encode specified, by default, it is '2012'.
      },
      {
        type: "pie",
        name: "月发电量",
        radius: ["51.5%", "58.5%"],
        center: ["47.5%", "50%"],
        labelLine: {
          show: false,
        },
        label: {
          position: "center",
          formatter: `{a_style|{a}}\n{b_style|${monthlyProduction}}\n{c_style|万kWh}`,
          rich: commonTextStyle,
        },
        data: commonSeriesPart(monthRate),
        // No encode specified, by default, it is '2012'.
      },
      {
        type: "pie",
        name: "年发电量",
        radius: ["51.5%", "58.5%"],
        center: ["77.5%", "50%"],
        labelLine: {
          show: false,
        },
        label: {
          position: "center",
          formatter: `{a_style|{a}}\n{b_style|${yearlyProduction}}\n{c_style|万kWh}`,
          rich: commonTextStyle,
        },
        data: commonSeriesPart(yearRate),
        // No encode specified, by default, it is '2012'.
      },
    ],
  }
  return option
}

const commonSeriesPart = (value = 0) => {
  return [
    {
      value: value,
      name: "",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 1,
            color: "RGBA(0, 187, 252, 1)",
          },
          {
            offset: 0.5,
            color: "RGBA(47, 252, 25, .3)",
          },
          {
            offset: 0,
            color: "RGBA(47, 252, 25, 1)",
          },
        ]),
      },
    },
    {
      value: 100 - value,
      name: "",
      label: {
        show: false,
      },
      itemStyle: {
        color: "rgba(255, 255, 255, 0)",
      },
    },
  ]
}
