/*
 *@Author: chenmeifeng
 *@Date: 2024-03-28 15:13:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-03 16:58:26
 *@Description:
 */
import { DEVICE_INDEX_TYPE_OPTIONS } from "@configs/option-const.tsx"
import { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageStationData } from "@/configs/storage-cfg"
import { day4Y2S } from "@/configs/time-constant"
import { getStorage, parseNum, uDate } from "@/utils/util-funs"

export const stationAllInfo = getStorage(StorageStationData)

export const RP_HN_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const RP_HN_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  // {
  //   type: StationTreeSelect,
  //   name: "stationCodeList",
  //   label: "场站",
  //   props: {
  //     disabled: false,
  //     multiple: true,
  //     placeholder: "全部",
  //     style: { minWidth: "13em" },
  //   },
  // },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    formItemProps: { labelCol: { span: 3 } },
    props: {
      style: { width: "22em" },
      showTime: true,
      disabledDate: (current) => {
        return current && current.isAfter(dayjs(), "day")
      },
    },
  },
]

export const CONTROL_HN_COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  { dataIndex: "name", title: "场站/期次名称", align: "center" },
  { dataIndex: "windSpeed", title: "平均风速(m/s)", align: "center", render: (text) => parseNum(text, 2, null) },
  { dataIndex: "dailyProduction", title: "发电量(kWh)", align: "center", render: (text) => parseNum(text, 0, null) },
  {
    dataIndex: "theoryProduction",
    title: "理论发电量(kWh)",
    align: "center",
    render: (text) => parseNum(text, 0, null),
  },
  {
    dataIndex: "forwardProduction",
    title: "上网电量(kWh)",
    align: "center",
    render: (text) => parseNum(text, 0, null),
  },
  { dataIndex: "backProduction", title: "下网电量(kWh)", align: "center", render: (text) => parseNum(text, 0, null) },
  {
    dataIndex: "forwardActivePower0",
    title: "上网期末表底",
    align: "center",
    render: (text) => parseNum(text, 4, null),
  },
  { dataIndex: "backActivePower0", title: "下网期末表底", align: "center", render: (text) => parseNum(text, 4, null) },
  {
    dataIndex: "forwardActivePower1",
    title: "上网期初表底",
    align: "center",
    render: (text) => parseNum(text, 4, null),
  },
  { dataIndex: "backActivePower1", title: "下网期初表底", align: "center", render: (text) => parseNum(text, 4, null) },
  { dataIndex: "coefficient", title: "倍率", align: "center", render: (text) => parseNum(text, 2, null) },
]
