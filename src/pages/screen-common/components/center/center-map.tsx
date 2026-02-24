/*
 * @Author: chenmeifeng
 * @Date: 2024-02-21 10:11:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 10:59:16
 * @Description:
 */
import "./center-map.less"

import { Button } from "antd"
import * as echarts from "echarts"
import ReactEchartsCore from "echarts-for-react/lib/core"
import { useContext, useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import HbScreenContext from "@/contexts/hubei-screen-context"
import useChartRender from "@/hooks/use-chart-render"
import { getStationType } from "@/utils/device-funs"
import { validResErr } from "@/utils/util-funs"
import { areaList } from "@pages/hb-new-screen/configs"
import { geoOption } from "../../configs/map-like3d"
import { getAllStnList, getMaintenance, getScreenUrl } from "@/utils/screen-funs"
import { getMapName } from "../../methods"
import { useRefresh } from "@/hooks/use-refresh"
import { GD_MAINCOMPANY } from "@/pages/guangdong-screen/configs"
import gdsrn from "@/assets/shanxi-screen/map.json"
import gdksrn from "@/assets/shanxi-screen/kuang.json"
interface IProps {
  large?: boolean
}
export default function MapSiteProvic(props: IProps) {
  const { large = true } = props
  const [guangxiMap, setJson] = useState(null)
  const [chartData, setChartData] = useState(null)
  const { setQuotaInfo } = useContext(HbScreenContext)
  const currentCity = useRef({
    mapName: "",
    series: [],
  })
  const screenName = useRef("")
  const timeout = useRef(3000)
  const timer = useRef<any>()
  const [reload, setReload] = useRefresh(3000)
  const getFile = async () => {
    const screen = await getScreenUrl()
    console.log(screen)
    echarts.registerMap("山西", gdsrn as any)
    echarts.registerMap("山西框", gdksrn as any)
    try {
      // debugger
      const { kuangName, mapName, kuangMap, provinceMap, otherMap } = await getMapName(screen)
      currentCity.current.mapName = mapName
      screenName.current = mapName
      echarts.registerMap(kuangName, kuangMap as any)
      echarts.registerMap(mapName, provinceMap as any)

      Object.keys(otherMap)?.forEach((i) => {
        echarts.registerMap(i, otherMap[i] as any)
      })
      setTimeout(() => {
        setJson(provinceMap || null)
      }, 500)
    } catch (e) {
      console.log("地图资源加载")
    }

    window.addEventListener("resize", () => {
      initSiteData({ mapName: currentCity.current?.mapName, series: currentCity.current?.series })
    })
  }

  // 获取全部区域公司数据并渲染地图
  const getMaintenances = async () => {
    // 只有广东有区域公司分级
    if (screenName.current !== "广东") {
      const allPoint = await getAllStnList()
      initSiteData({ mapName: screenName.current, series: allPoint })
      return
    } else {
      const seriesData = await getMaintenance(GD_MAINCOMPANY)
      initSiteData({ mapName: screenName.current, series: seriesData })
    }
  }
  const initSiteData = ({ mapName, series = [] }) => {
    const obj = {
      mapName: mapName,
      series: series,
      screenWidth: 3840 || window.innerWidth,
      large: large,
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
    if (
      (e?.seriesType === "effectScatter" || e?.seriesType === "scatter3D") &&
      currentCity.current?.mapName === screenName.current
    ) {
      clearInterval(timer.current)
      console.log(e, "sdfsdf")
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
          value: lat ? [lng, lat, 50] : [],
          stnDeviceType: getStationType(i.stationType),
        }
      }) || []
    console.log(series, "series")

    initSiteData({ mapName: e.name, series: series })
  }
  const cancelMainMap = () => {
    clearInterval(timer.current)
    getMaintenances()
    getScreenPointData()
    timer.current = setInterval(() => {
      getMaintenances()
      getScreenPointData()
    }, timeout.current)
  }

  const fun = useRef<any>()
  fun.current = geoOption
  const { chartOptions } = useChartRender(chartData, fun.current)
  const initData = async () => {
    await getFile()
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      getMaintenances()
      getScreenPointData()
    }, timeout.current)
    getMaintenances()
    getScreenPointData()
  }
  useEffect(() => {
    initData()
    return () => {
      clearInterval(timer.current)
      window.removeEventListener("resize", () => {
        initSiteData({ mapName: currentCity.current?.mapName, series: currentCity.current?.series })
      })
    }
    // if (!reload) return
    //   getMaintenance()
    //   getScreenPointData()
  }, [])

  return (
    <div className="nhb-map-content">
      {chartData?.mapName !== screenName.current ? (
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
