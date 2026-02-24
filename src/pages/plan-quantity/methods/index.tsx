/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-05 15:05:46
 * @Description:
 */

import { day4Y } from "@configs/time-constant"
import { IRpPowerData, IRpPowerSchForm, IRpPowerSchParams } from "@pages/plan-quantity/types"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IStationData } from "@/types/i-station.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { validOperate, validResErr } from "@/utils/util-funs"
import { uDate } from "@/utils/util-funs"

import { stationList } from "../configs"

// 处理查询及导出参数
function dealParams(formData: IRpPowerSchForm): IRpPowerSchParams {
  let { year } = formData
  const { ...others } = formData
  year = uDate(year, day4Y)

  return { ...others, year }
}

// 执行数据查询
export async function getReportPowerSchData(_: IPageInfo, formData: IRpPowerSchForm) {
  const params = dealParams(formData)
  const res = await doBaseServer<IRpPowerSchParams>("getProductionPlan", params)
  if (validResErr(res) || !Array.isArray(res)) return null
  return { records: res || [], total: 0 }
}

//获取详情
export async function getReportPowerSchDataDetail({ stationId, year }: IRpPowerData) {
  const stationCode = stationList?.filter((e: IStationData) => e.id === stationId)?.[0]?.stationCode
  const params = {
    stationCode,
    year,
  }
  let records: IRpPowerData[] = []

  const res = await doBaseServer<IRpPowerSchParams>("getProductionPlanDetail", params)

  if (validResErr(res) || !Array.isArray(res)) return
  records = res || []
  return records
}

//批量导入
export async function handleOption(form: IRpPowerSchForm, tableData: IRpPowerData[]) {
  let method = "fetchInsert"
  let year: any = uDate(form.year, day4Y)
  if (tableData?.[0].id) {
    method = "fetchEditPlan"
    year = form.year
  }

  const params = tableData?.map(({ id, month, productionPlan, stationId }) => {
    return {
      id,
      year: Number(year),
      stationId: stationId || form.stationId,
      month,
      productionPlan,
    }
  })
  const resData = await doBaseServer<IRpPowerSchParams[]>(method, params)
  const result = typeof resData == "string" ? { code: 200 } : null
  return validOperate(result, "新增成功", "新增失败")
}

//删除
export async function handleDelete(params: IRpPowerData | number[], data: IRpPowerData[]) {
  if (!params) return
  let ids: string
  if (Array.isArray(params)) {
    ids = getChildIds(params, data)
  } else {
    const idArr = params?.child?.map((e) => e.id)
    ids = idArr.join()
  }
  const resData = await doBaseServer<IRpPowerSchParams>("fetchDeletePlan", { ids })
  return validOperate(resData, "删除成功", "删除失败")
}

//将表格数据二次处理
export function getNewData(data: IRpPowerData[], result = []) {
  data.forEach((obj) => {
    const { stationId, year, stationName } = obj
    const index = result.findIndex((item) => item.stationId === stationId && item.year === year)

    if (index === -1) {
      const newObj = {
        id: stationId + "_" + year,
        stationId: stationId,
        stationName,
        year: year,
        child: [obj],
      }
      result.push(newObj)
    } else {
      result[index].child.push(obj)
    }
  })
  return result
}

//根据父级id获取子级id
export function getChildIds(par = [], data = []) {
  const newArr = []
  for (let i = 0; i < data.length; i++) {
    const e = data[i]
    for (let j = 0; j < par.length; j++) {
      const f = par[j]
      if (e.id === f) {
        newArr.push(...e.child.map((e: { id: number }) => e.id))
      }
    }
  }

  return newArr.join()
}

export const sortByKey = (arr, key) => {
  if (!arr) return []
  return arr?.sort((a, b) => {
    return a[key] - b[key]
  })
}
