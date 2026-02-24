/*
 * @Author: chenmeifeng
 * @Date: 2023-11-08 11:22:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-08 13:38:27
 * @Description:
 */
import { doBaseServer } from "@/api/serve-funs"
import { DevideListParam } from "@/pages/site-tower/types"
import { validResErr } from "@/utils/util-funs"

export async function getSWDeviceList(stationCode) {
  const deviceList = await doBaseServer<DevideListParam>("queryDevicesDataByParams", {
    stationCode,
    deviceType: "JCY",
  })
  // return validServe(deviceList)
  if (validResErr(deviceList)) return []
  return deviceList
}
