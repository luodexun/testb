/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:47:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-16 11:11:54
 * @Description:
 */
import { doBaseServer } from "@/api/serve-funs"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { StorageDeviceType, StorageStationData, StorageStnDvsType } from "@/configs/storage-cfg"
// import { STATION_DATA_MAP } from "@/store/atom-station"
import { TOptions } from "@/types/i-antd"
import { IStationData } from "@/types/i-station"
import { IPageInfo } from "@/types/i-table.ts"
import { getStorage, isEmpty, validOperate, validResErr } from "@/utils/util-funs"

import { alldeviceTypes } from "../configs/index"
import { DevideListParam, TDeviceSchFormField } from "../types"

let actualData = []
let refleshFlag = true
// let deviceList = []
// 执行数据查询
export async function getSettingMngSchData(pageInfo?: IPageInfo, formData?) {
  if (!refleshFlag) return { records: actualData || [], total: actualData.length }
  const { stationList } = getStorage(StorageStationData) || []
  const stationCode = formData.stationId
    ? stationList?.find((e) => e.id === parseInt(formData.stationId))?.stationCode || ""
    : ""
  const params = { stationCode: stationCode, deviceType: formData.deviceType }

  const res = await doBaseServer<DevideListParam>("queryDevicesDataByParams", params)

  actualData = res?.length
    ? res.map((i, idx) => {
        return { ...i, row_idx: idx + 1 }
      })
    : []
  refleshFlag = false
  return { records: actualData, total: res?.length }
}

export const changeRefleshFlag = (flag) => {
  refleshFlag = flag
}

export async function onSettingMngSchFormChg(
  changedValue: DevideListParam,
  formInst: IFormInst,
): Promise<TFormItemConfig<TDeviceSchFormField>> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "deviceType"].includes(chgedKey) || isEmpty(chgedVal)) return {}

  const theFormInst = formInst?.getInst()
  if (chgedKey === "stationId") {
    const deviceTypesOfSt = getStorage(StorageStnDvsType)
    // debugger
    const items = deviceTypesOfSt?.find((e) => e.stationId == chgedVal)

    const deviceTypeOptions = getIntersection(items?.deviceTypes || [], chgedVal)
    const theFirst: TOptions<string>[0] = deviceTypeOptions?.[0]
    theFormInst?.setFieldsValue({ deviceType: theFirst.value })
    return { deviceType: { options: deviceTypeOptions } }
  }
  if (chgedKey == "deviceType") {
    const data = theFormInst?.getFieldsValue()
    const dvsOptions = await getDeviceData(data)
    const theDvsIdFirst: TOptions<string>[0] = dvsOptions?.[0]

    window.setTimeout(() => {
      theFormInst?.setFieldsValue({
        deviceIds: theDvsIdFirst ? [theDvsIdFirst.value] : [],
      })
    }, 300)
    return { deviceIds: { options: dvsOptions } }
  }
  return {}
}

const getDeviceData = async (data) => {
  // debugger
  const { stationList } = getStorage(StorageStationData) || []
  if (!data?.stationId) return []
  const station = stationList.find((e) => e.id === data.stationId)
  if (!station) return []
  const params = { stationCode: station.stationCode, deviceType: data.deviceType }

  const res = await doBaseServer<DevideListParam>("queryDevicesDataByParams", params)
  if (validResErr(res)) return []
  let newData = []
  if (res?.length) {
    newData = res.map((e) => ({ label: e.deviceName, value: e.deviceId }))
  }
  return newData
}

const getIntersection = (data = [], stationIds) => {
  if (!data.length) return []
  const allDvsType = getStorage(StorageDeviceType)
  const newData = data.map((item) => ({
    label: allDvsType.find((i) => i.code === item)?.name || "未知",
    value: item,
    stationIds,
  }))

  return newData
}

export const saveStnIdxData = async (data) => {
  const changeStnList = data
    .filter((i) => i.edit)
    .map((e) => {
      return {
        id: e.deviceId,
        tags: e.tags,
      }
    })
  if (!changeStnList.length) return Promise.reject()
  const res = await doBaseServer<IStationData>("updateDevicesData", changeStnList)
  refleshFlag = true
  return validOperate(res)
}
