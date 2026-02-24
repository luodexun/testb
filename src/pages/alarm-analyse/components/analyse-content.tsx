/*
 * @Author: chenmeifeng
 * @Date: 2024-04-01 10:00:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-25 14:26:23
 * @Description: 图表组件
 */
import { useEffect, useRef, useState } from "react"

import ChartRender from "@/components/chart-render"
import { dataConvertEchartOptions } from "../methods"
import { IRunTrendChartData } from "../types"
import runTrendOption from "./trend-option"

export default function AnalyseContent(props: IRunTrendChartData) {
  const { loading, dataSource } = props
  const chartRef = useRef(null)
  const xAixsData = useRef([])
  const seriesData = useRef([])
  const seriesDataDeviceID = useRef([])
  const selectIndex = useRef(0)

  const [echartOptions, setEchartOptions] = useState({})
  const [echartOptionsOne, setEchartOptionsOne] = useState({})
  const [echartOptionsTwo, setEchartOptionsTwo] = useState({})
  const [echartOptionsthree, setEchartOptionsthree] = useState({})
  const [selectTitle, setSelectTitle] = useState("设备告警信息")

  useEffect(() => {
    const tmpData = dataSource.filter((item) => item.parentClass == "汇总" && item.childClass == "汇总")
    xAixsData.current = tmpData.map((itep) => `${itep.stationDesc}-${itep.deviceDesc}`)
    seriesData.current = tmpData.map((itep) => itep.alarmCount)
    seriesDataDeviceID.current = tmpData.map((itep) => itep.deviceId)
    const chartOptions = runTrendOption({
      xAixsData: xAixsData.current,
      seriesData: seriesData.current,
      title: "告警条数",
      showMrkLine: true,
    })
    setEchartOptions(chartOptions)

    const { chartOptionsOne, chartOptionsTwo, chartOptionsThree } = dataConvertEchartOptions(
      dataSource,
      selectIndex,
      seriesDataDeviceID,
    )
    setEchartOptionsOne(chartOptionsOne)
    setEchartOptionsTwo(chartOptionsTwo)
    setEchartOptionsthree(chartOptionsThree)

    setSelectTitle(`${tmpData.map((itep) => `${itep.stationDesc}-${itep.deviceDesc}`)[0] || ""} 设备告警信息`)
    if (!dataSource?.length) return
    handleClick({ dataIndex: 0 })
  }, [dataSource])
  // 点击事件处理函数
  const handleClick = (e) => {
    // 保存当前的滚动条位置
    const chartInstance = chartRef.current?.getEchartsInstance()
    const dataZoom = chartInstance.getModel()?.option?.["dataZoom"]?.[0]
    const { start, end } = dataZoom
    selectIndex.current = e.dataIndex
    const chartOptions = runTrendOption({
      xAixsData: xAixsData.current,
      seriesData: seriesData.current,
      dataIndex: e.dataIndex,
      title: "告警条数",
      showMrkLine: true,
      dataZoomStart: e.dataIndex === 0 ? null : start,
      dataZoomEnd: e.dataIndex === 0 ? null : end,
    })
    setEchartOptions(chartOptions)
    setSelectTitle(`${xAixsData.current[e.dataIndex] || ""} 设备告警信息`)

    const { chartOptionsOne, chartOptionsTwo, chartOptionsThree } = dataConvertEchartOptions(
      dataSource,
      selectIndex,
      seriesDataDeviceID,
    )
    setEchartOptionsOne(chartOptionsOne)
    setEchartOptionsTwo(chartOptionsTwo)
    setEchartOptionsthree(chartOptionsThree)
  }
  return (
    <div className="curve-warp ">
      {/* <ChartRender loading={loading} option={chartOptions} /> */}
      <div className="echart-content-top">
        <ChartRender ref={chartRef} loading={loading} option={echartOptions} onClick={handleClick} />
      </div>
      <div className="echart-content-bottom">
        <div className="echart-content-title">{selectTitle}</div>
        <div className="echart-content-detail">
          <div className="detail-content-top">
            <ChartRender loading={loading} option={echartOptionsOne} />
          </div>
          <div className="detail-content-bottom">
            <div className="bottom-echart">
              <ChartRender loading={loading} option={echartOptionsTwo} />
            </div>
            <div className="bottom-echart">
              <ChartRender loading={loading} option={echartOptionsthree} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
