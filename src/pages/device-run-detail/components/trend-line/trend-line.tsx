/*
 * @Author: chenmeifeng
 * @Date: 2024-01-08 17:49:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-13 16:23:54
 * @Description:
 */
import "./trend-line.less"

import { AxiosResponse } from "axios"
import { useAtomValue, useSetAtom } from "jotai"
// import { DatePicker } from "antd"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import EchartCom from "@/components/echarts-common"
// import RangeDatePicker from "@/components/range-date-picker"
import { IDvsRunStateInfo } from "@/configs/dvs-state-info"
import { day4Y2S } from "@/configs/time-constant"
import { getMeasurePointTreeData } from "@/pages/analysis-scatter/methods"
import { TAnlyTrendServe4Chart, TRpPowerSchFormItemName } from "@/pages/analysis-trend/types"
import { pointInfoSetAtom } from "@/store/atom-point-modal"
import { dealDownload4Response } from "@/utils/file-funs"
// import { TDate } from "@/types/i-antd"
import { getStartAndEndTime } from "@/utils/form-funs"
import { uDate, validResErr, vDate } from "@/utils/util-funs"

import { COM_TREND_FORM_BTNS, COM_TREND_SCH_ITEMS } from "./trend-line-config"
import { IComAnlyTrendSchForm, IDeviceTrendSchParams, TTrendOption } from "./types"
import { IDeviceData } from "@/types/i-device"
// import { analogData } from "@/pages/site-boost/components/history-line/methods"
// import MinMaxInput from "@/components/min-max-input"
// import { Button, Input, Select } from "antd"
// import LimitPowerButton from "@/components/custom-input/limit-power-button"
// import Draggable from "react-draggable"
import MaximumSet from "@/components/common-maximum-set/maximum-set"

