/*
 * @Author: chenmeifeng
 * @Date: 2025-04-15 16:37:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-21 10:39:16
 * @Description:
 */
import { ITbColAction } from "@/components/action-buttons/types"
import type { ColumnsType } from "antd/es/table"
import { ITemplateData, TTpltTbActInfo } from "../types/template"
import { getTableActColumn } from "@/utils/table-funs"
const TABLE_ACTION = [
  { key: "delete", label: "删除" },
  { key: "choose", label: "选择" },
]
export function TEMPLATE_COLUMNS(config: ITbColAction<TTpltTbActInfo, ITemplateData>): ColumnsType<ITemplateData> {
  const { onClick } = config
  return [
    { dataIndex: "index", title: "序号", align: "center", width: 80 },
    { dataIndex: "name", title: "模版", align: "center" },
    { dataIndex: "sharedFlag", title: "是否私有", align: "center", render: (text) => (text === 0 ? "是" : "否") },
    {
      dataIndex: "data",
      title: "内容",
      align: "center",
      render: (text) => (
        <div>
          <div>设备类型：{text?.deviceTypeName}</div>
          <div>设备：{text?.deviceNames}</div>
          <div>测点: {text?.devicePoint?.map((i) => i.label)?.join("、")}</div>
          <div>刻度间隔：{text?.timeIntervalName}</div>
          <div>聚合方式：{text?.funcName}</div>
        </div>
      ),
    },
    ...getTableActColumn<ITemplateData, TTpltTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          delete: {
            // disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15,
          },
        },
      }),
      null,
      { width: 150 },
    ),
  ]
}
