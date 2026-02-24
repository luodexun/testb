/*
 * @Author: chenmeifeng
 * @Date: 2024-08-09 10:17:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-27 10:43:56
 * @Description: 近7日阶段数据质量趋势图
 */
import "./index.less"
import InfoCard from "@/components/info-card"
import RangeDatePicker from "@/components/range-date-picker"
import useChartRender from "@/hooks/use-chart-render"
import { useContext, useEffect, useState } from "react"
import { commonBarOrLineStyle, lineOrBarOption } from "../../configs/line-bar-options"
import ChartRender from "@/components/chart-render"
import { useRefresh } from "@/hooks/use-refresh"
import { getCenterTrend } from "../../methods"
import { uDate, vDate } from "@/utils/util-funs"
import { day4Y2S } from "@/configs/time-constant"
import AreaQualityContext from "../../configs/use-data-context"

export default function QualityTrend(props) {
  const { title } = props
  const [chooseDate, setChooseDate] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [quotaInfo, setQuotaInfo] = useState([])
  const [refresh, setRefresh] = useRefresh(10 * 60 * 1000) // 十分钟

  const { areaQualityCt } = useContext(AreaQualityContext)
  const { chartRef, chartOptions } = useChartRender(chartData, lineOrBarOption)
  const changeDate = (e) => {
    setChooseDate(e)
    setRefresh(true)
  }
  const getQuotaInfo = async () => {
    const res = await getCenterTrend({ dateRange: chooseDate, stationCode: areaQualityCt.stationCode })
    if (!res) return
    setQuotaInfo(res)
    setRefresh(false)
  }

  useEffect(() => {
    setChartData({
      xAxis: quotaInfo?.map((i) => uDate(i.Time, day4Y2S)),
      series: [
        {
          ...commonBarOrLineStyle.coverLine,
          data: quotaInfo?.map((i) => i.collectionCoverageRate),
        },
        {
          ...commonBarOrLineStyle.completeLine,
          data: quotaInfo?.map((i) => i.dataIntegrityRate),
        },
        {
          ...commonBarOrLineStyle.legalLine,
          data: quotaInfo?.map((i) => i.dataQualityRate),
        },
        {
          ...commonBarOrLineStyle.communicateLine,
          data: quotaInfo?.map((i) => i.communicationReliabilityRate),
        },
        {
          ...commonBarOrLineStyle.fileUploadLine,
          data: quotaInfo?.map((i) => i.fileUploadRate),
        },
      ],
      downloadFileName: "数据质量趋势",
    })
  }, [quotaInfo])
  useEffect(() => {
    setChooseDate([vDate().subtract(14, "day").startOf("day"), vDate().endOf("day")])
  }, [])
  useEffect(() => {
    if (!areaQualityCt?.stationCode) return
    setRefresh(true)
  }, [areaQualityCt])
  useEffect(() => {
    if (!refresh || !chooseDate || !areaQualityCt?.stationCode) return
    getQuotaInfo()
  }, [refresh, chooseDate, areaQualityCt])
  return (
    <InfoCard
      title={title}
      className={`area-quality-trend`}
      extra={
        <>
          <RangeDatePicker value={chooseDate} onChange={changeDate} />
        </>
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </InfoCard>
  )
}
