/*
 * @Author: chenmeifeng
 * @Date: 2024-03-26 10:40:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-15 17:21:53
 * @Description: 大屏地图底部
 */
import "./center-bottom.less"

import { Progress } from "antd"
import { useContext, useMemo, useRef } from "react"

import HbScreenContext from "@/contexts/hubei-screen-context"
import { parseNum } from "@/utils/util-funs"

import { mapTypeQuota } from "../../configs"
import CommonQuotaBox from "../common-quota-box"
import LargeScreenContext from "@/contexts/screen-context"
// import TypeQuotaBox from "./type-quota-box"
export default function TypeQuota() {
  const typeList = useRef(mapTypeQuota)
  const { quotaInfo } = useContext(HbScreenContext)
  const transData = useMemo(() => {
    if (!quotaInfo) return null

    const wtInstalledCapacityTRate = (quotaInfo?.wtInstalledCapacity / quotaInfo?.totalInstalledCapacity) * 100
    const pvinvInstalledCapacityTRate = (quotaInfo?.pvinvInstalledCapacity / quotaInfo?.totalInstalledCapacity) * 100
    const espcsInstalledCapacityTRate = (quotaInfo?.espcsInstalledCapacity / quotaInfo?.totalInstalledCapacity) * 100
    return Object.assign({}, quotaInfo, {
      wtInstalledCapacityTRate,
      pvinvInstalledCapacityTRate,
      espcsInstalledCapacityTRate,
    })
  }, [quotaInfo])

  const { quotaInfo: staticInfo } = useContext(LargeScreenContext)

  const actualShowInfo = useMemo(() => {
    // 当数据自定义接口返回useInterfaceData为false时，取自定义数据
    if (staticInfo?.capacityOverview && !staticInfo?.capacityOverview?.useInterfaceData) {
      return staticInfo?.capacityOverview?.data
    }
    return transData
  }, [staticInfo, transData])
  return (
    <div className="nhb-map-btm-quota">
      {typeList.current.map((i) => {
        const boxList = i.children.filter((child) => child.type === "box")
        const rateList = i.children.filter((child) => child.type === "line")
        const typeNum = i.children.find((child) => child.type === "num")
        return (
          <div className="btm-quota-item" key={i.key}>
            <div className="item-top">
              {boxList?.map((item) => {
                return (
                  <div className="box-item" key={item.key}>
                    <CommonQuotaBox
                      name={item.name}
                      unit={item.unit}
                      value={parseNum(actualShowInfo?.[item.key]) || "-"}
                    />
                  </div>
                )
              })}
            </div>
            <div className="progress-list">
              {rateList?.map((item) => {
                return (
                  <div className="progress-item" key={item.key}>
                    <span className="item-name">{item.name}</span>
                    <Progress
                      percent={parseNum(actualShowInfo?.[item.key]) || 0}
                      strokeColor="rgba(0, 242, 254, 1)"
                      trailColor="rgba(164, 175, 188, 0.24)"
                    />
                  </div>
                )
              })}
            </div>
            <div className="item-bottom">
              <span className="type-name">{i.name}</span>
              <div className="site-num ">
                <span className="span-20">场站数</span>
                <div>
                  <span className="span-26">{actualShowInfo?.[typeNum?.key] || 0}</span>
                  <span className="span-16">个</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
