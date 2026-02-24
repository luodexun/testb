/*
 * @Author: chenmeifeng
 * @Date: 2024-01-12 13:39:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-21 16:51:01
 * @Description:
 */
import { doBaseServer } from "@/api/serve-funs"
import { StorageDeviceStdState } from "@/configs/storage-cfg"
import { changeRefleshFlag, getSettingMngSchData } from "@/pages/setting-manage/methods"
import { IModelListData } from "@/pages/setting-state-model/types"
import { IDeviceState } from "@/types/i-device"
import { IDvsSignalRecordInfo } from "@/types/i-monitor-info"
import { getStorage, validOperate, validResErr } from "@/utils/util-funs"

// 根据设备类型过滤出状态列表，并根据SUB类型下parentId推断出属于哪些MAIN类型的子数据
export const getStateList = (deviceType) => {
  const deviceModelStdList = getStorage<Array<IModelListData>>(StorageDeviceStdState)
  let actualDvTyState: Array<IModelListData> = []
  const mainState = deviceModelStdList?.filter((i) => i.deviceType === deviceType && i.stateType === "MAIN")
  const subState = deviceModelStdList?.filter((i) => i.deviceType === deviceType && i.stateType === "SUB")
  actualDvTyState = mainState?.map((i) => {
    return {
      ...i,
      children: subState.filter((state) => state.parentId === i.id),
    }
  })
  return actualDvTyState
}
//无通讯或未知
export const getStateNumberInfo = (currntStateList, runDataList, unKnownState) => {
  const unKnown = runDataList.filter((i) => !i?.runData?.subState || i?.runData?.subState == unKnownState?.["state"])
  currntStateList.forEach((state) => {
    state.num = runDataList.filter((data) => data?.runData?.mainState == state.state)?.length || 0
    state.stateDesc === "无通讯" ? (state.num = unKnown.length) : ""
    state.children.forEach((child) => {
      child.num = runDataList.filter((data) => data?.runData?.subState == child.state)?.length || 0
      child.stateDesc === "无通讯" ? (child.num = unKnown.length) : ""
    })
  })
  // const res = {main: {}, sub: {}}
  return currntStateList
}

export async function getDeviceData(stationId, deviceType) {
  changeRefleshFlag(true)
  const params = {
    stationId: stationId || 1,
    deviceType: deviceType,
  }
  return new Promise((resolve, reject) => {
    getSettingMngSchData(null, params)
      .then((res) => {
        resolve({ [stationId]: res.records })
      })
      .catch((e) => {
        reject(e)
      })
  })
}
// export const getsdjfk = (list, deviceType) => {
//   let results = []
//   Promise.all(list.map((item) => getWTdeviceData(item.value, deviceType))).then((res) => {
//     results = res.reduce((prev, cur) => {
//       return prev.concat(cur)
//     }, [])
//     Promise.resolve(results)
//   })
// }
export async function getTypeDeviceSignRecordData(params: { deviceType?: string; stationId?: number }) {
  if (!params.deviceType && !params.stationId) return []
  const resData = await doBaseServer<typeof params, IDvsSignalRecordInfo[]>("getSyzzzDeviceSignRecord", params)
  if (validResErr(resData)) return []
  return resData
}

export const getDvsState = async () => {
  const params = {
    mainState: "5,6",
    firstFlag: "1",
  }
  const resData = await doBaseServer<any, IDeviceState>("getComDeviceState", params)
  if (validResErr(resData)) return false
  return resData.data
}

export const comfirmState = async (list: string[]) => {
  if (!list?.length) return false
  const dvsCodes = list?.join(",")
  const res = await doBaseServer("confirmDeviceState", { deviceCode: dvsCodes })
  return validOperate(res)
}
