/*
 *@Author: chenmeifeng
 *@Date: 2024-03-27 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-25 16:42:52
 *@Description:
 */

import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { AxiosResponse } from "axios"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { validResErr } from "@/utils/util-funs"

import { IRpGridSchForm, IRpGridSchParams } from "../types"

// 处理查询及导出参数
function dealParams(formData: IRpGridSchForm): IRpGridSchParams {
  const { dateRange, stationCodeList, ...others } = formData
  const stationCode = stationCodeList?.length ? stationCodeList.join(",") : ""
  return { ...others, stationCode, ...getStartAndEndTime(dateRange, null) }
}

// 执行数据查询
export async function getReportGridSchData(pageInfo: IPageInfo, formData: IRpGridSchForm) {
  const params = dealParams(formData)
  params.pageNum = pageInfo.current
  params.pageSize = pageInfo.pageSize
  const res = await doBaseServer<IRpGridSchForm>("getGridProductionDataV2", params)
  if (validResErr(res)) return null
  const actualData = res?.list.map((i, idx) => {
    return {
      ...i,
      id: i.Time + i.backActivePower + i.forwardActivePower + idx,
    }
  })
  return { records: actualData || [], total: res?.total }
}

// 执行数据导出
export function reportGridExport(formData: IRpGridSchForm) {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportGridProductionDataV2", params).then((data) => {
    dealDownload4Response(data, "涉网电量报表.xlsx")
  })
}
