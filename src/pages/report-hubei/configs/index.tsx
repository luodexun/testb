/*
 *@Author: chenmeifeng
 *@Date: 2024-03-28 15:13:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-09 14:16:17
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
  { dataIndex: "name", title: "名称", align: "center" },
  { dataIndex: "firstData", title: "首值", align: "center", render: (text) => parseNum(text, 2, null) },
  { dataIndex: "lastData", title: "末值", align: "center", render: (text) => parseNum(text, 2, null) },
  {
    dataIndex: "avgData",
    title: "平均值",
    align: "center",
    render: (text) => parseNum(text, 2, null),
  },
  { dataIndex: "startFormatTime", title: "开始时间", align: "center" },
  { dataIndex: "endFormatTime", title: "结束时间", align: "center" },
]
