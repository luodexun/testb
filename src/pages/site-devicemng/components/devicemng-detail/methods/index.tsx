/*
 *@Author: chenmeifeng
 *@Date: 2024-04-07 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 14:13:00
 *@Description:
 */

import { doBaseServer } from "@/api/serve-funs.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { validResErr } from "@/utils/util-funs"

export interface IRpDeviceLogSchForm {
  deviceType: string
  deviceIds: string
  startTime: string | number
  endTime: string | number
  pageNum?: string | number
  pageSize?: string | number
}

function dealParams(formData: IRpDeviceLogSchForm) {
  const { ...others } = formData
  return { ...others }
}

export async function getDevicemngLogSchData(pageInfo: IPageInfo, formData: IRpDeviceLogSchForm) {
  const params = dealParams(formData)
  params.pageNum = pageInfo.current
  params.pageSize = pageInfo.pageSize
  const res = await doBaseServer<IRpDeviceLogSchForm>("getControlLog", params)
  if (validResErr(res)) return null
  const actualData = res?.list.map((i, idx) => {
    return {
      ...i,
      id: i.deviceId + i.pointName + i.operatorTime + idx,
    }
  })
  return { records: actualData || [], total: res?.total }
}
