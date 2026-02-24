/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 15:14:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-22 15:50:53
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import StationTreeSelect from "@/components/station-tree-select"

import { IStationIndexInfo } from "../types"

export const ST_STATION_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "save", label: "编辑" }]

export const ST_STATION_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      options: [],
      needFirst: false,
      disabled: false,
      placeholder: "全部",
    },
  },
]

export const ST_STATION_SYS_COLUMNS: ColumnsType<IStationIndexInfo> = [
  { dataIndex: "row_idx", title: "序号", width: 60 },
  { dataIndex: "maintenanceComShortName", title: "上级公司" },
  // { dataIndex: "projectComShortName", title: "项目公司" },
  { dataIndex: "fullName", title: "场站全称" },
  { dataIndex: "shortName", title: "场站简称" },
]
