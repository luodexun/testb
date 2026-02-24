/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-13 15:30:55
 * @Description:
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { TIntervalKey } from "@configs/option-const.tsx"
import { StorageDeviceType, StorageStationData } from "@configs/storage-cfg.ts"
import { day4Y2S } from "@configs/time-constant"
import { ANLY_SCTTR_COLUMNS } from "@pages/analysis-scatter/configs"
import {
  deviceDisabled4OverLimit,
  dvsPointDisabeld4OverLimit,
  getAnalyDeviceOptions,
  getAxisMeasurePointTreeData,
  splitPoint,
} from "@pages/analysis-scatter/methods"
import { IAnalyFormItemCfgMap, TAnlyScatterData } from "@pages/analysis-scatter/types"
import { IAnalyTrendChartData } from "@pages/analysis-trend/components/analy-trend-options.ts"
import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime, onFormValueChange } from "@utils/form-funs.ts"
import { addTableIndex, joinFormValue } from "@utils/table-funs.tsx"
import {
  getStorage,
  isEmpty,
  isNumVal,
  judgeNull,
  numberVal,
  reduceList2KeyValueMap,
  showMsg,
  uDate,
  validResErr,
  validServe,
  vDate,
} from "@utils/util-funs.tsx"
import { ColumnsType } from "antd/es/table"
import { AxiosResponse } from "axios"
import { UnitTypeLong } from "dayjs"
import { MutableRefObject } from "react"

import { doBaseServer, doRecordServer } from "@/api/serve-funs.ts"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import { TOptions } from "@/types/i-antd"
import { TDeviceType } from "@/types/i-config"
import { IAtomStation } from "@/types/i-station.ts"
import { IPageInfo } from "@/types/i-table.ts"

import {
  IAnlyTrendSchForm,
  IAnlyTrendSchParams,
  TAnlyTrendData,
  TAnlyTrendSchItemName,
  TAnlyTrendServe4Chart,
} from "../types/index"

const DATE_INFO_MAP: Partial<Record<TIntervalKey, { unit: UnitTypeLong; limit: number; title: string }>> = {
  "1s": { unit: "day", limit: 2000, title: "天" }, // 2 小时hour
  "1m": { unit: "day", limit: 2000, title: "天" }, // 6 小时
  "1h": { unit: "day", limit: 2000, title: "天" }, // 24 小时
  "1d": { unit: "day", limit: 2000, title: "天" }, // 15 天day
}
const VALID_INFOS: IDvsRunStateInfo<keyof IAnlyTrendSchForm>[] = [
  { field: "devicePoint", title: "请选择测点！", valueFun: (val) => !val?.length },
  { field: "timeInterval", title: "请选择刻度间隔！", valueFun: (val) => !val },
  { field: "func", title: "请选择聚合方式！", valueFun: (val) => !val },
  {
    field: "dateRange",
    title: "请选择时间！",
    valueFun: (val: IAnlyTrendSchForm["dateRange"]) => {
      const [start, end] = val || []
      return !start || !end
    },
  },
]
function dateRangeErr(dateRange: IAnlyTrendSchForm["dateRange"], timeInterval: IAnlyTrendSchForm["timeInterval"]) {
  const [start, end] = dateRange
  const info = DATE_INFO_MAP[timeInterval] || DATE_INFO_MAP["1h"]
  const dateDiff = end.diff(start, info.unit)
  if (dateDiff > info.limit) return info
  return null
}
// 处理查询及导出参数
function dealParams(formData: IAnlyTrendSchForm, pageInfo?: IPageInfo): IAnlyTrendSchParams {
  const { dateRange, devicePoint, func, timeInterval } = formData
  const errInfo = VALID_INFOS.find(({ field, valueFun }) => valueFun(formData[field]))
  if (errInfo) {
    showMsg(errInfo.title)
    return null
  }

  // 取消时间差限制，不取消就放开
  // const dateErr = dateRangeErr(dateRange, timeInterval)
  // if (dateErr) {
  //   showMsg(`所选刻度间隔下，时间范围不能超过${dateErr.limit}${dateErr.title}`)
  //   return null
  // }

  return {
    func,
    timeInterval,
    devicePoint: joinFormValue(
      devicePoint?.map((e) => e.value + "-" + e.label),
      "",
    ),
    ...getStartAndEndTime<number>(dateRange, "", null, true),
    pageNum: pageInfo?.current,
    pageSize: pageInfo?.pageSize,
  }
}

