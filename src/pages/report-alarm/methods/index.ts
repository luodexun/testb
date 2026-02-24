/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-19 14:37:11
 * @Description:
 */

import { dealDownload4Response } from "@utils/file-funs.tsx"
import {
  deviceTrform,
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
  StorageDeviceType,
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
import { AlarmListData, AlarmSerForm, IQueryAlarmParams, TRptAlarmFormField } from "../types/index"
let isJumpTOThisPage = false // 是否是从其它页面跳转过来，通过url判断
// 处理查询及导出参数
function dealParams(formData) {
  const { dateRange, stationId, deviceType, confirmFlag, deviceIds, alarmLevelId, brakeLevelId, systemId } = formData
  let theCfmFlag: boolean | null | string[] =
    !confirmFlag || !confirmFlag.length || confirmFlag?.length > 1 ? null : confirmFlag
  theCfmFlag = theCfmFlag ? (theCfmFlag as string[]).includes("1") : theCfmFlag
  // console.log(confirmFlag, theCfmFlag, "theCfmFlag")

  return {
    stationIdList: stationId ? [stationId] : null,
    deviceTypeList: deviceType ? [deviceType] : null,
    deviceIdList: deviceIds, // 设备id列表
    alarmLevelIdList: alarmLevelId || [], // 告警等级id列表
    // brakeLevelIdList: brakeLevelId || [], // 停机等级id列表
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
  pageSize: 10,
}
let formDataCatch

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

  const res = await doBaseServer<IQueryAlarmParams>("selectRptMsg", params)
  if (validResErr(res)) return null
  isJumpTOThisPage = false
  let VirtaulList
  const { data } = res
  if (data?.records) {
    VirtaulList = data.records.map((i) => {
      return {
        ...i,
        id: `${i.ruleId}_${i.startTime}_${i.deviceId}_${i.alarmLevelId}`,
        deviceTypeName: CONTROL_DEFAULT_TYPE[i.deviceType] || i.deviceType,
      }
    })
  }

  return { records: VirtaulList || [], total: data.total }
}

// 执行数据导出
export function doExportReportPower(formData) {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportRptMsg", params).then((data) => {
    dealDownload4Response(data, "告警日志导出表.xlsx")
  })
}

export async function bacthPass(selectedRows, confirmMsg?) {
  const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)
  const params = selectedRows.map((i) => {
    return {
      startTime: i.startTime,
      deviceId: i.deviceId,
      ruleId: i.ruleId,
      confirmBy: userInfoLocal?.realName || "",
      confirmMsg: confirmMsg || "",
      confirmTime: new Date().getTime(),
    }
  })
  const res = await doBaseServer("confirmRptMsg", params)
  res.data = res.data?.toString() || null
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

export async function onAlarmHistorySchFormChg(
  changedValue: IQueryAlarmParams,
  formInst: IFormInst,
  deviceTypeMap,
): Promise<TFormItemConfig<TRptAlarmFormField>> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "deviceType"].includes(chgedKey) || isEmpty(chgedVal)) return {}

  const theFormInst = formInst?.getInst()
  if (chgedKey === "stationId") {
    const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
    const deviceTypes = getStorage(StorageDeviceType) || []
    const items = deviceTypesOfSt.find((e) => e.stationId == chgedVal)
    const deviceTypeOptions = getIntersection(items?.deviceTypes || [], chgedVal, deviceTypes)
    // 如果是从其它页面点击某条数据跳转过来，不用置空
    if (!isJumpTOThisPage) {
      theFormInst?.setFieldsValue({
        deviceIds: [],
        deviceType: undefined,
      })
    }
    return { deviceType: { options: deviceTypeOptions }, deviceIds: { options: [] } }
  }
  if (chgedKey == "deviceType") {
    const data = theFormInst?.getFieldsValue()
    const schParams = { stationId: data.stationId, deviceType: chgedVal }
    const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
    // const theDvsIdFirst: TOptions<string>[0] = dvsOptions?.[0]
    const dvsOptions = deviceTrform(dvsList)
    const systemIdOptions = (await getBelongForType(chgedVal)) || []
    // const theSysIdFirst: TOptions<string>[0] = systemIdOptions?.[0]
    // 如果是从其它页面点击某条数据跳转过来，不用置空
    if (!isJumpTOThisPage) {
      theFormInst?.setFieldsValue({
        deviceIds: [],
        systemId: [],
      })
    }
    return { deviceIds: { options: dvsOptions }, systemId: { options: systemIdOptions } }
  }
  return {}
}

const getIntersection = (data = [], stationIds, dvsTypes = []) => {
  if (!data.length) return []
  const newData = data.map((item) => ({
    label: dvsTypes?.find((i) => i.code === item)?.name || item,
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
