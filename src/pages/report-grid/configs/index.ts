/*
 *@Author: chenmeifeng
 *@Date: 2024-03-27 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-05 11:13:27
 *@Description:
 */

import { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageStationData } from "@/configs/storage-cfg"
import { getStorage, parseNum, uDate } from "@/utils/util-funs"

export const stationAllInfo = getStorage(StorageStationData)

export const RP_GRID_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const RP_GRID_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
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
export const CONTROL_GRID_NEW_COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  {
    dataIndex: "stationName",
    title: "场站",
    align: "center",
  },
  // { dataIndex: "time", title: "日期", align: "center", render: (text) => uDate(text, "YYYY-MM-DD") },
  {
    dataIndex: "forwardActivePower1",
    title: "期初正向有功",
    align: "center",
    render: (text, record) => parseNum(record.forwardActivePower1, 4, null),
  },
  {
    dataIndex: "forwardActivePower0",
    title: "期末正向有功",
    align: "center",
    render: (text, record) => parseNum(record.forwardActivePower0, 4, null),
  },
  {
    dataIndex: "backActivePower1",
    title: "期初反向有功",
    align: "center",
    render: (text, record) => parseNum(record.backActivePower1, 4, null),
  },
  {
    dataIndex: "backActivePower0",
    title: "期末反向有功",
    align: "center",
    render: (text, record) => parseNum(record.backActivePower0, 4, null),
  },
  { dataIndex: "coefficient", title: "倍率", align: "center" },
  {
    dataIndex: "forwardProduction",
    title: "上网电量(kWh)",
    align: "center",
    render: (text, record) => parseNum(record.forwardProduction, 4, null),
  },
  {
    dataIndex: "backProduction",
    title: "下网电量(kWh)",
    align: "center",
    render: (text, record) => parseNum(record.backProduction, 4, null),
  },
  // 江苏个性化
  // {
  //   dataIndex: "verifyForwardProduction",
  //   title: "线路上网(kWh)",
  //   align: "center",
  //   render: (text, record) => parseNum(record.verifyForwardProduction, 4, null),
  // },
  // {
  //   dataIndex: "verifyBackProduction",
  //   title: "线路下网(kWh)",
  //   align: "center",
  //   render: (text, record) => parseNum(record.verifyBackProduction, 4, null),
  // },
]

export const CONTROL_GRID_COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  {
    dataIndex: "stationCode",
    title: "场站",
    align: "center",
    render: (text, record) => stationAllInfo.stationMap[record.stationCode]?.shortName,
  },
  { dataIndex: "time", title: "日期", align: "center", render: (text) => uDate(text, "YYYY-MM-DD") },
  {
    dataIndex: "forwardActivePower0",
    title: "D-1日正向有功",
    align: "center",
    render: (text, record) => Number(record.forwardActivePower1).toFixed(4),
  },
  {
    dataIndex: "forwardActivePower1",
    title: "D日正向有功",
    align: "center",
    render: (text, record) => Number(record.forwardActivePower0).toFixed(4),
  },
  {
    dataIndex: "backActivePower0",
    title: "D-1日反向有功",
    align: "center",
    render: (text, record) => Number(record.backActivePower1).toFixed(4),
  },
  {
    dataIndex: "backActivePower1",
    title: "D日反向有功",
    align: "center",
    render: (text, record) => Number(record.backActivePower0).toFixed(4),
  },
  { dataIndex: "coefficient", title: "倍率", align: "center" },
  {
    dataIndex: "forwardProduction",
    title: "上网电量",
    align: "center",
    render: (text, record) => Number(record.forwardProduction).toFixed(4),
  },
  {
    dataIndex: "backProduction",
    title: "下网电量",
    align: "center",
    render: (text, record) => Number(record.backProduction).toFixed(4),
  },
]
