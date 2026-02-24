/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:13:13
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-28 18:13:13
 * @Description: 区域中心-指标总览-等效利用小时数图表
 */

import useChartRender from "@hooks/use-chart-render.ts"
import useDataZoomScroll from "@hooks/use-data-zoom-scroll.ts"

import ChartRender from "@/components/chart-render"
import { IBaseChartProps } from "@/types/i-page.ts"

import utilizationHoursOption, { IHourChartData } from "./utilization-hours-option.ts"

export default function UtilizationHoursChart(props: IBaseChartProps<IHourChartData>) {
  const { data, loading } = props

  const { chartRef, chartOptions } = useChartRender<IHourChartData>(data, utilizationHoursOption)

  useDataZoomScroll(chartRef, data?.xAxis?.length, { step: 6 })

  return <ChartRender ref={chartRef} loading={loading} option={chartOptions} />
}
