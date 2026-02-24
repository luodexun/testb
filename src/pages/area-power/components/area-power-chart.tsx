/*
 * @Author: xiongman
 * @Date: 2023-09-04 16:24:51
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-04 16:24:51
 * @Description: 区域中心-功率总览-功率图表
 */

import useChartRender from "@hooks/use-chart-render.ts"

import ChartRender from "@/components/chart-render"
import { IBaseChartProps } from "@/types/i-page.ts"

import { IchartData } from "../types.ts"
import { areaPowerOption } from "./area-power-option.ts"

interface IBaseProps extends IBaseChartProps<IchartData> {
  element?: string[]
}

export default function AreaPowerChart(props: IBaseProps) {
  const { data, loading } = props

  const { chartRef, chartOptions } = useChartRender<IchartData>(data, areaPowerOption)

  return <ChartRender ref={chartRef} loading={loading} empty option={chartOptions} />
}
