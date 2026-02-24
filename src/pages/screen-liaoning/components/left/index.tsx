/*
 * @Author: chenmeifeng
 * @Date: 2024-12-25 15:38:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-19 16:53:11
 * @Description: 辽宁大屏左
 */
import "./index.less"
import LNCapacity from "../capacity"
import LNElecOverview from "../elec-overview"
import YearUseHour from "../year-use-hour"
import LNBrand from "../brand"

// import lnDailyLoad from "../daily-load"
// import lnElecOverview from "../elec-overviwe"
// import SocialCtbtn from "../social-contribution"
// import YearElecSts from "../year-elec-statistics"

export default function LNLeft() {
  return (
    <div className="ln-screen-left--content">
      <LNCapacity />
      <LNElecOverview />
      <div className="ln-lctnt-box">
        <div className="lctnt-box-item">
          <YearUseHour />
        </div>
        <div className="lctnt-box-item">
          <LNBrand />
        </div>
      </div>
    </div>
  )
}
