/*
 * @Author: xiongman
 * @Date: 2022-11-09 11:44:06
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-09 11:44:06
 * @Description: 查询组件-数据类型们
 */

import { ButtonProps, DropDownProps, FormInstance, FormItemProps } from "antd"
import type { PopconfirmProps } from "antd"
import { FormProps } from "antd/es/form/Form"
import { ComponentClass, FunctionComponent } from "react"

interface IFormItemOption {
  type: FunctionComponent | ComponentClass
  name: string
  label?: string
  props?: any
  formItemProps?: FormItemProps
}

interface IFormOptions extends FormProps {
  modalType?: string
  extra?: Record<string, any>
  loadData?: (values: any) => void
}

export interface ISearchFormProps {
  onSearch?: (values: any) => void
  onAction?: (type?: any, select?: any) => void
  loading?: boolean
  disabled?: boolean
  wrapBtn?: boolean // 换行参数
  formOptions?: IFormOptions
  itemOptions?: IFormItemOption[]
  itemOptionConfig?: TFormItemConfig
  buttons?: {
    name: string
    label?: string
    props?: ButtonProps
    btnType?: "button" | "dropdown" | "popconfirm"
    dropdownProps?: DropDownProps
    popProps?: PopconfirmProps
  }[]
}

export interface IFormInst<TFormVal = any> extends Partial<FormInstance<TFormVal>> {
  submit?: FormInstance<TFormVal>["submit"]
  getInst?: () => FormInstance<TFormVal>
  getFormValues?: FormInstance<TFormVal>["getFieldsValue"]
}

export type TFormItemConfig<TKey extends string = string> = Partial<Record<TKey, any>>
