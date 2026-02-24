/*
 * @Author: xiongman
 * @Date: 2023-10-19 18:04:04
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-19 18:04:04
 * @Description:
 */

import { ButtonProps } from "antd"
import { ReactNode } from "react"

export interface IActInfo {
  key: string
  label: string
}

export interface IActBtnInfo<TAct extends IActInfo> {
  key: TAct["key"]
  label: TAct["label"]
}

// 表格操作按钮配置参数
export interface IActBtnProps<TAct extends IActInfo> {
  prefix?: string
  items?: IActInfo[]
  buttonProps?: { [k in TAct["key"]]?: ButtonProps }
  onClick?: (info: IActBtnInfo<TAct>) => void
  confirmProps?: { title?: ReactNode } | { [key in TAct["key"]]?: { title?: ReactNode } }
}

export interface ITbColAction<TAct extends IActInfo, TData = any> {
  onClick?: (record: TData, info: IActBtnInfo<TAct>) => void
  actHead?: boolean
}
