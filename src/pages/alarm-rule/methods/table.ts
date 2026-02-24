/*
 * @Author: chenmeifeng
 * @Date: 2024-08-29 10:55:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-14 16:17:14
 * @Description:
 */
import { AxiosResponse } from "axios"

import { doBaseServer, doRecordServer } from "@/api/serve-funs"
import { IPageInfo } from "@/types/i-table"
import { getDvsMeasurePointsData } from "@/utils/device-funs"
import { dealDownload4Response } from "@/utils/file-funs"
import { showMsg, validOperate, validResErr } from "@/utils/util-funs"

import { IEditFormData, ISchForm } from "../types/form"
import { AlarmSerForm, IAlarmRuleLs, IPointSch, IQueryAlarmRuleParams } from "../types/table"
const isFirst = true
const allPointList = []
export const getAlarmRuleSchData = async (pageInfo: IPageInfo, formData: AlarmSerForm) => {
  const params = {
    data: {
      deviceIds: formData.deviceIds,
      stationId: formData.stationId,
      deviceType: formData.deviceType,
    },
    params: {
      pageNum: pageInfo.current,
      pageSize: pageInfo.pageSize,
    },
  }
  const res = await doBaseServer<IQueryAlarmRuleParams>("customAlarm", params)
  const { data } = res
  if (validResErr(res)) return { records: [], total: 0 }
  return { records: data.records, total: data.total }
}
export const initPiontLs = async (pageInfo: IPageInfo, formData: IPointSch) => {
  const { deviceId, pointDesc, exitPointList } = formData
  const { current, pageSize } = pageInfo
  // if (isFirst) {
  //   allPointList = await getDvsMeasurePointsData({ deviceId, pointTypes: "2" })
  // }
  // if (allPointList?.length) isFirst = false
  const actualShowPt = pointDesc
    ? exitPointList?.filter((i) => i.pointDesc === pointDesc)
    : exitPointList?.slice((current - 1) * pageSize, current * pageSize)
  return {
    records: actualShowPt,
    total: pointDesc ? actualShowPt?.length : allPointList?.length,
  }
}

export const editAlarmRule = async (formData: ISchForm, devices) => {
  if (!formData.alarmRule?.length) {
    showMsg("请至少填写一条规则")
    return false
  }
  const alarmRule = formData.alarmRule?.reduce((prev, cur, idx) => {
    prev =
      prev +
      `${idx === 0 ? "" : " "}` +
      `${cur.pointName} ${cur.operator} ${cur.value}${idx === formData.alarmRule?.length - 1 ? "" : " " + cur.symbol}`
    return prev
  }, "")

  const params: Array<IEditFormData> = devices.map((i) => {
    return {
      ...formData,
      alarmRule,
      stationId: i.stationId,
      deviceId: i.deviceId,
    }
  })
  console.log(params, "formData")
  const apiKey = formData.id ? "customAlarmUpdate" : "customAlarmSave"
  const res = await doBaseServer<Array<IEditFormData>>(apiKey, params)
  return validOperate(res)
}

// 测点最新值查询
export const queryLastedVals = async (data, devices) => {
  const deviceCode = devices?.[0].deviceCode
  const params = data?.map((i) => {
    return {
      deviceCode,
      pointName: i.pointName,
    }
  })
  const res = await doBaseServer("pointLastedValue", params)

  if (validResErr(res)) return []
  return res.data
}

// 批量删除规则
export const batchDelRules = async (ids) => {
  const res = await doBaseServer("customAlarmDelete", { ids })
  return validOperate(res)
}
export const updateRulesEnable = async (ids, type) => {
  const params = {
    idList: ids,
    enableFlag: type,
  }
  const res = await doBaseServer("updateRulesEnable", params)
  return validOperate(res)
}
export const updateRulesAction = async (ids, type) => {
  const params = {
    idList: ids,
    actionFlag: type,
  }
  const res = await doBaseServer("updateRulesAction", params)
  return validOperate(res)
}
// 执行数据导出
export function doExportAlarmRule(ids) {
  const params = { deviceIds: ids }
  doBaseServer<typeof params, AxiosResponse>("exportRuleAlarm", params).then((data) => {
    dealDownload4Response(data, "导出表.xlsx")
  })
}
