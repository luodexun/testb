/*
 * @Author: xiongman
 * @Date: 2023-08-28 15:01:24
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-28 15:01:24
 * @Description: 图表自滚动hook方法
 */

import { MutableRefObject, useEffect, useRef } from "react"

import { IChartRef } from "@/components/chart-render/interfaces.ts"

interface IConfig {
  step?: number
  timeout?: number
}
interface IScrollConfig {
  startValue: number
  endValue: number
  timeFlag: number
}
function doDataZoomScroll(chartEl: any, xAxisCount: number, config?: IConfig & IScrollConfig) {
  if (config.timeFlag < 0 || chartEl.isDisposed()) return

  const { step = 10, timeout = 1000 } = config

  chartEl.dispatchAction({ type: "dataZoom", startValue: config.startValue, endValue: config.endValue })
  config.startValue += 1
  if (config.endValue === xAxisCount) config.startValue = 0
  config.endValue = config.startValue + step
  if (config.endValue > xAxisCount) config.endValue = xAxisCount
  window.clearTimeout(config.timeFlag)
  config.timeFlag = window.setTimeout(() => doDataZoomScroll(chartEl, xAxisCount, config), timeout)
}
export default function useDataZoomScroll(
  chartRef: MutableRefObject<IChartRef>,
  xAxisCount?: number,
  config?: IConfig,
) {
  const { step = 6, timeout = 1000 } = config || {}
  const configRef = useRef({ startValue: 0, endValue: step, timeFlag: 0, step, timeout })

  useEffect(() => {
    const config = configRef.current
    const chartEl = chartRef?.current?.getEchartsInstance()
    const chartDom = chartEl?.getDom()
    if (!chartDom) return () => {}
    function stop() {
      window.clearTimeout(config.timeFlag)
      config.timeFlag = 0
    }
    function start() {
      stop()
      doDataZoomScroll(chartEl, xAxisCount, config)
    }
    if (chartEl && xAxisCount && xAxisCount > step) {
      window.setTimeout(start, 2000)
      chartDom.addEventListener("mouseenter", stop)
      chartDom.addEventListener("mouseout", start)
    }
    return () => {
      window.clearTimeout(config.timeFlag)
      chartDom.removeEventListener("mouseenter", stop)
      chartDom.removeEventListener("mouseout", start)
    }
  }, [chartRef, step, xAxisCount])
}
