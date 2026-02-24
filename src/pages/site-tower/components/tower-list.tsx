/*
 * @Author: chenmeifeng
 * @Date: 2023-10-23 17:56:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-24 18:10:53
 * @Description:
 */
import "../index.less"

import { useEffect, useState } from "react"

import { towerBasicList, towerHeightList } from "../configs"

interface IProps {
  cftData: any
  deviceCode: string
}
export default function TowerList(props: IProps) {
  const { cftData, deviceCode } = props
  const [actCftList, setCftList] = useState(towerHeightList)
  const [actBasicInfo, setActBasicInfo] = useState(towerBasicList)

  useEffect(() => {
    // console.log(cftData, "cftData")
    const data = cftData?.[deviceCode]?.[deviceCode]
    const result = actCftList.map((i) => {
      const key = i["key"]
      return {
        ...i,
        value: data ? data[key] || "" : "",
      }
    })
    setCftList(result)

    const actBasicInfoList = actBasicInfo.map((i) => {
      const key = i["key"]
      return {
        ...i,
        value: data ? data[key] || "" : "",
      }
    })
    setActBasicInfo(actBasicInfoList)
  }, [cftData, deviceCode])
  return (
    <div className="tower-list">
      <div className="tower-speed">
        {actCftList.map((i) => {
          return (
            <div key={i.key} className="tower-list-item">
              <span>{i.name}:</span>
              <span className="tower-list-item--value">
                {i.value} {i.unit}
              </span>
            </div>
          )
        })}
      </div>
      <div className="tower-basic">
        {actBasicInfo.map((i) => {
          return (
            <div key={i.key} className="tower-basic-item">
              <span>{i.name}：</span>
              <div className="tower-basic-item--value">
                <span className="item--value--value">{i.value}</span>
                <span>{i.unit}</span>
              </div>
            </div>
          )
        })}
      </div>
      {/* <div className="f10min">
        <div className="tower-item-common--box">12</div>
        <div className="tower-item-common--box">12</div>
      </div> */}
    </div>
  )
}
