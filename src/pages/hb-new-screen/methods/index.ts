import { doBaseServer, doNoParamServer } from "@/api/serve-funs"
import { LARGER_W } from "@/configs/text-constant"
import { TDeviceType } from "@/types/i-config"
import { IStationInfoData } from "@/types/i-monitor-info"
import { parseNum, validResErr } from "@/utils/util-funs"

export const getPowerInfo = async (params) => {
  const res = await doBaseServer("getReportGLYCData", params)
  if (validResErr(res)) return null
  return res || []
}
export const getPowerFutureInfo = async (params) => {
  const res = await doBaseServer("getGLYCFutureData", params)
  if (validResErr(res)) return null
  return res || []
}

export async function getScreenStnPduTrendData(): Promise<any> {
  const resData = await doNoParamServer("getStationProductionTrendData")
  if (validResErr(resData)) return { xAxis: [], dataMap: null }
  console.log(resData, "resData")

  // return dealStnPduTrendData(resData)
}

export const getScreenStaticInfo = async () => {
  const res = await doBaseServer("queryMngStatic", { key: "hubei" })
  if (validResErr(res)) return
  return res
}
