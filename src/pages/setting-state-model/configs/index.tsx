/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:47:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-26 10:58:43
 * @Description:
 */
import { STATION_DATA_MAP } from "@store/atom-station.ts"
import { ColumnsType } from "antd/es/table"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import SelectWithAll from "@/components/select-with-all"

import { IModelListData } from "../types/index"

export const ST_MANAGE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN]

const deviceTypeList = [
  { label: "风机", value: "WT" },
  { label: "光伏逆变器", value: "PVINV" },
  { label: "储能变流器", value: "ESPCS" },
  { label: "升压站", value: "SYZZZ" },
]
export const ST_MANAGE_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "设备类型",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      options: deviceTypeList,
      disabled: false,
    },
  },
]

export const DEVICE_ATT_COLUMNS: ColumnsType<IModelListData> = [
  { dataIndex: "row_idx", title: "序号", width: 60 },
  {
    dataIndex: "deviceType",
    title: "设备类型",
    render: (text) => deviceTypeList.find((i) => i.value === text)?.label || text,
  },
  { dataIndex: "state", title: "标准状态编码" },
  { dataIndex: "stateDesc", title: "标准状态描述" },
  { dataIndex: "color", title: "标准状态颜色", render: (text) => <span style={{ color: text }}>{text}</span> },
  { dataIndex: "stateType", title: "状态类型" },
]
