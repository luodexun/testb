/*
 * @Author: xiongman
 * @Date: 2023-09-21 12:13:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-04 10:14:09
 * @Description: 区域中心-矩阵监视-数据处理方法们
 */

import { MONITOR_SITE_INFO_MAP } from "@configs/dvs-state-info.ts"
import { StorageGenerateSet } from "@configs/storage-cfg.ts"
import { LOGIN_INFO_FOR_FUNS } from "@store/atom-auth.ts"
import { calcRate } from "@utils/device-funs.ts"
import { coverFakeData2ServeData } from "@utils/storage-funs.ts"
import {
  isEmpty,
  parseNum,
  reduceList2KeyValueMap,
  showMsg,
  validOperate,
  validResErr,
  vDate,
} from "@utils/util-funs.tsx"

import { doBaseServer, doNoParamServer } from "@/api/serve-funs.ts"
import { IDvsSignFormVal, IObjDvsSignFormVal } from "@/components/device-card/device-signal-form.tsx"
import { TDeviceType } from "@/types/i-config.ts"
import {
  ICenterInfoData,
  ICenterProductionData,
  ICenterRunDataMQ,
  IDvsSignalRecordInfo,
  IDvsSignUpdateParams,
  ISiteMonitorInfo,
  IStationInfoData,
} from "@/types/i-monitor-info.ts"

const MONITOR_INFO_OF_DVS_TYPE = Object.keys(MONITOR_SITE_INFO_MAP).map((dvsType) => dvsType.toLocaleLowerCase()) //["wt", "pvinv", "espcs"]

export async function getMonitorCenterInfoData() {
  let resData = await doNoParamServer<Partial<ICenterInfoData>>("getCenterInfoData")
  if (validResErr(resData)) resData = {}
  let prudData = await doNoParamServer<Partial<ICenterProductionData>>("getCenterProduction")
  if (validResErr(prudData)) prudData = {}
  const catData = coverFakeData2ServeData(StorageGenerateSet, Object.assign(resData, prudData))
  return dealMonitorCenterInfoData(catData)
}

function dealMonitorCenterInfoData(centerMonitorData: Partial<ICenterInfoData>) {
  if (isEmpty(centerMonitorData)) return null
  centerMonitorData.capacity = centerMonitorData.totalInstalledCapacity
  centerMonitorData.count = MONITOR_INFO_OF_DVS_TYPE.reduce(
    (prev, next) => prev + (centerMonitorData[`${next}Num`] ?? 0),
    0,
  )
  return centerMonitorData
}

export function calcMonitorCenterInfoRate(base: Partial<ICenterInfoData>, mqData: ICenterRunDataMQ): ICenterInfoData {
  const capacity = base.capacity
  if (!capacity) return Object.assign(base, mqData) as ICenterInfoData
  const rate = calcRate(mqData.activePower, capacity)
  return Object.assign(base, mqData, { rate: parseNum(rate) }) as ICenterInfoData
}

// 获取场站监控的基础数据，数量、容量、发电量、出力率等
export async function getMonitorStnInfoData(params: { deviceType: TDeviceType }) {
  const resData = await doBaseServer<typeof params, IStationInfoData>("getStationInfoData", params)
  if (validResErr(resData)) return null
  return dealMonitorStnInfoData(resData)
}

// 场站监控数据处理方法，计算场站设备总数，各个类型设备出力率
function dealMonitorStnInfoData(stnMonitorData: IStationInfoData) {
  if (isEmpty(stnMonitorData)) return null

  let data: IStationInfoData[string]["data"], theSiteBase: Omit<IStationInfoData[string], "data">
  Object.keys(stnMonitorData).forEach((stnCode) => {
    ;({ data, ...theSiteBase } = stnMonitorData[stnCode] || ({} as ISiteMonitorInfo))
    // 字段名 ["espcsNum", "pvinvNum", "wtNum"]
    theSiteBase.count = MONITOR_INFO_OF_DVS_TYPE.reduce((prev, next) => prev + (theSiteBase?.[`${next}Num`] ?? 0), 0)
    MONITOR_INFO_OF_DVS_TYPE.forEach((dvsType) => {
      theSiteBase[`${dvsType}Rate`] =
        (parseNum(data?.activePower, -1) * 100) / (parseNum(theSiteBase[`${dvsType}InstalledCapacity`], -1, 1) || 1)
    })
    stnMonitorData[stnCode] = Object.assign(theSiteBase, data)
  })
  return stnMonitorData
}

