/*
 * @Author: chenmeifeng
 * @Date: 2024-02-21 10:11:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 10:44:27
 * @Description:
 */
// import "./center-map.less"

import { Button } from "antd"
import * as echarts from "echarts"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { useContext, useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import chaonan from "@/assets/guangdong-screen/json/chaonan.json"
import huilai from "@/assets/guangdong-screen/json/huilai.json"
import qingyuan from "@/assets/guangdong-screen/json/qingyuan.json"
import yuebei from "@/assets/guangdong-screen/json/yuebei.json"
import yuexi from "@/assets/guangdong-screen/json/yuexi.json"
import yuezhong from "@/assets/guangdong-screen/json/yuezhong.json"
import zhanjiang from "@/assets/guangdong-screen/json/zhanjiang.json"
import guangdongMapData from "@/assets/guangdong-screen/map.json"
import HbScreenContext from "@/contexts/hubei-screen-context"
import useChartRender from "@/hooks/use-chart-render"
import { getStationType } from "@/utils/device-funs"
import { validResErr } from "@/utils/util-funs"

// import { areaList } from "../../configs"
import { geoOption } from "../../configs/map-option"
import { getMaintenance, getScreenPointData, renderMainOrStnData } from "@/utils/screen-funs"
import { GD_MAINCOMPANY } from "../../configs"
interface IProps {
  large?: boolean
}
interface ISiteMapProps {
  series: any
  province?: string
}
interface IChangeZCInfo {
  zoom: number
  center?: any
}
export default function MapSiteProvic(props: IProps) {
  const { large = true } = props
  const [guangxiMap, setJson] = useState(null)
  const [chartData, setChartData] = useState(null)
  const { setQuotaInfo } = useContext(HbScreenContext)
  const echartRef = useRef(null)
  const geoInfo = useRef<IChangeZCInfo>({
    zoom: 1.012,
  })
  const sGeoInfo = useRef<IChangeZCInfo>({
    zoom: 1,
  })
  const currentCity = useRef(null)
  const timeout = useRef(3000)
  const timer = useRef<any>()
  const getFile = async () => {
    echarts.registerMap("广东", guangdongMapData as any)
    echarts.registerMap("潮南", chaonan as any)
    echarts.registerMap("恵来", huilai as any)
    echarts.registerMap("清远", qingyuan as any)
    echarts.registerMap("粤北", yuebei as any)
    echarts.registerMap("粤中", yuezhong as any)
    echarts.registerMap("粤西", yuexi as any)
    echarts.registerMap("湛江", zhanjiang as any)

    setJson(guangdongMapData)

    window.addEventListener("resize", () => {
      initSiteData({ mapName: currentCity.current?.mapName, series: currentCity.current?.series })
    })
  }

  const getMainAndPointData = async () => {
    const getQuota = await getScreenPointData()
    if (getQuota) setQuotaInfo(getQuota)
    const seriesData = await getMaintenance(GD_MAINCOMPANY)
    initSiteData({ mapName: "广东", series: seriesData })
  }

  const initSiteData = ({ mapName, series = [] }) => {
    const obj = {
      mapName: mapName,
      series: series,
      screenWidth: window.innerWidth,
      geoInfo: geoInfo.current,
      sGeoInfo: sGeoInfo.current,
      // large: large,
    }
    currentCity.current = obj
    setChartData(obj)
  }

  // 地图点击事件
  const getd = useRef(async (e) => {
    if ((e?.seriesType === "scatter" || e?.seriesType === "scatter3D") && currentCity.current?.mapName === "广东") {
      clearInterval(timer.current)
      timer.current = setInterval(async () => {
        const stnData = await renderMainOrStnData(e)
        setQuotaInfo(stnData.info)

        initSiteData({ mapName: e.name, series: stnData.series || [] })
      }, timeout.current)
    }
  })
  // 地图放大事件
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
      {chartData?.mapName !== "广东" ? (
        <Button className="map-btn" onClick={cancelMainMap}>
          返回
        </Button>
      ) : (
        ""
      )}
      {guangxiMap ? (
        <ReactEchartsCore
          ref={(e) => {
            echartRef.current = e
          }}
          onEvents={{ click: getd.current, georoam: setGeoroam.current }}
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
