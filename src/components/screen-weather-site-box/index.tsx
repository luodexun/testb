/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 10:33:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-18 16:58:38
 * @Description: 大屏公用-场站气象信息
 */
import "./index.less"

import { ISiteMonitorInfo } from "@/types/i-monitor-info"
import { TDeviceType } from "@/types/i-config"
import CommonImtextBox from "./common-imtext-box"
import { useMemo } from "react"
const options = [
  { name: "平均风速(m/s)", unit: "m/s", field: "windSpeed", key: "wind" },
  { name: "有功功率(万kW)", unit: "万kW", field: "activePower", key: "sun" },
  { name: "日发电量(万kWh)", unit: "万kWh", field: "dailyProduction", key: "temperature" },
  { name: "出力率(%)", unit: "%", field: "typeRate", key: "rain" },
]
const pvOption = [
{ name: "转换效率(m/s)", unit: "m/s", field: "efficiency", key: "wind", child: "data" },
{ name: "有功功率(万kW)", unit: "万kW", field: "activePower", key: "sun" },
{ name: "日发电量(万kWh)", unit: "万kWh", field: "dailyProduction", key: "temperature" },
{ name: "出力率(%)", unit: "%", field: "typeRate", key: "rain" },
]
interface IProps {
  siteInfo: ISiteMonitorInfo
  deviceType: TDeviceType
}
export default function WSiteBox(props: IProps) {
  const { siteInfo, deviceType } = props
  const actualOpt = useMemo(() => {
    return deviceType === "WT" ? options : pvOption
  }, [deviceType])
  return (
    <div className="wth-site" key={siteInfo.stationCode}>
      <div className="wth-site-title">
        <span>{siteInfo.stationShortName}</span>
        <div className="wth-tl-line"></div>
      </div>

      <div className="wth-site-content">
        {actualOpt.map((i) => {
          return <CommonImtextBox key={i.key} type={i.key} value={i["child"] ? siteInfo?.["data"]?.[i.field]: siteInfo[i.field]} name={i.name} />
        })}
      </div>
    </div>
  )
}
