/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 15:51:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-19 14:09:16
 * @Description:
 */
import { AxiosResponse } from "axios"

import { doBaseServer, doRecordServer } from "@/api/serve-funs"
import { day4Y2S } from "@/configs/time-constant"
import { IPageInfo } from "@/types/i-table"
import { dealDownload4Response } from "@/utils/file-funs"
import { getStartAndEndTime } from "@/utils/form-funs"
import { validResErr, vDate } from "@/utils/util-funs"

import { IAlarmMergeSchForm, IAlarmMgData, IQueryAlMgParams } from "../types"

// 执行数据查询
export async function getAlarmMergePageData(pageInfo: IPageInfo, formData: IAlarmMergeSchForm) {
  const params = {
    data: dealParams(formData),
    params: {
      pageNum: pageInfo?.current,
      pageSize: pageInfo?.pageSize,
    },
  }
  // return {
  //   records: [{ deviceId: 1, alarmLevelId: 2, startTime: "2024-04-02 05:46:23", endTime: "" }],
  //   total: 2,
  // }
  const res = await doRecordServer<IQueryAlMgParams, IAlarmMgData>("queryGroup", params)
  if (validResErr(res)) return null
  const actList = res?.list?.map((i) => {
    return {
      ...i,
      startTime: i.startTime ? vDate(i.startTime, day4Y2S).valueOf() : null,
    }
  })
  return { records: actList || [], total: res.total }
}
export const setAlarmColor = (record) => {
  if (record.alarmLevelId === 1 || record.alarmLevelId === 11 || record.alarmLevelId === 14) {
    return "var(--alarm)"
  } else if (record.alarmLevelId === 2 || record.alarmLevelId === 12 || record.alarmLevelId === 13) {
    return "var(--warning-color)"
  } else {
    return "var(--deep-font-color)"
  }
}

function dealParams(formData) {
  const { dateRange, groupType, sortType, deviceIdList } = formData
  return {
    groupType,
    sortType,
    deviceIdList,
    ...getStartAndEndTime<number>(dateRange, "", null, true),
  }
}

// 列表执行数据导出
export function doExportAlMg(formData) {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportGroup", params).then((data) => {
    dealDownload4Response(data, "告警合并导出.xlsx")
  })
}
