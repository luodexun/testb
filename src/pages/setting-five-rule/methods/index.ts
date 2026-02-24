/*
 * @Author: chenmeifeng
 * @Date: 2024-12-16 10:47:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-20 15:50:02
 * @Description:
 */
import { doBaseServer, doNoParamServer } from "@/api/serve-funs"
// import { STATION_DATA_MAP } from "@/store/atom-station"
import { IPageInfo } from "@/types/i-table.ts"
import { validOperate, validResErr } from "@/utils/util-funs"

import { IRuleInfo, IRuleInfoParam } from "../types"
import { IPageData } from "@/types/i-config"
import { AxiosResponse } from "axios"
import { dealDownload4Response } from "@/utils/file-funs"

// 执行数据查询
export async function getPjctSchData(pageInfo: IPageInfo, formData) {
  const params = {
    pageSize: pageInfo.pageSize,
    pageNum: pageInfo.current,
    stationCode: formData?.stationCode,
  }
  const res = await doBaseServer<IRuleInfoParam, IPageData<IRuleInfo>>("fiveRuleAlarm", params)
  if (validResErr(res)) return null
  return { records: res.records || [], total: res.total }
}

export const exportData = async (data) => {
  const params = {
    stationCode: data.stationCode,
  }
  doBaseServer<any, AxiosResponse>("fiveRuleExport", params).then((data) => {
    dealDownload4Response(data, "导出表.xlsx")
  })
}
export const exportTemplate = async () => {
  doBaseServer<any, AxiosResponse>("pjtExportTemplate").then((data) => {
    dealDownload4Response(data, "导出表.xlsx")
  })
}

export const importFile = async (formData) => {
  const res = await doBaseServer("pjtImportData", formData)
  return validOperate(res)
}
