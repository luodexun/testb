/*
 * @Author: chenmeifeng
 * @Date: 2024-03-26 09:34:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-15 16:15:10
 * @Description: 地图上方模块
 */
import "./center-top.less"

import { useContext, useMemo } from "react"

import HbScreenContext from "@/contexts/hubei-screen-context"
import { parseNum } from "@/utils/util-funs"

import CommonQuotaBox from "../common-quota-box"
import LargeScreenContext from "@/contexts/screen-context"
const mapQtlist = [
  { name: "装机容量", unit: "万kW", key: "totalInstalledCapacity", icon: "capacity" },
  { name: "实时有功", unit: "万kW", key: "activePower", icon: "actPower" },
  { name: "日发电量", unit: "万kWh", key: "dailyProduction", icon: "day" },
  { name: "实时风速", unit: "m/s", key: "windSpeed", icon: "speed" },
  { name: "辐照强度", unit: "W/㎡", key: "totalIrradiance", icon: "radiation" }, // 还没有辐照强度这个字段
]
export default function CenterTopBox() {
  const { quotaInfo } = useContext(HbScreenContext)
  const { quotaInfo: staticInfo } = useContext(LargeScreenContext)

  const actualShowInfo = useMemo(() => {
    if (staticInfo?.capacityOverview && !staticInfo?.capacityOverview?.useInterfaceData) {
      return staticInfo?.capacityOverview?.data
    }
    return quotaInfo
  }, [staticInfo, quotaInfo])
  return (
    <div className="nhb-center-top">
      {mapQtlist.map((i) => {
        return (
          <div key={i.key} className="hb-center-tbox">
            <i className={`i-${i.icon}`} />
            <CommonQuotaBox name={i.name} unit={i.unit} value={parseNum(actualShowInfo?.[i.key]) || "-"} />
          </div>
        )
      })}
    </div>
  )
}
