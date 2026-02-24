import "./index.less"
import ChartRender from "@/components/chart-render"
import CommonCtBox from "../common-box"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { useRefresh } from "@/hooks/use-refresh"
import LargeScreenContext from "@/contexts/screen-context"
import { judgeNull, parseNum } from "@/utils/util-funs"
import useChartRender from "@/hooks/use-chart-render"
import { LineOrBarOption } from "../../configs/line-bar-options"
import { echartsLineColor } from "../../configs"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
import { doBaseServer } from "@/api/serve-funs"
import useDayloadScreen from "@/hooks/use-dayload-screen"
const rtLs = [
  { name: "平均风速", key: "windSpeed", unit: "m/s", icon: "speed" },
  { name: "平均辐照度", key: "totalIrradiance", unit: "W/m²", icon: "irdt" },
]
export default function SXRealtime() {
  const [chartData, setChartData] = useState(null)

  const [reload, setReload] = useRefresh(10 * 60 * 1000) // 10min
  const reloadTime = useRef(5 * 60 * 1000) // 五分钟
  const { quotaInfo } = useContext(LargeScreenContext)
  const mainCpnInfo = useAtomValue(mainComAtom)
  const { series, xAxis, allData } = useDayloadScreen({ stnCode: "ALL", reload: reloadTime.current })
  const initChartData = async () => {
    const params = {}
    // 接口
    // const res = await doBaseServer("getStationPointTrendData", params)
    // console.log(res, "res")
    if (!series) return
    // const result = [
    //   { Time: "12", activePower: 12, wtActiveP: 10, pvActiveP: 1 },
    //   { Time: "2", activePower: 2, wtActiveP: 10, pvActiveP: 2 },
    //   { Time: "3", activePower: 65, wtActiveP: 10, pvActiveP: 1 },
    //   { Time: "6", activePower: 1, wtActiveP: 6, pvActiveP: 9 },
    // ]
    setReload(false)
    const xData = xAxis
    const atData = allData?.map((i) => parseNum(i.agvcPower / 10), 3) || [] // 返回的是MW，展示万kW
    const wtData = allData?.map((i) => parseNum(i.shortPredPower / 10000), 3) || [] // 返回的是kW，展示万kW
    const pvData = allData?.map((i) => parseNum(i.ultraShortPredPower / 10000), 3) || [] // 返回的是kW，展示万kW
    setCharts(xData, { wtData, pvData, atData })
  }
  const setCharts = (xData, { wtData, pvData, atData }) => {
    setChartData({
      unit: "万kWh",
      series: [
        {
          ...echartsLineColor.wtAtPower,
          showSymbol: false,
          data: atData,
        },
        {
          ...echartsLineColor.pvAtPower,
          showSymbol: false,
          data: wtData,
        },
        {
          ...echartsLineColor.atPower,
          showSymbol: false,
          data: pvData,
        },
      ],
      xAxis: xData,
      screenWidth: 1920 || window.innerWidth,
      showLegend: false,
    })
  }
  // 实时数据
  const actualShowInfo = useMemo(() => {
    if (quotaInfo?.realtimeInfo && !quotaInfo?.realtimeInfo?.useInterfaceData) {
      return quotaInfo?.realtimeInfo?.data || null
    }
    return mainCpnInfo
  }, [quotaInfo, mainCpnInfo])
  useEffect(() => {
    if (quotaInfo?.realtimeInfo && !quotaInfo?.realtimeInfo?.useInterfaceData) {
      const { list = [] } = quotaInfo?.realtimeInfo
      const xData = list?.map((i) => i.Time) || []
      const atData = list?.map((i) => parseNum(i.activePower), 3) || []
      const wtData = list?.map((i) => parseNum(i.shortPredPower), 3) || []
      const pvData = list?.map((i) => parseNum(i.ultraShortPredPower), 3) || []
      setCharts(xData, { wtData, pvData, atData })
    }
  }, [quotaInfo])
  useEffect(() => {
    if (quotaInfo?.realtimeInfo?.useInterfaceData || !quotaInfo?.realtimeInfo) {
      initChartData()
    }
  }, [series, quotaInfo])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <CommonCtBox title="实时信息">
      <div className="sx-realtime">
        <div className="sx-realtime-top">
          {rtLs?.map((i) => {
            return (
              <div className="rt-item" key={i.key}>
                <i className={`icon i-${i.icon}`}></i>
                <div>
                  <p className="item-name">{i.name}</p>
                  <p className="item-val">
                    {judgeNull(actualShowInfo?.[i.key], 1, 2, "-")} <span>{i.unit}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="sx-realtime-btm">
          <ChartRender ref={chartRef} empty option={chartOptions} />
        </div>
      </div>
    </CommonCtBox>
  )
}