// 执行数据查询-图表
export async function anlyTrendSch4Chart(formData: IAnlyTrendSchForm, formItemCfgMap: IAnalyFormItemCfgMap) {
  const params = dealParams(formData)
  if (!params) return dealAnlyTrendSchData4Chart(null, formData, formItemCfgMap)
  const resData = await doBaseServer<IAnlyTrendSchParams, TAnlyTrendServe4Chart>("getTrendDataV2", params)
  validServe(resData)
  if (validResErr(resData)) return dealAnlyTrendSchData4Chart(null, formData, formItemCfgMap)

  return dealAnlyTrendSchData4ChartV2(resData, formData, formItemCfgMap)
}

function dealAnlyTrendSchData4Chart(
  data: TAnlyTrendServe4Chart,
  formData: IAnlyTrendSchForm,
  formItemCfgMap: IAnalyFormItemCfgMap,
): IAnalyTrendChartData {
  if (isEmpty(data)) return { xAxis: [], data: [] }
  // 数据按时间分组
  const groupByTime = Object.values(data).reduce(
    (prev, dataList) => {
      dataList.forEach((item) => {
        if (!prev[item.Time]) prev[item.Time] = []
        prev[item.Time].push(item)
      })
      return prev
    },
    {} as Record<number, TAnlyTrendData[]>,
  )

  const xAxisTimeArr = Object.keys(groupByTime)
    .filter(isNumVal)
    .sort((a, b) => +a - +b)

  const dvsDataMap = formItemCfgMap.dvsOptionsMap || {}
  const { devicePoint } = formData

  const axisMap = reduceList2KeyValueMap(devicePoint, { vField: "value" }, (pointInfo) => {
    const [dvsCode] = pointInfo.value.split("-")
    return { deviceName: dvsDataMap?.[dvsCode]?.label || dvsCode, pointName: pointInfo.label, data: [] }
  }) as Record<string, IAnalyTrendChartData["data"][0]>

  let dataKey: string
  const groupByDvsPoint = xAxisTimeArr.reduce((prev, time) => {
    groupByTime[time].forEach(({ Time, stationCode, deviceCode, ...others }: TAnlyTrendData) => {
      // 收集测点字段
      Object.entries(others).forEach(([field, value]) => {
        dataKey = `${deviceCode}-${field}`
        if (!prev[dataKey]) return
        prev[dataKey].data.push(numberVal(value) as number)
      })
    })
    return prev
  }, axisMap)

  const xAxis = xAxisTimeArr.map((timeNum) => uDate(+timeNum, day4Y2S))

  return { xAxis, data: Object.values(groupByDvsPoint) }
}
const dealAnlyTrendSchData4ChartV2 = (
  data: TAnlyTrendServe4Chart,
  formData: IAnlyTrendSchForm,
  formItemCfgMap: IAnalyFormItemCfgMap,
): IAnalyTrendChartData => {
  const test = {
    "410527W01WT1107079": {
      Time: [1731481383000, 1731481397000, 1731481401000, 1731691298000, 1731691398000],
      YC181: [1, 2, 3, 4, 5],
      YC183: [2, 4, 5, 1, 5],
    },
    "410527W01WT1107080": {
      Time: [1731481383000, 1731481387000, 1731581391000, 1731691298000, 1731791398000],
      YC181: [3, 3, 3, 4, 1],
      YC183: [1, 3, 9, 4, 1],
    },
  }
  const dvsDataMap = formItemCfgMap.dvsOptionsMap || {}
  const { devicePoint } = formData

  const axisMap = devicePoint?.map((i) => {
    const { label, value } = i
    const [dvsCode, point] = value.split("-")
    const dvsName = dvsDataMap?.[dvsCode]?.label
    const stationName = dvsDataMap?.[dvsCode]?.stationName
    const currentInfo = data[dvsCode] || {}
    const title = stationName ? `${stationName}-${dvsName}-${value}-${label}` : `${dvsName}-${value}-${label}`
    console.log(currentInfo?.[point], "currentInfo?.[point]")

    return {
      deviceName: dvsName,
      pointName: value,
      pointDesc: label,
      deviceCode: dvsCode,
      stationName: stationName,
      title,
      data: currentInfo?.[point]?.map((item, idx) => [currentInfo?.["Time"]?.[idx], judgeNull(item, 1, 4, "")]) || [],
      ls: currentInfo?.[point]?.map((item) => item) || [],
      ponit: point,
    }
  })
  return { data: axisMap }
}

