/*
 * @Author: chenmeifeng
 * @Date: 2024-04-08 11:32:02
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 11:32:02
 * @Description:
 */
import { RangePickerProps } from "antd/es/date-picker"

import { ISchPageParams } from "@/types/i-table.ts"
export interface IRpGRIDData {
  index?: number
  deviceCode?: string
}
export interface IRpDevicemngSchForm {
  stationCode?: string
  deviceType?: string
  dateRange?: RangePickerProps["value"]
}
export interface IRpSitedevicemngSchParams extends Partial<ISchPageParams>, Omit<IRpDevicemngSchForm, "dateRange"> {
  startTime?: string | number
  endTime?: string | number
}
export interface ITbColAction<TData = any> {
  onClick?: (record: TData) => void
  actHead?: boolean
}
