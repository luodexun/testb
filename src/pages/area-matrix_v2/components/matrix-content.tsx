/*
 * @Author: chenmeifeng
 * @Date: 2024-12-09 17:08:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-27 15:24:15
 * @Description:
 */
import "./matrix-content.less"

import { useAtomValue } from "jotai"
import { useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

// import { getMngStaticInfo } from "@/components/common-target-box/methods"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import useMonitorStationData from "@/hooks/use-monitor-station-data"
import NamePanel from "@/pages/area-matrix/components/name-panel"
import { AtomStnMonitorDataMap } from "@/store/atom-run-station"
import { IDeviceData } from "@/types/i-device"
import { getMngStaticInfo, getTypeStationList } from "@/utils/device-funs"

import { getStnOfDeviceData } from "../methods"
import DeviceBlock from "./device-block"
import StationQuota from "./stn-quota"

interface IProps {
  realtimeDvsData: IDeviceData[]
}
export default function MatrixStnContent(props: IProps) {
  const { realtimeDvsData } = props

  const [siteQuota, setSiteQuota] = useState({})
  const { currentChooseState, deviceType } = useContext(DvsDetailContext)
  const navigate = useNavigate()
  const stnOfDvsLs = useMemo(() => {
    if (!realtimeDvsData?.length) return {}
    if (realtimeDvsData?.length && !currentChooseState?.length) return getStnOfDeviceData(realtimeDvsData)
    const stateOfDvsLs = realtimeDvsData?.filter((i) => currentChooseState?.includes(i.runData?.mainState?.toString()))
    const ree = getStnOfDeviceData(stateOfDvsLs)
    return ree
  }, [realtimeDvsData, currentChooseState])
  const stationByDvsType = useMemo(() => {
    const stn = getTypeStationList(deviceType || "WT", "stationId", false)
    return stn
  }, [deviceType])
  // 获取场站装机台数等信息
  useMonitorStationData([deviceType])
  const stationsInfo = useAtomValue(AtomStnMonitorDataMap)

  const toPage = (station) => {
    navigate(`/site/${station.maintenanceComId}/${station.stationCode}/matrix`)
  }
  const initQuotaChecks = async () => {
    const res = await getMngStaticInfo()
    if (!res) return
    setSiteQuota(res.siteChecks)
  }
  useEffect(() => {
    initQuotaChecks()
  }, [])
  return (
    <div className="matrix-wrap-content">
      {stationByDvsType?.map((station) => {
        return stnOfDvsLs?.[station.id]?.length ? (
          <div key={station.id} className="station-dvs">
            <div className="am-station-name" onClick={() => toPage(station)}>
              <NamePanel name={station?.shortName} className="site-name" />
            </div>
            <StationQuota
              data={stationsInfo?.[deviceType]?.[station.stationCode]}
              quotaInfo={siteQuota?.[deviceType]}
              stationCode={station.stationCode}
            />
            <DeviceBlock deviceList={stnOfDvsLs?.[station.id]} />
          </div>
        ) : (
          ""
        )
      })}
    </div>
  )
}
