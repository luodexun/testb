/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-06 10:11:34
 * @Description:
 */

import { CONTROL_DEFAULT_TYPE } from "@configs/dvs-control.ts"
import { StorageStationData } from "@configs/storage-cfg.ts"
import { day4Y2S } from "@configs/time-constant"
import { IAnlyTrendSchForm } from "@pages/analysis-trend/types"
import { getDvsMeasurePointsData, measurePoints2TreeData, queryDevicesByParams } from "@utils/device-funs.ts"
import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime, onFormValueChange } from "@utils/form-funs.ts"
import { addTableIndex, joinFormValue } from "@utils/table-funs.tsx"
import {
  deviceTrform,
  getStorage,
  isEmpty,
  reduceList2KeyValueMap,
  showMsg,
  validResErr,
  validServe,
} from "@utils/util-funs.tsx"
import { ColumnsType } from "antd/es/table"
import { AxiosResponse } from "axios"
import { MutableRefObject } from "react"

import { doBaseServer, doRecordServer } from "@/api/serve-funs.ts"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import { TOptions, TTreeOptions } from "@/types/i-antd.ts"
import { TDeviceType } from "@/types/i-config.ts"
import { IDvsMeasurePointTreeData, IDvsMeasurePointTreeVal } from "@/types/i-device.ts"
import { IAtomStation, IStationData } from "@/types/i-station.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { uDate } from "@/utils/util-funs"

import { ANLY_SCTTR_COLUMNS } from "../configs"
import {
  IAnalyFormItemCfgMap,
  IAnlyScatterSchForm,
  IAnlyScatterSchParams,
  IAnlyScttrDvsOptions,
  IAnlyScttrSchItemName,
  TAnlyScatterData,
  TAnlyScatterServe4Chart,
  TAnlyScttrChartData,
} from "../types"

function dateRangeErr(dateRange: IAnlyTrendSchForm["dateRange"]) {
  if (!dateRange?.length) return "请选择时间！"
  // 取消时间差限制，不取消就放开
  // const [start, end] = dateRange
  // const dateDiff = end.diff(start, "h")
  // if (dateDiff > 24) return "时间范围不能超过24小时！"
  return null
}

// 处理查询及导出参数
function dealParams(formData: IAnlyScatterSchForm, pageInfo?: IPageInfo): IAnlyScatterSchParams {
  const { dateRange, devicePointX, devicePointY, xRange, yRange } = formData
  const dateErr = dateRangeErr(dateRange)
  if (dateErr) {
    showMsg(dateErr)
    return null
  }
  if (!devicePointX?.length || !devicePointY?.length) {
    showMsg("请选择测点！")
    return null
  }

  return {
    ...getStartAndEndTime<number>(dateRange, "", null, true),
    minX: xRange?.min,
    maxX: xRange?.max,
    minY: yRange?.min,
    maxY: yRange?.max,
    devicePointX: joinFormValue(
      devicePointX?.map((e) => e.value),
      "",
    ),
    devicePointY: joinFormValue(
      devicePointY?.map((e) => e.value),
      "",
    ),
    pageNum: pageInfo?.current,
    pageSize: pageInfo?.pageSize,
  }
}

let DVS_DATA_MAP: Record<string, IAnlyScttrDvsOptions> = {}

// 执行数据查询-表格
export async function anlyScttrSch4Table(formData: IAnlyScatterSchForm, pageInfo: IPageInfo) {
  const params = dealParams(formData, pageInfo)
  if (!params) return null
  const resData = await doRecordServer<IAnlyScatterSchParams, TAnlyScatterData>("getScatterData", params)
  validServe(resData)
  if (validResErr(resData)) return null
  const { list, total } = resData
  const { tableData, columns } = dealAnlyScttrSchData4Table(list, formData, pageInfo)
  return { records: tableData, total, columns }
}

// 执行数据查询-图表
export async function anlyScttrSch4Chart(formData: IAnlyScatterSchForm) {
  const params = dealParams(formData)
  if (!params) return dealAnlyScttrSchData4Chart(null, formData)
  const resData = await doBaseServer<IAnlyScatterSchParams, TAnlyScatterServe4Chart>("getScatterData", params)
  validServe(resData)
  if (validResErr(resData)) return dealAnlyScttrSchData4Chart(null, formData)
  return dealAnlyScttrSchData4Chart(resData as TAnlyScatterServe4Chart, formData)
}

