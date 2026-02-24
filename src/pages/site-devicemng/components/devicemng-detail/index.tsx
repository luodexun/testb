/*
 * @Author: chenmeifeng
 * @Date: 2024-04-07 10:42:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 10:42:00
 * @Description:
 */

import "./index.less"

import { useEffect, useState } from "react"

import InfoCard from "@/components/info-card"

import DetailTitle from "./components/detail-title.tsx"
import PointData from "./components/point-data.tsx"

export default function DeviceRunDetail(props) {
  const { clickDevice, deviceList, onBackBtn, showDrawn } = props
  const [message, setMessage] = useState("")
  const [clickDeviceB, setClickDeviceB] = useState(null)

  useEffect(() => {
    setClickDeviceB(clickDevice)
  }, [clickDevice, deviceList])

  const onDevicemngChange = (e) => {
    const selectDevice = deviceList.filter((item) => item?.deviceCode == e)
    setClickDeviceB(selectDevice[0])
    setMessage(e)
  }

  return (
    <InfoCard className="l-full devicemng-run-detail">
      <DetailTitle
        showPart
        deviceList={deviceList}
        clickDevice={clickDevice}
        onDevicemngChange={onDevicemngChange}
        onBackBtn={onBackBtn}
      />
      <PointData message={message} showDrawn={showDrawn} clickDevice={clickDeviceB}></PointData>
    </InfoCard>
  )
}
