/*
 * @Author: xiongman
 * @Date: 2023-10-23 15:15:52
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-06 15:04:50
 * @Description: 设备部件监视-方法们
 */

import { dealDownload4Response } from "@utils/file-funs.tsx"
import { validResErr } from "@utils/util-funs.tsx"
import { AxiosResponse } from "axios"

import { doBaseServer, doNoParamServer } from "@/api/serve-funs.ts"

import {
  IDvsSubPartPoint,
  IDvsSubPartPointDataSchParams,
  IDvsSystemPointData,
  IDvsSystemTelemetryTableData,
  TDvsSubPartPointType,
} from "../types.ts"
import { ISubSystemType } from "@/types/i-config.ts"
import { ISysList } from "@/types/i-device.ts"
let modalPartPointSys
export async function getDvsSystemPointRealTimeData(params: IDvsSubPartPointDataSchParams): Promise<IDvsSubPartPoint> {
  const resData = await doBaseServer<IDvsSubPartPointDataSchParams, IDvsSystemPointData>(
    "getDeviceSystemPointRealTimeData",
    params,
  )
  if (validResErr(resData)) return { ...dealDvsSystemPointRTData(null), sysList: [] }
  const sysList = await getPointOfSys(resData)
  return { ...dealDvsSystemPointRTData(resData), sysList }
}

export async function getAllSystem() {
  const resData = await doNoParamServer<ISubSystemType[]>("getSubSystemTypeData")
  modalPartPointSys = resData
}

// 获取所有测点下存在的子系统
async function getPointOfSys(pointData: IDvsSystemPointData): Promise<ISubSystemType[]> {
  const { point } = pointData || {}
  if (!modalPartPointSys?.length) {
    await getAllSystem()
    console.log(222)
  }

  let initInfo: Record<number, ISubSystemType> = {}
  const result = point?.reduce((prev, cur) => {
    if (!prev[cur.systemId]) {
      const name = modalPartPointSys?.find((i) => i.id === cur.systemId)?.name
      prev[cur.systemId] = {
        id: cur.systemId,
        value: cur.systemId,
        name: name,
        label: name,
      }
    }
    return prev
  }, initInfo)
  return Object.values(result)
}

function dealDvsSystemPointRTData(
  pointData: IDvsSystemPointData,
): Record<TDvsSubPartPointType, IDvsSystemTelemetryTableData[]> {
  const { data, point } = pointData || {}
  const result: Record<TDvsSubPartPointType, IDvsSystemTelemetryTableData[]> = { telemetry: [], teleindication: [] }

  if (!point?.length) return { telemetry: [], teleindication: [] }

  //测点类型：1为遥信，2为遥测 "telemetry" | "teleindication" // |遥信|遥测
  let dataType: TDvsSubPartPointType, dataInfo: IDvsSystemTelemetryTableData, className: "no" | "red" | "blue" | boolean
  let isOverState = false
  return point.reduce((prev, next) => {
    if (!"1;2;".includes(`${next.pointType}`)) return prev
    // 1为遥信，2为遥测
    dataType = `${next.pointType}` === "2" ? "telemetry" : "teleindication"
    const value = data?.[next.pointName]
    // className = typeof data?.[next.pointName] === "undefined" ? "no" :  (data?.[next.pointName] as boolean)
    // className = className ? "red" : "blue"
    // 兼容遥信1为false,2为true
    // className = typeof data?.[next.pointName] === "undefined" ? "no" : data?.[next.pointName] ? "red" : "blue"
    className = typeof value === "undefined" ? "no" : dataType === "teleindication" ?  (value === true || value === 2 ? "red" : value === false || value === 1 ? "blue" : "no") : "no";   
    isOverState =
      dataType === "telemetry" && (next.maximum < (value as number) || (value as number) < next.minimum) ? true : false
    dataInfo = {
      id: `${next.pointName}_${next.pointDesc}`,
      name: next.pointDesc,
      value: data?.[next.pointName],
      className,
      unit: next.unit,
      isOverState,
      color: isOverState ? "var(--fault)" : "var(--white-color)",
      pointName: next.pointName,
      maximum: next.maximum,
      minimum: next.minimum,
    }
    prev[dataType].push(dataInfo)
    return prev
  }, result)
}

export function doExportDvsPartData(params: IDvsSubPartPointDataSchParams) {
  doBaseServer<IDvsSubPartPointDataSchParams, AxiosResponse>("exportDeviceSystemPoint", params).then((data) => {
    if (!data.data) {
      data.data = new Blob([data.data], { type: "application/json" })
    }
    dealDownload4Response(data, "测点实时数据导出表")
  })
}