function replaceKey(point: IDvsMeasurePointTreeVal, type: "x" | "y") {
  return point.value.replace("-", `_${type}_`)
}
function dealAnlyScttrSchData4Chart(data: TAnlyScatterServe4Chart, formData: IAnlyScatterSchForm): TAnlyScttrChartData {
  if (isEmpty(data)) return {}
  const { devicePointX, devicePointY } = formData
  const xAxisMap = reduceList2KeyValueMap(devicePointX, { lField: "label", keyFun: (d) => replaceKey(d, "x") })
  const yAxisMap = reduceList2KeyValueMap(devicePointY, { lField: "label", keyFun: (d) => replaceKey(d, "y") })
  let dvsName: string, keyArr: string[], xPointKey: string, yPointKey: string, xVal: number, yVal: number
  return Object.entries(data).reduce((prev, [dvsCode, dataList]) => {
    dvsName = DVS_DATA_MAP[dvsCode].label
    prev[dvsName] = dataList
      .map(({ Time, ...others }) => {
        keyArr = Object.keys(others)
        xPointKey = keyArr.find((field) => field.includes("_x_"))
        yPointKey = keyArr.find((field) => field.includes("_y_"))
        if (!xPointKey || !yPointKey) return null
        xVal = others[xPointKey] as number
        yVal = others[yPointKey] as number
        return { value: [xVal, yVal], labels: [xAxisMap[xPointKey], yAxisMap[yPointKey]], time: uDate(Time, day4Y2S) }
      })
      .filter(Boolean)
      .map((item) => ({ ...item, name: dvsName }))
    return prev
  }, {})
}

export function splitPoint(point: IDvsMeasurePointTreeVal) {
  return point.value.split("-")[1]
}

function reducePointInfo(data: TAnlyScatterData, axisMap: Record<string, string>) {
  return Object.keys(data).reduce((prev, key) => {
    if (!axisMap[key]) return prev
    prev[key] = data[key]
    return prev
  }, {})
}
function dealAnlyScttrSchData4Table(data: TAnlyScatterData[], formData: IAnlyScatterSchForm, pageInfo: IPageInfo) {
  const result = { tableData: [], columns: [...ANLY_SCTTR_COLUMNS] }
  if (!data?.length) return result
  const { devicePointX, devicePointY } = formData
  const axisArr = devicePointX.concat(...devicePointY)
  const axisMap = reduceList2KeyValueMap(axisArr, { lField: "label", keyFun: splitPoint })
  const pointCols = Object.entries(axisMap).map(([dataIndex, title]) => ({ dataIndex, title, align: "center" }))
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
      deviceName: others.deviceName || DVS_DATA_MAP[deviceCode]?.label,
      time: uDate(Time, day4Y2S),
    })
    return prev
  }, result)
  addTableIndex(tableData, pageInfo)
  return { tableData, columns }
}

// 执行数据导出
export function exportAnalysisScatter(formData: IAnlyScatterSchForm) {
  const params = dealParams(formData)
  if (!params || !params.devicePointX || !params.devicePointY) return

  doBaseServer<typeof params, AxiosResponse>("scatterDataExport", params).then((resData) => {
    dealDownload4Response(resData, "散点分析导出表.csv")
  })
}

// 监听场站选择变化查询模型数据
export async function onAnlyScttrSchFormChange(
  changedValue: IAnlyScatterSchForm,
  formRef: MutableRefObject<IFormInst<IAnlyScatterSchForm>>,
  formItemCfgMap: IAnalyFormItemCfgMap,
): Promise<TFormItemConfig<IAnlyScttrSchItemName>> {
  return onFormValueChange<IAnlyScatterSchForm>(
    changedValue,
    ["dateRange", "xRange", "yRange", "displayType"],
    async (value, field) => {
      if (!["deviceIds", "deviceType", "stationCode", "devicePointX", "devicePointY"].includes(field)) return {}
      if (field === "devicePointX" || field === "devicePointY") {
        const dvsPointTree = dvsPointDisabeld4OverLimit(formItemCfgMap.formItemConfig, changedValue, 1)
        return { [field]: { treeData: dvsPointTree } }
      }
      const formInst = formRef.current?.getInst()
      if (field === "stationCode" || field === "deviceType") {
        formInst?.setFieldsValue({ deviceIds: [], devicePointX: undefined, devicePointY: undefined })
      }
      const formData = formRef.current?.getFormValues()
      const stationMap = formItemCfgMap.stationMap || {}
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
        formInst?.setFieldsValue({ devicePointX: undefined, devicePointY: undefined })
        const dvsOptions = deviceDisabled4OverLimit(formItemCfgMap.formItemConfig, changedValue, 30000) // 限制设备台数
        const dvsDataMap = formItemCfgMap.dvsOptionsMap || {}
        const pointTreeData = await getAxisMeasurePointTreeData(value, dvsDataMap)
        return {
          deviceIds: { options: dvsOptions },
          devicePointX: { treeData: pointTreeData },
          devicePointY: { treeData: JSON.parse(JSON.stringify(pointTreeData)) },
        }
      }
      return {}
    },
  )
}

export function getDvsTypeOptions(deviceTypes4Stn: TDeviceType[], stationId: number): TOptions<TDeviceType> {
  if (!deviceTypes4Stn?.length) return []
  return deviceTypes4Stn
    .filter((dvsType) => !!CONTROL_DEFAULT_TYPE[dvsType])
    .map((dvsType) => ({
      value: dvsType,
      label: CONTROL_DEFAULT_TYPE[dvsType],
      stationId,
    }))
}

