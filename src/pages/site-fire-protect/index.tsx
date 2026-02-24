/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-25 16:43:32
 * @Description: 场站-消防系统
 */
import "./index.less"

import { Select } from "antd"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router"

import { AtomStation } from "@/store/atom-station"
import { IDeviceData } from "@/types/i-device"
import { queryDevicesByParams } from "@/utils/device-funs"
import { getParamDataFromUrl } from "@/utils/menu-funs"
import { getScreenUrl } from "@/utils/screen-funs"

import NamePanel from "../area-matrix/components/name-panel"
import PointTabs from "../site-device/components/point-table"
import { CONVERT_KEY } from "./config"

export default function SiteFireProtect() {
  const [deviceLs, setDeviceLs] = useState([])
  const [device, setDevice] = useState("")
  const [curDeviceInfo, setCurDeviceInfo] = useState<IDeviceData>(null)
  const [screenName, setScreenName] = useState("")

  const { pathname } = useLocation()
  const { stationMap } = useAtomValue(AtomStation)
  const stationInfo = useMemo(() => {
    const stationCode = getParamDataFromUrl(pathname)
    return stationMap[stationCode]
  }, [pathname, stationMap])
  const deviceType = useMemo(() => {
    const type = getParamDataFromUrl(pathname, 4)
    return type.toUpperCase()
  }, [pathname, stationMap])
  const needTransform = useMemo(() => {
    return screenName === "jsscreen" && deviceType === "WTFIR"
  }, [stationInfo, deviceType, screenName])
  const initData = async () => {
    const params = {
      stationCode: stationInfo?.stationCode,
      deviceType: deviceType, // WTFIR
    }
    const result = await queryDevicesByParams(params)
    setDeviceLs([...result])
    const firstDvsCode = result?.[0]?.deviceCode
    setDevice(firstDvsCode)
    setCurDeviceInfo(result?.[0])
  }
  const getProjectName = async () => {
    const res = await getScreenUrl()
    setScreenName(res)
  }
  const changeDvs = (e) => {
    setDevice(e)
    const device = deviceLs?.find((i) => i.deviceCode === e)
    setCurDeviceInfo(device)
  }
  useEffect(() => {
    if (!stationInfo) return
    getProjectName()
    initData()
  }, [stationInfo])
  return (
    <div className="l-full site-fire-protect">
      <NamePanel name={stationInfo?.fullName} option={stationInfo} className="site-name" />
      <div className="select-right">
        <Select
          value={device}
          style={{ width: 150, margin: "0 2em" }}
          fieldNames={{ label: "deviceName", value: "deviceCode" }}
          onChange={changeDvs}
          options={deviceLs}
        />
      </div>
      <PointTabs clickDevice={curDeviceInfo} needConvert={needTransform ? CONVERT_KEY : null} />
    </div>
  )
}
