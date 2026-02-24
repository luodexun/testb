import "./statistics.less"
import { useCallback, useEffect, useRef, useState } from "react"
import CommonBox1 from "../common-box1"
import { IStatisticsInfo } from "../../types"
import ChartRender from "@/components/chart-render"
import { getPieChart } from "../../configs/echarts-pie"
import useChartRender from "@/hooks/use-chart-render"
import useHourScreen from "@/hooks/use-usehour-screen"
import { echartsLineColor } from "../../configs"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
import { MS_HOUR } from "@/configs/time-constant"
import { judgeNull } from "@/utils/util-funs"

export default function Statistics(props: IStatisticsInfo) {
  const { typeName, typeKey, unit, child } = props
  const [chartData, setChartData] = useState(null)

  const { chartRef, chartOptions } = useChartRender(chartData, getPieChart)
  const mainCpnInfo = useAtomValue(mainComAtom)
  const intervalTime = useRef(null)
  const initChart = useCallback(() => {
    setChartData((prev) => {
      return {
        series:
          child?.map((i) => {
            return {
              name: i.name,
              value: mainCpnInfo?.[i.key] || 0,
              itemStyle: {
                color: i.color,
              },
            }
          }) || [],
        screenWidth: 5440 || window.innerWidth,
      }
    })
  }, [child, mainCpnInfo])
  useEffect(() => {
    intervalTime.current ? clearInterval(intervalTime.current) : ""
    initChart()
    intervalTime.current = setInterval(() => {
      initChart()
    }, MS_HOUR)
    return () => clearInterval(intervalTime.current)
  }, [])
  useEffect(() => {
    // effect logic
  }, [])
  return (
    <div className="station-statistics">
      <CommonBox1 name={typeName} value={judgeNull(mainCpnInfo?.[typeKey], 1, 2, "-")} unit={unit} />
      <div className="stc-right">
        <div className="stc-right-s">
          {child?.map((i) => {
            return (
              <div key={i.key} className="stc-box">
                <div className="box-left">
                  <i className="icon" style={{ backgroundColor: i.color }}></i>
                  <span className="name">{i.name}</span>
                </div>
                <div className="box-right">
                  <span className="value">{judgeNull(mainCpnInfo?.[i.key], 1, 2, "-")}</span>
                  <span className="unit">{unit}</span>
                </div>
              </div>
            )
          })}
        </div>
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
