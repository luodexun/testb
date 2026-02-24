/*
 * @Author: chenmeifeng
 * @Date: 2024-01-08 17:49:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-11 16:46:30
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
import { IDvsRunStateInfo, MONITOR_SITE_INFO_MAP } from "@/configs/dvs-state-info"
import { getMeasurePointTreeData } from "@/pages/analysis-scatter/methods"
import { TAnlyTrendServe4Chart, TRpPowerSchFormItemName } from "@/pages/analysis-trend/types"
import { pointInfoSetAtom } from "@/store/atom-point-modal"
import { TDeviceType } from "@/types/i-config"
import { IDeviceData } from "@/types/i-device"
import { dealDownload4Response } from "@/utils/file-funs"
// import { TDate } from "@/types/i-antd"
import { getStartAndEndTime } from "@/utils/form-funs"
import { uDate, validResErr, vDate } from "@/utils/util-funs"

import { COM_TREND_FORM_BTNS, COM_TREND_SCH_ITEMS } from "./trend-line-config"
import { IComAnlyTrendSchForm, IDeviceTrendSchParams, TTrendOption } from "./types"
export interface IPerateRef {}
export interface IOperateProps {
  deviceType: TDeviceType
  stationCode: string
  point: string
  loading?: boolean
}
const TrendLine = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { deviceType, stationCode, point } = props
  // const [schDate, setSchDate] = useState<TDate>()
  const formRef = useRef<IFormInst<IComAnlyTrendSchForm>>()
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()
  const [chartData, setChartData] = useState<TTrendOption>({ series: [] })
  const [show, setShow] = useState(false) // 解决echarts初次渲染宽高问题
  const allDataPiontData = useRef([])

  const isFirst = useRef(true) // 是否第一次加载数据
  const isFirstRefresh = useRef(true)
  const getPointList = async () => {
    allDataPiontData.current = MONITOR_SITE_INFO_MAP[deviceType]
      .filter((j) => !j.trendNoShow)
      ?.map((i) => {
        return {
          label: i.title,
          value: i.field,
        }
      })
    setFormItemConfig((prevState) => ({ ...prevState, points: { treeData: allDataPiontData.current } }))
  }
  const initData = async () => {
    // if (!info) return
    await getPointList()
    const formInst = formRef.current?.getInst()
    const startDate = vDate().startOf("d")
    const endDate = vDate()
    formInst?.setFieldsValue({ dateRange: [startDate, endDate], groupByTime: "5m", points: [point], stationCode })
    getTrendData()
    setShow(true)
  }

  const getTrendData = useCallback(async () => {
    const formInst = formRef.current?.getInst()
    const formData = formInst.getFieldsValue()
    // setAllChoosePoint(formData.devicePoint)
    const params = dealParams()
    const resData = await doBaseServer<IDeviceTrendSchParams>("getStationQtData", params)
    isFirstRefresh.current = true

    if (validResErr(resData)) return
    const series = formData.points.map((i) => {
      const info = allDataPiontData.current?.find((j) => j.value === i)
      return {
        type: "line",
        name: info?.title || "",
        smooth: true,
        data: resData?.[i]?.map((item, idx) => [resData?.["Time"]?.[idx], item]) || [],
        ls: resData?.[i]?.map((item) => item) || [],
        key: i,
      }
    })
    setChartData({ series: series })
  }, [stationCode])

  const convertPiontHasDvc = (devicePoint: string[]) => {
    return devicePoint.join(",")
  }
  const onSchValueChgRef = useRef((changedValue) => {
    console.log(345, changedValue)
  })
  async function onFormAction(type: string) {
    if (type === "export") {
      // 导出
      const params = dealParams()
      doBaseServer<typeof params, AxiosResponse>("exportStationData", params).then((data) => {
        dealDownload4Response(data, "趋势曲线导出表.xlsx")
      })
    }
  }
  const dealParams = () => {
    const formInst = formRef.current?.getInst()
    const formData = formInst.getFieldsValue()
    const params = {
      deviceType,
      points: convertPiontHasDvc(formData.points),
      groupByTime: formData.groupByTime,
      stationCode: formData.stationCode,
      func: "LAST",
      ...getStartAndEndTime<number>(formData.dateRange, "", null, true),
    }
    return params
  }

  useEffect(() => {
    if (!point) return
    initData()
  }, [point])
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
      {show ? <EchartCom type="dynamicsTimeLine" chartData={chartData} /> : ""}
    </div>
  )
})
export default TrendLine
