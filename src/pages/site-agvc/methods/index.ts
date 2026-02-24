/*
 * @Author: xiongman
 * @Date: 2023-11-28 16:38:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-05 14:20:41
 * @Description:
 */

import { dayH2S } from "@configs/time-constant.ts"
import { ISiteAgvcSchParams, ISiteAgvcSchVal, TTrendOption } from "@pages/site-agvc/types"
import { uDate, validResErr } from "@utils/util-funs.tsx"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IAgvcInfo } from "@/types/i-agvc.ts"
// const result = [
//   {
//     AGCActivePowerOrderBySchedule: 1567, // 71.1
//     AVCVoltageOrderBySchedule: 4333, //  39.7
//     additionalActivePowerOfSubStation: 2345, //  27.5
//     additionalReactivePowerOfSubStation: 557, //  57.7
//     decreaseActivePowerOfSubStation: 55555, //  9.6
//     decreaseReactivePowerOfSubStation: 7878, //  18.6
//     realTimeGirdVolt: 454, //  22.2
//     realTimeTotalActivePowerOfSubStation: 4567, //  80.5
//     Time: 17896433256,
//   },
//   {
//     AGCActivePowerOrderBySchedule: 1567, // 71.1
//     AVCVoltageOrderBySchedule: 4333, //  39.7
//     additionalActivePowerOfSubStation: 2345, //  27.5
//     additionalReactivePowerOfSubStation: 557, //  57.7
//     decreaseActivePowerOfSubStation: 55555, //  9.6
//     decreaseReactivePowerOfSubStation: 7878, //  18.6
//     realTimeGirdVolt: null, //  22.2
//     realTimeTotalActivePowerOfSubStation: 4567, //  80.5
//     Time: 17896438256,
//   },
// ]
export async function SiteAgvcSch(formData: ISiteAgvcSchVal) {
  const { deviceCode, date, type } = formData
  if (!date) return null
  const startTime = date.startOf("d").valueOf()
  const endTime = date.endOf("d").valueOf()
  const params: ISiteAgvcSchParams = { deviceCode, startTime, endTime, type }
  const resData = await doBaseServer<ISiteAgvcSchParams, IAgvcInfo[]>("getDevicePointTrendData", params)
  if (validResErr(resData)) return null
  return dealSiteAgvc2ChartData(resData, type)
}

function dealSiteAgvc2ChartData(data: IAgvcInfo[], type: ISiteAgvcSchVal["type"]): TTrendOption {
  if (!data?.length) return { xAxis: [] as string[], data: [] as IAgvcInfo[], type }
  const xAxis = data.map(({ Time }) => uDate(Time, dayH2S))
  return { xAxis, data, type }
}
