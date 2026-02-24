/*
 * @Author: chenmeifeng
 * @Date: 2024-12-25 15:38:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-21 10:54:05
 * @Description: 辽宁大屏左
 */
import "./index.less"
import LNRealtime from "../realtime"
import RealtimePw24h from "../24h-rltime-power"
import PredictElec from "../predict-elec"
import SocialCtbtn from "../social-contribution"

export default function LNRight() {
  return (
    <div className="ln-screen-right--content">
      <LNRealtime />
      <div className="ln-lctnt-box">
        <RealtimePw24h />
      </div>
      <div className="ln-lctnt-box">
        <PredictElec />
      </div>
      <div style={{ height: "15em" }}>
        <SocialCtbtn />
      </div>
    </div>
  )
}
