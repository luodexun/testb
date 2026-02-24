/*
 * @Author: chenmeifeng
 * @Date: 2024-06-27 11:33:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-02 15:32:12
 * @Description:
 */
import { EChartsOption } from "echarts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import brandImg from "@/assets/ningxia-screen/elec-chart.png"
import { parseNum, vDate } from "@/utils/util-funs"

export function elecOvPie(params) {
  const { value, type, screenWidth, color } = params || { value: 0, screenWidth: 3456 }
  const option: EChartsOption = {
    grid: { left: "3%", right: "3%", top: "2%", bottom: "2%", containLabel: true },
    title: {
      text: `{a|${value || ""}%}`,
      left: "center",
      top: "center",
      textStyle: {
        rich: {
          a: {
            fontSize: 22 * (screenWidth / 4320),
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
          width: 100,
          height: 100,
        },
      },
    ],
    series: [
      {
        type: "pie",
        radius: ["73%", "88%"],
        center: ["50%", "50%"],
        silent: true,
        clockwise: true,
        // startAngle: 260,
        label: {
          position: "center",
        },
        data: [
          {
            value: value,
            name: "",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: getRingColor(value, type)?.[0],
                },
                {
                  offset: 0.5,
                  color: getRingColor(value, type)?.[1],
                },
                {
                  offset: 1,
                  color: getRingColor(value, type)?.[2],
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
        ],
        // No encode specified, by default, it is '2012'.
      },
    ],
  }
  return option
}

const getRingColor = (value, type) => {
  const current = vDate()
  const day = current.date() // 天
  const month = current.month() + 1 // 月
  // 获取当前月份的第一天
  const startOfMonth = vDate().startOf("month")

  // 获取当前月份的最后一天
  const endOfMonth = vDate().endOf("month")
  // 计算当前月份的天数
  const daysInMonth = endOfMonth.diff(startOfMonth, "days") + 1
  // 天处于当月的百分比
  const dayRate = (day / daysInMonth) * 100
  // 月处于当年的百分比
  const monthRate = (month / 12) * 100
  const rate = type === "month" ? dayRate : type === "year" ? monthRate : 0

  if (value > rate) return ["RGBA(19, 183, 165, 1)", "RGBA(36, 222, 81, 1)", "RGBA(19, 183, 165, 1)"]
  return ["RGBA(245, 132, 9, 1)", "RGBA(225, 229, 28, 1)", "RGBA(245, 132, 9, 1)"]
}
