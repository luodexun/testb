/*
 *@Author: chenmeifeng
 *@Date: 2024-03-27 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-01 14:56:37
 *@Description:
 */

import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { AxiosResponse } from "axios"

import { doBaseServer, doRecordServer } from "@/api/serve-funs.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { validResErr } from "@/utils/util-funs"

import { IRpOperationSchForm, IRpOperationSchParams } from "../types"

// 处理查询及导出参数
function dealParams(formData: IRpOperationSchForm): IRpOperationSchParams {
  const { dateRange } = formData
  return { ...getStartAndEndTime(dateRange, "", null, true) }
}

// 执行数据查询
export async function getReportHnSchData(pageInfo: IPageInfo, formData: IRpOperationSchForm) {
  const params = dealParams(formData)
  params.pageNum = pageInfo.current
  params.pageSize = pageInfo.pageSize
  const res = await doRecordServer<IRpOperationSchParams>("getHenanData", params)
  if (validResErr(res)) return null
  const actualData = res?.list.map((i, idx) => {
    return {
      ...i,
      id: i.endTime + i.startTime + i.name + idx,
    }
  })
  return { records: actualData || [], total: res?.total }
}

// 执行数据导出
export function reportGridExport(formData: IRpOperationSchForm) {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportHenanData", params).then((data) => {
    dealDownload4Response(data, "河南日报报表.xlsx")
  })
}
