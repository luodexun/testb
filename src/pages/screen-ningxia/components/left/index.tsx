/*
 * @Author: chenmeifeng
 * @Date: 2024-12-25 15:38:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-03 17:53:31
 * @Description: 宁夏大屏左
 */
import "./index.less"
import NxDailyLoad from "../daily-load"
import NXElecOverview from "../elec-overviwe"
import SocialCtbtn from "../social-contribution"
import YearElecSts from "../year-elec-statistics"

export default function NXLeft() {
  return (
    <div className="nx-screen-left--content">
      <div style={{ height: "13.5%" }}>
        <NXElecOverview />
      </div>
      <div className="nx-lctnt-box">
        <YearElecSts />
      </div>
      <div className="nx-lctnt-box">
        <NxDailyLoad />
      </div>
      <div style={{ height: "17%" }}>
        <SocialCtbtn />
      </div>
    </div>
  )
}
