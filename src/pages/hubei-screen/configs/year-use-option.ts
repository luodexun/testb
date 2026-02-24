/*
 * @Author: chenmeifeng
 * @Date: 2023-12-04 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-23 17:28:55
 * @Description: echarts-柱状图、折线图图表配置方法
 */

import { baseTooltip } from "@configs/chart-fragments.ts"
import { EChartsOption } from "echarts"
import * as echarts from "echarts"

import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

import { commonBaseXAis, commonBaseYAxis } from "./common-echarts-data"

export interface barChartData extends IBaseChartOption {
  series: any[]
  screenWidth: number
  axisLabel: any
}
export function yuBarOption(params: barChartData) {
  const { xAxis, series, screenWidth, axisLabel } = params || { xAxis: [], series: [], screenWidth: 4513 }
  const actTooltip = {
    ...baseTooltip,
    formatter: function (params) {
      let res = params[0].name
      for (let i = 0; i < params.length; i++) {
        res += "<br>" + params[i].marker + params[i].seriesName + "：" + parseNum(params[i].data)
      }
      return res
    },
  }
  const option: EChartsOption = {
    grid: { left: "3%", right: "3%", top: "14%", bottom: "2%", containLabel: true },
    tooltip: actTooltip as EChartsOption["tooltip"],
    // dataZoom: baseDataZoom,
    // legend: commonBaseLegend(screenWidth),
    // toolbox: getToolbox(downloadFileName ?? "发电量报表"),
    xAxis: {
      type: "category",
      data: xAxis,
      ...commonBaseXAis({ screenWidth, axisLabel }),
    },
    yAxis: {
      type: "value",
      name: "h",
      show: true,
      // position: "left",
      ...commonBaseYAxis(screenWidth),
    },
    series: [
      {
        name: "利用小时数",
        type: "bar",
        data: series,
        barWidth: 20,
        // itemStyle: {
        //   color: "#FF8000",
        // },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(255, 128, 0, 1)",
            },
            {
              offset: 1,
              color: "rgba(110, 57, 4, 0.40)",
            },
          ]),
        },
      },
    ],
  }
  return option
}
