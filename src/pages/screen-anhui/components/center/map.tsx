/*
 * @Author: chenmeifeng
 * @Date: 2024-07-10 10:29:52
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 10:58:21
 * @Description:
 */
import useChartRender from "@/hooks/use-chart-render"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { geoOption } from "../../configs/map-like3d"
import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import jiangsuJson from "@/assets/anhui-screen/anhui.json"
import kuang from "@/assets/anhui-screen/anhui-kuang.json"
import { useRefresh } from "@/hooks/use-refresh"
import { getAllStnList } from "@/utils/screen-funs"
import { TEMPORARY_LAT_LONG } from "../../configs"
import { useNavigate } from "react-router"
export const Ser = [
  { name: "江苏", value: [118.76, 32.06], stnDeviceType: "WT", type: "WT" },
  { name: "合肥", value: [117.2, 31.84], stnDeviceType: "WT", type: "WT" },
]
export default function AhCenterMap() {
  const [jiangsuMap, setJson] = useState(null)
  const echartRef = useRef(null)
  const currentCity = useRef(null)
  const isFirst = useRef(true)
  const [chartData, setChartData] = useState({
    series: Ser,
    screenWidth: 6400,
  })

  const navigate = useNavigate()
  const [reload, setReload] = useRefresh(3000)
  const { chartOptions } = useChartRender(chartData, geoOption)

  const initSiteData = ({ series = [] }) => {
    const data = {
      series: series,
      screenWidth: 1920,
    }

    setChartData(() => {
      return {
        ...data,
      }
    })
    currentCity.current = data
  }
  // 地图点击事件
  const getd = useRef(async (e) => {
    if ((e?.seriesType === "scatter" || e?.seriesType === "custom") && e.name !== "集控中心") {
      const { maintenanceComId, stationCode } = e.data
      navigate(`/site/${maintenanceComId}/${stationCode}/matrix`)
    }
  })
  async function init() {
    const series = await getAllStnList()
    if (!series) return

    isFirst.current = true
    setReload(false)
    initSiteData({ series: [...(series || []), ...TEMPORARY_LAT_LONG] })
  }
  useEffect(() => {
    echarts.registerMap("安徽", jiangsuJson as any)
    echarts.registerMap("安徽框", kuang as any)
    setJson(jiangsuJson)
    initSiteData({ series: TEMPORARY_LAT_LONG })
    window.addEventListener("resize", () => {
      initSiteData(currentCity.current)
    })
    return () => {
      window.removeEventListener("resize", () => {
        initSiteData(currentCity.current)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (isFirst.current && reload) {
      isFirst.current = false
      init()
    }
  }, [reload])
  return (
    <div className="map-center">
      {jiangsuMap ? (
        <ReactEchartsCore
          ref={(e) => {
            echartRef.current = e
          }}
          onEvents={{ click: getd.current }}
          echarts={echarts}
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        ""
      )}
    </div>
  )
}
