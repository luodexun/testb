/*
 * @Author: chenmeifeng
 * @Date: 2024-07-23 10:22:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-12 16:42:28
 * @Description:24小时实时功率
 */
import { useEffect, useRef, useState } from "react"
import { DVS_TYPE_OPTION, HOUR_24_REALTIME_PW } from "../../configs"
import CommonBoxHeader from "../common-box-header"
import ComRadioClk from "../common-radio"
import "./index.less"
import LNCommonQuotaBox from "../common-quota"
import { judgeNull, parseNum, validResErr } from "@/utils/util-funs"
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
import { LineOrBarOption } from "../../configs/line-bar-options"
import usePredictPowerScreen from "@/hooks/use-predict-screen"
import { TimeLineOption } from "../../configs/time-line-option"
import { useRefresh } from "@/hooks/use-refresh"
import { doBaseServer } from "@/api/serve-funs"
import LNCommonBox from "../common-box"
export default function RealtimePw24h() {
  const [quotaInfo, setQuotaInfo] = useState(null)
  const [chartData, setChartData] = useState(null)

  const [reload, setReload] = useRefresh(3 * 1000)
  const { dataMap } = usePredictPowerScreen({})
  const changeType = useRef((e) => {})
  const defaultProps = useRef((info) => {
    return {
      name: info.name,
      type: "line",
      lineStyle: {
        color: info.color,
      },
      itemStyle: {
        color: info.color,
      },
    }
  })
  const initData = () => {
    setChartData({
      unit: "MW",
      series: [
        {
          ...defaultProps.current(HOUR_24_REALTIME_PW?.find((i) => i.key === "AGCAvailablePower")),
          data: dataMap?.AGCAvailablePower || [],
          smooth: true,
          showSymbol: false,
        },
        {
          ...defaultProps.current(HOUR_24_REALTIME_PW?.find((i) => i.key === "realTimeTotalActivePowerOfSubStation")),
          data: dataMap?.realTimeTotalActivePowerOfSubStation || [],
          smooth: true,
          showSymbol: false,
        },
        {
          ...defaultProps.current(HOUR_24_REALTIME_PW?.find((i) => i.key === "AGCActivePowerOrderBySchedule")),
          data: dataMap?.AGCActivePowerOrderBySchedule || [],
          showSymbol: false,
        },
        {
          ...defaultProps.current(HOUR_24_REALTIME_PW?.find((i) => i.key === "shortPredPower")),
          data: dataMap?.shortPredPower || [],
          smooth: true,
          showSymbol: false,
        },
      ],
      screenWidth: 5440 || window.innerWidth,
      showLegend: true,
    })
  }
  const getPowerData = async () => {
    const res = await doBaseServer("getCenterPoint")
    if (validResErr(res)) return
    setReload(false)
    setQuotaInfo(res)
  }
  useEffect(() => {
    initData()
  }, [dataMap])
  useEffect(() => {
    if (!reload) return
    getPowerData()
  }, [reload])
  const { chartRef, chartOptions } = useChartRender(chartData, TimeLineOption)
  return (
    <LNCommonBox title="24小时实时功率">
      <div className="ln-rt-pw">
        {/* rightBox={<ComRadioClk options={DVS_TYPE_OPTION} onChange={changeType.current} />} */}
        <div className="rt-pw-left">
          {HOUR_24_REALTIME_PW?.map((i) => {
            return (
              <div className="pw-item" key={i.key}>
                <i className="pw-line" style={{ backgroundColor: i.color }}></i>
                <LNCommonQuotaBox
                  horizontal={false}
                  name={i.name}
                  unit="MW"
                  value={judgeNull(quotaInfo?.[i.key] / i.calculate, 1, 2, "-")}
                />
              </div>
            )
          })}
        </div>
        <div className="rt-pw-right">
          <ChartRender ref={chartRef} empty option={chartOptions} />
        </div>
      </div>
    </LNCommonBox>
  )
}
