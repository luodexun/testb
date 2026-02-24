/*
 * @Author: chenmeifeng
 * @Date: 2024-09-19 16:37:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 15:17:46
 * @Description:
 */
import { EChartsOption } from "echarts"
import * as echarts from "echarts"

import brandImg from "@/assets/yunnan-screen/elec-chart.png"
import { parseNum } from "@/utils/util-funs"

export function elecOvPie(params) {
  const { value, screenWidth, color } = params || { value: 0, screenWidth: 3456 }
  const option: EChartsOption = {
    grid: { left: "3%", right: "3%", top: "2%", bottom: "2%", containLabel: true },
    title: {
      text: `{a|${parseNum(value) || ""}%}`,
      left: "center",
      top: "center",
      textStyle: {
        rich: {
          a: {
            fontSize: 22 * (screenWidth / 3456),
            color: "#fff",
          },
        },
      },
    },
    // graphic: [
    //   {
    //     type: "image",
    //     left: "center",
    //     top: "center",
    //     z: -10,
    //     bounding: "all",
    //     rotation: 0, //旋转
    //     // scale: [1.0, 1.0], //缩放
    //     style: {
    //       image: brandImg,
    //       width: 110,
    //       height: 110,
    //     },
    //   },
    // ],
    series: [
      {
        type: "pie",
        radius: ["70%", "81%"],
        center: ["50%", "50%"],
        silent: true,
        clockwise: true,
        // startAngle: 260,
        label: {
          position: "center",
        },
        data: [
          {
            value: value || 0,
            name: "",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: color?.[0] || "RGBA(19, 183, 165, 1)",
                },
                {
                  offset: 0.5,
                  color: color?.[1] || "RGBA(36, 222, 81, 1)",
                },
                {
                  offset: 1,
                  color: color?.[2] || "RGBA(19, 183, 165, 1)",
                },
              ]),
            },
          },
          {
            value: 100 - (value || 0),
            name: "",
            label: {
              show: false,
            },
            itemStyle: {
              color: "RGBA(50, 81, 154, 1)",
            },
          },
        ],
        // No encode specified, by default, it is '2012'.
      },
    ],
  }
  return option
}
