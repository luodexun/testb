/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-25 10:46:37
 * @Description:
 */

import { dealDownload4Response } from "@utils/file-funs.tsx"
import {
  deviceTrform,
  getAlarmLevelByType,
  getBelongForType,
  getStorage,
  isEmpty,
  setStorage,
  validOperate,
  validResErr,
} from "@utils/util-funs.tsx"
import { AxiosResponse } from "axios"

import { doBaseServer, doNoParamServer, doRecordServer } from "@/api/serve-funs.ts"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import {
  StorageAlarmLevels,
  StorageIsAlarmGo,
  StorageStationData,
  StorageStnDvsType,
  StorageUserInfo,
} from "@/configs/storage-cfg"
import { SITE_AGVC, SITE_BOOST, SITE_MATRIX } from "@/router/variables"
import { ILoginInfo } from "@/types/i-auth"
import { IStnDvsType4LocalStorage } from "@/types/i-device"
import { IPageInfo } from "@/types/i-table.ts"
import { queryDevicesByParams } from "@/utils/device-funs"
import { getStartAndEndTime } from "@/utils/form-funs"

import { CONTROL_DEFAULT_TYPE, stationAllInfo } from "../configs/index"
import { AlarmListData, AlarmSerForm, IQueryAlarmParams, TAlarmHistoryFormField } from "../types/index"
let isJumpTOThisPage = false // 是否是从其它页面跳转过来，通过url判断
// 处理查询及导出参数
function dealParams(formData) {
  const { dateRange, stationIdList, deviceType, confirmFlag, deviceIdList, alarmLevelId, brakeLevelId, systemId } =
    formData
  let theCfmFlag: boolean | null | string[] =
    !confirmFlag || !confirmFlag.length || confirmFlag?.length > 1 ? null : confirmFlag
  theCfmFlag = theCfmFlag ? (theCfmFlag as string[]).includes("1") : theCfmFlag
  // console.log(confirmFlag, theCfmFlag, "theCfmFlag")

  return {
    stationIdList: stationIdList || null,
    deviceTypeList: deviceType ? [deviceType] : null,
    deviceIdList: deviceIdList, // 设备id列表
    alarmLevelIdList: alarmLevelId || [], // 告警等级id列表
    brakeLevelIdList: brakeLevelId || [], // 停机等级id列表
    systemIdList: systemId, //归属系统id列表
    confirmFlag: theCfmFlag as boolean | null,
    ...getStartAndEndTime<number>(dateRange, "", null, true),
  }
}

let belongList = []
let alarmLevelList = []
let brakeLevelList = []
const pageInfoCatch = {
  current: 1,
  pageSize: 50,
}
let formDataCatch
export const initCurData = () => {
  belongList = null
  alarmLevelList = null
  brakeLevelList = null
  formDataCatch = null
}
// 执行数据查询
export async function getReportPowerSchData(pageInfo: IPageInfo, formData: AlarmSerForm) {
  formDataCatch = formData || formDataCatch
  const params: IQueryAlarmParams = {
    data: dealParams(formData || formDataCatch),
    params: {
      pageNum: pageInfo?.current || pageInfoCatch.current,
      pageSize: pageInfo?.pageSize || pageInfoCatch.pageSize,
    },
  }

  const res = await doRecordServer<IQueryAlarmParams, AlarmListData>("getAlarmList", params)
  // const sysList = await getAllBelongSystem()
  if (validResErr(res)) return null
  isJumpTOThisPage = false
  let VirtaulList
  if (res?.list) {
    VirtaulList = res.list.map((i) => {
      return {
        ...i,
        id: `${i.alarmId}_${i.stationCode}_${i.startTime}_${i.deviceId}_${i.alarmLevelId}`,
      }
    })
  }

  return { records: VirtaulList || [], total: res.total }
}

// 执行数据导出
export function doExportHstyAlarm(formData, key) {
  const params = dealParams(formData)
  params["fileType"] = parseInt(key)
  doBaseServer<typeof params, AxiosResponse>("exportAlarmHistory", params).then((data) => {
    dealDownload4Response(data, "告警日志导出表.xlsx")
  })
}

