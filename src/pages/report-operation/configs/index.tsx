/*
 *@Author: chenmeifeng
 *@Date: 2024-03-28 15:13:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-26 15:26:04
 *@Description:
 */
import { DEVICE_INDEX_TYPE_OPTIONS } from "@configs/option-const.tsx"
import dayjs from "dayjs"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageStationData } from "@/configs/storage-cfg"
import { getStorage, judgeNull } from "@/utils/util-funs"

export const stationAllInfo = getStorage(StorageStationData)

export const RP_OPERATION_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const RP_OPERATION_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationCodeList",
    label: "场站",
    props: {
      disabled: false,
      multiple: true,
      placeholder: "全部",
      style: { minWidth: "13em" },
    },
  },
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "指标类型",
    props: {
      needFirst: true,
      disabled: false,
      options: DEVICE_INDEX_TYPE_OPTIONS,
      allowClear: false,
      style: { minWidth: "10em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    formItemProps: { labelCol: { span: 3 } },
    props: {
      style: { width: "22em" },
      disabledDate: (current) => {
        return current && current.isAfter(dayjs(), "day")
      },
    },
  },
]
export const CONTROL_OPERATION_COLUMNS = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  { dataIndex: "recordTime", title: "日期", align: "center", unShow: "AGVC" },
  { dataIndex: "time", title: "日期", align: "center", unShow: "GLYC" },
  { dataIndex: "stationName", title: "场站", align: "center" },
  { dataIndex: "deviceName", title: "设备", align: "center", unShow: "GLYC" },
  { dataIndex: "ruleName", title: "规则名称", align: "center", unShow: "AGVC" },
  {
    dataIndex: "ultraShortAccuracy",
    title: "超短期准确率",
    align: "center",
    unShow: "AGVC",
    render: (_, record) => getActualVal(record["ultraShortAccuracy"]),
  },
  {
    dataIndex: "ultraShortPassRate",
    title: "超短期合格率",
    align: "center",
    unShow: "AGVC",
    render: (_, record) => getActualVal(record["ultraShortPassRate"]),
  },
  {
    dataIndex: "shortAccuracy",
    title: "短期准确率",
    align: "center",
    unShow: "AGVC",
    render: (_, record) => getActualVal(record["shortAccuracy"]),
  },
  {
    dataIndex: "shortPassRate",
    title: "短期合格率",
    align: "center",
    unShow: "AGVC",
    render: (_, record) => getActualVal(record["shortPassRate"]),
  },
  {
    dataIndex: "middleAccuracy",
    title: "中期准确率",
    align: "center",
    unShow: "AGVC",
    render: (_, record) => getActualVal(record["middleAccuracy"]),
  },
  {
    dataIndex: "middlePassRate",
    title: "中期合格率",
    align: "center",
    unShow: "AGVC",
    render: (_, record) => getActualVal(record["middlePassRate"]),
  },
  {
    dataIndex: "agcinputRatio",
    title: "AGC投运率",
    unShow: "GLYC",
    align: "center",
    // render: (text) => judgeNull(text, 0.01, 2, "-"),
    render: (text) => {
      const formattedValue = judgeNull(text, 0.01, 2, "-");
      if (formattedValue !== "-" && Number(formattedValue) < 99) {
        return <span style={{ color: "red" }}>{formattedValue}</span>;
      }
      return formattedValue;
    },
  },
  {
    dataIndex: "agcadjustPassrate",
    title: "AGC调节合格率",
    unShow: "GLYC",
    align: "center",
    // render: (text) => judgeNull(text, 0.01, 2, "-"),
    render: (text) => {
      const formattedValue = judgeNull(text, 0.01, 2, "-");
      if (formattedValue !== "-" && Number(formattedValue) < 99) {
        return <span style={{ color: "red" }}>{formattedValue}</span>;
      }
      return formattedValue;
    },
  },
  {
    dataIndex: "avcinputRatio",
    title: "AVC投运率",
    unShow: "GLYC",
    align: "center",
    // render: (text) => judgeNull(text, 0.01, 2, "-"),
    render: (text) => {
      const formattedValue = judgeNull(text, 0.01, 2, "-");
      if (formattedValue !== "-" && Number(formattedValue) < 99) {
        return <span style={{ color: "red" }}>{formattedValue}</span>;
      }
      return formattedValue;
    },
  },
  {
    dataIndex: "avcadjustPassrate",
    title: "AVC调节合格率",
    unShow: "GLYC",
    align: "center",
    // render: (text) => judgeNull(text, 0.01, 2, "-"),
    render: (text) => {
      const formattedValue = judgeNull(text, 0.01, 2, "-");
      if (formattedValue !== "-" && Number(formattedValue) < 99) {
        return <span style={{ color: "red" }}>{formattedValue}</span>;
      }
      return formattedValue;
    },
  },
  {
    dataIndex: "powerChangePassrate",
    title: "有功功率变化合格率",
    unShow: "GLYC",
    align: "center",
    // render: (text) => judgeNull(text, 0.01, 2, "-"),
    render: (text) => {
      const formattedValue = judgeNull(text, 0.01, 2, "-");
      if (formattedValue !== "-" && Number(formattedValue) < 99) {
        return <span style={{ color: "red" }}>{formattedValue}</span>;
      }
      return formattedValue;
    },
  },
]

export const getActualVal = (info) => {
  if (info) {
    const { value, threshold } = info
    if (value < threshold) {
      return <span style={{ color: "red" }}>{value}</span>
    }
    return value
  }
  return null
}
