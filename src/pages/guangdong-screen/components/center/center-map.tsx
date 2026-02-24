/*
 * @Author: chenmeifeng
 * @Date: 2024-04-17 13:53:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-14 17:22:52
 * @Description:
 */
import * as echarts from "echarts"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { useEffect, useRef, useState } from "react"

import guangdongMapData from "@/assets/guangdong-screen/map.json"
import guangxiMapData from "@/assets/guangxi-srceen/map.json"
import useChartRender from "@/hooks/use-chart-render"

// import guangxiMap from
import { geoOption } from "../../configs/map-option"

interface ISiteMapProps {
  series: any
  province?: string
}
interface IChangeZCInfo {
  zoom: number
  center?: any
}
export default function SiteMap(props: ISiteMapProps) {
  const { series, province } = props
  const echartRef = useRef(null)
  const geoInfo = useRef<IChangeZCInfo>({
    zoom: 1.012,
  })
  const sGeoInfo = useRef<IChangeZCInfo>({
    zoom: 1,
  })
  const [guangxiMap, setJson] = useState(null)
  const [chartData, setChartData] = useState({
    mapName: province,
    series: [],
  })
  const currentCity = useRef(null)
  useEffect(() => {
    echarts.registerMap("广东", guangdongMapData as any)
    echarts.registerMap("广西", guangxiMapData as any)
    province === "广东" ? setJson(guangdongMapData) : setJson(guangxiMapData)

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
  }, [province])
  useEffect(() => {
    if (!series?.length) return
    initSiteData({ series })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series])
  const initSiteData = ({ series = [] }) => {
    const obj = {
      series: series,
      screenWidth: window.innerWidth,
      mapName: province,
      geoInfo: geoInfo.current,
      sGeoInfo: sGeoInfo.current,
    }
    currentCity.current = obj
    setChartData(obj)
  }

  const setGeoroam = useRef((params) => {
    const option = echartRef.current?.getEchartsInstance()?._api?.getOption()
    const { zoom, center } = option.series[0]
    if (params.zoom != null) {
      sGeoInfo.current.zoom = zoom
      sGeoInfo.current.center = center
      geoInfo.current.zoom = zoom + 0.03
      geoInfo.current.center = center
    } else {
      geoInfo.current.center = center
      sGeoInfo.current.center = center
    }
    // console.log(center, "center")
    initSiteData(currentCity.current)
  })

  const { chartOptions } = useChartRender(chartData, geoOption)
  return (
    <div style={{ height: "100%", width: "100%" }}>
      {guangxiMap ? (
        <ReactEchartsCore
          ref={(e) => {
            echartRef.current = e
          }}
          onEvents={{ georoam: setGeoroam.current }}
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
