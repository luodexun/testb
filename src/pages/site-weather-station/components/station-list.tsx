/*
 * @Author: chenmeifeng
 * @Date: 2023-11-07 17:44:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-11 10:23:49
 * @Description:
 */
import "./station-list.less"

// import { Image } from "antd"
import { useState } from "react"

import CustomBoxWth from "@/components/custom-box-w"
import useMqttQxz from "@/hooks/use-mqtt-qxz"
import { IDeviceData } from "@/types/i-device"
import { TSWeatherData } from "@/types/i-qxz"

import { TPiontData } from "../types"
interface Iprops {
  dvsInfo?: IDeviceData
  deviceCode?: string
  siteWeaList?: TPiontData[]
}
export default function WtStationLs(props: Iprops) {
  const { siteWeaList, dvsInfo, deviceCode } = props

  const [sweatherData, setSweatherData] = useState<TSWeatherData>()
  useMqttQxz({ deviceCode: deviceCode, setSweatherData })
  // const currentData = useRef<TSWeatherData>()
  // if (sweatherData && sweatherData?.deviceCode) {
  //   currentData.current = sweatherData
  // }
  return (
    <div className="stList">
      {siteWeaList?.map((i) => {
        return (
          <CustomBoxWth
            key={i.pointName}
            dvsInfo={dvsInfo}
            item={i}
            data={sweatherData?.deviceCode ? sweatherData : {}}
          />
        )
      })}
    </div>
  )
}
