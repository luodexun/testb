import { getTableActColumn, tableSortByKeyByChina } from "@utils/table-funs.tsx"
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
import { AlarmListData, TAlarmHistoryTbActInfo } from "../types/index"
import { EXPORT_LIST1 } from "@/configs/option-const"

export const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
export const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)
export const stationAllInfo = getStorage(StorageStationData)

export const RP_POWER_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  {
    name: "export",
    label: "导出",
    btnType: "dropdown",
    dropdownProps: { menu: { items: EXPORT_LIST1 }, placement: "bottomLeft" },
  },
  { name: "batchCmomfirm", label: "批量确认" },
  { name: "property", label: "列配置" },
]
export const RP_POWER_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectOrdinary,
    name: "deviceType",
    label: "设备类型",
    props: {
      disabled: false,
      options: [],
      allowClear: false,
      style: { minWidth: "10em" },
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
    name: "brakeLevelId",
    label: "停机等级",
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
  { key: "toMonitor", label: "设备监视" },
]

export function ALARM_HISTORY_COLUMNS(
  config: ITbColAction<TAlarmHistoryTbActInfo, AlarmListData>,
  ptype,
): ColumnsType<AlarmListData> {
  const { onClick } = config
  return [
    {
      dataIndex: "index",
      title: "序号",
      width: 60,
      align: "center",
      fixed: "left",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "startTime",
      title: "故障开始时间",
      width: 130,
      hidden: ptype?.startTime,
      fixed: "left",
      // sorter: tableSortByKeyByChina("startTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "stationDesc",
      title: "场站",
      width: 100,
      fixed: "left",
      // sorter: tableSortByKeyByChina("stationDesc"),
      render: (text, record) => (
        <Link to={`/site/${getStationMainId(record)}/${record.stationCode}/${SITE_MATRIX}`}>
          <span style={{ color: setAlarmColor(record) }}>{text}</span>,
        </Link>
      ),
    },
    {
      dataIndex: "deviceTypeName",
      title: "设备类型",
      width: 100,
      fixed: "left",
      // sorter: tableSortByKeyByChina("deviceTypeName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "deviceDesc",
      title: "设备名称",
      width: 100,
      fixed: "left",
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
      dataIndex: "deviceModel",
      width: 170,
      title: "型号",
      // sorter: tableSortByKeyByChina("deviceModel"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmId",
      title: "故障码",
      width: 100,
      // sorter: tableSortByKeyByChina("alarmId"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmDesc",
      title: "故障描述",
      width: 400,
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "endTime",
      title: "故障结束时间",
      width: 130,
      hidden: ptype?.endTime,
      // sorter: tableSortByKeyByChina("endTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmLevelName",
      title: "告警等级",
      width: 80,
      hidden: ptype?.alarmLevelName,
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "systemName",
      title: "归属系统",
      width: 100,
      hidden: ptype?.systemName,
      // sorter: tableSortByKeyByChina("systemName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "brakeLevelName",
      title: "停机等级",
      width: 80,
      hidden: ptype?.brakeLevelName,
      // sorter: tableSortByKeyByChina("brakeLevelName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "resetLevel",
      title: "复位等级",
      width: 80,
      hidden: ptype?.resetLevel,
      // sorter: tableSortByKeyByChina("resetLevel"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "condition",
      title: "故障条件",
      width: 80,
      hidden: ptype?.condition,
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "resetNum",
      title: "2h可复位次数",
      width: 100,
      hidden: ptype?.resetNum,
      // sorter: tableSortByKeyByChina("resetNum"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmNum",
      title: "2h告警次数",
      width: 100,
      hidden: ptype?.alarmNum,
      // sorter: tableSortByKeyByChina("alarmNum"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "resetNumLeft",
      title: "2h剩余复位次数",
      width: 100,
      hidden: ptype?.resetNumLeft,
      // sorter: tableSortByKeyByChina("resetNumLeft"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "confirmBy",
      title: "确认人",
      width: 100,
      hidden: ptype?.confirmBy,
      // sorter: tableSortByKeyByChina("confirmBy"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "confirmTime",
      title: "确认时间",
      width: 120,
      hidden: ptype?.confirmTime,
      // sorter: tableSortByKeyByChina("confirmTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "confirmMsg",
      title: "备注",
      width: 120,
      hidden: ptype?.confirmMsg,
      // sorter: tableSortByKeyByChina("confirmMsg"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    // { dataIndex: "deviceName", title: "操作人" }, // 没有字段
    ...getTableActColumn<AlarmListData, TAlarmHistoryTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          ensure: {
            disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15,
          },
        },
      }),
      null,
      { width: 150, fixed: "right" },
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
  PVTRA: "光伏箱变",
  PVDCB: "直流汇流箱",
  PVTRS: "光伏跟踪系统",
  PVCOL: "光伏数采",
}

export const CHECKBOX_OPTS = [
  // { label: "设备型号", value: "model" },
  // {name: "重要等级", key: ""},
  { label: "停机等级", value: "brakeLevelName" },
  { label: "复位等级", value: "resetLevel" },
  // { label: "型号", value: "deviceModel" },
  { label: "归属系统", value: "systemName" },
  { label: "故障条件", value: "condition" },
  { label: "2h可复位次数", value: "resetNum" },
  { label: "2h告警次数", value: "alarmNum" },
  { label: "2h剩余复位次数", value: "resetNumLeft" },
  { label: "开始时间", value: "startTime" },
  { label: "结束时间", value: "endTime" },
  { label: "是否确认", value: "confirmFlag" },
  { label: "确认人", value: "confirmBy" },
  { label: "确认时间", value: "confirmTime" },
  { label: "确认备注", value: "confirmMsg" },
]
