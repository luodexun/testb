/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 17:12:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-09 15:31:38
 * @Description: 气象信息
 */
import "./weather-info.less"

import HBCommonTitle from "./common-title"
import WSiteBox from "./wth-site-box"
export default function WeatherInfo() {
  const info = [
    { name: "风电场sdf", wind: 124, temperature: 999, sun: 876, rain: 67 },
    { name: "清远风电场", wind: 124, temperature: 999, sun: 876, rain: 67 },
    { name: "清远风电场2", wind: 45, temperature: 999, sun: 986, rain: 67 },
  ]
  return (
    <div className="screen-box scn-weather">
      <HBCommonTitle title="气象信息" />
      <div className="weather-chart">
        {info.map((i) => {
          return (
            <div key={i.name} className="weather-site-box">
              <WSiteBox siteInfo={i} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
