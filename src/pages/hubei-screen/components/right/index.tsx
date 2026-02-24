/*
 * @Author: chenmeifeng
 * @Date: 2024-09-05 10:03:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-05 10:11:13
 * @Description: 屏幕右边部分
 */
import "./index.less"
import HbSrnLeft from "../state-view"
import HbElecView from "../elec-view"
import HbTwoDayUse from "../hb-two-day-use"
import HbNetMnt from "../net-monitor"
import HbStLsDetail from "../site-list-detail"

export default function HbSrnRight() {
  return (
    <div className="hbs-right">
      <div className="hbs-cr-con hbs-cr-7">
        <HbStLsDetail />
      </div>
      <div className="hbs-cr-con hbs-cr-7">
        {/* <HbElecView /> */}
        <HbSrnLeft />
      </div>
      <div className="hbs-cr-con hbs-cr-3">
        <HbTwoDayUse />
      </div>
      <div className="hbs-cr-con hbs-cr-3">
        <HbNetMnt />
      </div>
    </div>
  )
}
