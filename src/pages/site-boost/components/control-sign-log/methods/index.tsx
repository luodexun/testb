/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-11 14:36:21
 * @Description:
 */

import { queryDevicesByParams } from "@utils/device-funs.ts"
import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { joinFormValue } from "@utils/table-funs.tsx"
import { deviceTrform, showMsg, validResErr } from "@utils/util-funs.tsx"
import { AxiosResponse } from "axios"

// import { MutableRefObject } from "react"
import { doBaseServer } from "@/api/serve-funs.ts"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import { TOptions } from "@/types/i-antd.ts"
import { IDeviceTypeOfStation, IPageData, TDeviceType } from "@/types/i-config.ts"
import { IPageInfo } from "@/types/i-table.ts"

import { ISignLogData, ISignLogSchForm, ISignLogSchParams, TSignLogSchFmItemName } from "../types"

// 执行控制日志查询
export async function doFetchControlLogData(params: ISignLogSchParams) {
  const resData = await doBaseServer<ISignLogSchParams, IPageData<ISignLogData>>("getSignRecordPage", params)
  if (validResErr(resData)) return { records: [], total: 0 }
  const { records, total } = resData
  return { records: records, total }
}

// 处理查询及导出参数
function dealParams(formData: ISignLogSchForm, pageInfo?: IPageInfo): ISignLogSchParams {
  const { dateRange, deviceId, ...others } = formData
  return {
    ...others,
    deviceId: joinFormValue(deviceId, ""),
    deviceType: "SYZZZ",
    pageNum: pageInfo?.current,
    pageSize: pageInfo?.pageSize,
    ...getStartAndEndTime<number>(dateRange, "", null, true),
  }
}

export async function getSignLogData(pageInfo: IPageInfo, formData: ISignLogSchForm) {
  return doFetchControlLogData(dealParams(formData, pageInfo))
}

// 执行数据导出
export function exportControlLog(formData: ISignLogSchForm) {
  // if (!formData.deviceType) return
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportSyzzzDeviceSignRecord", params).then((data) => {
    dealDownload4Response(data, "挂牌日志导出表.xlsx")
  })
}

export function getStn2DvsTypeInfoMap(
  deviceTypeOfStationMap: Record<string, IDeviceTypeOfStation>,
  deviceTypeMap: Record<string, string>,
): Record<string, TOptions<TDeviceType>> {
  if (!deviceTypeMap || !deviceTypeOfStationMap) return {}
  const mainDvsType = ["WT", "PVINV", "ESPCS"]
  let stnOfDvsTypes: TDeviceType[]
  return Object.keys(deviceTypeOfStationMap).reduce((prev, stnId) => {
    stnOfDvsTypes = deviceTypeOfStationMap[stnId].deviceTypes.filter((dvsType) => mainDvsType.includes(dvsType))
    prev[stnId] = stnOfDvsTypes.map((dvsType) => ({ value: dvsType, label: deviceTypeMap[dvsType] }))
    return prev
  }, {})
}

// 监听场站选择变化查询模型数据
export async function onSignLogSchFormChange(
  changedValue: ISignLogSchForm,
  formRef: IFormInst,
  dvsTypeInfoOfStnMap: ReturnType<typeof getStn2DvsTypeInfoMap>,
  deviceTypeMap: Record<string, string>,
): Promise<TFormItemConfig<TSignLogSchFmItemName> | null> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "deviceType"].includes(chgedKey)) return {}
  // if (!["stationId", "deviceType"].includes(field)) return {}
  const formInst = formRef?.getInst()
  formInst?.setFieldValue("deviceIds", [])
  const formValue: ISignLogSchForm = formInst.getFieldsValue()
  if (chgedKey === "stationId") {
    const dvsTypeOptionsOfStn = dvsTypeInfoOfStnMap[chgedVal]
    const dvsOptions = await commonDealDevice(null, formValue, deviceTypeMap)
    formInst?.setFieldsValue({ deviceType: undefined })
    return { deviceType: { options: dvsTypeOptionsOfStn }, deviceId: { options: dvsOptions } }
  }
  if (chgedKey === "deviceType") {
    const dvsOptions = await commonDealDevice(chgedVal, formValue, deviceTypeMap)
    return { deviceId: { options: dvsOptions } }
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

export const onChgSignForm = async (changedValue, formRef: IFormInst) => {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId"].includes(chgedKey)) return {}
  const formInst = formRef?.getInst()
  formInst?.setFieldValue("lineCodeList", undefined)
  if (chgedKey === "stationId") {
    const lines = await getLines(chgedVal)
    const device = await queryDevicesByParams({ stationId: chgedVal as number, deviceType: "SYZZZ" })
    formInst?.setFieldValue("deviceId", device?.[0]?.deviceId)
    return { lineCodeList: { options: lines } }
  }
  return {}
}

export const getLines = async (stationId) => {
  const res = await doBaseServer("getLineInfo", { stationId: stationId })
  if (validResErr(res)) return []
  const lines = res?.map((i) => {
    return {
      label: i.lineName,
      value: i.lineCode,
    }
  })
  return lines
}
export const signsDevice = async (params) => {
  const res = await doBaseServer("upSignRecord", params)
  const flag = res?.msg ? false : true
  showMsg(res?.msg || res, flag ? "success" : "error")
  return res?.msg ? false : res
}
export const downSignsDevice = async (data, userInfo) => {
  const time = new Date().getTime()
  const params = data?.map((i) => {
    return {
      id: i.id,
      remark: i.remark,
      endBy: userInfo.loginName,
      endTime: time,
      lineCode: i.lineCode,
    }
  })
  const res = await doBaseServer("downSignRecord", params)
  if (res) {
    showMsg(res, "success")
  }
  return res
}
