/*
 * @Author: chenmeifeng
 * @Date: 2025-02-06 11:04:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-06 14:18:51
 * @Description: 广东、广西、山西公用的大屏
 */
import "./index.less"

import { lazy, Suspense, useEffect, useRef, useState } from "react"

const BrandRate = lazy(() => import("@/pages/hb-new-screen/components/brand/brand-rate"))
const CenterContent = lazy(() => import("./components/center/center"))
const DayLoad = lazy(() => import("@/pages/hb-new-screen/components/day-load/day-load"))
const ElecOverview = lazy(() => import("@/pages/hb-new-screen/components/elec-overview/elec-overview"))
const HubeiScreenHeader = lazy(() => import("./components/header/header"))
const Prediction = lazy(() => import("@/pages/hb-new-screen/components/prediction/prediction-elec"))
const WeatherInfo = lazy(() => import("@/pages/hb-new-screen/components/weather/weather"))
const YearUseHour = lazy(() => import("@/pages/hb-new-screen/components/year-use-hour/year-use-hour"))
export default function CommonScreen() {
  const screenRef = useRef(null)
  // useEffect(() => {
  //   screenRef.current.style.fontSize = (window.innerWidth / 4513) * 10 + "px"
  //   window.addEventListener("resize", () => {
  //     console.log(window.innerWidth, "window.innerWidth")
  //     screenRef.current.style.fontSize = (window.innerWidth / 4513) * 10 + "px"
  //     // screenRef.current.style.width = window.innerWidth
  //   })
  // }, [])
  return (
    <div className="screen-common" ref={screenRef}>
      <Suspense fallback={<div>Loading...</div>}>
        <HubeiScreenHeader />
        <div className="screen-content">
          <div className="screen-left">
            <div className="screen-lr-box">
              <DayLoad />
            </div>
            <div className="screen-lr-box">
              <Prediction />
            </div>
            <div className="screen-lr-box">
              <BrandRate />
            </div>
          </div>
          <div className="screen-center">
            <CenterContent />
          </div>
          <div className="screen-right">
            <div className="screen-lr-20">
              <ElecOverview />
            </div>
            <div className="screen-lr-30">
              <YearUseHour />
            </div>
            <div className="screen-lr-50">
              <WeatherInfo />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
