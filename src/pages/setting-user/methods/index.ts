/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:47:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-24 14:24:28
 * @Description:
 */
import { doBaseServer, doNoParamServer } from "@/api/serve-funs"
// import { STATION_DATA_MAP } from "@/store/atom-station"
import { IPageInfo } from "@/types/i-table.ts"
import { validOperate, validResErr } from "@/utils/util-funs"

import { IUserListParam } from "../types"

let roleList = []
// 执行数据查询
export async function getSettingUserSchData(pageInfo?: IPageInfo, formData?) {
  // const { stationList } = getStorage(StorageStationData) || []
  // const stationCode = formData.stationId ? stationList.find((e) => e.id === formData.stationId)?.stationCode || "" : ""
  // const params = { stationCode: stationCode, deviceType: formData.deviceType }

  const params = {
    pageNum: pageInfo?.current,
    pageSize: pageInfo?.pageSize,
  }
  const res = await doBaseServer<IUserListParam>("getAllUser", params)
  if (validResErr(res)) return null
  // console.log(res, "接口都是浪费精力开发")

  return { records: res?.list || [], total: res?.total }
  // return { records: [], total: 0 }
}

export const getRoleList = async () => {
  if (roleList.length) return roleList
  const res = await doNoParamServer<any>("getRoleUser")
  if (validResErr(res)) return null
  roleList = res.map((i) => {
    return {
      label: i.description,
      value: i.id,
    }
  })
  return roleList
}

export const addUserMethods = async (data, type) => {
  const api = type == "add" ? "addUser" : "updateUser"
  const res = await doBaseServer<any>(api, data)
  return validOperate(res)
}

export const udPwMethods = async (data) => {
  const res = await doBaseServer<any>("updatePwdUser", data)
  return validOperate(res)
}

export const ulImgMethods = async (data) => {
  const res = await doBaseServer<any>("uploadImgUser", data)
  return validOperate(res)
}

export const delUserMethods = async (data) => {
  const res = await doBaseServer<any>("deleteUser", data)
  return validOperate(res)
}
