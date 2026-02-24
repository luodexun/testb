/*
 * @Author: chenmeifeng
 * @Date: 2024-07-24 10:29:52
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-03 13:48:35
 * @Description:
 */
import useChartRender from "@/hooks/use-chart-render"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { geoOption } from "../../configs/map-like3d"
import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import mapJson from "@/assets/ningxia-screen/json/ningxia.json"
import kuang from "@/assets/ningxia-screen/json/ningxia-kuang.json"
import { useRefresh } from "@/hooks/use-refresh"
import { getAllStnList } from "@/utils/screen-funs"
import { TEMPORARY_LAT_LONG } from "../../configs"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
import { useNavigate } from "react-router"
import { getsiteUrl } from "@/router/menu-site"
export const Ser = [
  // { name: "江苏", value: [118.76, 32.06], stnDeviceType: "WT", type: "WT" },
  // { name: "合肥", value: [117.2, 31.84], stnDeviceType: "WT", type: "WT" },
]
export default function NXCenterMap(props) {
  const [ningxiaMap, setJson] = useState(null)
  const echartRef = useRef(null)
  const currentCity = useRef(null)
  const isFirst = useRef(true)
  const [chartData, setChartData] = useState({
    series: [],
    controlData: null,
    screenWidth: 4230,
  })

  const [reload, setReload] = useRefresh(3000)
  const { chartOptions } = useChartRender(chartData, geoOption)
  const quotaInfo = useAtomValue(mainComAtom)
  const navigate = useNavigate()

  const initSiteData = ({ series = [] }) => {
    const data = {
      series: series,
      screenWidth: 4230,
      controlData: quotaInfo,
    }
    setChartData(data)
    currentCity.current = data
  }
  // 地图点击事件
  const getd = useRef(async (e) => {
    if (e?.seriesType === "effectScatter" || e?.seriesType === "scatter") {
      const { maintenanceComId, stationCode, stationType, stnDeviceType } = e.data

      stnDeviceType !== "Control" ? navigate(`/site/${maintenanceComId}/${stationCode}/${getsiteUrl(stationType)}`) : ""
    }
  })
  const init = async () => {
    const series = await getAllStnList()
    if (!series) return
    isFirst.current = true
    setReload(false)
    // initSiteData({ series: [...(series || [])] })
    initSiteData({ series: [...(series || []), ...TEMPORARY_LAT_LONG] })
  }
  useEffect(() => {
    echarts.registerMap("宁夏", mapJson as any)
    echarts.registerMap("宁夏框", kuang as any)
    setJson(mapJson)
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
      {ningxiaMap ? (
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
