/*
 * @Author: chenmeifeng
 * @Date: 2023-11-10 10:15:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-16 10:38:33
 * @Description:
 */

import { doNoParamServer } from "@/api/serve-funs"
import MnCenter from "@/assets/monitor/mn_center.png"
import MnDian from "@/assets/monitor/mn_dian.png"
import MnFc from "@/assets/monitor/mn_fc.png"
import MnF from "@/assets/monitor/mn_feng.png"
import MnYa from "@/assets/monitor/mn_ya.png"
import { TSiteType } from "@/types/i-config.ts"
import { IAtomStation } from "@/types/i-station.ts"
import { oneToTowDimentionArr, validResErr } from "@/utils/util-funs"

import { TNetStateData } from "../types"

export async function getStaNetworkSt(stationMap: IAtomStation["stationMap"]): Promise<TNetStateData[][]> {
  const resData = await doNoParamServer<TNetStateData[]>("getNetworkStatus")
  if (validResErr(resData) || !Array.isArray(resData)) return []
  return oneToTowDimentionArr(10, dealNetData(resData, stationMap))
}

function dealNetData(dataList: TNetStateData[], stationMap: IAtomStation["stationMap"]) {
  dataList.forEach((item, index) => {
    item.ipPort = [item.ip, item.port].join(":")
    item.color = item.connStatus ? "#1CB158" : "#bd250d"
    item.siteIcon = getNetSiteImg(stationMap[item.stationCode]?.stationType || "W")
    item.stationCode = `${item.stationCode}_${index}`
  })
  return dataList
}

const NET_ICON_MAP: Partial<Record<TSiteType | "CENTER" | "OTHER", string>> = {
  W: MnF,
  H: MnFc,
  S: MnYa,
  E: MnDian,
  CENTER: MnCenter,
  OTHER: MnFc,
}

export function getNetSiteImg(name?: keyof typeof NET_ICON_MAP): string {
  return NET_ICON_MAP[name] || NET_ICON_MAP["OTHER"]
}
