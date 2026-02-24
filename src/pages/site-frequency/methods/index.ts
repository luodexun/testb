/*
 * @Author: chenmeifeng
 * @Date: 2024-07-15 16:37:39
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-28 11:39:57
 * @Description:
 */
import { IPageInfo } from "@/types/i-table"
import { queryDevicesByParams } from "@/utils/device-funs"

let refleshFlag = true
let lastParams = ""
let dvsMeasurePoints = []
// 执行数据查询
export async function getSiteDvSchData(pageInfo?: IPageInfo, formData?) {
  if (lastParams && lastParams === JSON.stringify(formData))
    return { records: dvsMeasurePoints || [], total: dvsMeasurePoints.length }
  const result = await queryDevicesByParams(formData)
  // const result = [
  //   {
  //     deviceId: 1,
  //     deviceCode: "441882W01WT1101001",
  //     deviceName: "G001",
  //     deviceType: "PVDCB",
  //     Current1: 0,
  //     Current2: 1,
  //   },
  //   { deviceId: 2, deviceCode: "441882W01WT1101002", deviceName: "G002", deviceType: "PVDCB" },
  //   { deviceId: 3, deviceCode: "441882W01WT1101003", deviceName: "G003", deviceType: "PVDCB" },
  //   { deviceId: 4, deviceCode: "441882W01WT1101004", deviceName: "G004" },
  //   { deviceId: 5, deviceCode: "441882W01WT1101005", deviceName: "G005" },
  //   { deviceId: 6, deviceCode: "441882W01WT1101006", deviceName: "G006" },
  //   { deviceId: 7, deviceCode: "441882W01WT1101007", deviceName: "G007" },
  //   { deviceId: 8, deviceCode: "441882W01WT1101008", deviceName: "G008" },
  //   { deviceId: 9, deviceCode: "441882W01WT1101009", deviceName: "G009" },
  //   { deviceId: 10, deviceCode: "441882W01WT11010010", deviceName: "G0010" },
  //   { deviceId: 11, deviceCode: "441882W01WT11010011", deviceName: "G0011" },
  // ]
  dvsMeasurePoints = result.map((i, idx) => {
    return {
      ...i,
      row_idx: idx + 1,
    }
  })
  lastParams = JSON.stringify(formData)
  return { records: dvsMeasurePoints || [], total: dvsMeasurePoints.length }
}
export const changePar = () => {
  lastParams = null
}
export const transformCurData = (record, key) => {
  let actPointDesc = ""
  let operateName = ""
  let controlType
  if (key === "YCTP_Inputstatus") {
    operateName = record[key] ? "退出" : "投入"
    actPointDesc = "投入状态"
    controlType = 35
  }
  const params = {
    stationName: record?.stationName,
    deviceName: record?.deviceName,
    stateName: "",
    operateName: operateName,
    // 控制信息
    deviceIds: record.deviceId,
    pointName: "YCTP_Input",
    pointDesc: actPointDesc,
    controlType: controlType,
    operatorBy: "",
    authorizerBy: "",
    targetValue: record[key] ? 0 : 1,
    interval: 0,
  }
  console.log(params, "params")

  return params
}
