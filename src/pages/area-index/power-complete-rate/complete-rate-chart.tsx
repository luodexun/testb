/*
 * @Author: xiongman
 * @Date: 2023-08-28 13:43:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-29 10:39:59
 * @Description: 区域中心-指标总览-发电量完成率-图表组件
 */

import useChartRender from "@hooks/use-chart-render.ts"
import useDataZoomScroll from "@hooks/use-data-zoom-scroll.ts"

import ChartRender from "@/components/chart-render"
import { IBaseChartProps } from "@/types/i-page.ts"

import { completeRateOption, ICompleteRateChartData } from "./complete-rate-option.ts"
interface IComRateChartProps extends IBaseChartProps<ICompleteRateChartData> {
  step?: number
}
export default function CompleteRateChart(props: IComRateChartProps) {
  const { data, loading, step } = props

  const { chartRef, chartOptions } = useChartRender<ICompleteRateChartData>(data, completeRateOption)

  useDataZoomScroll(chartRef, data?.stations?.length, { step: step ?? 5 })

  return <ChartRender ref={chartRef} loading={loading} option={chartOptions} />
}
