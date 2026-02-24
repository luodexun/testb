/*
 * @Author: chenmeifeng
 * @Date: 2024-09-18 10:34:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-29 16:30:15
 * @Description: 河南大屏左边
 */
import "./index.less"
import HnDayLoad from "../day-load"
import HnStatinDetail from "../station-detail"

export default function HNLeft() {
  return (
    <div className="hn-screen-left">
      <div className="box-item">
        <HnDayLoad />
      </div>
      <div className="box-item">
        <HnStatinDetail />
      </div>
    </div>
  )
}
