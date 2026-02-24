/*
 * @Author: chenmeifeng
 * @Date: 2024-06-25 14:36:32
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-24 15:41:31
 * @Description:
 */
// import WtStationLs from "@/pages/site-weather-station/components/station-list";
import "./tower-com.less"

import { useEffect, useState } from "react"

import CustomBoxWth from "@/components/custom-box-w"
import useMqttCft from "@/hooks/use-mqtt-cft"

import { towerBasicList, towerHeightList } from "../configs"
import { ITowerDataMQ } from "../types"

export default function TowerCom(props) {
  const { deviceCode, dvsInfo } = props
  const [actCftList, setCftList] = useState(towerHeightList)
  const [cftMqttData, setCftMqttData] = useState<ITowerDataMQ>()
  useMqttCft({ deviceCode: deviceCode, setCftMqttData })
  useEffect(() => {
    const data = cftMqttData?.[deviceCode]
    const result = actCftList.map((i) => {
      const key = i["key"]
      return {
        ...i,
        value: data ? `${data[key]}` : "",
      }
    })
    setCftList(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cftMqttData, deviceCode])
  return (
    <div className="twcom">
      <div className="twcom-left">
        {towerBasicList?.map((i) => {
          return <CustomBoxWth key={i.key} dvsInfo={dvsInfo} item={i} data={cftMqttData?.[deviceCode]} />
        })}
      </div>
      <div className="twcom-right">
        {actCftList.map((i) => {
          return (
            <div key={i.key} className="twcom-list-item" style={i.style}>
              <span>{i.name}:</span>
              <div className="twcom-list-item--right">
                <span className="twcom-item-value">{i.value}</span>
                <span>{i.unit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
