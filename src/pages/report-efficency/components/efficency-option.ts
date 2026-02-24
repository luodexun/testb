/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:28:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-04 17:36:28
 * @Description: 区域中心-指标总览-运行趋势图表配置数据
 */

import { baseAxisLabel, baseDataZoom, baseGrid, baseLegend, baseTooltip } from "@configs/chart-fragments.ts"
import { crtLegend0Series } from "@pages/area-index/run-trend/run-trend-option.ts"

import { IStnPointTrendParams } from "@/pages/area-index/run-trend/types"
import { IBaseChartOption } from "@/types/i-page.ts"

export interface IRunTrendChartData extends Omit<IBaseChartOption, "data"> {
  deviceType?: IStnPointTrendParams["deviceType"] | null
  data: { title: string; unit: string; data: (number | null)[]; color?: string }[] | null
  legend?: string[]
}

export default function runTrendOption(params: IRunTrendChartData) {
  const { xAxis, deviceType, data } = params || { deviceType: null, xAxis: [], data: null }
  const { legend, series, yAxis } = crtLegend0Series(deviceType, data)
  const len = yAxis.length > 2 ? yAxis.length - 2 : 0
  const gridRight = len * 50 + 50

  return {
    grid: { ...baseGrid, left: 30, right: gridRight },
    legend: { data: legend, ...baseLegend },
    tooltip: baseTooltip,
    toolbox: {
      right: -5,
      feature: {
        saveAsImage: {
          name: "功率预测曲线",
          backgroundColor: "#010219",
          iconStyle: {
            color: "#1477F2",
          },
        },
      },
    },
    dataZoom: baseDataZoom,
    xAxis: { type: "category", data: xAxis, boundaryGap: true, axisLabel: baseAxisLabel },
    yAxis,
    series,
  }
}

export function efRunTrendOption(params: IRunTrendChartData) {
  const { xAxis, data } = params || {
    deviceType: null,
    xAxis: [],
    data: null,
    legend: ["全场实际功率(MW)", "短期功率(MW)"],
  }
  // const
  // const { legend, series } = crtLegend0Series(deviceType, data)
  // const len = yAxis.length > 2 ? yAxis.length - 2 : 0
  // const gridRight = len * 50 + 50
  return {
    grid: { ...baseGrid, left: 30 },
    legend: { ...baseLegend },
    tooltip: baseTooltip,
    toolbox: {
      right: -5,
      feature: {
        saveAsImage: {
          name: "功率预测曲线",
          backgroundColor: "#010219",
          iconStyle: {
            color: "#1477F2",
          },
        },
      },
    },
    dataZoom: baseDataZoom,
    xAxis: { type: "category", data: xAxis, boundaryGap: true, axisLabel: baseAxisLabel },
    yAxis: {
      type: "value",
    },
    series: data?.map((i) => {
      return {
        data: i.data,
        name: i.title + `(${i.unit})`,
        type: "line",
      }
    }),
  }
}
