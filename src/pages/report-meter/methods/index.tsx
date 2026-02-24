/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-10 10:57:10
 * @Description:
 */

import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { AxiosResponse } from "axios"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { validResErr } from "@/utils/util-funs"

import { IRpPowerSchForm, IRpPowerSchParams } from "../types"

// 处理查询及导出参数
function dealParams(formData: IRpPowerSchForm): IRpPowerSchParams {
  const { dateRange, stationCodeList, ...others } = formData
  const stationCode = stationCodeList?.length ? stationCodeList.join(",") : ""
  return { ...others, stationCode, ...getStartAndEndTime(dateRange, null, null, true) }
}

// 执行数据查询
export async function getReportPowerSchData(pageInfo: IPageInfo, formData: IRpPowerSchForm) {
  const params = dealParams(formData)
  params.pageNum = pageInfo.current
  params.pageSize = pageInfo.pageSize
  const res = await doBaseServer<IRpPowerSchForm>("getDNJLData", params)
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
export function reportMeterExport(formData: IRpPowerSchForm) {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportDNJLData", params).then((data) => {
    dealDownload4Response(data, "电计量报表.xlsx")
  })
}
