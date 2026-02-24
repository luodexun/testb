/*
 * @Author: chenmeifeng
 * @Date: 2023-12-04 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-04 15:33:42
 * @Description: echarts-柱状图、折线图图表配置方法
 */

import { baseTooltip } from "@configs/chart-fragments.ts"
import { EChartsOption } from "echarts"

import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

import { commonBaseLegend, commonBaseXAis, commonBaseYAxis } from "./common-echarts-data"

export interface lineChartData extends IBaseChartOption {
  series: any
  screenWidth: number
}
export function lineOption(params: lineChartData) {
  const { xAxis, series, screenWidth } = params || { xAxis: [], series: [] }
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
    grid: { left: "3%", right: "3%", top: "22%", bottom: "2%", containLabel: true },
    backgroundColor: "transparent",
    tooltip: actTooltip as EChartsOption["tooltip"],
    // dataZoom: baseDataZoom,
    legend: commonBaseLegend(screenWidth),
    // toolbox: getToolbox(downloadFileName ?? "发电量报表"),
    xAxis: {
      type: "category",
      data: xAxis,
      ...commonBaseXAis({ screenWidth }),
    },
    yAxis: [
      {
        type: "value",
        name: "万kW",
        show: true,
        position: "left",
        ...commonBaseYAxis(screenWidth),
      },
      // {
      //   type: "value",
      //   name: "m/s",
      //   show: true,
      //   position: "right",
      //   ...commonBaseYAxis(screenWidth),
      // },
    ] as EChartsOption["YAXisOption"],
    series,
  }
  return option
}
