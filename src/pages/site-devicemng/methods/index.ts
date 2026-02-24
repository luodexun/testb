/*
 *@Author: chenmeifeng
 *@Date: 2024-04-07 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-14 17:50:30
 *@Description:
 */
import { getStartAndEndTime } from "@utils/form-funs.ts"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { validResErr } from "@/utils/util-funs"

import { IRpDevicemngSchForm, IRpSitedevicemngSchParams } from "../types"

function dealParams(formData: IRpDevicemngSchForm): IRpSitedevicemngSchParams {
  const { dateRange, stationCode, ...others } = formData
  return { ...others, stationCode, ...getStartAndEndTime(dateRange, null) }
}

// 执行数据查询
export async function getSiteDevicemngSchData(pageInfo: IPageInfo, formData: IRpDevicemngSchForm) {
  const params = dealParams(formData)
  const res = await doBaseServer<IRpDevicemngSchForm>("queryDevicesDataByParams", params)
  if (validResErr(res)) return null
  const actualData = res?.map((i, idx) => {
    return {
      ...i,
      id: i.deviceId + i.deviceName + idx,
    }
  })
  return { records: actualData || [], total: res?.total }
}

// 执行查询场站所有设备名称接口
export async function getDevicemngDetailhData() {
  const res = await doBaseServer<IRpDevicemngSchForm>("queryDevicesDataByParams")
  return res
}

export const transColor = (record, key) => {
  const value = record[key]
  if (!`${value}` || `${value}` === "undefined") {
    return "#c5c4c4"
  }
  return value ? "red" : "rgba(38, 204, 38, 1)"
}
