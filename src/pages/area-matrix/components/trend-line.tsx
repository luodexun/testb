/*
 * @Author: chenmeifeng
 * @Date: 2024-01-08 17:49:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-08 16:03:48
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
import { getMeasurePointTreeData } from "@/pages/analysis-scatter/methods"
import { TAnlyTrendServe4Chart, TRpPowerSchFormItemName } from "@/pages/analysis-trend/types"
import { pointInfoSetAtom } from "@/store/atom-point-modal"
import { dealDownload4Response } from "@/utils/file-funs"
// import { TDate } from "@/types/i-antd"
import { getStartAndEndTime } from "@/utils/form-funs"
import { uDate, validResErr, vDate } from "@/utils/util-funs"

import { COM_TREND_FORM_BTNS, COM_TREND_SCH_ITEMS } from "../configs/trend-line-config"
import { IComAnlyTrendSchForm, IDeviceTrendSchParams, TTrendOption } from "../types"
import { IDeviceData } from "@/types/i-device"
export interface IPerateRef {}
export interface IOperateProps {
  info?: IDvsRunStateInfo
  device?: IDeviceData
  loading?: boolean
}
const TrendLine = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { device } = props
  // const [schDate, setSchDate] = useState<TDate>()
  const formRef = useRef<IFormInst<IComAnlyTrendSchForm>>()
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()
  const [chartData, setChartData] = useState<TTrendOption>()
  const [show, setShow] = useState(false) // 解决echarts初次渲染宽高问题
  const dataPiontList = useRef([])
  const allDataPiontData = useRef([])

  const isFirst = useRef(true) // 是否第一次加载数据
  const isFirstRefresh = useRef(true)
  const initPoint = async () => {}
  const getPointList = async () => {
    dataPiontList.current = await getMeasurePointTreeData({ modelId: device.modelId })
    allDataPiontData.current = dataPiontList.current.reduce((prev, cur) => {
      return prev.concat(cur.children || [])
    }, [])
    // setAllPoints(allDataPiontData.current)
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

  const getTrendData = useCallback(async () => {
    const formInst = formRef.current?.getInst()
    const formData = formInst.getFieldsValue()
    // setAllChoosePoint(formData.devicePoint)
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
    setChartData({ series: series })
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
  })
  async function onFormAction(type: string) {
    if (type === "export") {
      // 导出
      const params = dealParams()
      doBaseServer<typeof params, AxiosResponse>("exportTrendData", params).then((data) => {
        dealDownload4Response(data, "趋势曲线导出表.xlsx")
      })
    }
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
      {show ? <EchartCom type="dynamicsTimeLine" chartData={chartData} /> : ""}
    </div>
  )
})
export default TrendLine
