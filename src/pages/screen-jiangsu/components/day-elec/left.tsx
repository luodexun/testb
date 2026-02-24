import ChartRender from "@/components/chart-render"
import { powerType } from "../../configs"
import CommonQuotaBox from "../common-quota-box"
import "./index.less"
import { useEffect, useRef, useState } from "react"
import useChartRender from "@/hooks/use-chart-render"
import { brand2DPie } from "../../configs/pie-options"
import useHourScreen from "@/hooks/use-usehour-screen"
import { getScreenPointData } from "@/utils/screen-funs"
import { useRefresh } from "@/hooks/use-refresh"
import { parseNum } from "@/utils/util-funs"
export default function DayElecLeft() {
  const [chartData, setChartData] = useState(null)
  const [dailyPd, setDailyPd] = useState(null)
  const [reload, setReload] = useRefresh(10 * 60 * 6000) // 10m
  const getPieData = useRef(async () => {
    const res = await getScreenPointData()
    if (res) {
      setDailyPd({
        wtDailyProduction: res.wtDailyProduction,
        pvinvDailyProduction: res.pvinvDailyProduction,
      })
      setChartData({
        series: [
          { value: res.wtDailyProduction, name: "风机", itemStyle: { color: "rgba(248, 188, 57, 1)" } },
          { value: res.pvinvDailyProduction, name: "光伏", itemStyle: { color: "rgba(0, 246, 249, 1)" } },
        ],
      })
    }
  })
  useEffect(() => {
    getPieData.current()
  }, [reload])
  const { chartRef, chartOptions } = useChartRender(chartData, brand2DPie)

  return (
    <div className="elec-left-con">
      <div className="elec-left">
        {powerType?.map((i) => {
          return (
            <div key={i.value} className="elec-box">
              <i className={`name-be name-be-${i.color}`}></i>
              <CommonQuotaBox name={i.name} unit={i.unit} value={parseNum(dailyPd?.[i.value], 3) || "-"} />
            </div>
          )
        })}
      </div>
      <div className="elec-right">
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
