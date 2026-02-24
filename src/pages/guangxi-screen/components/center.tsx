/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 13:51:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-20 11:06:45
 * @Description:
 */
import "./center.less"

import { useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { getStationType } from "@/utils/device-funs"
import { validResErr } from "@/utils/util-funs"

// import { IGroupType } from "../types"
import TypeQuota from "@/pages/guangdong-screen/components/center/center-bottom"
import MapSiteProvic from "@/pages/guangdong-screen/components/center/center-map"
import CenterTopBox from "@/pages/guangdong-screen/components/center/center-top"
import { IGroupType } from "@/types/i-screen"
import HbScreenContext from "@/contexts/hubei-screen-context"
export default function GDCenterContent(props) {
  const [quotaInfo, setQuotaInfo] = useState(null)
  const [currentMode, setCurrentMode] = useState<IGroupType>("REGION_COM_ID")
  const [mapSeries, setMapSeries] = useState([])
  const timeout = useRef(3000)
  const timer = useRef<any>()
  // 获取该检修公司数据
  const getMaintenanceOfStn = async () => {
    const allMain = await doBaseServer("getScreenPoint", { groupByPath: "REGION_COM_ID" })
    // let info = allMain?.find((item) => item.maintenanceComShortName === company)
    if (validResErr(allMain)) return
    const info = commonDealInfo(allMain?.[0])
    setQuotaInfo(info)
    return getStnList()
  }

  const getStnList = async () => {
    const allStn = await doBaseServer("getScreenPoint", { groupByPath: "STATION_CODE" })
    // if (!info?.maintenanceComId) return []
    const getAllStn = await doBaseServer("allStationsData")
    // console.log(getAllStn, "getAllStn", info)
    // getAllStn[0].tags = {
    //   ip: "10.168.200.86",
    //   port: 30111,
    //   latitude: "25.08829°",
    //   priority: "12",
    //   longitude: "112.60828°",
    // }
    if (validResErr(getAllStn)) return
    const result = getAllStn?.map((i) => {
      let oneInfo = allStn?.find((item) => item.stationId === i.id)
      oneInfo = commonDealInfo(oneInfo)
      const mixedInfo = Object.assign({}, oneInfo, i)
      return mixedInfo
    })
    return result || []
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

    const wtInstalledCapacityTRate = (info?.wtInstalledCapacity / info?.totalInstalledCapacity) * 100
    const pvinvInstalledCapacityTRate = (info?.pvinvInstalledCapacity / info?.totalInstalledCapacity) * 100
    const espcsInstalledCapacityTRate = (info?.espcsInstalledCapacity / info?.totalInstalledCapacity) * 100
    return Object.assign({}, info, {
      wtInstalledCapacityTRate,
      pvinvInstalledCapacityTRate,
      espcsInstalledCapacityTRate,
    })
  }
  //
  const renderMainOrStnData = async () => {
    const stnList = await getMaintenanceOfStn()
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

    setMapSeries(series)
  }
  useEffect(() => {
    renderMainOrStnData()
    timer.current = setInterval(renderMainOrStnData, timeout.current)
    return () => {
      clearInterval(timer.current)
    }
  }, [])
  return (
    <div className="gx-center">
      <HbScreenContext.Provider value={{ quotaInfo, setQuotaInfo, currentMode, setCurrentMode }}>
      <div className="map-top">
        <CenterTopBox />
      </div>
      <div className="map-center">
        <MapSiteProvic series={mapSeries} province="广西" />
      </div>
      <div className="map-bottom">
        <TypeQuota />
      </div>
      </HbScreenContext.Provider>
    </div>
  )
}