export async function anlyTrendSch4Table(
  formData: IAnlyTrendSchForm,
  pageInfo: IPageInfo,
  formItemCfgMap: IAnalyFormItemCfgMap,
) {
  const params = dealParams(formData, pageInfo)
  if (!params) return null
  const resData = await doRecordServer<IAnlyTrendSchParams, TAnlyScatterData>("getTrendData", params)
  validServe(resData)
  if (validResErr(resData)) return null
  const { list, total } = resData
  const { tableData, columns } = dealAnlyTrendSchData4Table(list, formData, pageInfo, formItemCfgMap)
  return { records: tableData, total, columns }
}

function reducePointInfo(data: TAnlyScatterData, axisMap: Record<string, string>) {
  return Object.keys(data).reduce((prev, key) => {
    if (!axisMap[key]) return prev
    prev[key] = numberVal(data[key]) ?? "-"
    return prev
  }, {})
}
function dealAnlyTrendSchData4Table(
  data: TAnlyScatterData[],
  formData: IAnlyTrendSchForm,
  pageInfo: IPageInfo,
  formItemCfgMap: IAnalyFormItemCfgMap,
) {
  const result = { tableData: [], columns: [...ANLY_SCTTR_COLUMNS] }
  if (!data?.length) return result
  const { devicePoint } = formData
  const axisMap = reduceList2KeyValueMap(devicePoint, { lField: "label", keyFun: splitPoint })
  const dvsDataMap = formItemCfgMap.dvsOptionsMap || {}
  const pointCols = Object.entries(axisMap).map(([dataIndex, title]) => ({
    dataIndex,
    title: title + "-" + dataIndex,
    align: "center",
    render: (text, record) => {
      let sss = ""
      sss = typeof text === "boolean" ? `${text.toString()}` : `${text}`
      return sss
    },
  }))
  result.columns.push(...(pointCols as ColumnsType<any>))

  const { stationMap } = getStorage<IAtomStation>(StorageStationData)
  let keyArr: string[], colKey: string
  const { tableData, columns } = data.reduce((prev, { stationCode, deviceCode, Time, ...others }) => {
    keyArr = Object.keys(others)
    colKey = keyArr.find((key) => axisMap[key])
    if (!colKey) return prev
    prev.tableData.push({
      ...reducePointInfo(others, axisMap),
      id: `${deviceCode}_${Time}`,
      stationCode,
      stationName: others.stationName || stationMap[stationCode]?.shortName,
      deviceCode,
      deviceName: others.deviceName || dvsDataMap[deviceCode]?.label,
      time: uDate(Time, day4Y2S),
    })
    return prev
  }, result)
  addTableIndex(tableData, pageInfo)
  return { tableData, columns }
}

