/*
 * @Author: chenmeifeng
 * @Date: 2024-03-15 14:30:05
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-27 11:20:31
 * @Description: 广西大屏第二张
 */
import "../guangdong-screen/index.less"

import { lazy, Suspense, useEffect } from "react"

import CommonScreenHeader from "@/components/screen-header"

import { screenList } from "./configs/configs"
const GDDayLoadTrend = lazy(() => import("../guangdong-screen/components/day-load/day-load-trend"))
const GDPrediction = lazy(() => import("../guangdong-screen/components/predict/prediction-elec"))
const GDBrandRate = lazy(() => import("../guangdong-screen/components/brand/brand-rate"))
const GDElecOverview = lazy(() => import("../guangdong-screen/components/elec-overview/elec-overview"))
const GDYearUseHour = lazy(() => import("../guangdong-screen/components/year-use-hour/year-use-hour"))
const GDWeatherInfo = lazy(() => import("../guangdong-screen/components/weather/weather-info"))
const GDCenterContent = lazy(() => import("./components/center"))
export default function GuangxiScreenTwo() {
  return (
    <div className="gdscreen">
      <Suspense fallback={<div>Loading...</div>}>
        <CommonScreenHeader screenList={screenList} defaultKey="gxscreen2" title="华润电力广西公司" />
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
            <GDCenterContent />
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
