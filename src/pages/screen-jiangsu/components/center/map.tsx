/*
 * @Author: chenmeifeng
 * @Date: 2024-07-01 15:53:06
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-19 14:56:51
 * @Description:
 */
import useChartRender from "@/hooks/use-chart-render"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { geoOption } from "../../configs/map-like3d"
import { useContext, useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import jiangsuJson from "@/assets/jiangsu-screen/jiangsu.json"
import kuang from "@/assets/jiangsu-screen/kuang.json"
import { useRefresh } from "@/hooks/use-refresh"
import { getAllStnList } from "@/utils/screen-funs"
import { MAP_ICON, TEMPORARY_LAT_LONG } from "../../configs"
import HbScreenContext from "@/contexts/hubei-screen-context"
import { useNavigate } from "react-router-dom"
export const Ser = [
  { name: "江苏", value: [118.76, 32.06], stnDeviceType: "WT", type: "WT" },
  { name: "合肥", value: [117.2, 31.84], stnDeviceType: "WT", type: "WT" },
]
export default function JsCenterMap() {
  const [jiangsuMap, setJson] = useState(null)
  const echartRef = useRef(null)
  const currentCity = useRef(null)
  const isFirst = useRef(true)
  const [chartData, setChartData] = useState({
    series: Ser,
    screenWidth: 6400,
    controlData: null,
  })

  const [reload, setReload] = useRefresh(3000)
  const { quotaInfo } = useContext(HbScreenContext)
  const { chartOptions } = useChartRender(chartData, geoOption)
  const navigate = useNavigate()
  const initSiteData = ({ series = [] }) => {
    const data = {
      series: series,
      screenWidth: 6400,
      controlData: quotaInfo,
    }
    setChartData(data)
    currentCity.current = data
  }
  const clickStation = useRef((e) => {
    if ((e?.seriesType === "scatter" || e?.seriesType === "custom") && e.name !== "集控中心") {
      const { maintenanceComId, stationCode } = e.data
      navigate(`/site/${maintenanceComId}/${stationCode}/matrix`)
    }
  })
  useEffect(() => {
    echarts.registerMap("江苏", jiangsuJson as any)
    echarts.registerMap("江苏框", kuang as any)
    setJson(jiangsuJson)
    initSiteData({})
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
    async function init() {
      const series = await getAllStnList()
      isFirst.current = true
      setReload(false)
      initSiteData({ series: [...series, ...TEMPORARY_LAT_LONG] })
    }
    if (isFirst.current) {
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
          onEvents={{ click: clickStation.current }}
          echarts={echarts}
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        ""
      )}
      <div className="icon-list">
        <span className="icon-name">图例</span>
        {MAP_ICON?.map((i) => {
          return (
            <div key={i.icon} className="icon-list-item">
              <i className={`icon-${i.icon}`}></i>
              <span className="icon-name">{i.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
