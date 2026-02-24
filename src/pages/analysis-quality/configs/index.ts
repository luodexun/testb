import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { day4Y2S, dayY2D } from "@configs/time-constant.ts"
import { parseNum, uDate } from "@utils/util-funs"
import { ColumnsType } from "antd/es/table"

import DATA_INTERGRITY from "@/assets/analysis/dataIntegrity.png"
import RECEIPTS from "@/assets/analysis/receipts.png"
import RECEIVABLE from "@/assets/analysis/receivable.png"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"

export const FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]
export const AQTAB_LIST = ["曲线", "列表"]
export const CONTROL_DEFAULT_TYPE = {
  WT: "风机",
  PVINV: "光伏逆变器",
  ESPCS: "储能变流器系统",
  // SYZZZ: "升压站",
}
export const FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      disabled: false,
      needFirst: true,
      allowClear: false,
      style: { minWidth: "13em" },
      options: [],
    },
  },
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "设备类型",
    props: {
      disabled: false,
      needFirst: true,
      allowClear: false,
      style: { minWidth: "13em" },
      options: [],
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    props: {
      presets: true,
      disabled: false,
      allowClear: false,
      picker: "date",
      format: dayY2D,
      style: { width: "30em" },
    },
  },
]

export const CARD_INFO: IDvsRunStateInfo[] = [
  {
    title: "实收数据条数",
    field: "receivedDataCount",
    value: 0,
    icon: RECEIPTS,
  },
  {
    title: "应收数据条数",
    field: "expectedDataCount",
    value: 0,
    icon: RECEIVABLE,
  },
  {
    title: "数据完整度%",
    field: "rate",
    value: 0,
    icon: DATA_INTERGRITY,
  },
]

export const COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (_v, _r, index) => index + 1 },
  {
    dataIndex: "stationName",
    title: "场站",
    align: "center",
  },
  {
    dataIndex: "Time",
    title: "时间",
    align: "center",
    render: (text) => {
      return uDate(text, day4Y2S)
    },
  },
  {
    dataIndex: "receivedDataCount",
    title: "实收数据条数",
    align: "center",
    render: (text) => parseNum(text),
  },
  {
    dataIndex: "expectedDataCount",
    title: "应收数据条数",
    align: "center",
    render: (text) => parseNum(text),
  },
  {
    dataIndex: "Time",
    title: "数据完整率%",
    align: "center",
    render: (_, record) => {
      return parseNum((record.receivedDataCount / record.expectedDataCount) * 100) || null
    },
  },
]
