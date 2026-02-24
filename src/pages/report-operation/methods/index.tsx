/*
 *@Author: chenmeifeng
 *@Date: 2024-03-27 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-25 11:33:50
 *@Description:
 */

import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { AxiosResponse } from "axios"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { validResErr } from "@/utils/util-funs"

import { IRpOperationSchForm, IRpOperationSchParams } from "../types"

// 处理查询及导出参数
function dealParams(formData: IRpOperationSchForm): IRpOperationSchParams {
  const { dateRange, stationCodeList, ...others } = formData
  const stationCode = stationCodeList?.length ? stationCodeList.join(",") : ""
  return { ...others, stationCode, ...getStartAndEndTime(dateRange, null) }
}

// 执行数据查询
export async function getReportGridSchData(pageInfo: IPageInfo, formData: IRpOperationSchForm) {
  const params = dealParams(formData)
  params.pageNum = pageInfo.current
  params.pageSize = pageInfo.pageSize
  let res
  let records
  if (formData.deviceType === "GLYC") {
    res = await doBaseServer<IRpOperationSchForm>("getOperationData", params)
    records = res?.list
  } else {
    res = await doBaseServer<IRpOperationSchForm>("getIndicatorByPage", params)
    records = res?.records
  }
  if (validResErr(res)) return null
  const actualData =
    records?.map((i, idx) => {
      return {
        ...i,
        id: i.Time + i.backActivePower + i.forwardActivePower + idx + "_" + i.time + i.stationCode,
      }
    }) || []
  return { records: actualData || [], total: res?.total }
}

// 执行数据导出
export function reportGridExport(formData: IRpOperationSchForm) {
  const params = dealParams(formData)
  const api = formData.deviceType === "GLYC" ? "exportOperationData" : "exportDataIndicator"
  doBaseServer<typeof params, AxiosResponse>(api, params).then((data) => {
    dealDownload4Response(data, "并网运行报表.xlsx")
  })
}
