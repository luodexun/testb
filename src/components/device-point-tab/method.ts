import { doBaseServer, doNoParamServer } from "@/api/serve-funs"
import { ISubSystemType } from "@/types/i-config"
import { validResErr } from "@/utils/util-funs"
import {
  IDvsSubPartPointDataSchParams,
  IDvsSubPartPoint,
  IDvsSystemPointData,
  TDvsSubPartPointType,
  IDvsSystemTelemetryTableData,
} from "./type"
import { IDvsMeasurePointData } from "@/types/i-device"

let modalPartPointSys
export async function getDvsSystemPointRealTimeData(params: IDvsSubPartPointDataSchParams): Promise<IDvsSubPartPoint> {
  const resData = await doBaseServer<IDvsSubPartPointDataSchParams>("getDeviceSystemPointRealTimeData", params)
  if (validResErr(resData)) return { ...dealDvsSystemPointRTData(null), sysList: [], total: 0 }
  const isOrdinary = !!params?.pageSize
  const point = !isOrdinary ? resData.point : resData.point?.list
  const sysList = await getPointOfSys(point)
  const total = isOrdinary ? resData.point.total : 0
  const { telemetry, teleindication } = dealDvsSystemPointRTData({ data: resData.data, point: point })
  return { telemetry, teleindication, total: total, sysList }
}

export async function getAllSystem() {
  const resData = await doNoParamServer<ISubSystemType[]>("getSubSystemTypeData")
  modalPartPointSys = resData
}

// 获取所有测点下存在的子系统
async function getPointOfSys(point: Partial<IDvsMeasurePointData>[]): Promise<ISubSystemType[]> {
  if (!modalPartPointSys?.length) {
    await getAllSystem()
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

  //测点类型：1为遥信，2为遥测 "teleindication" | "telemetry" // |遥信|遥测
  let dataType: TDvsSubPartPointType, dataInfo: IDvsSystemTelemetryTableData, className: "no" | "red" | "blue" | boolean
  let isOverState = false
  return point.reduce((prev, next) => {
    if (!"1;2;".includes(`${next.pointType}`)) return prev
    // 1为遥信，2为遥测
    dataType = `${next.pointType}` === "2" ? "telemetry" : "teleindication"
    const value = data?.[next.pointName]
    // className = typeof data?.[next.pointName] === "undefined" ? "no" :  (data?.[next.pointName] as boolean)
    // className = className ? "red" : "blue"
    className = typeof data?.[next.pointName] === "undefined" ? "no" : data?.[next.pointName] ? "red" : "blue"
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
