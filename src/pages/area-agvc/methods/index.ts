import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"

/*
 * @Author: chenmeifeng
 * @Date: 2024-04-24 17:26:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-11 17:29:26
 * @Description:
 */
export const transformCurData = (record, key, isDiao) => {
  let actPointName = ""
  let actPointDesc = ""
  let operateName = ""
  let controlType
  let targetValue = isDiao
  if (key === "AGCInput") {
    actPointName = record[key] ? "AGCInputSet" : "AGCInputSet"
    operateName = record[key] ? "AGC功能退出" : "AGC功能投入"
    actPointDesc = "AGC状态"
    controlType = record[key] ? 19 : 18
    targetValue = record[key] ? 0 : 1
  } else if (key === "AVCInput") {
    actPointName = record[key] ? "AVCInputSet" : "AVCInputSet"
    operateName = record[key] ? "AVC功能退出" : "AVC功能投入"
    actPointDesc = "AVC状态"
    controlType = record[key] ? 21 : 20
    targetValue = record[key] ? 0 : 1
  } else if (key === "AVCRemoteOperation") {
    actPointName = record[key] ? "AVCLocalCtl" : "AVCLocalCtl"
    operateName = record[key] ? "AVC就地控制" : "AVC远方控制"
    actPointDesc = "AVC运行状态"
    controlType = record[key] ? 39 : 38
    targetValue = record[key] ? 0 : 1
  } else if (key === "AGCRemoteOperation") {
    actPointName = record[key] ? "AGCLocalCtl" : "AGCLocalCtl"
    operateName = record[key] ? "AGC就地控制" : "AGC远方控制"
    actPointDesc = "AGC运行状态"
    controlType = record[key] ? 37 : 36
    targetValue = record[key] ? 0 : 1
  } else if (key === "AGCActivePowerOrderSet") {
    actPointName = key
    actPointDesc = "AGC有功指令设定"
    operateName = "AGC有功设定"
    controlType = "22"
  } else if (key === "AVCVoltagePowerOrderSet") {
    actPointName = key
    actPointDesc = "AVC电压指令设定"
    operateName = "AVC电压设定"
    controlType = "23"
  } else if (key === "AVCReactivePowerOrderSet") {
    actPointName = key
    actPointDesc = "AVC无功指令设定"
    operateName = "AVC无功设定"
    controlType = "24"
  } else if (key === "AGCInputSetEnable") {
    actPointName = key
    actPointDesc = "AGC投入退出使能"
    operateName = "AGC投入退出使能"
    controlType = "41"
    targetValue = 1
  } else if (key === "AVCInputSetEnable") {
    actPointName = key
    actPointDesc = "AVC投入退出使能"
    operateName = "AVC投入退出使能"
    controlType = "42"
    targetValue = 1
  } else if (key === "AGCLocalCtlEnable") {
    actPointName = key
    actPointDesc = "AGC远方就地使能"
    operateName = "AGC远方就地使能"
    controlType = "43"
    targetValue = 1
  } else if (key === "AVCLocalCtlEnable") {
    actPointName = key
    actPointDesc = "AVC远方就地使能"
    operateName = "AVC远方就地使能"
    controlType = "44"
    targetValue = 1
  }
  const params = {
    stationName: record?.stationName,
    deviceName: record?.deviceName,
    stateName: "",
    operateName: operateName,
    // 控制信息
    deviceIds: record.deviceId,
    pointName: actPointName,
    pointDesc: actPointDesc,
    controlType: controlType,
    operatorBy: "",
    authorizerBy: "",
    targetValue: targetValue,
    interval: 0,
  }
  console.log(params, "params")

  return params
}

export const getStationInfo = async () => {
  const resData = await doBaseServer("getStationInfoData")
  if (validResErr(resData)) return null
  return resData
}

/**
 * 判断条件
 * AGVC状态投入且在远方状态
 * ##AGC调度有功设定值<场站装机容量(去掉)
 * AGC调度有功设定值 ＜ AGC全场可用功率
 */
export const judgeIsXd = (record) => {
  const flag =
    record.AGCInput && record.AGCRemoteOperation && record.AGCActivePowerOrderBySchedule < record.AvailablePower - 2
  return flag
}