// 执行数据导出
export function exportAnlyTrendData(formData: IAnlyTrendSchForm) {
  const params = dealParams(formData)
  if (!params) return
  doBaseServer<typeof params, AxiosResponse>("exportTrendData", params).then((resData) => {
    dealDownload4Response(resData, "")
  })
}

const CHG_EXCLUDE: (keyof IAnlyTrendSchForm)[] = ["displayType", "func", "timeInterval", "dateRange"]
// 监听场站选择变化查询模型数据
export async function onAnlyTrendSchFormChange(
  changedValue: IAnlyTrendSchForm,
  formRef: MutableRefObject<IFormInst<IAnlyTrendSchForm>>,
  formItemCfgMap: IAnalyFormItemCfgMap,
): Promise<TFormItemConfig<TAnlyTrendSchItemName>> {
  return onFormValueChange<IAnlyTrendSchForm>(changedValue, CHG_EXCLUDE, async (value, field) => {
    if (!["deviceIds", "deviceType", "stationCode", "devicePoint"].includes(field)) return {}
    if (field === "devicePoint") {
      const dvsPointTree = dvsPointDisabeld4OverLimit(formItemCfgMap.formItemConfig, changedValue, 30000) // 限制测点数量
      return { devicePoint: { treeData: dvsPointTree } }
    }
    const formInst = formRef.current?.getInst()

    if (field === "stationCode" || field === "deviceType") {
      formInst?.setFieldsValue({ deviceIds: [], devicePoint: [] })
    }
    const stationMap = formItemCfgMap.stationMap || {}
    const formData = formRef.current?.getFormValues()
    const theStnInfo = stationMap[formData.stationCode]
    if (!theStnInfo) return {}
    if (field === "stationCode") {
      const stationId = theStnInfo.id
      const deviceTypeOfStationMap = formItemCfgMap.deviceTypeOfStationMap || {}
      const dvsType4StnInfo = deviceTypeOfStationMap[stationId]
      const dvsTypeOptions = getDvsTypeOptions(dvsType4StnInfo?.deviceTypes, stationId)
      return { deviceType: { options: dvsTypeOptions } }
    }
    if (field === "deviceType") {
      const dvsIdOptions = await getAnalyDeviceOptions(theStnInfo, value)
      return { deviceIds: { options: dvsIdOptions } }
    } else if (field === "deviceIds") {
      // formInst?.setFieldsValue({ devicePoint: [] })
      const dvsOptions = deviceDisabled4OverLimit(formItemCfgMap.formItemConfig, changedValue, 20000) // 设备台数限制
      const dvsDataMap = formItemCfgMap.dvsOptionsMap || {}
      const pointTreeData = await getAxisMeasurePointTreeData(value, dvsDataMap)
      // 获取所有测点value集合
      const allPointsValue = pointTreeData.reduce((prev, item) => {
        const childs = []
        item.children.forEach((child) => {
          childs.push(...(child.children?.map((i) => i.value) || []))
        })
        prev.push(...childs)
        return prev
      }, [])
      const devicePoint = formInst.getFieldValue("devicePoint") || []
      const pointChoose = devicePoint?.map((i) => i.value) // 已选择的测点
      const existChoosePoints = pointChoose?.filter((i) => allPointsValue?.includes(i)) // 当前存在选择的测点
      formInst?.setFieldsValue({ devicePoint: devicePoint?.filter((i) => existChoosePoints?.includes(i.value)) })
      return { deviceIds: { options: dvsOptions }, devicePoint: { treeData: pointTreeData } }
    }
    return {}
  })
}

function getDvsTypeOptions(deviceTypes4Stn: TDeviceType[], stationId: number): TOptions<TDeviceType> {
  if (!deviceTypes4Stn?.length) return []
  const deviceList = getStorage(StorageDeviceType) || []
  return deviceTypes4Stn.map((dvsType) => {
    const label = deviceList?.find((i) => i.code === dvsType)?.name
    return {
      value: dvsType,
      label,
      stationId,
    }
  })
}
