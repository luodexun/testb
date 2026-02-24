/*
 * @Author: chenmeifeng
 * @Date: 2023-11-15 15:52:59
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-11 14:45:50
 * @Description: mqtt实时告警
 */
import { atom } from "jotai"

import { StorageAlarmList } from "@/configs/storage-cfg"
import { getRealAlarmCounts } from "@/pages/alarm-realtime/methods"
import { IAlarmCount, IAlarmMessages, IAlarmMqttInfo } from "@/types/i-alarm"
import { getStorage, setStorage } from "@/utils/util-funs"
export const alarmInfoAtom = atom<IAlarmMqttInfo>({})
export const alarmCountInfo = atom<IAlarmCount>({})
export const alarmAudioAtom = atom<IAlarmMessages>(null as IAlarmMessages)
export const alarmInfoSetAtom = atom(
  null,
  async (_, set, data: { alarmInfo: IAlarmMqttInfo; call: (isErr: boolean) => void; showMqttCount?: boolean }) => {
    const { alarmInfo, call, showMqttCount = true } = data
    const hasErr = true
    try {
      if (!showMqttCount) {
        const res = await getRealAlarmCounts()
        set(alarmInfoAtom, {
          alarmCounts: res || { total: 0 },
        })
        return
      }
      const AlarmListStorage = getStorage(StorageAlarmList)
      const actualAlarmMes = AlarmListStorage?.alarmMessages || []
      actualAlarmMes?.length > 20 ? actualAlarmMes.shift() : ""
      const alarmMqttData = {
        alarmMessages: actualAlarmMes?.concat(alarmInfo.alarmMessages.sort((a, b) => a.startTime - b.startTime) || []),
        alarmCounts: alarmInfo?.alarmCounts,
      }
      setStorage(alarmMqttData, StorageAlarmList)

      set(alarmInfoAtom, alarmMqttData)
    } catch (err: any) {
      // showMsg(err.data || "登录失败", "error")
    } finally {
      call(hasErr)
    }
  },
)

export const alarmAudioSetAtom = atom(
  null,
  async (_, set, data: { alarmInfo: IAlarmMessages[]; call?: (isErr?: boolean) => void }) => {
    const { call, alarmInfo } = data
    try {
      const lastInfo = alarmInfo?.sort((a, b) => a.startTime - b.startTime) || []
      const length = lastInfo.length
      set(alarmAudioAtom, lastInfo[length - 1])
    } catch (err: any) {
      // showMsg(err.data || "登录失败", "error")
    } finally {
      call?.()
    }
  },
)

export const alarmCountInfoSetAtom = atom(null, async (_, set, data: { call: (isErr?: boolean) => void }) => {
  const { call } = data
  try {
    const res = await getRealAlarmCounts()
    set(alarmCountInfo, res || { total: 0 })
  } catch (err: any) {
    // showMsg(err.data || "登录失败", "error")
  } finally {
    call()
  }
})
