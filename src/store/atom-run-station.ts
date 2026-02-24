/*
 * @Author: xiongman
 * @Date: 2023-09-25 10:17:19
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-25 10:17:19
 * @Description:
 */

import { atom } from "jotai"

import { IStationRunDataMQ, TStnMonitorDataMap } from "@/types/i-monitor-info.ts"

const RUN_4STATION_DATA = atom<IStationRunDataMQ>({})

export const AtomRun4StationData = atom(
  (get) => get(RUN_4STATION_DATA),
  (get, set, data: IStationRunDataMQ) => {
    const prevData = get(RUN_4STATION_DATA)
    set(RUN_4STATION_DATA, { ...prevData, ...data })
  },
)

export const AtomStnMonitorDataMap = atom<TStnMonitorDataMap>({})
