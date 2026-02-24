/*
 * @Author: chenmeifeng
 * @Date: 2024-12-25 13:44:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-03 13:54:05
 * @Description: 宁夏大屏总体
 */
import "./index.less"
import { getScreenPointData } from "@/utils/screen-funs"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { mainComSetAtom } from "@/store/atom-screen-data"
import { useSetAtom } from "jotai"
import { useRefresh } from "@/hooks/use-refresh"
import { screenVirtualData } from "./configs/form-json"
import { getScreenStaticInfo } from "./methods"
// import config from "./configs"
import LargeScreenContext from "@/contexts/screen-context"
const NXHeader = lazy(() => import("./components/header"))
const NXCenter = lazy(() => import("./components/center"))
const NXLeft = lazy(() => import("./components/left"))
const NXRight = lazy(() => import("./components/right"))
export default function NingXiaScreen() {
  const screenRef = useRef(null)
  const [reload, setReload] = useRefresh(3000) // 3s
  const [settingData, setSettingData] = useState(screenVirtualData)
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

  const initData = async () => {
    // 获取接口临时数据
    const res = await getScreenStaticInfo()
    if (!res) return
    setSettingData(JSON.parse(res?.data))
    // changejson(JSON.parse(res.data))
  }
  useEffect(() => {
    if (!reload) return
    initActualData()
  }, [reload])
  useEffect(() => {
    initData()
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
    <div className="nx-screen" ref={screenRef}>
      <Suspense fallback={<div>Loading...</div>}>
        <LargeScreenContext.Provider value={{ quotaInfo: settingData, setQuotaInfo: setSettingData }}>
          <NXHeader />
          <div className="screen-content">
            <div className="screen-left">
              <NXLeft />
            </div>
            <div className="screen-center">
              <NXCenter />
            </div>
            <div className="screen-right">
              <NXRight />
            </div>
          </div>
          {/* <i className="float-bottom"></i> */}
        </LargeScreenContext.Provider>
      </Suspense>
    </div>
  )
}
