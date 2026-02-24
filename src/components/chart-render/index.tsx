/*
 * @Author: chenmeifeng
 * @Date: 2023-10-13 10:35:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-23 15:50:31
 * @Description:
 */

import { Empty } from "antd"
import * as echarts from "echarts"
import ReactEchartsCore from "echarts-for-react/lib/core"
import React, { CSSProperties, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"

import WindowSizeContext from "@/contexts/window-size-context"

import { IChartProps, IChartRef } from "./interfaces"

const EMPTY_STYLE: CSSProperties = {
  position: "absolute",
  left: "50%",
  height: "80%",
  opacity: 0.5,
  overflow: "hidden",
  transform: "translateX(-50%)",
}
function hasData(list: { data: any } | { data: any }[]) {
  if (Array.isArray(list)) {
    return list?.find((item: any) => !!item.data?.length)
  }
  return list?.data?.length
}

const ChartRender = forwardRef<IChartRef, IChartProps>((props, ref) => {
  const { option, wrapClass, empty, onClick, ...sets } = props
  const [isEmpty, setIsEmpty] = useState(false)
  const { needResize, setNeedResize } = useContext(WindowSizeContext)
  const chartRef = useRef<any>()
  const timeoutRef = useRef(0)
  const resizeFlag = useRef(0)
  const chartWrapRef = useRef<HTMLDivElement>(null)

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    resize: () => chartRef.current && chartRef.current.resize(),
    getEchartsInstance: () => {
      if (!chartRef.current) return null
      return chartRef.current.getEchartsInstance()
    },
    getWrapDom: () => chartWrapRef.current,
    setChartHeight: (height: string) => {
      chartWrapRef.current?.style.setProperty("--chart-wrap", height)
      chartWrapRef.current?.style.setProperty("height", height)
    },
  }))

  useEffect(() => {
    // 刚加载页面时因弹性布局造成初始dom尺寸没确定，echart画布尺寸会不准，需要resize几次
    if (!option || !chartRef.current) return
    if (resizeFlag.current > 4) return
    timeoutRef.current = window.setTimeout(() => {
      chartRef.current && chartRef.current.resize()
      resizeFlag.current++
    }, 800)
    return () => clearTimeout(timeoutRef.current)
  }, [option])

  useEffect(() => {
    if (!option) return
    setIsEmpty(!hasData(option.series) && empty)
  }, [empty, option])

  useEffect(() => {
    if (!needResize) return
    resizeFlag.current = 3
    chartRef.current && chartRef.current.resize()
    setNeedResize(false)
  }, [setNeedResize, needResize])

  return (
    <div ref={chartWrapRef} style={{ position: "relative", height: "100%", width: "100%" }} className="chart-wrap">
      {isEmpty ? <Empty style={EMPTY_STYLE} description={false} imageStyle={{ height: "50%" }} /> : null}
      <ReactEchartsCore
        ref={chartRef}
        echarts={echarts}
        notMerge
        lazyUpdate
        option={option}
        className={wrapClass}
        style={{ height: "100%", width: "100%" }}
        onEvents={{
          click: onClick,
        }}
        {...sets}
      />
    </div>
  )
})
ChartRender.displayName = "ChartRender"
export default ChartRender
