/*
 * @Author: chenmeifeng
 * @Date: 2024-02-21 10:11:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-29 15:54:24
 * @Description:
 */
import "./center-map.less"

import { Button } from "antd"
import * as echarts from "echarts"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { useContext, useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import henan from "@/assets/henan-screen/json/map.json"
import kuang from "@/assets/henan-screen/json/kuang.json"
import anyang from "@/assets/henan-screen/json/anyang.json"
import luohe from "@/assets/henan-screen/json/luohe.json"
// import luoyang from "@/assets/henan-screen/json/luoyang.json"
import nanyang from "@/assets/henan-screen/json/nanyang.json"
import pingdingshan from "@/assets/henan-screen/json/pingdingshan.json"
import xinxiang from "@/assets/henan-screen/json/xinxiang.json"
import xinyang from "@/assets/henan-screen/json/xinyang.json"
import zhoukou from "@/assets/henan-screen/json/zhoukou.json"
import zhumadian from "@/assets/henan-screen/json/zhumadian.json"
import useChartRender from "@/hooks/use-chart-render"
import { getStationType } from "@/utils/device-funs"
import { validResErr } from "@/utils/util-funs"

import { mapList } from "../../configs"
import LargeScreenContext from "@/contexts/screen-context"
import { geoOption } from "../../configs/map-like3d"
import { getMaintenance, getScreenPointData, renderMainOrStnData } from "@/utils/screen-funs"
// import guangxiMap from

export default function MapSiteProvic() {
  const [guangxiMap, setJson] = useState(null)
  const [chartData, setChartData] = useState(null)
  const { setQuotaInfo } = useContext(LargeScreenContext)
  const currentCity = useRef(null)
  const timeout = useRef(3000)
  const timer = useRef<any>()
  const getFile = async () => {
    echarts.registerMap("河南框", kuang as any)
    echarts.registerMap("河南", henan as any)
    echarts.registerMap("内黄基地", anyang as any)
    // echarts.registerMap("安阳昼锦", anyang as any)
    // echarts.registerMap("滑县守风", anyang as any)
    echarts.registerMap("漯河基地", luohe as any)
    echarts.registerMap("独立场站", henan as any)
    echarts.registerMap("南阳基地", nanyang as any)
    echarts.registerMap("平顶山基地", pingdingshan as any)
    echarts.registerMap("新乡基地", xinxiang as any)
    echarts.registerMap("信阳基地", xinyang as any)
    echarts.registerMap("豫东基地", zhoukou as any)
    echarts.registerMap("驻马店基地", zhumadian as any)
    setJson(henan)

    window.addEventListener("resize", () => {
      initSiteData({ mapName: currentCity.current?.mapName, series: currentCity.current?.series })
    })
  }

  // 获取大区数据和区域公司数据
  const getMainAndPointData = async () => {
    const getQuota = await getScreenPointData()
    if (getQuota) setQuotaInfo(getQuota)
    const seriesData = await getMaintenance(mapList)
    initSiteData({ mapName: "河南", series: seriesData })
  }

  const initSiteData = ({ mapName, series = [] }) => {
    const obj = {
      mapName: mapName,
      series: series,
      screenWidth: 5123 || window.innerWidth,
    }
    currentCity.current = obj
    setChartData(obj)
  }

  // 地图点击事件
  const getd = useRef(async (e) => {
    if (e?.seriesType === "effectScatter" && currentCity.current?.mapName === "河南") {
      clearInterval(timer.current)
      initSiteData({ mapName: e.name, series: [] })
      timer.current = setInterval(async () => {
        const stnData = await renderMainOrStnData(e)
        setQuotaInfo(stnData.info)
        initSiteData({ mapName: e.name, series: stnData.series || [] })
      }, timeout.current)
    }
  })
  const cancelMainMap = () => {
    clearInterval(timer.current)
    getMainAndPointData()
    timer.current = setInterval(() => {
      getMainAndPointData()
    }, timeout.current)
  }

  const fun = useRef<any>()
  fun.current = geoOption
  const { chartOptions } = useChartRender(chartData, fun.current)
  useEffect(() => {
    getFile()
    cancelMainMap()
    return () => {
      clearInterval(timer.current)
      window.removeEventListener("resize", () => {
        initSiteData({ mapName: currentCity.current?.mapName, series: currentCity.current?.series })
      })
    }
  }, [])

  return (
    <div className="map-content">
      {chartData?.mapName !== "河南" ? (
        <Button className="map-btn" onClick={cancelMainMap}>
          返回
        </Button>
      ) : (
        ""
      )}
      {guangxiMap ? (
        <ReactEchartsCore
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
