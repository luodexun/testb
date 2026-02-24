/*
 * @Author: chenmeifeng
 * @Date: 2024-09-23 13:42:06
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-24 10:24:18
 * @Description:
 */
import { doNoParamServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"
import { IStnProductionData } from "../types"

export async function getStationProductionData() {
  const resData = await doNoParamServer<IStnProductionData[]>("getStationProductionData")
  if (validResErr(resData)) return []
  return resData
}

export const isNullNumber = (val) => {
  if (`${val}` === "undefined") return ""
  return `${val}`
}
