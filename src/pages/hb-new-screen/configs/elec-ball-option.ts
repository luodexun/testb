/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 10:07:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-04 10:59:07
 * @Description: 发电量概览图形配置
 */
import "echarts-liquidfill"

import { parseNum } from "@/utils/util-funs"
interface IPrams {
  value?: number
  color?: string
  screenWidth?: number
  gaugeStyle?: boolean
}
// import { EChartsOption } from "echarts"
export function ballOption(params: IPrams) {
  const { value, color } = params || { value: 0, color: "#57D2F3", screenWidth: 0 }

  // const value = 85
  const option = {
    grid: { left: "3%", right: "3%", top: "1%", bottom: "2%", containLabel: true },
    backgroundColor: "transparent",
    series: [
      {
        type: "liquidFill",
        radius: "80%",
        center: ["50%", "50%"],
        color: [color], //水波
        data: [0.5], // data个数代表波浪数
        backgroundStyle: {
          borderWidth: 1,
          color: "transparent",
        },
        label: {
          //标签设置
          position: ["50%", "30%"],
          formatter: `${parseNum(value, 0)}%`, //显示文本,
          textStyle: {
            fontSize: 20, //文本字号,
            // fontSize: 20 * (screenWidth / 4513), //文本字号,
            color: "#fff",
          },
        },
        outline: {
          show: true,
          itemStyle: {
            borderColor: color,
            borderWidth: 2,
          },
          borderDistance: 3,
        },
        zlevel: 3,
      },
      {
        name: "分数",
        type: "pie",
        radius: ["80%", "85%"],
        center: ["50%", "50%"],
        silent: true,
        clockwise: true,
        startAngle: 180,
        z: 0,
        zlevel: 0,
        label: {
          position: "center",
        },
        data: [
          {
            value: value,
            name: "",
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: color, // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: color, // 100% 处的颜色
                    opacity: 0.2,
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          {
            value: 100 - value,
            name: "",
            label: {
              show: false,
            },
            itemStyle: {
              color: "#E6EAF2",
            },
          },
        ],
      },
      // {
      //   name: "分割线",
      //   type: "gauge",
      //   radius: "80%",
      //   center: ["50%", "50%"],
      //   zlevel: 1,
      //   startAngle: 0,
      //   endAngle: 360.0,
      //   splitNumber: 30,
      //   splitLine: {
      //     length: 70,
      //     lineStyle: {
      //       width: 3,
      //       color: "#011D42", //
      //       opacity: 0.4,
      //     },
      //   },
      //   // hoverAnimation: true,
      //   axisTick: {
      //     show: false,
      //   },
      //   // splitLine: {
      //   //   length: 30,
      //   //   lineStyle: {
      //   //     width: 5,
      //   //     color: '#fff',
      //   //   },
      //   // },
      //   axisLabel: {
      //     show: false,
      //   },
      //   pointer: {
      //     show: false,
      //   },
      //   axisLine: {
      //     lineStyle: {
      //       opacity: 0,
      //     },
      //   },
      //   detail: {
      //     show: false,
      //   },
      //   data: [
      //     {
      //       value: 100,
      //       name: "",
      //     },
      //   ],
      // },
    ],
  }
  return option
}
