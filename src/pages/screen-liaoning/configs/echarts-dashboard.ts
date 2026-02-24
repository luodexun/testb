/*
 * @Author: chenmeifeng
 * @Date: 2025-02-17 17:19:49
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-26 15:20:27
 * @Description:
 */
import * as echarts from "echarts"
import { EChartsOption } from "echarts"
import guan from "@/assets/liaoning-screen/guan.png"
import brandImg from "@/assets/liaoning-screen/guan-bg.png"
export const getDashboardPie = (params) => {
  const { value } = params || {}
  const option: EChartsOption = {
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
          width: 155,
          height: 135,
        },
      },
    ],
    series: [
      {
        type: "gauge",
        center: ["50%", "50%"],
        radius: "63%",
        startAngle: 270,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "RGBA(0, 116, 251, 1)" },
            { offset: 0.5, color: "RGBA(79, 251, 12, 0.4)" },
            { offset: 1, color: "RGBA(79, 251, 12, 1)" },
          ]),
        },
        progress: {
          show: true,
          width: 10,
          clip: true,
        },
        pointer: {
          show: true,
        },
        axisLine: {
          lineStyle: {
            width: 10,
            color: [[1, "transparent"]],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          distance: -13,
          length: 5,
          lineStyle: {
            width: 1,
            color: "#999",
          },
        },
        axisLabel: {
          distance: -20,
          color: "rgba(255, 255, 255, .5)",
          fontSize: 16,
        },
        anchor: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          width: "60%",
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: ["85%", "65%"],
          fontWeight: "bolder",
          formatter: ["{a|完成率}", `{b|${value}%}`].join("\n"),
          color: "inherit",
          rich: {
            a: {
              color: "#0CFF08",
              fontSize: 14,
              lineHeight: 16,
            },
            b: {
              height: 32,
              width: 80,
              color: "rgba(255, 255, 255, 1)",
              fontSize: 24,
              backgroundColor: {
                image: guan,
              },
            },
          },
        },
        data: [
          {
            value: value,
          },
        ],
      },
    ],
  }
  return option
}
