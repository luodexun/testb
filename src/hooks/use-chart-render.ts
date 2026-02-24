/*
 * @Author: xiongman
 * @Date: 2023-08-28 17:38:49
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-28 17:38:49
 * @Description: 图表配置数据处理hook方法
 */

import { useEffect, useRef, useState } from "react"

import type { IChartRef } from "@/components/chart-render/interfaces.ts"

export default function useChartRender<TData>(data: TData, optionFun: (data?: TData) => any) {
  const [chartOptions, setChartOptions] = useState<any>(optionFun())
  const chartRef = useRef<IChartRef>()

  useEffect(() => {
    // if (!data) return
    setChartOptions(optionFun(data))
  }, [data, optionFun])

  useEffect(() => {
    const wrapDom = chartRef.current?.getWrapDom()
    if (!wrapDom || !chartOptions?.series) return
    chartRef.current.setChartHeight("100%")
  }, [chartOptions])

  return { chartOptions, chartRef }
}
