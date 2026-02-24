/*
 * @Author: xiongman
 * @Date: 2022-12-20 16:51:04
 * @LastEditors: xiongman
 * @LastEditTime: 2022-12-20 16:51:04
 * @Description: 自定义表格组件数据类型们
 */

import { FormItemProps, TableProps } from "antd"
import { FormProps } from "antd/es/form/Form"
import { ColumnType } from "antd/es/table"
// @ts-ignore
import { FormInstance, NamePath } from "rc-field-form/lib/interface"
import React, { ReactNode } from "react"

// customTable 的组件参数类型
export interface ICustomTabProps extends TableProps<any> {
  limitHeight?: boolean
  initHeight?: string
  scrollX?: string | number
}
// customTable 的 ref 数据类型
export interface ICustomTabRef {
  tableWrap: HTMLDivElement
}

interface IEditColumn extends ColumnType<any> {
  editable?: boolean
  inputNode?: ReactNode
  formItemProps?: FormItemProps
  dependencies?: EditableCellProps["dependencies"]
}
export interface IEditTbProps<TData = any> extends TableProps<TData> {
  formProps?: FormProps<TData>
  editingKey?: string
  editDatas?: Array<any>
  columns?: IEditColumn[]
  limitHeight?: ICustomTabProps["limitHeight"]
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing?: boolean
  dataIndex: string
  title: any
  inputNode?: ReactNode
  formItemProps?: FormItemProps
  record: any
  index: number
  children?: ReactNode
  dependencies?: { fields: NamePath[]; render: (form: FormInstance, record: EditableCellProps["record"]) => ReactNode }
}
