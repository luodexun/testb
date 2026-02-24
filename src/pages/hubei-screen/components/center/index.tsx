/*
 * @Author: chenmeifeng
 * @Date: 2024-09-05 10:03:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-05 10:11:13
 * @Description: 屏幕中间部分
 */
import "./index.less"

import CenterContent from "../center"
import ElecOverview from "../elec-overview"
import DayLoad from "../day-load"
export default function HbSrnCenter() {
  return (
    <div className="hb2-center">
      <div className="hbs-center-top">
        <CenterContent />
      </div>
      <div className="hbs-center-bottom">
        <div className="hbs-cb-con">
          <ElecOverview isScreenOne={false} />
        </div>
        <div className="hbs-cb-con">
          <DayLoad />
        </div>
      </div>
    </div>
  )
}
