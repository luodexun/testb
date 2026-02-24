/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-10 14:18:47
 * @Description: 区域中心-场站总览
 */

import "./index.less"

import { queryDevicesByParams } from "@utils/device-funs.ts"
import { getParamDataFromUrl } from "@utils/menu-funs.tsx"
import { Select } from "antd"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"

import useMqttAgvc from "@/hooks/use-mqtt-agvc.ts"
// import { CardTitle } from "@/components/info-card"
import NamePanel from "@/pages/area-matrix/components/name-panel.tsx"
import { AtomStation } from "@/store/atom-station.ts"
import { IAgvcMQDataMap } from "@/types/i-agvc.ts"

import Management from "./components/management.tsx"

export default function SiteAgvc() {
  const [deviceCode, setDeviceCode] = useState<string>()
  const { stationMap } = useAtomValue(AtomStation)

  const { pathname } = useLocation()
  const [dvsList, setDvsList] = useState([])
  const [agvcMqttData, setAgvcMqttData] = useState<IAgvcMQDataMap>()
  useMqttAgvc({ deviceCode, setAgvcMqttData, isStart: !!deviceCode })

  const stationInfo = useMemo(() => {
    const stationCode = getParamDataFromUrl(pathname)
    return stationMap[stationCode]
  }, [pathname, stationMap])

  const currentDvs = useMemo(() => {
    return dvsList?.find((i) => i.deviceCode === deviceCode)
  }, [dvsList, deviceCode])

  const handleChange = (e) => {
    setDeviceCode(e)
  }
  useEffect(() => {
    if (!stationInfo?.stationCode) return
    ;(async function () {
      const deviceList = await queryDevicesByParams({
        stationCode: stationInfo?.stationCode,
        deviceType: "AGVC",
      })
      setDvsList(deviceList || [])
      setDeviceCode(deviceList?.[0]?.deviceCode || "")
    })()
  }, [stationInfo?.stationCode])

  return (
    <div className="l-full site-agvc-wrap">
      {/* <CardTitle children={stationInfo?.shortName} /> */}
      <NamePanel name={stationInfo?.fullName} option={stationInfo} className="site-name" />
      <div className="site-agvc-hd">
        <Select
          value={deviceCode}
          style={{ width: 120 }}
          fieldNames={{ label: "deviceName", value: "deviceCode" }}
          onChange={handleChange}
          options={dvsList}
        />
      </div>
      <div className="l-full info-card-wrap">
        <Management type="AGC" dvsInfo={currentDvs} deviceCode={deviceCode} realtimeData={agvcMqttData} />
        <Management type="AVC" dvsInfo={currentDvs} deviceCode={deviceCode} realtimeData={agvcMqttData} />
      </div>
    </div>
  )
}
