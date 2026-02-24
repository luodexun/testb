/*
 * @Author: chenmeifeng
 * @Date: 2024-03-06 15:50:52
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-07 15:30:26
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import CommonTreeSelect from "@/components/common-tree-select"
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { day4Y2S } from "@/configs/time-constant"
import { uDate } from "@/utils/util-funs"

import { TCancelShieldData } from "../types/cancel-form"

export const CANCEL_SHIELD_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN]

export const CANCEL_SHIELD_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      // needFirst: true,
      style: { minWidth: "10em" },
      placeholder: "全部",
      needId: true,
    },
  },
  {
    type: SelectWithAll,
    name: "modelId",
    label: "型号",
    props: {
      placeholder: "全部",
      style: { minWidth: "13em" },
    },
  },
  {
    type: CommonTreeSelect,
    name: "deviceId",
    label: "设备",
    props: {
      placeholder: "全部",
      style: { minWidth: "13em" },
    },
  },
]
export const CANCEL_SHIELD_COLUMNS: ColumnsType<TCancelShieldData> = [
  { dataIndex: "index", title: "序号", align: "center", width: 50 },
  { dataIndex: "stationDesc", title: "场站" },
  { dataIndex: "deviceDesc", title: "设备" },
  { dataIndex: "alarmId", title: "故障码" },
  { dataIndex: "alarmDesc", title: "故障描述", width: 400 },
  { dataIndex: "createBy", title: "屏蔽人" },
  { dataIndex: "createTime", title: "屏蔽时间", render: (text) => <span>{uDate(text, day4Y2S, day4Y2S)}</span> },
]
