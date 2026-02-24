/*
 *@Author: chenmeifeng
 *@Date: 2023-10-10 11:12:12
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-10-10 11:12:12
 *@Description: 模块描述
 
 */
import type { AxiosPromise } from "axios"
import type { CSSProperties } from "react"

import { ComponentName, ComponentProps } from "@/types/components"

export type FormValueType = string | number | string[] | number[] | boolean | undefined | null
export type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : any, T>

export type FormItemProps = {
  labelWidth?: string | number
  required?: boolean
  error?: string
  showMessage?: boolean
  inlineMessage?: boolean
  style?: CSSProperties
}
export interface FormSchema {
  // 唯一值
  name: string
  // 标题
  label?: string
  //宽度
  width?: string | number
  // 提示
  labelMessage?: string
  // formItem组件属性
  formItemProps?: FormItemProps

  defaultValue?: string | number | any

  componentProps?: { slots?: Recordable } & ComponentProps
  // 渲染的组件
  component?: ComponentName
  // 初始值
  value?: FormValueType
  // 是否隐藏
  hidden?: boolean
  // 远程加载下拉项
  api?: <T = any>() => AxiosPromise<T>

  //是否警用
  disabled?: boolean
  //
  placeholder?: string
}
