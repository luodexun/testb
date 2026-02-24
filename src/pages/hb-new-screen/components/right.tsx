/*
 * @Author: chenmeifeng
 * @Date: 2024-09-09 10:56:26
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-09 14:36:43
 * @Description: 湖北大屏1右侧
 */
import LargeScreenContext from "@/contexts/screen-context"
import { testScreenData } from "../configs/form-json"
import { getScreenStaticInfo } from "../methods"
import "./right.less"
import { Suspense, lazy, useEffect, useState } from "react"
const ElecOverview = lazy(() => import("./elec-overview/elec-overview"))
const WeatherInfo = lazy(() => import("./weather/weather"))
const YearUseHour = lazy(() => import("./year-use-hour/year-use-hour"))
export default function Hb1SrcTtRight() {
  const [settingData, setSettingData] = useState(testScreenData)
  const initData = async () => {
    // 获取接口临时数据
    const res = await getScreenStaticInfo()
    setSettingData(JSON.parse(res.data))
    // changejson(JSON.parse(res.data))
  }
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="l-full hb1-tr">
      <LargeScreenContext.Provider value={{ quotaInfo: settingData, setQuotaInfo: setSettingData }}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="screen-lr-20">
            <ElecOverview />
          </div>
          <div className="screen-lr-30">
            <YearUseHour />
          </div>
          <div className="screen-lr-50">
            <WeatherInfo />
          </div>
        </Suspense>
      </LargeScreenContext.Provider>
    </div>
  )
}
