/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-12 14:40:30
 * @Description:
 */
import { judgeNull } from "@utils/util-funs.tsx"

import { IAgvcInfo } from "@/types/i-agvc.ts"

import { AGCChartSeries, AVCChartSeries } from "../configs/trend-chart"

export const tranformSeries = (data: IAgvcInfo[], type: "AGC" | "AVC") => {
  const result = { series: [], legend: [] }
  const seriesCfg = type === "AGC" ? AGCChartSeries : AVCChartSeries
  let name: string
  return seriesCfg.reduce((prev, { field, title, unit, caculate }) => {
    name = `${title}(${unit})`
    prev.series.push({
      name,
      type: "line",
      smooth: true,
      data: data?.map((item) => judgeNull(item[field], caculate, 2)) || [],
    })
    prev.legend.push(name)
    return prev
  }, result)
}
