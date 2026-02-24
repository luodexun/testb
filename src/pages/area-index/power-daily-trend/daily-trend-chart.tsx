/*
 * @Author: xiongman
 * @Date: 2023-08-28 17:35:49
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-28 17:35:49
 * @Description: 区域中心-指标总览-日电量趋势图表
 */

import useChartRender from "@hooks/use-chart-render.ts"

import ChartRender from "@/components/chart-render"
import { IBaseChartProps } from "@/types/i-page.ts"

import { dailyTrendOption, IDailyTrendChartData } from "./daily-trend-option.ts"

export default function DailyTrendChart(props: IBaseChartProps<IDailyTrendChartData>) {
  const { data, loading } = props

  const { chartRef, chartOptions } = useChartRender<IDailyTrendChartData>(data, dailyTrendOption)

  return <ChartRender ref={chartRef} loading={loading} option={chartOptions} />
}
