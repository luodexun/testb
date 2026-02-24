/*
 * @Author: chenmeifeng
 * @Date: 2024-07-01 15:53:06
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-04 09:53:46
 * @Description:
 */
import useChartRender from "@/hooks/use-chart-render"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { geoOption } from "../../configs/map-like3d"
import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import kuang from "@/assets/liaoning-screen/json/map.json"
import mapjson from "@/assets/liaoning-screen/json/kuang.json"
import { useRefresh } from "@/hooks/use-refresh"
import { getAllStnList } from "@/utils/screen-funs"
import { MAP_ICONS, TEMPORARY_LAT_LONG } from "../../configs/index"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
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
  const { chartOptions } = useChartRender(chartData, geoOption)
  const mainCpnInfo = useAtomValue(mainComAtom)

  const initSiteData = ({ series = [] }) => {
    const data = {
      series: series,
      screenWidth: 6400,
      controlData: mainCpnInfo,
    }
    setChartData(data)
    currentCity.current = data
  }
  const init = async () => {
    const series = await getAllStnList()
    isFirst.current = true
    setReload(false)
    initSiteData({ series: [...series, ...TEMPORARY_LAT_LONG] })
  }
  useEffect(() => {
    echarts.registerMap("东北", mapjson as any)
    echarts.registerMap("东北框", kuang as any)
    setJson(mapjson)
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
          // onEvents={{ georoam: setGeoroam.current }}
          echarts={echarts}
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        ""
      )}
      <div className="icon-list">
        <span className="icon-name">图例</span>
        {MAP_ICONS?.map((i) => {
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