export async function getDeviceSignRecordData(params: { deviceId?: number; stationId?: number; isEnd?: boolean }) {
  if (!params.deviceId && !params.stationId) return []
  const resData = await doBaseServer<typeof params, IDvsSignalRecordInfo[]>("getSyzzzDeviceSignRecord", params)
  if (validResErr(resData)) return []
  return resData
}

// 场站检修信息数据按设备id分组方法
export function stnDvSignListGroupByDvsId(
  signalRecordList: IDvsSignalRecordInfo[],
): Record<IDvsSignalRecordInfo["deviceId"], IDvsSignalRecordInfo[]> {
  return reduceList2KeyValueMap(signalRecordList, { vField: "deviceId" }, [])
}

export async function updateDvsSignalRecord(
  signFormData: IDvsSignFormVal[],
  isMultiple?: boolean,
  stnDvSignList?: IDvsSignalRecordInfo[],
  deviceIdList?: number[],
) {
  const loginName = LOGIN_INFO_FOR_FUNS?.loginInfo?.loginName
  const arr = stnDvSignList.filter((i) => deviceIdList.includes(i.deviceId)) // 从改场站下所有挂牌记录过滤出当前选择的设备列表的挂牌记录
  const deviceMap = getDeviceMap(arr, signFormData, deviceIdList)
  const actualSignData = isMultiple ? deviceMap : signFormData
  const params = actualSignData
    .map(({ isChecked, operate, id, signState, remark, deviceId }) => {
      remark = remark || ""
      // 修改
      if (isChecked && operate === "edit" && id) return { id, remark }
      // 结束
      if (!isChecked && operate === "del" && id) {
        return { id, remark, endBy: loginName, endTime: vDate().valueOf() }
      }
      // 新增
      if (isChecked && operate === "add") {
        return { deviceId, remark, signState, createBy: loginName, createTime: vDate().valueOf() }
      }
      return null
    })
    .filter(Boolean)
  if (!params?.length && isMultiple) return showMsg("请选择设备")
  const resData = await doBaseServer<IDvsSignUpdateParams[], any>("upDownSign", params)
  return resData
}

const getDeviceMap = (arr: IDvsSignalRecordInfo[], signFormData: IDvsSignFormVal[], deviceIdList: number[]) => {
  if (!deviceIdList?.length) return []
  const signCheckFormData = signFormData.filter((i) => i.isChecked) // 过滤出选中的挂牌信息
  const obj: IObjDvsSignFormVal = {} // 存储所有设备的挂牌信息，包括新增、删除和修改
  arr.forEach((i) => {
    if (!obj[i.deviceId]) {
      obj[i.deviceId] = []
    }
    obj[i.deviceId].push({
      id: i.id,
      remark: i.remark,
      signState: i.signState,
      deviceId: i.deviceId,
      isChecked: true,
      operate: "edit",
    })
  })
  deviceIdList.forEach((i) => {
    const curExist = Object.keys(obj).includes(i.toString())
    !curExist ? (obj[i] = []) : ""
  })
  const resulr = Object.values(obj).reduce((prev: any, cur) => {
    return prev.concat(cur)
  }, [])
  resulr.forEach((item: any) => {
    const curInfo = signCheckFormData.find((i) => i.signState === item.signState) // 是否存在
    if (!curInfo) {
      item.operate = "del"
      item.isChecked = false
    } else {
      item.isChecked = true
      item.operate = "edit"
      item.remark = curInfo.remark
    }
  })
  signCheckFormData.forEach((item) => {
    Object.keys(obj).forEach((i) => {
      const isExist = obj[i].find((j: IDvsSignFormVal) => j.signState === item.signState)
      if (isExist) return
      obj[i].push({ ...item, deviceId: parseInt(i) })
    })
  })
  return Object.values(obj).reduce((prev, cur) => {
    return prev.concat(cur)
  }, [])
}
