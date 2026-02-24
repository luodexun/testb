/*
 * @Author: chenmeifeng
 * @Date: 2024-06-27 11:33:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-27 15:59:13
 * @Description:
 */
import { EChartsOption } from "echarts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import brandImg from "@/assets/jiangsu-screen/pie.png"
import { parseNum } from "@/utils/util-funs"

export function brand2DPie(params) {
  const { series } = params || { series: [] }
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
          width: 280,
          height: 280,
        },
      },
    ],
    series: [
      {
        type: "pie",
        radius: ["40%", "51%"],
        center: ["50%", "50%"],
        labelLine: {
          show: false,
        },
        label: {
          show: false,
          position: "center",
        },
        data: series,
        // No encode specified, by default, it is '2012'.
      },
    ],
  }
  return option
}
