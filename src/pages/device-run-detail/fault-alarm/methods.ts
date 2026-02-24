/*
 * @Author: xiongman
 * @Date: 2023-09-27 10:21:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-23 10:25:32
 * @Description: 故障报警信息-方法们
 */

import { day4Y2S } from "@configs/time-constant.ts"
import { uDate, vDate, validResErr } from "@utils/util-funs.tsx"

import { doRecordServer } from "@/api/serve-funs.ts"

import { IDvsAlarmData, IDvsAlarmParams, IDvsHtrAlarmParams } from "./types.ts"
import { getStartAndEndTime } from "@/utils/form-funs.ts"

export async function queryDvsAlarmData(data): Promise<IDvsAlarmData[] | boolean> {
  const { deviceIds, alarmLevelId } = data
  const resData = await doRecordServer<IDvsAlarmParams, IDvsAlarmData>("queryRoughMsg", {
    params: { pageNum: 1, pageSize: 100 },
    data: { deviceId: deviceIds, alarmLevelId: alarmLevelId },
  })
  if (validResErr(resData)) return false
  return dealAlarmData(resData.list)
}
// 调用历史告警接口
export async function queryHtrAlarmData(data, api = "getAlarmList"): Promise<IDvsAlarmData[] | boolean> {
  const { deviceIds, alarmLevelId } = data
  const dateRange = [vDate().subtract(7, "day"), vDate()]
  const resData = await doRecordServer<IDvsHtrAlarmParams, IDvsAlarmData>(api, {
    params: { pageNum: 1, pageSize: 200 },
    data: {
      deviceIdList: [deviceIds],
      alarmLevelIdList: [alarmLevelId],
      ...getStartAndEndTime<number>(dateRange as any, "", null, true),
    },
  })
  if (validResErr(resData)) return false
  return dealAlarmData(resData.list)
}

function dealAlarmData(alarmDataList: IDvsAlarmData[]): IDvsAlarmData[] {
  alarmDataList.forEach((item) => {
    item.id = `${item.startTime}_${item.endTime}_${item.alarmDesc}`
    // item.startTimeStr = uDate(item.startTime, day4Y2S)
    item.confirmLabel = item.confirmFlag ? "是" : "否"
  })
  return alarmDataList
}
