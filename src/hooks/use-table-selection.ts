/*
 * @Author: xiongman
 * @Date: 2023-07-07 09:49:26
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-25 10:43:49
 * @Description: 表格可选列钩子方法
 */

import type { TableProps } from "antd"
import React, { Key, useState } from "react"

export default function useTableSelection<TData = any>(
  props?: Omit<TableProps<TData>["rowSelection"], "selectedRowKeys" | "onChange"> & { needInfo?: boolean },
) {
  const { needInfo, ...others } = props || {}
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [selectedRows, setSelectedRows] = useState<TData[]>([])

  const rowSelection: TableProps<TData>["rowSelection"] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedAllRows: TData[]) => {
      if (needInfo) {
        setSelectedRows(selectedAllRows)
        return setSelectedRowKeys(selectedRowKeys)
      }
      setSelectedRowKeys(selectedRowKeys)
    },
    ...(others || {}),
  } as TableProps<TData>["rowSelection"]

  return { selectedRowKeys, rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows }
}
