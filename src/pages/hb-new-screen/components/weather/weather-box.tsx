/*
 * @Author: chenmeifeng
 * @Date: 2024-07-08 10:00:59
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-25 11:13:34
 * @Description:
 */
import "./weather.less"

import CommonQuotaBox from "../common-quota-box"
import { useMemo } from "react"
const PV_OPTIONS = [
  { name: "辐照度", unit: "W/m²", field: "totalIrradiance", key: "wind" },
  { name: "有功功率", unit: "万kW", field: "activePower", key: "power" },
  { name: "日发电", unit: "万kWh", field: "dailyProduction", key: "temperature" },
  { name: "出力率", unit: "%", field: "typeRate", key: "rate" },
]
const WT_OPTIONS = [
  { name: "平均风速", unit: "m/s", field: "windSpeed", key: "wind" },
  { name: "有功功率", unit: "万kW", field: "activePower", key: "power" },
  { name: "日发电", unit: "万kWh", field: "dailyProduction", key: "temperature" },
  { name: "出力率", unit: "%", field: "typeRate", key: "rate" },
]
export default function WeatherBox(props) {
  const { info, deviceType = "WT" } = props
  const actualOptions = useMemo(() => {
    if (deviceType === "WT") return WT_OPTIONS
    return PV_OPTIONS
  }, [deviceType])
  return (
    <div className="weather-box">
      <div className="weather-box-title">
        <span>{info?.stationShortName}</span>
      </div>
      <div className="weather-box-content">
        {actualOptions?.map((i) => {
          return (
            <div className="weather-list-item" key={i.key}>
              <i className={`wea-${i.key}`} />
              <CommonQuotaBox name={i.name} unit={i.unit} value={info?.[i.field] || "-"} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
