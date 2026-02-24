/*
 *@Author: chenmeifeng
 *@Date: 2023-10-20 10:18:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 16:01:30
 *@Description: 模块描述
 */

import { StorageStationData } from "@configs/storage-cfg.ts"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IQueryAlarmParams } from "@/pages/alarm-realtime/config/types"
import { IDvsSignalRecordInfo } from "@/types/i-monitor-info"
import { getStorage, judgeNull, validResErr } from "@/utils/util-funs"

import LineList from "../components/line-list"
import { COLUMNS_FOR_AREA } from "../configs"
import { IEleOverviewInfo, IEleOverviewSchParams, TEleOverviewData, TEleOverviewDataAct } from "../types"

export async function testTimeout() {
  const res = await doBaseServer("testSyzz")
  console.log("测试")
}
// 执行数据查询
export async function getEleOverviewData() {
  const res = await doBaseServer<IEleOverviewSchParams, TEleOverviewData>("getSYZZZBreakerPoint")
  if (validResErr(res)) return getElecOverviewData(null)
  return getElecOverviewData(res || null)
}
export const getElecOverviewData = (data) => {
  const { stationMap, stationList } = getStorage(StorageStationData) || {}
  const dataSource: TEleOverviewDataAct[] = [] as TEleOverviewDataAct[]
  if (!data) return dataSource
  const getExistAllStation = [] // 所有data返回中存在的场站
  const getNoExistAllStationList = [] // 所有data未返回中存在的场站
  const getExistDataList = Object.entries(data).map(([stationCode, stnDataMap]) => {
    const findStation = getExistAllStation.includes(stationCode)
    if (!findStation) {
      getExistAllStation.push(stationCode)
    }
    const tableRowData: TEleOverviewDataAct = {
      stationCode,
      stationName: stationMap?.[stationCode]?.shortName,
      stationId: stationMap?.[stationCode]?.id,
      breakerList: {},
    }

    Object.keys(stnDataMap).forEach((itemList) => {
      tableRowData.breakerList[itemList] = stnDataMap[itemList]
    })
    return tableRowData
  })
  // 获取所有data未返回中存在的场站
  stationList?.forEach((i) => {
    const findStation = getExistAllStation.find((j) => j == i.stationCode)
    if (i.stationCode !== findStation) {
      getNoExistAllStationList.push(i)
    }
  })
  const noExistStationDataList =
    getNoExistAllStationList?.map((i) => {
      return {
        stationCode: i.stationCode, // "44182W01"
        stationName: i.shortName,
        stationId: i.id,
        breakerList: {},
      }
    }) || []
  return getExistDataList.concat(noExistStationDataList)
}

export const getRealtimeAlarm = async () => {
  const res = await doBaseServer<IQueryAlarmParams>("getfilterRealTimeMsgData", {
    data: { alarmLevelIdList: [14], confirmFlag: false },
    params: { pageNum: 1, pageSize: 1000 },
  })
  if (validResErr(res)) return null
  // return [
  //   { alarmId: "UnderFrequencyLoadSheddingTripping", stationCode: "441882W01" },
  //   { alarmId: "YX359", stationCode: "410527W01" },
  // ]
  return res?.list || []
}

export const comfirmAlarmDeal = (realtimeAlarm, dataSource: TEleOverviewDataAct[]) => {
  const existAlarmKey = realtimeAlarm?.map((i) => i.alarmId)
  const allBreakData: IEleOverviewInfo[] = dataSource?.reduce((prev, cur) => {
    const breakerList = Object.values(cur.breakerList).reduce((vpr, ecur) => {
      const arr = ecur?.filter((i) => existAlarmKey.includes(i.pointName))
      return vpr?.concat(arr)
    }, [])

    return prev.concat(breakerList)
  }, [])
  // allBreakData的数据可能存在pointName相同，所以过滤掉相同的
  const noRepeatExistPiontName =
    allBreakData
      ?.map((i) => i.pointName)
      ?.reduce((prev, cur) => {
        const exist = prev.includes(cur)
        return exist ? prev : prev.concat(cur)
      }, []) || []
  const comfirmAlarmList = realtimeAlarm.filter((i) => noRepeatExistPiontName?.includes(i.alarmId)) || []
  return comfirmAlarmList
}

export const dealReturnData = (val) => {
  const result = val !== undefined ? (val !== null ? `${val}` : "-") : ""
  return result
}

export const getElecColumnForDemand = (city: string) => {
  if (!COLUMNS_FOR_AREA[city]) return null
  const cityColumns = Object.keys(COLUMNS_FOR_AREA[city])?.reduce((prev, cur) => {
    prev[cur] = COLUMNS_FOR_AREA[city]?.[cur]?.map((i) => {
      return {
        systemId: cur,
        dataIndex: i.pointName,
        title: i.subName ? (
          <div>
            {i.mainName}
            <sub>{i.subName}</sub>
            <div>({i.unit})</div>
          </div>
        ) : (
          i.title
        ),
        width: i.width,
        align: "center",
        type: i.pointType === "1" ? "LineList" : "text",
        pointName: i.pointName,
        render:
          i.pointType === "1"
            ? (_, record) => <LineList lineData={record.breakerList[cur]?.filter((i) => i.pointType === "1")} />
            : (_, record) => {
                const info = record.breakerList[cur]?.find(
                  (j) => j.pointType === "2" && j.pointName === i.pointName,
                )?.value
                return <span>{toNumberStr(info, 1)}</span>
              },
      }
    })
    return { ...prev }
  }, {})
  return cityColumns
}

export const toNumberStr = (value, digits) => {
  if (!value) return "-"
  if (typeof value === "number") {
    return judgeNull(value, 1, digits, "-")
  } else if (typeof value === "string") {
    return judgeNull(Number(value), 1, digits, "-")
  }
}
export async function getDeviceSignRecordData() {
  const params = {
    isEnd: false,
  }
  const resData = await doBaseServer<typeof params, IDvsSignalRecordInfo[]>("getSyzzzDeviceSignRecord", params)
  if (validResErr(resData)) return false
  return resData
}
export const getOtherData = async () => {
  const requests = [
    doBaseServer<IQueryAlarmParams>("getfilterRealTimeMsgData", {
      data: { alarmLevelIdList: [14], confirmFlag: false },
      params: { pageNum: 1, pageSize: 1000 },
    }).catch((e) => ({ error: e })),
    doBaseServer<any, IDvsSignalRecordInfo[]>("getSyzzzDeviceSignRecord", { isEnd: false, deviceType: "SYZZZ" }).catch(
      (e) => ({
        error: e,
      }),
    ),
  ]
  return Promise.all(requests)
}
