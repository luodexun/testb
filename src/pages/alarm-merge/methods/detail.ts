/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 17:13:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-19 14:12:13
 * @Description:
 */
import { isNumber } from "ahooks/es/utils"
import { AxiosResponse } from "axios"

import { doBaseServer, doRecordServer } from "@/api/serve-funs"
import { day4Y2S } from "@/configs/time-constant"
import { IPageInfo } from "@/types/i-table"
import { dealDownload4Response } from "@/utils/file-funs"
import { validResErr, vDate } from "@/utils/util-funs"

import { IAlMgDataInfo, IQueryAlMgDtParams } from "../types/detail"
const testData = [
  {
    stationDesc: "连州风电场",
    deviceTypeName: "风机",
    deviceId: 1,
    deviceDesc: "G001",
    alarmId: "2",
    alarmDesc: "机舱风轮锁控制盒急停按钮按下",
    systemId: null,
    systemName: "主控系统",
    alarmLevelId: 1,
    alarmLevelName: "故障",
    brakeLevelId: null,
    brakeLevelName: "正常停机",
    startTime: "2024-03-13 15:01:33",
    endTime: "2024-03-13 15:01:43",
    confirmBy: "集控管理员",
    confirmTime: 1713321659978,
    confirmMsg: "test",
    status: 1,
  },
]
// 执行数据查询
export async function getAlarmMergeDtPageData(pageInfo: IPageInfo, formData) {
  const params = {
    data: dealParams(formData),
    params: {
      pageNum: pageInfo?.current,
      pageSize: pageInfo?.pageSize,
    },
  }
  console.log(params, "day4Y2S")
  // return { records: testData || [], total: 2 }
  const api = formData?.chooseVal?.groupType !== 1 ? "getAlarmList" : "groupByAlarmDetail"
  const res = await doRecordServer<IQueryAlMgDtParams, IAlMgDataInfo>(api, params)
  if (validResErr(res)) return null
  const actList = res?.list?.map((i) => {
    return {
      ...i,
      startTime: !isNumber(i.startTime) ? vDate(i.startTime, day4Y2S).valueOf() : i.startTime,
    }
  })
  return { records: actList || [], total: res.total }
}
const dealParams = (formData) => {
  const { deviceId, alarmId, startTime, chooseVal } = formData
  const { formStTime, formEndTime, groupType } = chooseVal
  let newStartTime = null
  let newEndTime = null
  if (groupType === 1) {
    newStartTime = startTime
  } else {
    newStartTime = formStTime
    newEndTime = formEndTime
  }
  const params = {
    deviceIdList: [deviceId],
    alarmIdList: [alarmId],
    startTime: newStartTime,
    endTime: newEndTime,
  }
  return params
}
// 列表执行数据导出
export function doExportAlMgDetail(formData) {
  const params = dealParams(formData)
  const api = formData?.chooseVal?.groupType !== 1 ? "exportAlarmHistory" : "exportAlarmDetail"
  doBaseServer<typeof params, AxiosResponse>(api, params).then((data) => {
    dealDownload4Response(data, "告警详情列表.xlsx")
  })
}
