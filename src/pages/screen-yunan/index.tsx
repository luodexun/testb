/*
 * @Author: chenmeifeng
 * @Date: 2024-02-20 13:44:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-05 10:02:44
 * @Description:
 */
import { getScreenPointData } from "@/utils/screen-funs"
import YNHeader from "./components/header"
import "./index.less"

import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { mainComSetAtom } from "@/store/atom-screen-data"
import { useSetAtom } from "jotai"
import { useRefresh } from "@/hooks/use-refresh"

// const BrandRate = lazy(() => import("./components/brand/brand-rate"))
const YNCenter = lazy(() => import("./components/center"))
const SocialCtbtn = lazy(() => import("./components/social-contribution"))
const RealtimePw24h = lazy(() => import("./components/24h-rltime-power"))
const YNCapacity = lazy(() => import("./components/capacity"))
const YNElecOverview = lazy(() => import("./components/elec-overview"))
const YearElecSts = lazy(() => import("./components/year-elec-statistics"))
const YearUseHour = lazy(() => import("./components/year-use-hour"))
export default function YunnanScreen() {
  const screenRef = useRef(null)
  const [reload, setReload] = useRefresh(3000) // 3s
  const setScreenMainValue = useSetAtom(mainComSetAtom)
  //获取实时数据，有几个模块同时用到
  const initActualData = async () => {
    const mainInfo = await getScreenPointData()
    if (!mainInfo) return
    // const mainInfo = {
    //   totalInstalledCapacity: 1098,
    //   // activePower: 1000,
    //   yearlyProduction: 10000,
    //   dailyProduction: 200,
    //   wtInstalledCapacity: 0,
    //   pvinvInstalledCapacity: 12,
    //   pvinvNum: 2,
    //   wtNum: 4,
    //   stationWNum: 10,
    //   stationSNum: 11,
    // }
    setScreenMainValue({
      mainComInfo: mainInfo,
      call: () => {
        setReload(false)
      },
    })
  }
  useEffect(() => {
    if (!reload) return
    initActualData()
  }, [reload])
  useEffect(() => {
    return () => {
      setScreenMainValue({
        mainComInfo: null,
      })
    }
  }, [])
  // useEffect(() => {
  //   screenRef.current.style.fontSize = (window.innerWidth / 4513) * 10 + "px"
  //   window.addEventListener("resize", () => {
  //     console.log(window.innerWidth, "window.innerWidth")
  //     screenRef.current.style.fontSize = (window.innerWidth / 4513) * 10 + "px"
  //     // screenRef.current.style.width = window.innerWidth
  //   })
  // }, [])
  return (
    <div className="yn-screen" ref={screenRef}>
      <Suspense fallback={<div>Loading...</div>}>
        <YNHeader />
        <div className="screen-content">
          <div className="screen-left">
            <div className="screen-lr-33">
              <YNElecOverview />
            </div>
            <div className="screen-lr-33">
              <YearElecSts />
            </div>
            <div className="screen-lr-33">
              <YearUseHour />
            </div>
          </div>
          <div className="screen-center">
            <YNCenter />
          </div>
          <div className="screen-right">
            <div className="screen-lr-15">
              <YNCapacity />
            </div>
            <div className="screen-lr-65">
              <RealtimePw24h />
            </div>
            <div className="screen-lr-17">
              <SocialCtbtn />
            </div>
          </div>
        </div>
        <i className="float-bottom"></i>
      </Suspense>
    </div>
  )
}
