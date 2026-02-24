/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 15:40:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-08 13:37:33
 * @Description:
 */
import { doBaseServer, doNoParamServer } from "@/api/serve-funs"
import { IStationData } from "@/types/i-station"
import { IPageInfo } from "@/types/i-table"
import { validOperate } from "@/utils/util-funs"

import { IProjectCompany, IStationIdxListParam } from "../types"
let stationIdxData = []
// 执行数据查询
export async function getSettingStIdexSchData(pageInfo?: IPageInfo, formData?) {
  const params = { stationCode: formData.stationCode }

  stationIdxData = await doBaseServer("allStationsData", params)
  const companyList = await doNoParamServer<Array<IProjectCompany>>("getProjectCompany")

  stationIdxData = stationIdxData.map((i, idx) => {
    const maintenanceComShortName = companyList.find(
      (item) => item?.type === "MAINTENANCE" && item?.id === i?.maintenanceComId,
    )?.shortName
    const projectComShortName =
      companyList.find((item) => item?.type === "PROJECT" && item?.id === i?.parentComId)?.shortName || ""
    return {
      ...i,
      row_idx: idx + 1,
      maintenanceComShortName,
      projectComShortName,
    }
  })
  // refleshFlag = false
  return { records: stationIdxData || [], total: stationIdxData?.length }
}

export const changeRefleshFlag = (flag) => {
  // refleshFlag = flag
}

export const saveStnIdxData = async (data) => {
  const changeStnList = data.filter((i) => i.edit)
  if (!changeStnList.length) return Promise.reject()
  const res = await doBaseServer<IStationData>("updateStationsData", changeStnList)
  // refleshFlag = true
  return validOperate(res)
}
