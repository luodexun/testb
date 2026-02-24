/*
 * @Author: chenmeifeng
 * @Date: 2024-02-21 10:11:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-07 16:36:08
 * @Description:
 */
import "./center-map.less"

import { Button } from "antd"
import * as echarts from "echarts"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { useContext, useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import exibei from "@/assets/hubei-screen/exibei.json"
import jiangxi from "@/assets/hubei-screen/jiangxi.json"
import lianyuan from "@/assets/hubei-screen/lianyuan.json"
import fileData from "@/assets/hubei-screen/province-map.json"
import sichuan from "@/assets/hubei-screen/sichuan.json"
import suizhou from "@/assets/hubei-screen/suizhou.json"
import noBorderMap from "@/assets/hubei-screen/unborder-map.json"
import xianning from "@/assets/hubei-screen/xianning.json"
import xiantao from "@/assets/hubei-screen/xiantao.json"
import HbScreenContext from "@/contexts/hubei-screen-context"
import useChartRender from "@/hooks/use-chart-render"
import { geoOption } from "@/pages/hb-new-screen/configs/map-like3d"
import { getStationType } from "@/utils/device-funs"
import { validResErr } from "@/utils/util-funs"

import { areaList } from "../configs"
// import guangxiMap from

export default function MapSiteProvic() {
  const [guangxiMap, setJson] = useState(null)
  const [chartData, setChartData] = useState(null)
  const { setQuotaInfo } = useContext(HbScreenContext)
  const currentCity = useRef(null)
  const timeout = useRef(3000)
  const timer = useRef<any>()
  const getFile = async () => {
    echarts.registerMap("华中框", noBorderMap as any)
    echarts.registerMap("华中", fileData as any)
    echarts.registerMap("咸宁", xianning as any)
    echarts.registerMap("鄂西北", exibei as any)
    echarts.registerMap("仙桃", xiantao as any)
    echarts.registerMap("随州", suizhou as any)
    echarts.registerMap("江西", jiangxi as any)
    echarts.registerMap("涟源", lianyuan as any)
    echarts.registerMap("四川", sichuan as any)
    setJson(fileData)

    window.addEventListener("resize", () => {
      initSiteData({ mapName: currentCity.current?.mapName, series: currentCity.current?.series })
    })
  }

  // 获取全部区域公司数据并渲染地图
  const getMaintenance = async () => {
    const allMain = await doBaseServer("getScreenPoint", { groupByPath: "MAINTENANCE_COM_ID" })

    const valid = validResErr(allMain)
    if (valid) return initSiteData({ mapName: "华中", series: [] })
    const allMaintnList = areaList?.map((i) => {
      let info = allMain?.find((item) => item.maintenanceComShortName === i.name)
      info = commonDealInfo(info)
      return {
        ...i,
        windSpeed: info?.windSpeed,
        activePower: info?.activePower,
        dailyProduction: info?.dailyProduction,
        stnDeviceType: "ALL",
      }
    })
    initSiteData({ mapName: "华中", series: allMaintnList })
  }
  const initSiteData = ({ mapName, series = [] }) => {
    const obj = {
      mapName: mapName,
      series: series,
      screenWidth: window.innerWidth,
    }
    currentCity.current = obj
    setChartData(obj)
  }
  // 获取大区数据
  const getScreenPointData = async () => {
    const res = await doBaseServer("getScreenPoint", { groupByPath: "REGION_COM_ID" })
    if (validResErr(res)) return
    const info = commonDealInfo(res?.[0])
    setQuotaInfo(info)
  }

  // 获取该检修公司数据
  const getMaintenanceOfStn = async (company: string) => {
    const allMain = await doBaseServer("getScreenPoint", { groupByPath: "MAINTENANCE_COM_ID" })
    if (validResErr(allMain)) return
    let info = allMain.find((item) => item.maintenanceComShortName === company)
    info = commonDealInfo(info)
    setQuotaInfo(info)
    return getStnList(company, info)
  }

  // 公共处理数据
  const commonDealInfo = (info) => {
    if (!info) return null
    info.totalInstalledCapacity = info.totalInstalledCapacity / 10000
    info.activePower = info.activePower / 10000
    info.dailyProduction = info.dailyProduction / 10000
    info.wtInstalledCapacity = info.wtInstalledCapacity / 10000
    info.wtDailyProduction = info.wtDailyProduction / 10000
    info.pvinvInstalledCapacity = info.pvinvInstalledCapacity / 10000
    info.pvinvDailyProduction = info.pvinvDailyProduction / 10000
    info.espcsInstalledCapacity = info.espcsInstalledCapacity / 10000
    return info
  }

  const getStnList = async (company: string, info) => {
    const allStn = await doBaseServer("getScreenPoint", { groupByPath: "STATION_CODE" })
    if (validResErr(allStn)) return
    if (!info?.maintenanceComId) return []
    const getAllStn = await doBaseServer("allStationsData", { maintenanceComId: info?.maintenanceComId })
    // console.log(getAllStn, "getAllStn", info)
    const result = getAllStn?.map((i) => {
      let oneInfo = allStn.find((item) => item.stationId === i.id)
      oneInfo = commonDealInfo(oneInfo)
      const mixedInfo = Object.assign({}, oneInfo, i)
      return mixedInfo
    })
    return result || []
  }
  // 地图点击事件
  const getd = useRef(async (e) => {
    if (e?.seriesType === "scatter" && currentCity.current?.mapName === "华中") {
      clearInterval(timer.current)

      timer.current = setInterval(() => {
        renderMainOrStnData(e)
      }, timeout.current)
    }
  })
  const renderMainOrStnData = async (e) => {
    const stnList = await getMaintenanceOfStn(e.name)
    const series =
      stnList?.map((i) => {
        const lat = parseFloat(i.tags?.latitude)
        const lng = parseFloat(i.tags?.longitude)
        return {
          ...i,
          name: i.stationShortName,
          value: lat ? [lng, lat] : [],
          stnDeviceType: getStationType(i.stationType),
        }
      }) || []
    initSiteData({ mapName: e.name, series: series })
  }
  const cancelMainMap = () => {
    clearInterval(timer.current)
    getMaintenance()
    getScreenPointData()
    timer.current = setInterval(() => {
      getMaintenance()
      getScreenPointData()
    }, timeout.current)
  }

  const fun = useRef<any>()
  fun.current = geoOption
  const { chartOptions } = useChartRender(chartData, fun.current)
  useEffect(() => {
    getFile()
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      getMaintenance()
      getScreenPointData()
    }, timeout.current)
    getMaintenance()
    getScreenPointData()
    return () => {
      clearInterval(timer.current)
      window.removeEventListener("resize", () => {
        initSiteData({ mapName: currentCity.current?.mapName, series: currentCity.current?.series })
      })
    }
  }, [])

  return (
    <div className="map-content">
      {chartData?.mapName !== "华中" ? (
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
