/*
 * @Author: xiongman
 * @Date: 2023-09-07 11:08:36
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-28 10:56:27
 * @Description:
 */

import { IAgvcInfo } from "@/types/i-agvc.ts"
import { TDate } from "@/types/i-antd.ts"

export type TEnergyType = "AGC" | "AVC"

export interface ISiteAgvcSchVal {
  deviceCode: string
  date: TDate
  type: TEnergyType
}
export interface ISiteAgvcSchParams {
  deviceCode: string
  startTime: number
  endTime: number
  type: TEnergyType
}

export interface TTrendOption {
  xAxis: string[]
  data: IAgvcInfo[]
  type: "AGC" | "AVC"
}
