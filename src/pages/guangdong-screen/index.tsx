/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 09:57:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-16 13:56:15
 * @Description:
 */
import "./index.less"

import { lazy, Suspense, useEffect } from "react"

import CommonScreenHeader from "@/components/screen-header"

import GdScreenHeader from "./components/header"
import { SCREEN_LIST } from "./configs"
const GDDayLoadTrend = lazy(() => import("./components/day-load/day-load-trend"))
const GDPrediction = lazy(() => import("./components/predict/prediction-elec"))
const GDBrandRate = lazy(() => import("./components/brand/brand-rate"))
const GDElecOverview = lazy(() => import("./components/elec-overview/elec-overview"))
const GDYearUseHour = lazy(() => import("./components/year-use-hour/year-use-hour"))
const GDWeatherInfo = lazy(() => import("./components/weather/weather-info"))
const GDCenterContent = lazy(() => import("./components/center/center"))
export default function GuangdongScreen() {
  return (
    <div className="gdscreen">
      <Suspense fallback={<div>Loading...</div>}>
        <CommonScreenHeader screenList={SCREEN_LIST} defaultKey="gdscreen" title="华润电力广东公司新能源集控中心" />
        <div className="gdscreen-content">
          <div className="gdscreen-left">
            <div className="gdscreen-com-box">
              <GDDayLoadTrend />
            </div>
            <div className="gdscreen-com-box">
              <GDPrediction />
            </div>
            <div className="gdscreen-com-box">
              <GDBrandRate />
            </div>
          </div>
          <div className="gdscreen-center">
            <GDCenterContent province="广东" />
          </div>
          <div className="gdscreen-right">
            <div className="gdscreen-com-box">
              <GDElecOverview />
            </div>
            <div className="gdscreen-com-box">
              <GDYearUseHour />
            </div>
            <div className="gdscreen-com-box">
              <GDWeatherInfo />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