export interface IPerateRef {}
export interface IOperateProps {
  info?: IDvsRunStateInfo
  device?: IDeviceData
  loading?: boolean
}
interface IMaximum {
  [key: string]: {
    min: number
    max: number
    position?: "left" | "right"
  }
}
const options = [
  { label: "左边", value: "left" },
  { label: "右边", value: "right" },
]
const TrendLine = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { device } = props
  // const [schDate, setSchDate] = useState<TDate>()
  const formRef = useRef<IFormInst<IComAnlyTrendSchForm>>()
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()
  const [chartData, setChartData] = useState<TTrendOption>()
  const [show, setShow] = useState(false) // 解决echarts初次渲染宽高问题
  const dataPiontList = useRef([])
  const allDataPiontData = useRef([])

  const choosePointLs = useRef([])
  const isFirst = useRef(true) // 是否第一次加载数据
  const isFirstRefresh = useRef(true)
  const lastDeviceCode = useRef("")
  const pointLs = useAtomValue(pointInfoSetAtom)
  const setPiontList = useSetAtom(pointInfoSetAtom)
  const [showMaximums, setShowMaximums] = useState(false)
  const [showYMaximums, setShowYMaximums] = useState(false)
  const [maximumLs, setMaximumLs] = useState([])

  const [allChoosePoint, setAllChoosePoint] = useState([])
  const [allPoints, setAllPoints] = useState([])
  const [yAxisData, setYAxisData] = useState([])
  const maximumRef = useRef(null)
  useEffect(() => {
    if (isFirstRefresh.current && pointLs?.pointInfo?.length) {
      isFirstRefresh.current = false
      initPoint()
    }
  }, [pointLs])
  useEffect(() => {
    const init = async () => {
      // 避免第一进来调用
      if (!isFirst.current && lastDeviceCode.current) {
        await getPointList()
        initPoint()
      }
    }
    init()
  }, [device])
  const initPoint = async () => {
    if (pointLs?.pointInfo?.length) {
      // 是否是第一次进来弹框查询
      if (isFirst.current) {
        isFirst.current = false
        // lastDeviceCode.current = device.deviceCode
        await initData()
      }
      lastDeviceCode.current = device.deviceCode
      const formInst = formRef.current?.getInst()
      const devicePoint = formInst.getFieldValue("devicePoint")
      choosePointLs.current = pointLs.pointInfo

      const isCentralized = device?.deviceTags?.inverter_type === "集中式"
      const field = isCentralized ? "actualShowSubField" : "subField"
      const pointArr = choosePointLs.current?.map((i) => i[field] || i.subField) || []

      if (!devicePoint?.length) {
        formInst?.setFieldsValue({ devicePoint: pointArr })
      } else {
        // const noRepeatArr =
        pointArr.forEach((i) => {
          const exit = devicePoint.includes(i)
          if (!exit) devicePoint.push(i)
        })
        formInst?.setFieldsValue({ devicePoint: devicePoint })
      }
      // setAllChoosePoint(devicePoint || pointArr)
      formInst?.submit()
    }
  }
  const getPointList = async () => {
    dataPiontList.current = await getMeasurePointTreeData({ modelId: device.modelId })
    allDataPiontData.current = dataPiontList.current.reduce((prev, cur) => {
      return prev.concat(cur.children || [])
    }, [])
    setAllPoints(allDataPiontData.current)
    setFormItemConfig((prevState) => ({ ...prevState, devicePoint: { treeData: dataPiontList.current } }))
  }
  const initData = async () => {
    // if (!info) return
    await getPointList()
    const formInst = formRef.current?.getInst()
    const startDate = vDate().startOf("d")
    const endDate = vDate()
    formInst?.setFieldsValue({ dateRange: [startDate, endDate], timeInterval: "10m" })
    setShow(true)
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

  const getTrendData = useCallback(async () => {
    const formInst = formRef.current?.getInst()
    const formData = formInst.getFieldsValue()
    setAllChoosePoint(formData.devicePoint)
    const params = dealParams()
    const resData = await doBaseServer<IDeviceTrendSchParams, TAnlyTrendServe4Chart>("getTrendDataV2", params)
    isFirstRefresh.current = true

    if (validResErr(resData)) return
    const currentInfo = resData[device.deviceCode] || {}
    const series = formData.devicePoint.map((i) => {
      const info = allDataPiontData.current?.find((j) => j.value === i)
      return {
        type: "line",
        name: info?.title || "",
        smooth: true,
        data: currentInfo?.[i]?.map((item, idx) => [currentInfo?.["Time"]?.[idx], item]) || [],
        ls: currentInfo?.[i]?.map((item) => item) || [],
        key: i,
      }
    })
    getPointMaximum.current(series)
    //
    setChartData({ series: series })
    setYAxisData(maximumRef?.current?.getYAxis(series))
  }, [device])

  const convertPiontHasDvc = (devicePoint: string[]) => {
    return devicePoint
      .map((i) => {
        const pointDesc = allDataPiontData.current?.find((j) => j.value === i)?.title
        return `${device.deviceCode}-${i}-${pointDesc}`
      })
      ?.join(",")
  }
  const onSchValueChgRef = useRef((changedValue) => {
    console.log(345, changedValue)

    if (changedValue?.devicePoint) {
      isFirstRefresh.current = true
      setPiontList({ pointInfo: null, open: true })
      // setAllChoosePoint(changedValue.devicePoint)
    }
  })
  async function onFormAction(type: string) {
    if (type === "export") {
      // 导出
      const params = dealParams()
      doBaseServer<typeof params, AxiosResponse>("exportTrendData", params).then((data) => {
        dealDownload4Response(data, "趋势曲线导出表.xlsx")
      })
    } else if (type === "maxmin") {
      // 最值查看
      setShowMaximums((prev) => !prev)
    } else if (type === "ymaxmin") {
      // y轴范围
      setShowYMaximums((prev) => !prev)
    }
  }
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
    console.log(e, "dfsd")

    setYAxisData(e)
  }

  const dealParams = () => {
    const formInst = formRef.current?.getInst()
    const formData = formInst.getFieldsValue()
    const params = {
      devicePoint: convertPiontHasDvc(formData.devicePoint),
      timeInterval: formData.timeInterval,
      func: "LAST",
      ...getStartAndEndTime<number>(formData.dateRange, "", null, true),
    }
    return params
  }
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="attr-trend">
      <CustomForm
        ref={formRef}
        itemOptionConfig={formItemConfig}
        itemOptions={COM_TREND_SCH_ITEMS}
        buttons={COM_TREND_FORM_BTNS}
        formOptions={{
          onValuesChange: onSchValueChgRef.current,
        }}
        onSearch={getTrendData}
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
export default TrendLine
