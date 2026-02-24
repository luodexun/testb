/*
 * @Author: chenmeifeng
 * @Date: 2024-10-04 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-14 17:35:02
 * @Description: echarts-时间轴
 */

import { baseDataZoom, baseLegend, baseTooltip } from "@configs/chart-fragments.ts"
import { EChartsOption } from "echarts"
import * as echarts from "echarts"

import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

import { commonBaseLegend, commonBaseXAis, commonBaseYAxis } from "./common-echarts-data"

export interface lineChartData extends IBaseChartOption {
  series: any[]
  screenWidth: number
  unit?: string
  axisLabel?: any
  yAxisTwoUnit?: string
  yAxisProps: any
  showLegend?: boolean
}
const actTooltip = {
  ...baseTooltip,
  formatter: function (params) {
    console.log(params, "params")

    let res = params[0].name
    for (let i = 0; i < params.length; i++) {
      res += "<br>" + params[i].marker + params[i].seriesName + "：" + parseNum(params[i].data?.[1])
    }
    return res
  },
}
export function timeLineOption(params: lineChartData) {
  const {
    series,
    screenWidth,
    yAxisProps = {},
    axisLabel,
    yAxisTwoUnit,
    showLegend = true,
  } = params || { showLegend: true, xAxis: [], series: [], yAxisProps: {} }

  const option: EChartsOption = {
    grid: { left: "2%", right: "3%", top: "10%", bottom: "7%", containLabel: true },
    tooltip: baseTooltip as any,
    dataZoom: baseDataZoom,
    legend: {
      ...baseLegend,
    },
    // toolbox: getToolbox(downloadFileName ?? "发电量报表"),
    xAxis: {
      type: "time",
      ...commonBaseXAis({ screenWidth, axisLabel }),
    },
    yAxis: [
      {
        type: "value",
        // name: unit || "万kW",
        show: true,
        position: "left",
        ...commonBaseYAxis(screenWidth),
        ...yAxisProps,
      },
      {
        type: "value",
        name: yAxisTwoUnit,
        show: !!yAxisTwoUnit,
        position: "right",
        ...commonBaseYAxis(screenWidth),
        ...yAxisProps,
      },
    ] as EChartsOption["YAXisOption"],
    series: series,
  }
  return option
}
