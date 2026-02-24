/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 16:58:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-28 16:28:53
 *@Description: 报表管理-功率预测报表-曲线
 */
import useChartRender from "@hooks/use-chart-render.ts"
import { useEffect, useState } from "react"

import ChartRender from "@/components/chart-render"
import { IBaseChartProps } from "@/types/i-page.ts"

import runTrendOption, { efRunTrendOption, IRunTrendChartData } from "./efficency-option.ts"
export default function CurveContent(props: IBaseChartProps<IRunTrendChartData[]>) {
  const { data, loading } = props
  const { chartRef, chartOptions } = useChartRender<IRunTrendChartData>(data?.[0], efRunTrendOption)
  return (
    <div className="l-full curve-warp">
      <ChartRender ref={chartRef} loading={loading} option={chartOptions} />
    </div>
  )
}
