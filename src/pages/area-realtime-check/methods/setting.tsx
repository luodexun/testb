/*
 * @Author: chenmeifeng
 * @Date: 2025-06-09 14:26:22
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-25 17:11:12
 * @Description:
 */
import { doBaseServer } from "@/api/serve-funs"
import { validOperate, validResErr } from "@/utils/util-funs"

export const onFormFinish = async (val) => {
  const params = {
    key: "station_point",
    data: val,
  }
  const res = await doBaseServer("updateMngStatic", params)
  return validOperate(res)
}
export const getPointChoose = async () => {
  const res = await doBaseServer("queryMngStatic", { key: "station_point" })
  if (validResErr(res)) return []
  return typeof res.data == "string" ? JSON.parse(res.data) : res.data
}
export const getStnDvsPointData = async () => {
  const res = await doBaseServer("getStationMngPoint")
  if (validResErr(res)) return false
  return res
}
