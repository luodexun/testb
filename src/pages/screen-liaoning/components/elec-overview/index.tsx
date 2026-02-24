import { judgeNull, parseNum } from "@/utils/util-funs"
import LnCommonQuotaBox from "../common-quota"
import "./index.less"
import { useEffect, useState } from "react"
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
import { getDashboardPie } from "../../configs/echarts-dashboard"
import CommonBox2 from "../common-box2"
import { getElecData } from "@/utils/screen-funs"
import { useRefresh } from "@/hooks/use-refresh"
const elecOpts = [
  {
    type: "year",
    name: "年发电量",
    unit: "MWh",
    key: "yearlyProduction",
    needRate: true,
    finishRateKey: "yearRate",
    onYearRateKey: "yearlyYearOnYear",
    calculate: 0.1,
  },
  {
    type: "month",
    name: "月发电量",
    unit: "MWh",
    key: "monthlyProduction",
    needRate: true,
    finishRateKey: "monthRate",
    onYearRateKey: "monthlyYearOnYear",
    calculate: 0.1,
  },
  { name: "年发电量完成率(%)", key: "yearRate" },
]
const capacityOpts = [
  { title: "风电", key: "wtYearlyCompletionRate", icon: "wt" },
  { title: "光伏", key: "pvYearlyCompletionRate", icon: "pv" },
]
export default function LNElecOverview(props) {
  const [mchartData, setMChartData] = useState({
    value: 1,
  })
  const [ychartData, setYChartData] = useState({
    value: 1,
  })
  const [reload, setReload] = useRefresh(3 * 1000)
  const [quotaInfo, setQuotaInfo] = useState(null)
  const { chartRef, chartOptions } = useChartRender(mchartData, getDashboardPie)
  const { chartRef: ychartRef, chartOptions: ychartOptions } = useChartRender(ychartData, getDashboardPie)
  const initData = async () => {
    const result = await getElecData()
    if (!result) return
    setReload(false)
    setQuotaInfo(result)
    console.log(result, "result")

    setMChartData({ value: result.monthRate })
    setYChartData({ value: result.yearRate })
  }
  useEffect(() => {
    // effect logic
    if (!reload) return
    initData()
  }, [reload])
  return (
    <div className="ln-elec">
      <i className="ln-elec-icon"></i>
      <div className="ln-elec-box">
        {elecOpts?.map((i) => {
          return (
            <div className="box-item" key={i.key}>
              <LnCommonQuotaBox
                name={i.name}
                unit={i.unit}
                describeName={i.needRate ? "同比" : ""}
                describeValue={judgeNull(quotaInfo?.[i.onYearRateKey], 1, 2, "-")}
                value={judgeNull(quotaInfo?.[i.key], i.calculate || 1, 2, "-")}
              />
              {i.needRate ? (
                <div className="item-chart">
                  <ChartRender
                    ref={i.type === "year" ? ychartRef : chartRef}
                    option={i.type === "year" ? ychartOptions : chartOptions}
                  />
                </div>
              ) : (
                <div className="cpct-wp">
                  {capacityOpts?.map((j) => {
                    return (
                      <CommonBox2
                        key={j.key}
                        title={j.title}
                        icon={j.icon}
                        value={judgeNull(quotaInfo?.[j.key], 1, 2, "-")}
                        width="20em"
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
