import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { StorageStationData } from "@configs/storage-cfg"
import { UNIT } from "@configs/text-constant.ts"
import { day4Y2S } from "@configs/time-constant.ts"
import { getStorage, judgeNull } from "@utils/util-funs"
import { evoluateNum, numberVal, uDate } from "@utils/util-funs.tsx"
import { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import CustonInputNumber from "@/components/custom-input-number"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"

import { IRpPowerData } from "../types"
export const START_TIME = dayjs(new Date())
export const END_TIME = dayjs(new Date()).add(7, "day")
export const TAB_LIST = ["曲线", "列表"]
export const { stationOptions } = getStorage(StorageStationData) || {}
export const RP_POWER_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const TREND_PARAM_CM: IDvsRunStateInfo<keyof IRpPowerData, string>[] = [
  // { title: "风速", field: "windSpeed", unit: UNIT.WIND },
  // { title: "有功功率", field: "activePower", unit: UNIT.POWER },
  // { title: "可用功率", field: "availablePower", unit: UNIT.POWER },
  // { title: "线路总功率", field: "totalLinePower", unit: UNIT.POWER },
  // { title: "出线总功率", field: "outLinePower", unit: UNIT.POWER },
  // { title: "无功功率", field: "reactivePower", unit: UNIT.REACTIVE_M },
  // { title: "理论功率", field: "theoryPower", unit: UNIT.POWER },
  { title: "AGVC有功功率", field: "agvcPower", unit: UNIT.POWER },
  { title: "电气出线功率", field: "syzzzPower", unit: UNIT.POWER },
]

export const RP_POWER_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      needFirst: true,
      allowClear: false,
      placeholder: "全部",
      style: { minWidth: "13em" },
    },
  },
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "预测类型",
    props: {
      needFirst: true,
      allowClear: false,
      options: [
        {
          label: "短期",
          value: "DQ",
        },
        {
          label: "超短期",
          value: "CDQ",
        },
      ],
      placeholder: "请选择预测类型",
      style: { minWidth: "10em" },
    },
  },
  {
    type: CustonInputNumber,
    name: "preQrts",
    label: "预报点",
    props: {
      allowClear: false,
      placeholder: "",
      style: { minWidth: "8em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    props: { style: { width: "28em" } },
  },
]

export const COLUMNS: ColumnsType<any> = [
  { dataIndex: "index", title: "序号", align: "center", width: 100 },
  {
    dataIndex: "forecastTime",
    title: "时间",
    align: "center",
    // render: (text) => {
    //   return uDate(text, day4Y2S)
    // },
  },
  // {
  //   dataIndex: "totalLinePower",
  //   title: `线路总功率${UNIT.POWER}）`,
  //   align: "center",
  //   render: (text) => {
  //     return evoluateNum(numberVal(text ?? null))
  //   },
  // },
  // {
  //   dataIndex: "outLinePower",
  //   title: `出线总功率${UNIT.POWER}）`,
  //   align: "center",
  //   render: (text) => evoluateNum(numberVal(text ?? null)),
  // },
  // {
  //   dataIndex: "windSpeed",
  //   title: `风速（${UNIT.WIND}）`,
  //   align: "center",
  //   render: (text) => evoluateNum(numberVal(text ?? null)),
  // },
  // {
  //   dataIndex: "activePower",
  //   title: `有功功率${UNIT.POWER}）`,
  //   align: "center",
  //   render: (text) => evoluateNum(numberVal(text ?? null)),
  // },
  // {
  //   dataIndex: "reactivePower",
  //   title: `无功功率（${UNIT.REACTIVE}）`,
  //   align: "center",
  //   render: (text) => evoluateNum(numberVal(text ?? null)),
  // },
  // {
  //   dataIndex: "theoryPower",
  //   title: `理论功率（${UNIT.POWER}）`,
  //   align: "center",
  //   render: (text) => evoluateNum(numberVal(text ?? null)),
  // },
  // {
  //   dataIndex: "availablePower",
  //   title: `可用功率（${UNIT.POWER}）`,
  //   align: "center",
  //   render: (text) => evoluateNum(numberVal(text ?? null)),
  // },
  {
    dataIndex: "agvcPower",
    title: `AGVC有功功率(${UNIT.POWER})`,
    align: "center",
    render: (text) => text,
  },
  {
    dataIndex: "syzzzPower",
    title: `电气出线功率(${UNIT.POWER})`,
    align: "center",
    render: (text) => text,
  },
]
