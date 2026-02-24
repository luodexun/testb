/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 17:34:32
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-22 09:38:59
 * @Description: 公用气象信息-场站模块
 */
import "./wth-site-box.less"

import CommonImtextBox from "./common-imtext-box"
const options = [
  { name: "风速(m/s)", key: "wind" },
  { name: "辐照(W/m²)", key: "sun" },
  { name: "温度(℃)", key: "temperature" },
  { name: "雨雪(mm)", key: "rain" },
]
export default function WSiteBox(props) {
  const { siteInfo } = props

  return (
    <div className="wth-site" key={siteInfo.name}>
      <div className="wth-site-title">
        <span>{siteInfo.name}</span>
        <div className="wth-tl-line"></div>
      </div>

      <div className="wth-site-content">
        {options.map((i) => {
          return <CommonImtextBox type={i.key} value={siteInfo[i.key]} name={i.name} />
        })}
      </div>
    </div>
  )
}
