import { getStn2DvsTypeMap, queryDevicesByParams } from "@/utils/device-funs"
import { IAreaQltParam, ILowerDvsData, IStationRateData } from "../types"
import { deviceTrform, vDate, validResErr } from "@/utils/util-funs"
import { doBaseServer } from "@/api/serve-funs"
import { getStartAndEndTime } from "@/utils/form-funs"

export const getAreaQltDvsDataexport = async (formData: IAreaQltParam) => {
  // return {
  //   records: [
  //     {
  //       modelId: 1,
  //       alarmId: "2",
  //       alarmDesc: "原因1",
  //       systemId: 1,
  //       systemName: "系统1",
  //       brakeLevelId: 2,
  //       brakeLevelName: "的风格风格l",
  //       alarmLevelId: 10,
  //       resetLevel: "远程复位",
  //       resetNum: 5,
  //     },
  //     {
  //       modelId: 1,
  //       alarmId: "3",
  //       alarmDesc: "原因2",
  //       systemId: 2,
  //       systemName: "系统2",
  //       brakeLevelId: 2,
  //       brakeLevelName: "的风格风格l",
  //       alarmLevelId: 10,
  //       resetLevel: "远程复位",
  //       resetNum: 5,
  //     },
  //   ],
  //   total: 2,
  // }
}

export const onAreaQltDvsSchFormChange = async (
  changedValue,
  formRef,
  deviceTypeMap,
  deviceTypeOfStationMap,
  stationId?,
  parentDisableCheck = false,
) => {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["deviceType", "stationId"].includes(chgedKey)) return {}
  const formInst = formRef?.getInst()
  const formValue: IAreaQltParam = formInst.getFieldsValue()
  console.log(formValue, "formValue")

  if (chgedKey === "stationId") {
    return { deviceType: { options: getStn2DvsTypeMap(deviceTypeOfStationMap, deviceTypeMap, chgedVal) } }
  }
  if (chgedKey === "deviceType") {
    const stnId = stationId ?? formValue.stationId
    const dvsOptions = await commonDealDevice(chgedVal, formValue, deviceTypeMap, stnId, parentDisableCheck)
    formInst.setFieldValue("deviceList", [])
    return { deviceList: { options: dvsOptions } }
  }
  return {}
}

const commonDealDevice = async (chgedVal, formValue, deviceTypeMap, stationId, parentDisableCheck) => {
  let schParams = {}
  if (!chgedVal) {
    schParams = { stationId }
  } else {
    schParams = { stationId, deviceType: chgedVal || null }
  }
  const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
  const dvsOptions = deviceTrform(dvsList, "deviceCode", "deviceNumber", parentDisableCheck)
  return dvsOptions
}

export const getStationLs = async () => {
  const resData = await doBaseServer<IStationRateData[]>("getQualityStation")
  if (validResErr(resData)) return false
  return resData
}

export const getErrorDeviceInfo = async (params) => {
  const resData = await doBaseServer<IStationRateData[]>("getErrorDevice", params)
  if (validResErr(resData)) return false
  return resData
}

export const getCenterTrend = async (data) => {
  if (!data.dateRange) return false
  const params = {
    stationCode: data.stationCode,
    ...getStartAndEndTime<number>(data.dateRange, "", null, false),
  }
  const resData = await doBaseServer<any, IStationRateData[]>("getQualityCenterTrend", params)
  if (validResErr(resData)) return false
  return resData
}

export const getLowestDevice = async (form, sortedPoint) => {
  const params = {
    startTime: form?.Time ? new Date(form.Time).getTime() : null,
    deviceCode: form?.deviceList?.join(","),
    stationCode: form?.stationCode,
    deviceType: form?.deviceType,
    sortedPoint,
  }

  const resData = await doBaseServer<any, ILowerDvsData[]>("getLowestDevice", params)
  if (validResErr(resData)) return false
  if (!form?.deviceCode || !form?.deviceCode?.length) return resData.slice(0, 10)
  return resData
}

export const getDeviceTrend = async (form) => {
  // const deviceCode = deviceList.find(i => i.)
  const startTime = vDate(form.Time).startOf("day").valueOf()
  const endTime = vDate(form.Time).endOf("day").valueOf()
  const params = {
    startTime,
    endTime,
    deviceCode: form?.deviceList,
  }

  const resData = await doBaseServer<any, ILowerDvsData[]>("getDeviceTrend", params)
  if (validResErr(resData)) return false
  return resData
}
