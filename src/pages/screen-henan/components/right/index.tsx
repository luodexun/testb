/*
 * @Author: chenmeifeng
 * @Date: 2024-09-18 10:34:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-30 09:40:50
 * @Description: 河南大屏右边
 */
import "./index.less"
import YearUseHour from "../year-use-hour"
import HnElecOvw from "../elec-overview"

export default function HNRight() {
  return (
    <div className="hn-screen-right">
      <div className="box-item">
        <HnElecOvw />
      </div>
      <div className="box-item">
        <YearUseHour />
      </div>
    </div>
  )
}
