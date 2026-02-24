/*
 * @Author: chenmeifeng
 * @Date: 2024-06-26 09:53:32
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-03 10:33:58
 * @Description: 江苏大屏
 */
import { Suspense, lazy } from "react"
import "./index.less"
const JSHeader = lazy(() => import("./components/header"))
const DayElec = lazy(() => import("./components/day-elec"))
const YearUseRate = lazy(() => import("./components/year-use-rate"))
const YearUseHour = lazy(() => import("./components/year-use-hour"))
const PredictElec = lazy(() => import("./components/predict-elec"))
const ElecOverview = lazy(() => import("./components/elec-overview"))
const JsCenter = lazy(() => import("./components/center"))
export default function JiangsuScreen() {
  return (
    <div className="js-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <JSHeader />
        <div className="js-screen-content">
          <div className="js-screen-left">
            <div className="screen-lr-box">
              <DayElec />
            </div>
            <div className="screen-lr-box">
              <YearUseRate />
            </div>
          </div>
          <div className="js-screen-center">
            <JsCenter />
          </div>
          <div className="js-screen-right">
            <div className="screen-lr20-box">
              <ElecOverview />
            </div>
            <div className="screen-lr40-box">
              <YearUseHour />
            </div>
            <div className="screen-lr40-box">
              <PredictElec />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
