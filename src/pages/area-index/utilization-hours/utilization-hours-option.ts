/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:14:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-12 14:54:41
 * @Description: 区域中心-指标总览-等效利用小时数图表配置数据
 */

import { baseAxisLabel, baseGrid, baseTooltip, baseYAxis, scrollDataZoom } from "@configs/chart-fragments.ts"

import { TDeviceType } from "@/types/i-config.ts"
import { IBaseChartOption } from "@/types/i-page.ts"

export interface IHourChartData extends Omit<IBaseChartOption, "data"> {
  data: Partial<Record<TDeviceType | "total", (number | null)[]>>
  deviceType: TDeviceType[]
}

function crtSeries(data: IHourChartData["data"], dvsName: TDeviceType | "total") {
  const isTotal = dvsName === "total"
  const barWidth = isTotal ? 6 : 14
  const stack = isTotal ? undefined : "device_type"
  const name = isTotal ? "总数" : dvsName
  return {
    name,
    type: "bar",
    barWidth,
    stack,
    data: data[dvsName] || [],
    emphasis: { focus: "series" },
    tooltip: {
      valueFormatter: function (value: number) {
        return `${value ?? "-"} h`
      },
    },
  }
}

export default function utilizationHoursOption(params: IHourChartData) {
  const { xAxis, data, deviceType } = params || { xAxis: [], data: {}, deviceType: [] }

  const seriesNames: (TDeviceType | "total")[] = [...deviceType, "total"]
  const series = seriesNames.map(crtSeries.bind(null, data))

  return {
    grid: baseGrid,
    tooltip: { ...baseTooltip, appendToBody: true },
    dataZoom: scrollDataZoom(),
    xAxis: {
      name: "月份",
      type: "category",
      nameGap: 6,
      axisLine: { show: true },
      axisLabel: { ...baseAxisLabel, interval: 0 }, // , formatter: (value: string) => uDate(value, day4M, dayM2D)
      data: xAxis,
      nameTextStyle: {
        color: "#ededed",
      },
    },
    yAxis: { name: "小时数(h)", ...baseYAxis },
    series,
  }
}
