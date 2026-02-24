import { AxiosResponse } from "axios"

import { doBaseServer } from "@/api/serve-funs"
import { day4Y2S } from "@/configs/time-constant"
import { IBoostMQData } from "@/types/i-boost"
import { dealDownload4Response } from "@/utils/file-funs"
import { getStartAndEndTime } from "@/utils/form-funs"
import { uDate, validServe } from "@/utils/util-funs"

import { ISvgHistorySchForm } from "./types"

export async function exportCrashTrackData(formData: ISvgHistorySchForm, pointInfo, pointLs) {
  const params = dealParams(formData, pointInfo, pointLs)
  if (!params) return false
  const data = await doBaseServer<typeof params, AxiosResponse>("exportTrendData", params)
  dealDownload4Response(data, "历史趋势.xlsx")
  return true
}

// export const dealParams = (formData, pointInfo) => {
//   const params = {
//     stationCode: pointInfo?.stationInfo?.stationCode,
//     devicePoint: pointInfo?.pointName,
//     ...getStartAndEndTime<number>(formData.dateRange, "", null, true),
//   }
//   return params
// }

export const dealParams = (formData, pointInfo, pointLs?) => {
  const params = {
    devicePoint: formData.devicePoint
      .map((i) => {
        const pointDesc = pointLs?.find((j) => j.value === i)?.title
        return `${pointInfo.deviceCode}-${i}-${pointDesc}`
      })
      ?.join(","),
    timeInterval: formData.timeInterval,
    func: "LAST",
    ...getStartAndEndTime<number>(formData.dateRange, "", null, true),
  }
  return params
}

export const getTrendData = async (formData, pointInfo) => {
  const params = dealParams(formData, pointInfo)

  const resData = await doBaseServer<typeof params, IBoostMQData[]>("getCrashTrackData", params)
  validServe(resData)
  const timeList = resData.map((i) => uDate(i.Time, day4Y2S))
  const series = [
    {
      name: pointInfo?.pointDesc,
      data: resData.map((i) => i[pointInfo?.pointName]),
      type: "line",
    },
  ]
  return { xAxis: timeList, series }
}

// 模拟数据
export const analogData = () => {
  let timestamp = 1727763440000
  let Time = [],
    YX2411 = [],
    YC185 = [],
    ConGridsidePhaseVolL1 = []
  for (let i = 0; i < 3000; i++) {
    Time.push(timestamp)
    YX2411.push(Math.ceil(Math.random() * 10))
    ConGridsidePhaseVolL1.push(Math.ceil(Math.random() * 10))
    YC185.push(Math.ceil(Math.random() * 10))
    timestamp = timestamp + 1000
  }
  return {
    "410527W01WT1107076": {
      Time,
      YX2411,
      YC185,
      ConGridsidePhaseVolL1,
    },
  }
}
