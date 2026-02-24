
import { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"
import { EXECUTE_LOG, TIME_STATE } from "@configs/dvs-control.ts"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import CustonInputNumber from "@/components/custom-input-number"

import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageStationData } from "@/configs/storage-cfg"
import { day4Y2S } from "@/configs/time-constant"
import { getStorage, parseNum, uDate } from "@/utils/util-funs"
import CommonTreeSelect from "@/components/common-tree-select"
import SelectDeviceState from "@/components/select-device-sate"
import SelectOrdinary from "@/components/select-ordinary"
export const RP_DEVICE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const CONTROL_BATCH_COLUMNS_MAP: any = {
  [TIME_STATE]: [],//todo:待处理
  [EXECUTE_LOG]: [],//todo:待处理
}
export const RP_DEVICE_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectDeviceState,
    name: "deviceState",
    label: "设备状态",
    props: {
      needFirst: true,
      disabled: false,
      placeholder: "",
      style: { minWidth: "10em",whiteSpace: "nowrap" },
      multiple: true,
      treeCheckable: true,
      maxTagCount: 1,
      maxTagPlaceholder: (omittedValues) => `+${omittedValues.length}...`,
      options: [],
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    // formItemProps: { labelCol: { span: 3 } },
    props: {
      showTime: true,
      style: { width: "22em" },
      // disabledDate: (current) => {
      //   return current && current.isAfter(dayjs(), "day")
      // },
    },
  },
  {
    type: CustonInputNumber,
    name: "duration",
    label: "状态时长",
    props: {
      addonBefore:">=",
      placeholder: "",
      style: { width: "10em" },
      suffix: "h",
    },
  },
  {
    type: CustonInputNumber,
    name: "totalLossProduction",
    label: "损失电量",
    props: {
      // allowClear: false,
      addonBefore:">=",
      placeholder: "",
      style: { width: "10em" },
      preffix: "",
      suffix: "KWh",
    },
  },
  {
    type: CommonTreeSelect,
    name: "isGroupByStationOrDeviceCode",
    label: "是否聚合",
    props: {
      disabled: false,
      options: [
        // { label: "不聚合", value: '0' },
        { label: "按设备相同大状态", value: '1' },
        { label: "按场站相同大状态", value: '2' },
        { label: "按设备相同小状态", value: '3' },
        { label: "按场站相同小状态", value: '4' },
      ],
      placeholder: "",
      style: { minWidth: "11em", },
    },
  },
  {
    type: SelectOrdinary,
    name: "deviceType",
    label: "",
    props: {
      disabled: false,
      options: [],
      placeholder: "",
      style: { minWidth: "10em", display: "none" },
    },
  },
]
export const REPORT_DEVICE_COLUMNS1: ColumnsType<any> = [
  { title: "序号", align: "center", width: 60, render: (text, record, index) => index + 1 },
  { dataIndex: "stationName", title: "场站", align: "center" },
  { dataIndex: "deviceName", title: "设备", align: "center" },
  { dataIndex: "mainStateName", title: "大状态", align: "center" },
  { dataIndex: "subStateName", title: "小状态", align: "center" },
  { dataIndex: "startTime", title: "开始时间", align: "center" , width: 180},
  { dataIndex: "endTime", title: "结束时间", align: "center" , width: 180},
  { dataIndex: "duration", title: "持续时间(h)", align: "center" , render: (text) => parseNum(text, 3)},
  { dataIndex: "totalLossProduction", title: "损失电量(kWh)", align: "center", render: (text) => parseNum(text, 2) },
  { dataIndex: "activePower", title: "平均功率(kW)", align: "center", render: (text) => parseNum(text, 2) },
]
export const REPORT_DEVICE_COLUMNS2: ColumnsType<any> = [
  { title: "序号", align: "center", width: 60, render: (text, record, index) => index + 1 },
  { dataIndex: "stationName", title: "场站", align: "center" },
  { dataIndex: "deviceName", title: "设备", align: "center" },
  { dataIndex: "mainStateName", title: "大状态", align: "center" },
  { dataIndex: "subStateName", title: "小状态", align: "center" },
  { dataIndex: "startTime", title: "开始时间", align: "center" , width: 180},
  { dataIndex: "endTime", title: "结束时间", align: "center" , width: 180},
  { dataIndex: "duration", title: "持续时间(h)", align: "center", render: (text) => parseNum(text, 3) },
  { dataIndex: "totalLossProduction", title: "损失电量(kWh)", align: "center", render: (text) => parseNum(text, 2)  },
  { dataIndex: "activePower", title: "平均功率(kW)", align: "center", render: (text) => parseNum(text, 2)  },
]
export const REPORT_DEVICE_COLUMNS3: ColumnsType<any> = [
  { title: "序号", align: "center", width: 60, render: (text, record, index) => index + 1 },
  { dataIndex: "stationName", title: "场站", align: "center" },
  { dataIndex: "deviceName", title: "设备", align: "center" },
  { dataIndex: "mainStateName", title: "大状态", align: "center" },
  { dataIndex: "subStateName", title: "小状态", align: "center" },
  { dataIndex: "startTime", title: "开始时间", align: "center" , width: 180},
  { dataIndex: "endTime", title: "结束时间", align: "center" , width: 180},
  { dataIndex: "duration", title: "持续时间(h)", align: "center", render: (text) => parseNum(text, 3)  },
  { dataIndex: "totalLossProduction", title: "损失电量(kWh)", align: "center", render: (text) => parseNum(text, 2)  },
  { dataIndex: "activePower", title: "平均功率(kW)", align: "center", render: (text) => parseNum(text, 2)  },
  { dataIndex: "windSpeedAvg", title: "平均风速(m/s)", align: "center", render: (text) => parseNum(text, 2)  },
]
export const CONTROL_DEFAULT_TYPE = {
  WT: "风机",
  PVINV: "光伏逆变器",
  ESPCS: "储能变流器系统",
  // SYZZZ: "升压站",
}

export const CONTROL_OPTION = [
  { label: "风机", value: "WT" },
  { label: "光伏逆变器", value: "PVINV" },
  { label: "储能变流器系统", value: "ESPCS" },
]
export const TAB_LIST = ["列表", "数据"]


