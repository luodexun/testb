/*
 * @Author: chenmeifeng
 * @Date: 2024-12-09 17:03:04
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-10 10:27:39
 * @Description:
 */
import { IDeviceData } from "@/types/i-device"
import { queryDevicesByParams } from "@/utils/device-funs"

// 组合成场站下的设备列表
export const getStnOfDeviceData = (dvsList: IDeviceData[]) => {
  const result = dvsList.reduce((prev, cur) => {
    if (!prev[cur.stationId]) {
      prev[cur.stationId] = []
    }
    prev[cur.stationId].push(cur)
    return prev
  }, {})
  return result
}
