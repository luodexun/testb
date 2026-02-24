/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-31 10:17:01
 * @Description: 区域中心-场站总览
 */

import "./index.less"

import { Select } from "antd"
import { useAtomValue } from "jotai"
// import { useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"

import { doBaseServer } from "@/api/serve-funs"
import { AtomStation } from "@/store/atom-station"
import { getParamDataFromUrl } from "@/utils/menu-funs"

import NamePanel from "../area-matrix/components/name-panel"
// import useMqttCft from "@/hooks/use-mqtt-cft"
// import { AtomStation } from "@/store/atom-station"
import TowerCom from "./components/tower-com"
// import TowerList from "./components/tower-list"
import { DevideListParam } from "./types"

export default function SiteTower() {
  const [deviceList, setDeviceList] = useState([])
  const [deviceCode, setDeviceCode] = useState("")
  const { stationMap } = useAtomValue(AtomStation)

  const { pathname } = useLocation()

  const stationInfo = useMemo(() => {
    const stationCode = getParamDataFromUrl(pathname)
    return stationMap[stationCode]
  }, [pathname, stationMap])

  const dvsInfo = useMemo(() => {
    return deviceList.find((i) => i.deviceCode === deviceCode)
  }, [deviceCode, deviceList])
  // const [cftMqttData, setCftMqttData] = useState<ITowerDataMQ>()
  // useMqttCft({ deviceCode: deviceCode, setCftMqttData })
  // console.log(cftMqttData, "cftMqttData")

  useEffect(() => {
    getDeviceList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationInfo])
  const getDeviceList = async () => {
    const deviceList = await doBaseServer<DevideListParam>("queryDevicesDataByParams", {
      stationCode: stationInfo?.stationCode,
      deviceType: "CFT",
    })
    setDeviceCode(deviceList?.length ? deviceList[0].deviceCode : "")
    setDeviceList(deviceList?.length ? deviceList : [])
  }
  const handleChange = (e) => {
    setDeviceCode(e)
  }
  return (
    <div className="page-wrap l-full site-tower-wrap">
      <NamePanel name={stationInfo?.fullName} option={stationInfo} className="site-name" />
      <div className="site-tower-header">
        <Select
          value={deviceCode}
          style={{ width: 120 }}
          fieldNames={{ label: "deviceName", value: "deviceCode" }}
          onChange={handleChange}
          options={deviceList}
        />
      </div>
      <div className="l-full site-tower-content">
        <TowerCom deviceCode={deviceCode} dvsInfo={dvsInfo}></TowerCom>
      </div>
      <div className="site-tower-background"></div>
    </div>
  )
}
