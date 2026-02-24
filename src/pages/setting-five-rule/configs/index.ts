/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:47:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-23 11:02:35
 * @Description:
 */

import { ColumnsType } from "antd/es/table"

import { ITbColAction } from "@/components/action-buttons/types"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import { StorageStnDvsType } from "@/configs/storage-cfg"
import { getTableActColumn } from "@/utils/table-funs"
import { getStorage } from "@/utils/util-funs"

import { IRuleInfo, TUserTbActInfo } from "../types/index"
import SelectWithAll from "@/components/select-with-all"
import { SCH_BTN } from "@/components/custom-form/configs"
import StationTreeSelect from "@/components/station-tree-select"

export const deviceTypesOfSt = getStorage(StorageStnDvsType)

export const ST_MANAGE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "add", label: "新增" },
  { name: "batchDelete", label: "批量删除" },
  { name: "export", label: "导出" },
]

const TABLE_ACTION = [
  { key: "edit", label: "编辑" },
  { key: "deleted", label: "删除" },
]
export const PJCT_SEARCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      options: [],
      disabled: false,
    },
  },
]
export function DEVICE_ATT_COLUMNS(config: ITbColAction<TUserTbActInfo, IRuleInfo>): ColumnsType<IRuleInfo> {
  const { onClick } = config
  return [
    { dataIndex: "index", title: "序号", width: 60, align: "center" },
    { dataIndex: "stationName", title: "场站" },
    { dataIndex: "deviceName", title: "设备" },
    { dataIndex: "pointDesc", title: "遥控点" },
    { dataIndex: "controlType", title: "控制类型", render: (text) => (text === 1 ? "合位" : "分位") },
    ...getTableActColumn<IRuleInfo, TUserTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick?.bind(null, record),
      }),
      undefined,
      { width: 150 },
    ),
  ]
}
