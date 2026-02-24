import { getTableActColumn, tableSortByKey, tableSortByKeyByChina } from "@utils/table-funs.tsx"
import { ColumnsType } from "antd/es/table"
import { Link } from "react-router-dom"

import { ITbColAction } from "@/components/action-buttons/types.ts"
import CommonTreeSelect from "@/components/common-tree-select"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectOrdinary from "@/components/select-ordinary"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageStationData, StorageStnDvsType, StorageUserInfo } from "@/configs/storage-cfg"
import { day4Y2S } from "@/configs/time-constant"
import { SITE_MATRIX } from "@/router/variables"
import { ILoginInfo } from "@/types/i-auth"
import { IStnDvsType4LocalStorage } from "@/types/i-device.ts"
import { getStorage, uDate } from "@/utils/util-funs"

import { clkTableCell, getPageUrl, getStationMainId, setAlarmColor } from "../methods"
import { AlarmListData, TRptAlarmTbActInfo } from "../types/index"

export const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
export const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)
export const stationAllInfo = getStorage(StorageStationData)

export const RP_POWER_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "export", label: "导出" },
  { name: "batchCmomfirm", label: "批量确认" },
]
export const RP_POWER_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      options: [],
      needFirst: true,
      needId: true,
      disabled: false,
      style: { width: "10em" },
    },
  },
  {
    type: SelectOrdinary,
    name: "deviceType",
    label: "设备类型",
    props: {
      disabled: false,
      options: [],
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: CommonTreeSelect,
    name: "deviceIds",
    label: "设备",
    props: {
      // needFirst: true,
      disabled: false,
      placeholder: "全部",
      style: { minWidth: "10em" },
      multiple: true,
      treeCheckable: true,
    },
  },
  {
    type: SelectWithAll,
    name: "systemId",
    label: "归属系统",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [],
      mode: "multiple",
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "alarmLevelId",
    label: "告警等级",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [],
      mode: "multiple",
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "confirmFlag",
    label: "确认",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      mode: "multiple",
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [
        { value: "1", label: "已确认" },
        { value: "2", label: "未确认" },
      ],
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    // formItemProps: { labelCol: { span: 8 } },
    props: { showTime: true, style: { width: "28em" } },
  },
]

const TABLE_ACTION = [
  { key: "ensure", label: "确认" },
  // { key: "toMonitor", label: "设备监视" },
]

export function ALARM_HISTORY_COLUMNS(
  config: ITbColAction<TRptAlarmTbActInfo, AlarmListData>,
): ColumnsType<AlarmListData> {
  const { onClick } = config
  return [
    {
      dataIndex: "index",
      title: "序号",
      width: 60,
      align: "center",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "stationName",
      title: "场站",
      // sorter: tableSortByKeyByChina("stationDesc"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "deviceTypeName",
      title: "设备类型",
      // sorter: tableSortByKeyByChina("deviceTypeName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "deviceName",
      title: "设备名称",
      // sorter: tableSortByKeyByChina("deviceDesc"),
      render: (text, record) => {
        const url = getPageUrl(record)
        return (
          <Link to={url}>
            <span style={{ color: setAlarmColor(record) }}>{text}</span>,
          </Link>
        )
      },
      onCell: (record) => {
        return {
          onClick: () => {
            clkTableCell(record)
          },
        }
      },
    },
    {
      dataIndex: "ruleDesc",
      title: "告警规则",
      // sorter: tableSortByKeyByChina("alarmId"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmDesc",
      title: "故障描述",
      width: 400,
      // sorter: tableSortByKeyByChina("alarmDesc"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "systemName",
      title: "归属系统",
      // sorter: tableSortByKeyByChina("systemName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmLevelName",
      title: "告警等级",
      // sorter: tableSortByKeyByChina("alarmLevelName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "startTime",
      title: "故障开始时间",
      sorter: tableSortByKey("startTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{uDate(text, day4Y2S)}</span>,
    },
    {
      dataIndex: "endTime",
      title: "故障结束时间",
      sorter: tableSortByKey("endTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{uDate(text, day4Y2S)}</span>,
    },

    {
      dataIndex: "confirmBy",
      title: "确认人",
      // sorter: tableSortByKeyByChina("confirmBy"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "confirmTime",
      title: "确认时间",
      sorter: tableSortByKey("confirmTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{uDate(text, day4Y2S)}</span>,
    },
    {
      dataIndex: "confirmMsg",
      title: "备注",
      // sorter: tableSortByKeyByChina("confirmMsg"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    // { dataIndex: "deviceName", title: "操作人" }, // 没有字段
    ...getTableActColumn<AlarmListData, TRptAlarmTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          ensure: {
            disabled: record.confirmFlag,
          },
        },
      }),
      null,
      { width: 150 },
    ),
  ]
}

// export function ComfirmBtn(params:type) {
//   return <Button type="link">text</Button>
// }

export const CONTROL_DEFAULT_TYPE = {
  WT: "风机",
  PVINV: "光伏逆变器",
  ESPCS: "储能变流器系统",
  SYZZZ: "升压站",
}
