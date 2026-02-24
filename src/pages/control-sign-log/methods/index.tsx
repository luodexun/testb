/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-07 15:46:28
 * @Description:
 */

import { day4Y2S } from "@configs/time-constant.ts"
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
import { ISignLogData, ISignLogSchForm, ISignLogSchParams, TSignLogSchFmItemName } from "../types"

// 执行控制日志查询
export async function doFetchControlLogData(params: ISignLogSchParams, pageInfo: IPageInfo, formData: any) {
  // if (!params.deviceIds) return { records: [], total: 0 }
  let resData: any = null
  if(formData.logType == "1") {
    const { logType , ...others }= params as any
    let obj = {
      ...others,
    }
    resData = await doRecordServer<ISignLogSchParams, ISignLogData>("getSignRecordPage", obj)
  } else if(formData.logType == "2") {
    let obj = {
      "pageNum": 1,
      "pageSize": 10,
      "deviceId": params.deviceId,
      "stationId": params.stationId,
      "isEnd": params.isEnd,
      "deviceType": params.deviceType,
      "startTime": (params as any).startTime,
      "endTime": (params as any).endTime
    }
    resData = await doBaseServer<any>("selectPage", obj)
  }
  if (validResErr(resData)) return { records: [], total: 0 }
  const { records, total } = resData
  addTableIndex(records, pageInfo)
  return { records: records, total }
}

type TTypeMap = Record<string, string>

// 处理查询及导出参数
function dealParams(formData: ISignLogSchForm, pageInfo?: IPageInfo): ISignLogSchParams {
  const { dateRange, deviceId, ...others } = formData
  return {
    ...others,
    deviceId: joinFormValue(deviceId, ""),
    pageNum: pageInfo?.current,
    pageSize: pageInfo?.pageSize,
    ...getStartAndEndTime<number>(dateRange, "", null, true),
  }
}

export async function getSignLogData(pageInfo: IPageInfo, formData: ISignLogSchForm) {
  return doFetchControlLogData(dealParams(formData, pageInfo), pageInfo, formData)
}

// 执行数据导出
export function exportControlLog(formData: ISignLogSchForm) {
  // if (!formData.deviceType) return
  const params = dealParams(formData)  
  if((params as any).logType == "1") {
    doBaseServer<typeof params, AxiosResponse>("exportSyzzzDeviceSignRecord", params).then((data) => {
      dealDownload4Response(data, "挂牌日志导出表.xlsx")
    })
  }
  if((params as any).logType == "2") {
    let obj = {
      "pageNum": 1,
      "pageSize": 10,
      "deviceId": params.deviceId,
      "stationId": params.stationId,
      "isEnd": params.isEnd,
      "deviceType": params.deviceType,
      "startTime": (params as any).startTime,
      "endTime": (params as any).endTime
    }
    doBaseServer<typeof params, AxiosResponse>("exportEamOrder", obj as any).then((data) => {
      dealDownload4Response(data, "工单日志导出表.xlsx")
    })
  }
}

export function getStn2DvsTypeInfoMap(
  deviceTypeOfStationMap: Record<string, IDeviceTypeOfStation>,
  deviceTypeMap: Record<string, string>,
): Record<string, TOptions<TDeviceType>> {
  if (!deviceTypeMap || !deviceTypeOfStationMap) return {}
  const mainDvsType = ["WT", "PVINV", "ESPCS", "SYZZZ"]
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
    // formInst?.setFieldsValue({ deviceType: undefined })
    formInst?.setFieldsValue({ deviceId: undefined })
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
