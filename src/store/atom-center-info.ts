/*
 * @Author: xiongman
 * @Date: 2023-10-20 11:49:01
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-20 11:49:01
 * @Description: 区域信息全局变量
 */

import { getMonitorCenterInfoData } from "@pages/area-matrix/methods"
import { atom } from "jotai"

import { ICenterInfoData } from "@/types/i-monitor-info.ts"

export const AtomCenterInfoData = atom<Partial<ICenterInfoData>>({})

AtomCenterInfoData.onMount = (setAtom) => {
  getMonitorCenterInfoData().then(setAtom)
}