// 批量确认,这个方法很多地方用到，改动记得看看影响
export async function bacthPass(selectedRows, confirmMsg?) {
  const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)
  const params = selectedRows.map((i) => {
    return {
      startTime: i.startTime,
      deviceId: i.deviceId,
      alarmId: i.alarmId, //告警信息id，参考查询接口返回结果
      alarmLevelId: i.alarmLevelId,
      confirmBy: userInfoLocal?.realName || "",
      confirmMsg: confirmMsg || "",
    }
  })
  const res = await doBaseServer<AlarmListData[]>("confirmAlarmmsg", params)
  return validOperate(res)
}

// 告警等级下拉
export const getAlarmLevelList = async () => {
  if (alarmLevelList?.length) return alarmLevelList
  const res = await doNoParamServer<any>("getAllAlarmLevel")
  if (validResErr(res)) return []
  alarmLevelList =
    res?.map((i) => {
      return { label: i.name, value: i.id }
    }) || []
  return alarmLevelList
}
// 停机等级下拉
export const getBrakeLevelList = async () => {
  if (brakeLevelList?.length) return brakeLevelList
  const res = await doNoParamServer<any>("getAllBrakeLevel")
  if (validResErr(res)) return []
  brakeLevelList =
    res?.map((i) => {
      return { label: i.name, value: i.id }
    }) || []
  return brakeLevelList
}

// 归属系统下拉
export const getAllBelongSystem = async () => {
  if (belongList?.length) return belongList
  const res = await doNoParamServer<any>("getSubSystemTypeData")
  if (validResErr(res)) return []
  belongList =
    res?.map((i) => {
      return { label: i.name, value: i.id }
    }) || []
  return belongList
}

// export const getBelongForType = async (deviceType) => {
//   let getAlarmLevelLs = getStorage(StorageAlarmLevels)
//   if (!getAlarmLevelLs) {
//     getAlarmLevelLs = await doNoParamServer<any>("getSubSystemTypeData")
//     if (validResErr(getAlarmLevelLs)) return getAlarmLevelLs = []
//   }
//   let belongLists
//   switch (deviceType) {
//     case "WT":
//       belongLists = getAlarmLevelLs.filter((i) => i.value.toString().indexOf("1") === 0)
//       break
//     case "PVINV":
//       belongLists = getAlarmLevelLs.filter((i) => i.value.toString().indexOf("2") === 0)
//       break
//     case "ESPCS":
//       belongLists = getAlarmLevelLs.filter((i) => i.value.toString().indexOf("3") === 0)
//       break
//     case "SYZZZ":
//       belongLists = getAlarmLevelLs.filter((i) => i.value.toString().indexOf("4") === 0)
//       break
//     default:
//       belongLists = []
//   }
//   return belongLists
// }

export async function onAlarmHistorySchFormChg(
  changedValue: IQueryAlarmParams,
  formInst: IFormInst,
): Promise<TFormItemConfig<TAlarmHistoryFormField>> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["deviceType"].includes(chgedKey) || isEmpty(chgedVal)) return {}

  const theFormInst = formInst?.getInst()
  // if (chgedKey === "stationId") {
  //   const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
  //   const items = deviceTypesOfSt.find((e) => e.stationId == chgedVal)
  //   const deviceTypeOptions = getIntersection(items?.deviceTypes || [], chgedVal)
  //   // 如果是从其它页面点击某条数据跳转过来，不用置空
  //   if (!isJumpTOThisPage) {
  //     theFormInst?.setFieldsValue({
  //       deviceIds: [],
  //       deviceType: undefined,
  //     })
  //   }
  //   return { deviceType: { options: deviceTypeOptions }, deviceIds: { options: [] } }
  // }
  if (chgedKey == "deviceType") {
    // const data = theFormInst?.getFieldsValue()
    // const schParams = { stationId: data.stationId, deviceType: chgedVal }
    // const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
    // // const theDvsIdFirst: TOptions<string>[0] = dvsOptions?.[0]
    // const dvsOptions = deviceTrform(dvsList)
    const systemIdOptions = (await getBelongForType(chgedVal)) || []
    const alarmLevelOpts = getAlarmLevelByType(chgedVal)
    console.log(alarmLevelOpts, "alarmLevelOpts")

    // const theSysIdFirst: TOptions<string>[0] = systemIdOptions?.[0]
    // 如果是从其它页面点击某条数据跳转过来，不用置空
    if (!isJumpTOThisPage) {
      theFormInst?.setFieldsValue({
        deviceIds: [],
        systemId: [],
      })
    }
    return { systemId: { options: systemIdOptions }, alarmLevelId: { options: alarmLevelOpts } }
  }
  return {}
}

