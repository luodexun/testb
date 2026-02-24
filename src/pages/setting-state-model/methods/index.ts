/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 18:03:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-26 10:58:24
 * @Description:
 */
import { StorageDeviceStdNewState } from "@configs/storage-cfg.ts"

import { IPageInfo } from "@/types/i-table.ts"
import { getStorage } from "@/utils/util-funs"

import { IModelListData } from "../types"

// 执行数据查询
export async function getStStateModelSchData(pageInfo?: IPageInfo, formData?) {
  // const res: IModelListData[] = await doNoParamServer("getDeviceStdState")
  const deviceModelStdList = getStorage<IModelListData[]>(StorageDeviceStdNewState)
  let deviceModelActStdList = formData.deviceType
    ? deviceModelStdList.filter((i) => i.deviceType === formData.deviceType)
    : deviceModelStdList
  deviceModelActStdList = deviceModelActStdList.map((i, idx) => {
    return { ...i, row_idx: idx + 1 }
  })
  // return { records: res?.length ? res : [], total: res?.length }
  return { records: deviceModelActStdList, total: deviceModelActStdList.length }
}
