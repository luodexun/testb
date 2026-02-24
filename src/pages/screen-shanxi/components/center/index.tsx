/*
 * @Author: chenmeifeng
 * @Date: 2024-07-30 10:41:59
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-14 17:26:35
 * @Description: 中间模块
 */
import "./index.less"
import useChartRender from "@/hooks/use-chart-render"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { geoOption } from "../../configs/map-like3d"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import * as echarts from "echarts"
import shanxiJson from "@/assets/shanxi-screen/map.json"
import kuang from "@/assets/shanxi-screen/kuang.json"
import { useRefresh } from "@/hooks/use-refresh"
import { getAllStnList } from "@/utils/screen-funs"
import { TEMPORARY_LAT_LONG } from "../../configs"
import LargeScreenContext from "@/contexts/screen-context"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
export const Ser = [
  { name: "江苏", value: [118.76, 32.06], stnDeviceType: "WT", type: "WT" },
  { name: "合肥", value: [117.2, 31.84], stnDeviceType: "WT", type: "WT" },
]
export default function SXCenterMap(props) {
  const [mapJson, setJson] = useState(null)
  const echartRef = useRef(null)
  const currentCity = useRef(null)
  const isFirst = useRef(true)
  const [chartData, setChartData] = useState({
    series: [],
    screenWidth: 1920,
  })

  const { quotaInfo } = useContext(LargeScreenContext)
  const [reload, setReload] = useRefresh(3000)
  const { chartOptions } = useChartRender(chartData, geoOption)
  const mainCpnInfo = useAtomValue(mainComAtom)

  const initSiteData = ({ series = [] }) => {
    const data = {
      series: series,
      screenWidth: 1920,
    }

    setChartData(data)
    currentCity.current = data
  }
  const init = async () => {
    if (!quotaInfo?.siteInfo || quotaInfo?.siteInfo?.useInterfaceData) {
      const series = await getAllStnList()
      isFirst.current = true
      setReload(false)
      const control = TEMPORARY_LAT_LONG.find((i) => i.type === "Control")
      const showSeries = [
        ...(series || []),
        { ...control, ...mainCpnInfo },
        ...TEMPORARY_LAT_LONG.filter((i) => i.type !== "Control"),
      ]
      initSiteData({ series: showSeries })
    }
  }
  useEffect(() => {
    echarts.registerMap("山西", shanxiJson as any)
    echarts.registerMap("山西框", kuang as any)
    setJson(shanxiJson)
    // initSiteData({ series: [] })
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
  }, [reload, quotaInfo, mainCpnInfo])
  useEffect(() => {
    if (!quotaInfo?.siteInfo || quotaInfo?.siteInfo?.useInterfaceData) {
      init()
      return
    }
    initSiteData({
      series: quotaInfo?.siteInfo?.list?.map((i) => {
        return {
          ...i,
          value: i.value?.split(",")?.map((i) => parseFloat(i.trim())),
          ...i.tooltipContent,
        }
      }),
    })
  }, [quotaInfo])
  return (
    <div className="sx-center-map">
      {mapJson ? (
        <ReactEchartsCore
          ref={(e) => {
            echartRef.current = e
          }}
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