const getIntersection = (data = [], stationIds) => {
  if (!data.length) return
  const newData = data
    .filter((item) => Object.prototype.hasOwnProperty.call(CONTROL_DEFAULT_TYPE, item))
    .map((item) => ({
      label: CONTROL_DEFAULT_TYPE[item],
      value: item,
      stationIds,
    }))

  return newData
}

export const toMonitorPage = async (alarmOneInfo, navigate) => {
  const maintenanceComId = getStationMainId(alarmOneInfo)
  let urlDetail = SITE_MATRIX
  if (alarmOneInfo.deviceType === "WT" || alarmOneInfo.deviceType === "PVINV" || alarmOneInfo.deviceType === "ESPCS") {
    urlDetail = SITE_MATRIX
    setStorage(alarmOneInfo.deviceId, StorageIsAlarmGo)
    navigate(`/site/${maintenanceComId}/${alarmOneInfo.stationCode}/${urlDetail}`)
    return
  } else if (alarmOneInfo.deviceType === "AGVC") {
    urlDetail = SITE_AGVC
  } else if (alarmOneInfo.deviceType === "SYZZZ") {
    urlDetail = SITE_BOOST
  }

  navigate(`/site/${maintenanceComId}/${alarmOneInfo.stationCode}/${urlDetail}`)
}

export const getStationMainId = (record) => {
  const stationMap =
    stationAllInfo && stationAllInfo.stationMap?.length
      ? stationAllInfo.stationMap
      : getStorage(StorageStationData)?.stationMap
  const maintenanceComId = stationMap?.[record?.stationCode]?.maintenanceComId || 1
  return maintenanceComId
}

export const getPageUrl = (alarmOneInfo) => {
  let urlDetail = SITE_MATRIX
  const maintenanceComId = getStationMainId(alarmOneInfo)
  if (alarmOneInfo.deviceType === "WT" || alarmOneInfo.deviceType === "PVINV" || alarmOneInfo.deviceType === "ESPCS") {
    urlDetail = SITE_MATRIX
  } else if (alarmOneInfo.deviceType === "AGVC") {
    urlDetail = SITE_AGVC
  } else if (alarmOneInfo.deviceType === "SYZZZ") {
    urlDetail = SITE_BOOST
  }
  return `/site/${maintenanceComId}/${alarmOneInfo.stationCode}/${urlDetail}`
}

export const clkTableCell = (alarmOneInfo) => {
  if (alarmOneInfo.deviceType === "WT" || alarmOneInfo.deviceType === "PVINV" || alarmOneInfo.deviceType === "ESPCS") {
    setStorage(alarmOneInfo.deviceId, StorageIsAlarmGo)
  }
}

export const setAlarmColor = (record) => {
  if (record.alarmLevelId === 1 || record.alarmLevelId === 11 || record.alarmLevelId === 14) {
    return "var(--alarm)"
  } else if (record.alarmLevelId === 2 || record.alarmLevelId === 12 || record.alarmLevelId === 13) {
    return "var(--warning-color)"
  } else {
    return "var(--deep-font-color)"
  }
}

export const changeIsJumpTOThisPage = () => {
  isJumpTOThisPage = true
}
