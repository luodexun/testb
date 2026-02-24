/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-16 13:37:46
 * @Description:
 */

import { day4Y2S } from "@configs/time-constant.ts"
import {
  IControlLogData,
  IControlLogSchForm,
  IControlLogSchParams,
  TControlLogSchFmItemName,
} from "@pages/control-log/types"
import { queryDevicesByParams } from "@utils/device-funs.ts"
import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { addTableIndex, joinFormValue } from "@utils/table-funs.tsx"
import { deviceTrform, uDate, validResErr } from "@utils/util-funs.tsx"
import { AxiosResponse } from "axios"

// import { MutableRefObject } from "react"
import { doBaseServer, doRecordServer } from "@/api/serve-funs.ts"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import { TOptions } from "@/types/i-antd.ts"
import { IDeviceTypeOfStation, TDeviceType } from "@/types/i-config.ts"
import { IPageInfo } from "@/types/i-table.ts"

// 执行控制日志查询
export async function doFetchControlLogData(params: IControlLogSchParams, pageInfo: IPageInfo) {
  // if (!params.deviceIds) return { records: [], total: 0 }
  const resData = await doRecordServer<IControlLogSchParams, IControlLogData>("getControlLog", params)
  if (validResErr(resData)) return { records: [], total: 0 }
  const { list, total } = resData
  addTableIndex(list, pageInfo)
  return { records: list, total }
}

type TTypeMap = Record<string, string>
// 处理、转译数据字段
export function dealControlLogData(logList: IControlLogData[], controlTypeMap: TTypeMap, deviceTypeMap: TTypeMap) {
  if (!logList?.length) return []
  logList.forEach((item) => {
    item.controlTypeLabel = controlTypeMap?.[item.controlType] || item.controlType
    item.deviceTypeLabel = deviceTypeMap?.[item.deviceType] || item.deviceType
    item.operatorTimeStr = item.operatorTime ? uDate(item.operatorTime, day4Y2S, "") : ""
  })
  return logList
}

// 处理查询及导出参数
function dealParams(formData: IControlLogSchForm, pageInfo?: IPageInfo): IControlLogSchParams {
  const { dateRange, deviceIds, ...others } = formData
  return {
    ...others,
    ...getStartAndEndTime<number>(dateRange, "", { startTime: 1, endTime: 100000000000000 }),
    deviceIds: joinFormValue(deviceIds, ""),
    pageNum: pageInfo?.current,
    pageSize: pageInfo?.pageSize,
  }
}

export async function getControlLogData(pageInfo: IPageInfo, formData: IControlLogSchForm) {
  return doFetchControlLogData(dealParams(formData, pageInfo), pageInfo)
}

// 执行数据导出
export function exportControlLog(formData: IControlLogSchForm) {
  // if (!formData.deviceType) return
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("fetchLogExportExcel", params).then((data) => {
    dealDownload4Response(data, "控制日志导出表.xlsx")
  })
}

export function getStn2DvsTypeInfoMap(
  deviceTypeOfStationMap: Record<string, IDeviceTypeOfStation>,
  deviceTypeMap: Record<string, string>,
): Record<string, TOptions<TDeviceType>> {
  if (!deviceTypeMap || !deviceTypeOfStationMap) return {}
  const mainDvsType = ["WT", "PVINV", "ESPCS", "SYZZZ", "WTTRA", "PVTRA", "ESTRA", "AGVC", "PVCOL", "NLGL"]
  let stnOfDvsTypes: TDeviceType[]
  return Object.keys(deviceTypeOfStationMap).reduce((prev, stnId) => {
    stnOfDvsTypes = deviceTypeOfStationMap[stnId].deviceTypes.filter((dvsType) => mainDvsType.includes(dvsType))
    prev[stnId] = stnOfDvsTypes.map((dvsType) => ({ value: dvsType, label: deviceTypeMap[dvsType] }))
    return prev
  }, {})
}

// 监听场站选择变化查询模型数据
export async function onCtrlLogSchFormChange(
  changedValue: IControlLogSchForm,
  formRef: IFormInst,
  dvsTypeInfoOfStnMap: ReturnType<typeof getStn2DvsTypeInfoMap>,
  deviceTypeMap: Record<string, string>,
): Promise<TFormItemConfig<TControlLogSchFmItemName> | null> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "deviceType"].includes(chgedKey)) return {}
  // if (!["stationId", "deviceType"].includes(field)) return {}
  const formInst = formRef?.getInst()
  formInst?.setFieldValue("deviceIds", [])
  const formValue: IControlLogSchForm = formInst.getFieldsValue()
  if (chgedKey === "stationId") {
    const dvsTypeOptionsOfStn = dvsTypeInfoOfStnMap[chgedVal]
    const dvsOptions = await commonDealDevice(null, formValue, deviceTypeMap)
    formInst?.setFieldsValue({ deviceType: undefined })
    return { deviceType: { options: dvsTypeOptionsOfStn }, deviceIds: { options: dvsOptions } }
  }
  if (chgedKey === "deviceType") {
    const dvsOptions = await commonDealDevice(chgedVal, formValue, deviceTypeMap)
    return { deviceIds: { options: dvsOptions } }
  }
  return {}
}

const commonDealDevice = async (chgedVal, formValue, deviceTypeMap) => {
  let schParams = {}
  if (!chgedVal) {
    schParams = { stationId: formValue.stationId }
  } else {
    schParams = { stationId: formValue.stationId, deviceType: chgedVal || null }
  }
  const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
  const dvsOptions = deviceTrform(dvsList)
  return dvsOptions
}