//获取设备
export async function getAnalyDeviceOptions(stationInfo: IStationData, deviceType: TDeviceType): Promise<TTreeOptions> {
  const params = { deviceType, stationCode: stationInfo.stationCode }
  const resData = await queryDevicesByParams(params)
  const dvsOptions = resData.map((item) => ({ label: item.deviceName, value: item.deviceCode, modelId: item.modelId }))
  DVS_DATA_MAP = reduceList2KeyValueMap(dvsOptions, { vField: "value" }, (d) => d)
  return deviceTrform(resData, "deviceCode", "deviceName")
}
// export async function getAnalyDeviceOptions(
//   stationInfo: IStationData,
//   deviceType: TDeviceType,
// ): Promise<IAnlyScttrDvsOptions[]> {
//   const params = { deviceType, stationCode: stationInfo.stationCode }
//   const resData = await queryDevicesByParams(params)
//   const dvsOptions = resData.map((item) => ({ label: item.deviceName, value: item.deviceCode, modelId: item.modelId }))
//   DVS_DATA_MAP = reduceList2KeyValueMap(dvsOptions, { vField: "value" }, (d) => d)
//   return dvsOptions
// }
//获取去测点
export async function getAxisMeasurePointTreeData(
  deviceIds: IAnlyScatterSchForm["deviceIds"],
  dvsDataMap: IAnalyFormItemCfgMap["dvsOptionsMap"],
) {
  if (!deviceIds?.length) return []
  const deviceInfoArr = deviceIds.map((dvsId) => dvsDataMap[dvsId]).filter(Boolean)
  const mdlIdMap = reduceList2KeyValueMap(deviceInfoArr, { vField: "modelId", lField: "modelId" })
  const mdlIdArr = Object.keys(mdlIdMap)
  const msrPntServes = mdlIdArr.map((modelId) => getMeasurePointTreeData({ modelId }))
  const msrPntTreeArr = await Promise.all(msrPntServes)
  const msrPntTreeMap = reduceList2KeyValueMap(mdlIdArr, { keyFun: (k) => k }, (_, index) => msrPntTreeArr[index])
  return deviceInfoArr.map(({ label, value, modelId }) => {
    // value 是 deviceCode
    const optItem: IDvsMeasurePointTreeData = { title: label, value, modelId, disabled: true }
    optItem.children = dealMeasurePointTreeDisabled(msrPntTreeMap[modelId], optItem)
    return optItem
  })
}

function dealMeasurePointTreeDisabled(treeData: IDvsMeasurePointTreeData[], parentInfo: IDvsMeasurePointTreeData) {
  if (!treeData?.length) return []
  return treeData.map((item) => {
    const theItem = { ...item, disabled: !item.isLeaf, value: `${parentInfo.value}-${item.value}` }
    if (item.children?.length) {
      theItem.children = dealMeasurePointTreeDisabled(item.children, parentInfo)
    }
    return theItem
  })
}

//获取子节点数据
export async function getMeasurePointTreeData(params?: { modelId?: string | number | null; pointTypes?: string }) {
  const resData = await getDvsMeasurePointsData(params)
  return measurePoints2TreeData(resData)
}

export function dvsPointDisabeld4OverLimit<TN>(
  formItemConfig: Partial<Record<keyof TN, any>>,
  changedValue: TN,
  limitCount = 1,
) {
  const [field, value] = Object.entries(changedValue)[0]
  if (!formItemConfig) return []
  const theCfg = formItemConfig[field]
  return setOptionsDisabled(theCfg.treeData, value, limitCount)
}

export function deviceDisabled4OverLimit<TN>(
  formItemConfig: Partial<Record<keyof TN, any>>,
  changedValue: TN,
  limitCount = 3,
) {
  const [field, value] = Object.entries(changedValue)[0]
  if (!formItemConfig) return []
  const theOptions: TTreeOptions = formItemConfig[field].options
  theOptions.forEach((item) =>
    item.children.forEach((j) => (j.disabled = !value.includes(j.value) && value?.length >= limitCount)),
  )
  return theOptions
}

//设置测点disabled值
export function setOptionsDisabled(
  treeData: IDvsMeasurePointTreeData[],
  checkedPoints: IDvsMeasurePointTreeData[],
  limitCount = 1,
) {
  if (!checkedPoints?.length) return setOptionsDisabled(treeData, treeData)

  const checkedPointVals = checkedPoints.map(({ value }) => value)
  const acttreeData = treeData.map((i) => {
    const checkCount = checkedPointVals.filter((valStr) => valStr.startsWith(`${i.value}-`)).length
    const oneChild = i.children?.map((j) => {
      return {
        ...j,
        children: j?.children?.map((item) => {
          return { ...item, disabled: checkCount >= limitCount && !checkedPointVals.includes(item.value) }
        }),
      }
    })
    return {
      ...i,
      children: oneChild,
    }
  })
  // treeData.forEach((dvsItem) => {
  //   const checkCount = checkedPointVals.filter((valStr) => valStr.startsWith(`${dvsItem.value}-`)).length // dvsItem.value
  //   dvsItem.children.forEach((level2Item) => {
  //     level2Item.children.forEach((item) => {
  //       item.disabled = checkCount >= limitCount && !checkedPointVals.includes(item.value)
  //     })
  //   })
  // })
  return acttreeData
}
