/*
 * @Author: chenmeifeng
 * @Date: 2024-03-26 09:34:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-27 10:17:15
 * @Description: 地图上方模块
 */
import "./center-top.less"

import { useContext } from "react"

import HbScreenContext from "@/contexts/hubei-screen-context"
import { parseNum } from "@/utils/util-funs"
const mapQtlist = [
  { name: "装机容量(万kW)", key: "totalInstalledCapacity", icon: "capacity" },
  { name: "实时有功(万kW)", key: "activePower", icon: "actPower" },
  { name: "日发电量(万kWh)", key: "dailyProduction", icon: "day" },
  { name: "实时风速(m/s)", key: "windSpeed", icon: "speed" },
  { name: "辐照强度(W/㎡)", key: "totalIrradiance", icon: "radiation" }, // 还没有辐照强度这个字段
]
export default function CenterTopBox() {
  const { quotaInfo } = useContext(HbScreenContext)
  // const info = {}
  return (
    <div className="hb-center-top">
      {mapQtlist.map((i) => {
        return (
          <div key={i.key} className="hb-center-tbox">
            <i className={`i-${i.icon}`} />
            <div className="tbox-right">
              <span className="tbox-right-name">{i.name}</span>
              <span className="tbox-right-value">{parseNum(quotaInfo?.[i.key]) || "-"}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
