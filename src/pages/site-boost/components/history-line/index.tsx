/*
 * @Author: chenmeifeng
 * @Date: 2024-02-01 17:48:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-25 14:42:37
 * @Description:
 */
import "./index.less"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import EchartCom from "@/components/echarts-common"
import { day4Y2S } from "@/configs/time-constant"
import { TCrashTrackFormAct } from "@/pages/analysis-crash-track/types"
import { IPointInfo } from "@/pages/site-boost/types"
import { IBoostMQData } from "@/types/i-boost"
import { uDate, validResErr, validServe, vDate } from "@/utils/util-funs"

import { SVG_HISTORY_FORM_BTNS, SVG_HISTORY_SCH_ITEMS } from "./configs"
import { analogData, dealParams, exportCrashTrackData } from "./methods"
import { ISvgHistorySchForm, ISvgHistorySchFormItemName, TStHtyFormAct, TTrendOption } from "./types"
import { getMeasurePointTreeData } from "@/pages/analysis-scatter/methods"
import { TAnlyTrendServe4Chart } from "@/pages/analysis-trend/types"
import { IDeviceTrendSchParams } from "@/pages/device-run-detail/components/trend-line/types"
import MinMaxInput from "@/components/min-max-input"
import { Button } from "antd"
import MaximumSet from "@/components/common-maximum-set/maximum-set"
export interface ISvgLineRef {}
export interface ISvgLineMdlProps {
  pointInfo: IPointInfo
}
// const test = analogData()
const SvgHistoryLine = forwardRef<ISvgLineRef, ISvgLineMdlProps>((props, ref) => {
  const { pointInfo } = props
  const [loading, setLoading] = useState(false)
  const formRef = useRef<IFormInst<ISvgHistorySchForm>>()
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<ISvgHistorySchFormItemName>>()
  const allDataPiontData = useRef([])
  const [chartData, setChartData] = useState<TTrendOption>()
  const [show, setShow] = useState(false) // 解决echarts初次渲染宽高问题
  const [showMaximums, setShowMaximums] = useState(false)
  const [showYMaximums, setShowYMaximums] = useState(false)

  const [maximumLs, setMaximumLs] = useState([])

  const [allChoosePoint, setAllChoosePoint] = useState([])
  const [allPoints, setAllPoints] = useState([])
  const [yAxisData, setYAxisData] = useState([])
  const maximumRef = useRef(null)
  const isFirst = useRef(true)
  // const [useOtherDvsCode, setUseOtherDvsCode] = useState(false)
  const useOtherDvsCode = useRef(false)
  useEffect(() => {
    if (!pointInfo || !isFirst.current) return
    isFirst.current = false
    initData()
  }, [pointInfo])
  const initData = async () => {
    const dataPiontList = await getMeasurePointTreeData({ modelId: pointInfo.modelId, pointTypes: "1,2" })
    allDataPiontData.current = dataPiontList.reduce((prev, cur) => {
      return prev.concat(cur.children || [])
    }, [])
    setAllPoints(allDataPiontData.current)
    const formInst = formRef.current?.getInst()
    const startDate = vDate().startOf("d")
    const endDate = vDate()
    setFormItemConfig((prevState) => ({ ...prevState, devicePoint: { treeData: dataPiontList } }))

    formInst?.setFieldsValue({
      dateRange: [startDate, endDate],
      timeInterval: "10m",
      devicePoint: [pointInfo.pointName],
    })
    formInst?.submit()
    setShow(true)
  }
  const onSearch = () => {
    useOtherDvsCode.current = false
    getTrendData()
  }
  const getTrendData = async () => {
    const formInst = formRef.current?.getInst()
    const formData = formInst.getFieldsValue()
    setAllChoosePoint(formData.devicePoint)
    const params = dealParams(formData, pointInfo, allDataPiontData.current)
    const resData = await doBaseServer<typeof params, IBoostMQData[]>("getTrendDataV2", params)
    isFirst.current = true
    if (validResErr(resData)) return

    let currentInfo = resData[pointInfo.deviceCode] || {}
    // 第二次请求
    if (currentInfo && Object.keys(currentInfo)?.length < 1) {
      // useOtherDvsCode.current = true
      let strlength = pointInfo.deviceCode.length
      let newDvsCode =
        pointInfo.deviceCode.substring(0, strlength - 4) +
        "16" +
        pointInfo.deviceCode.substring(strlength - 2, strlength)
      let newParams = dealParams(formData, { ...pointInfo, deviceCode: newDvsCode }, allDataPiontData.current)
      let newResData = await doBaseServer<typeof params, IBoostMQData[]>("getTrendDataV2", newParams)
      if (validResErr(newResData)) return
      currentInfo = newResData[newDvsCode] || {}
      // 第三次请求
      if (currentInfo && Object.keys(currentInfo)?.length < 1) {
        newDvsCode = pointInfo.deviceCode.substring(0, strlength - 2) + "16"
        newParams = dealParams(formData, { ...pointInfo, deviceCode: newDvsCode }, allDataPiontData.current)
        newResData = await doBaseServer<typeof params, IBoostMQData[]>("getTrendDataV2", newParams)
        if (validResErr(newResData)) return
        currentInfo = newResData[newDvsCode] || {}
      }
    }
    const series = formData.devicePoint.map((i) => {
      const info = allDataPiontData.current?.find((j) => j.value === i)
      return {
        type: "line",
        // name: info.title + (info?.unit ? `(${info.unit})` : ""),
        name: info?.title || "",
        data: currentInfo?.[i]?.map((item, idx) => [currentInfo?.["Time"]?.[idx], item]) || [],
        ls: currentInfo?.[i]?.map((item) => item) || [],
        key: i,
      }
    })
    getPointMaximum.current(series)
    setChartData({ series: series })
    setYAxisData(maximumRef?.current?.getYAxis(series))
  }
  function onFormAction(type: TStHtyFormAct) {
    if (type === "export") {
      setLoading(true)
      const formData = formRef.current?.getFormValues()
      exportCrashTrackData(formData, pointInfo, allDataPiontData.current).then(() => setLoading(false))
    } else if (type === "maxmin") {
      // 显示最大最小值
      setShowMaximums((prev) => !prev)
    } else if (type === "ymaxmin") {
      // y轴范围
      setShowYMaximums((prev) => !prev)
    }
  }

  const chartProps = useMemo(() => {
    if (!chartData?.series || !yAxisData?.length) return null
    const series = chartData.series?.map((i) => {
      const yAxisIndex = yAxisData.findIndex((y) => y.key === i.key)
      return {
        ...i,
        yAxisIndex: yAxisIndex,
      }
    })
    return {
      xAxis: chartData?.xAxis,
      series: series,
      downloadFileName: "历史趋势曲线",
      yAxisProps: yAxisData,
    }
  }, [chartData, yAxisData])
  const getPointMaximum = useRef((info) => {
    const maximumInfo = info?.map((i) => {
      const max = parseFloat(Math.max.apply(null, i.ls).toFixed(2));
      const min = parseFloat(Math.min.apply(null, i.ls).toFixed(2));
      const avg = parseFloat((i.ls.reduce((sum, val) => sum + val, 0) / i.ls.length).toFixed(2))
      return {
        name: i.name,
        max,
        min,
        avg,
      }
    })
    setMaximumLs(maximumInfo)
  })

  const setMaxmin = (e) => {
    setYAxisData(e)
  }

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="svg-history">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={SVG_HISTORY_SCH_ITEMS}
        buttons={SVG_HISTORY_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      {showMaximums ? (
        <div className="attr-trend-mx">
          {maximumLs?.map((i) => {
            return (
              <div className="trend-mx-item" key={i.name}>
                {i.name}: {i.min}~{i.avg}~{i.max}
              </div>
            )
          })}
        </div>
      ) : (
        ""
      )}

      <MaximumSet
        ref={maximumRef}
        allChoosePoint={allChoosePoint}
        allDataPiontData={allPoints}
        series={chartData?.series}
        showBox={showYMaximums}
        onChange={setMaxmin}
      />
      {show ? <EchartCom type="dynamicsTimeLine" chartData={chartProps} /> : ""}
    </div>
  )
})
export default SvgHistoryLine
