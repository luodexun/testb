/*
 * @Author: chenmeifeng
 * @Date: 2024-02-21 10:11:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-12 17:30:43
 * @Description:
 */
import * as echarts from "echarts"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { useEffect, useRef, useState } from "react"

import guangxiMapData from "@/assets/guangxi-srceen/map.json"
import useChartRender from "@/hooks/use-chart-render"

// import guangxiMap from
import { geoOption } from "../configs/map-option"

interface EchartProps {
  siteInfo: any
}
export default function SiteMap(props: EchartProps) {
  const { siteInfo } = props
  const [guangxiMap, setJson] = useState()
  const [chartData, setChartData] = useState(null)
  const siteAllInfo = useRef(null)
  useEffect(() => {
    echarts.registerMap("广西", guangxiMapData as any)
    setJson(guangxiMapData as any)

    initSiteData()
    window.addEventListener("resize", initSiteData)
    return () => {
      window.removeEventListener("resize", initSiteData)
    }
  }, [])
  useEffect(() => {
    if (!siteInfo) return
    siteAllInfo.current = siteInfo
    initSiteData()
  }, [siteInfo])
  const initSiteData = () => {
    setChartData({
      series:
        siteAllInfo.current?.siteList?.map((i) => {
          return { ...i, value: i.value?.split(",") }
        }) || [],
      screenWidth: window.innerWidth,
      tooltipContent: siteAllInfo.current?.tooltipContent || [],
    })
  }

  const { chartOptions } = useChartRender(chartData, geoOption)
  return (
    <div style={{ height: "100%", width: "100%" }}>
      {guangxiMap ? (
        <ReactEchartsCore echarts={echarts} option={chartOptions} style={{ height: "100%", width: "100%" }} />
      ) : (
        ""
      )}
    </div>
  )
}
