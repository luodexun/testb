/*
 * @Author: chenmeifeng
 * @Date: 2024-07-05 16:45:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-05 17:44:30
 * @Description:
 */
import { IPageInfo } from "@/types/i-table"
import { IRpPowerSchForm, IRpPowerSchParams } from "../types"
import { uDate, validOperate, validResErr } from "@/utils/util-funs"
import { day4Y } from "@/configs/time-constant"
import { doBaseServer } from "@/api/serve-funs"
import { AxiosResponse } from "axios"
import { dealDownload4Response } from "@/utils/file-funs"

export const getDailyPdCorrectData = async (_: IPageInfo, formData: IRpPowerSchForm) => {
  const params = dealParams(formData)
  const res = await doBaseServer<IRpPowerSchParams>("getDailyProductionData", params)
  if (validResErr(res)) return null
  console.log(res, "修正列表")

  return { records: res || [], total: 0 }
}

// 处理查询及导出参数
function dealParams(formData: IRpPowerSchForm): IRpPowerSchParams {
  let { year } = formData
  const { ...others } = formData
  year = uDate(year, day4Y)

  return { ...others, year }
}

export const doExportCorrectPower = (formData) => {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportMockDailyProduction", params).then((data) => {
    dealDownload4Response(data, "计划电量.xlsx")
  })
}

export const importCorretList = async (formData) => {
  const res = doBaseServer("importMockDailyProduction", formData)
  const valid = await validOperate(res)
  console.log(valid, "valid")
  return valid
}

// 获取某月有多少天
export function loopNTimes(year, month) {
  // const month = month
  const dayNum = new Date(parseInt(year), parseInt(month) + 1, 0).getDate()
  console.log(dayNum, "dayNum", month)

  const allDayColumn = []
  for (let i = 0; i < dayNum; i++) {
    allDayColumn.push({
      dataIndex: i + 1,
      title: i + 1,
      render: (_, record) => record?.["dayList"]?.[i + 1],
    })
  }
  return allDayColumn
}
