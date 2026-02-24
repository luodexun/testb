/*
 * @Author: chenmeifeng
 * @Date: 2024-07-04 09:38:36
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-25 14:18:58
 * @Description:
 */
import { Suspense, lazy, useEffect } from "react"
import "./index.less"
import { useSetAtom } from "jotai"
import { mainComSetAtom } from "@/store/atom-screen-data"
import { useRefresh } from "@/hooks/use-refresh"
import { getScreenPointData } from "@/utils/screen-funs"
const JSHeader = lazy(() => import("./components/header"))
const DayElec = lazy(() => import("./components/day-elec"))
const WTState = lazy(() => import("./components/wt-state"))
const ElecOverview = lazy(() => import("./components/elec-overview"))
const YearElecUse = lazy(() => import("./components/year-elec-use"))
const PredictElec = lazy(() => import("./components/predict-elec"))
const RealtimeBox = lazy(() => import("./components/realtime"))
const AhCenter = lazy(() => import("./components/center"))
export default function AnhuiScreen() {
  const setScreenMainValue = useSetAtom(mainComSetAtom)
  const [reload, setReload] = useRefresh(3000) // 3s
  const initData = async () => {
    const mainInfo = await getScreenPointData()
    if (!mainInfo) return
    setScreenMainValue({
      mainComInfo: mainInfo,
      call: () => {
        setReload(false)
      },
    })
  }
  useEffect(() => {
    if (!reload) return
    initData()
  }, [reload])
  return (
    <div className="ah-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <JSHeader />
        <div className="ah-screen-content">
          <div className="ah-screen-content-box">
            <div className="ah-screen-left">
              <div className="screen-lr20-box">
                <ElecOverview />
              </div>
              <div className="screen-lr40-box">
                <DayElec />
              </div>
              <div className="screen-lr40-box">
                <YearElecUse />
              </div>
            </div>
            <div className="ah-screen-center">
              <AhCenter />
            </div>
            <div className="ah-screen-right">
              <div className="screen-lr12-box">
                <RealtimeBox />
              </div>
              <div className="screen-lr60-box">
                <WTState />
              </div>
              <div className="screen-lr28-box">
                <PredictElec />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
