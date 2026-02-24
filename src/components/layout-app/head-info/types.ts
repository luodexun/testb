/*
 * @Author: xiongman
 * @Date: 2023-10-30 17:38:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-28 17:04:42
 * @Description:
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"

export type TUserActKey = "edit-psw" | "loginout"

export type THeadInfoActIconKey =
  | "last"
  | "next"
  | "collect"
  | "voice"
  | "alarm"
  | "help"
  | "carousel"
  | "user"
  | TUserActKey
  | "virtualAlarm"
  | "searchSt"
  | "comloss"

export interface IHeadInfoIconInfo extends Omit<IDvsRunStateInfo<THeadInfoActIconKey, string>, "title" | "icon"> {
  title: string | ((checked?: boolean) => string)
  icon?: string | ((checked?: boolean) => string)
}

export type THeadInfoIconStateMap = {
  [key in THeadInfoActIconKey]?: boolean
}
export interface IComlossTotalInfo {
  count: {
    total: number
    normal: number
    noCommunication: number
  }
  data: IComlossData[]
}
export interface IComlossData {
  id: string
  stationCode: string
  stationName: string
  deviceName: string
  deviceCode: string
  deviceType: string
  deviceTypeName: string
  stateName: string
  mainState: number
  Time: number
}
export interface TComlossForm {
  stationCode?: string
  deviceType?: string
}

export type TComlossTbActInfo = {
  key: "confirmBtn"
  label: string
}
