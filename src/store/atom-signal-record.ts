/*
 * @Author: xiongman
 * @Date: 2024-02-20 11:38:50
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-07 16:55:19
 * @Description: 处理场站挂牌数据获取的变量
 */

import { MS_MINU, MS_SCEND_5 } from "@configs/time-constant.ts"
import { getDeviceSignRecordData, stnDvSignListGroupByDvsId } from "@pages/area-matrix/methods"
import { atom, Setter } from "jotai"

import { IDvsSignalRecordInfo } from "@/types/i-monitor-info.ts"

export type TStnSignRdMap = Record<IDvsSignalRecordInfo["deviceId"], IDvsSignalRecordInfo[]>
const ATOM_STATION_SIGNAL_RECORD_MAP = atom<TStnSignRdMap>({})

// 定时器
let timerFlag = 0
// 接口调用节流标记
let loadingFlag = false
export const AtomStnSignRdMap = atom(
  (get) => get(ATOM_STATION_SIGNAL_RECORD_MAP),
  (_get, set, data?: { stnId?: number; isRefresh?: boolean }) => {
    // 打开弹窗关闭刷新，开弹窗时 isRefresh 为 false
    window.clearTimeout(timerFlag)
    if (!data?.isRefresh && data?.stnId) return
    if (!data?.stnId) {
      return set(ATOM_STATION_SIGNAL_RECORD_MAP, {})
    }
    getStnDvsSignRdMapData(data.stnId, set)
  },
)

function getStnDvsSignRdMapData(stationId: number, set: Setter) {
  if (loadingFlag) return
  loadingFlag = true
  window.clearTimeout(timerFlag)
  getDeviceSignRecordData({ stationId, isEnd: false })
    .then(stnDvSignListGroupByDvsId)
    .then((signRdMap) => {
      set(ATOM_STATION_SIGNAL_RECORD_MAP, signRdMap)
      loadingFlag = false
    })
    .then(() => {
      timerFlag = window.setTimeout(() => {
        getStnDvsSignRdMapData(stationId, set)
      }, MS_SCEND_5)
    })
}
