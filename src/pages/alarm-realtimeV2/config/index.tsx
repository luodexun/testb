import { TAlarmHistoryTbActInfo } from "@pages/alarm-history/types"
import { getTableActColumn, tableSortByKey, tableSortByKeyByChina } from "@utils/table-funs.tsx"
import { ColumnsType } from "antd/es/table"
import { Link } from "react-router-dom"

import { ITbColAction } from "@/components/action-buttons/types.ts"
import { clkTableCell, getPageUrl, getStationMainId, setAlarmColor } from "@/pages/alarm-history/methods"
import { AlarmListData } from "./types"
import { SITE_MATRIX } from "@/router/variables"

const TABLE_ACTION = [
  { key: "ensure", label: "确认" },
  { key: "toMonitor", label: "详情" },
]
const TABLE_ACTION1 = [{ key: "ensure", label: "确认" }]

// export const ALARM_HISTORY_COLUMNS: ColumnsType<any> = [
export function ALARM_HISTORY_COLUMNS(
  config: ITbColAction<TAlarmHistoryTbActInfo, AlarmListData>,
  property,
): ColumnsType<AlarmListData> {
  const { onClick } = config
  return [
    {
      dataIndex: "index",
      title: "序号",
      width: 60,
      fixed: "left",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "startTime",
      title: "故障开始时间",
      width: 150,
      fixed: "left",
      sorter: tableSortByKeyByChina("startTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "stationDesc",
      title: "场站",
      width: 100,
      fixed: "left",
      sorter: tableSortByKeyByChina("stationDesc"),
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
      sorter: tableSortByKeyByChina("deviceTypeName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "deviceDesc",
      title: "设备名称",
      width: 100,
      fixed: "left",
      sorter: tableSortByKeyByChina("deviceDesc"),
      render: (text, record) => {
        const url = getPageUrl(record)
        return (
          <Link to={url}>
            <span style={{ color: setAlarmColor(record) }}>{text}</span>
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
      dataIndex: "alarmId",
      title: "故障码",
      width: 100,
      fixed: "left",
      sorter: tableSortByKeyByChina("alarmId"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmDesc",
      width: 400,
      title: "故障描述",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
      sorter: tableSortByKeyByChina("alarmDesc"),
    },
    {
      dataIndex: "alarmLevelName",
      title: "告警等级",
      width: 100,
      sorter: tableSortByKeyByChina("alarmLevelName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "condition",
      title: "故障条件",
      width: 80,
      hidden: property?.condition,
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "countHour",
      title: "6h次数",
      width: 100,
      hidden: property?.countHour,
      sorter: tableSortByKey("countHour"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "countDay",
      title: "24h次数",
      width: 100,
      hidden: property?.countDay,
      sorter: tableSortByKey("countDay"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "confirmFlag",
      title: "确认",
      width: 100,
      hidden: property?.confirmFlag,
      // sorter: tableSortByKeyByChina("confirmFlag"),
      render: (text, record) => (
        <span style={{ color: setAlarmColor(record) }}>{text !== null ? (text ? "已确认" : "未确认") : text}</span>
      ),
    },
    ...getTableActColumn<AlarmListData, TAlarmHistoryTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          ensure: { disabled: record.confirmFlag },
          toMonitor: { disabled: !record.lastStartTime },
        },
      }),
      null,
      { width: 150, fixed: "right" },
    ),
  ]
}

// export const ALARM_HISTORY_DETAIL_COLUMNS: ColumnsType<any> = [
export function ALARM_HISTORY_DETAIL_COLUMNS(
  config: ITbColAction<TAlarmHistoryTbActInfo, AlarmListData>,
  property,
  btn?,
): ColumnsType<AlarmListData> {
  const { onClick } = config
  return [
    {
      title: "序号",
      render: (text, record, index) => <span style={{ color: setAlarmColor(record) }}>{index + 1}</span>,
      width: 70,
      fixed: "left",
    },
    {
      dataIndex: "startTime",
      title: "故障开始时间",
      width: 150,
      hidden: property?.startTime,
      fixed: "left",
      sorter: tableSortByKeyByChina("startTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "stationDesc",
      title: "场站",
      width: 100,
      fixed: "left",
      sorter: tableSortByKeyByChina("stationDesc"),
      render: (text, record) => (
        <Link to={`/site/${getStationMainId(record)}/${record.stationCode}/${SITE_MATRIX}`}>
          <span style={{ color: setAlarmColor(record) }}>{text}</span>,
        </Link>
      ),
    },
    {
      dataIndex: "deviceTypeName",
      title: "设备类型",
      fixed: "left",
      width: 100,
      sorter: tableSortByKeyByChina("deviceTypeName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "deviceDesc",
      title: "设备名称",
      fixed: "left",
      width: 100,
      sorter: tableSortByKeyByChina("deviceDesc"),
      render: (text, record) => {
        const url = getPageUrl(record)
        return (
          <Link to={url}>
            <span style={{ color: setAlarmColor(record) }}>{text}</span>
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
      width: 200,
      title: "型号",
      sorter: tableSortByKeyByChina("deviceModel"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmId",
      width: 100,
      title: "故障码",
      sorter: tableSortByKeyByChina("alarmId"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmDesc",
      width: 400,
      title: "故障描述",
      sorter: tableSortByKeyByChina("alarmDesc"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmLevelName",
      title: "告警等级",
      width: 100,
      sorter: tableSortByKeyByChina("alarmLevelName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "systemName",
      title: "归属系统",
      width: 100,
      hidden: property?.systemName,
      sorter: tableSortByKeyByChina("systemName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "endTime",
      title: "故障结束时间",
      width: 150,
      hidden: property?.endTime,
      sorter: tableSortByKeyByChina("endTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "brakeLevelName",
      title: "停机等级",
      width: 100,
      hidden: property?.brakeLevelName,
      sorter: tableSortByKeyByChina("brakeLevelName"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "resetLevel",
      title: "复位等级",
      width: 100,
      hidden: property?.resetLevel,
      sorter: tableSortByKeyByChina("resetLevel"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "condition",
      title: "故障条件",
      width: 80,
      hidden: property?.condition,
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "countHour",
      title: "6h告警次数",
      width: 100,
      hidden: property?.countHour,
      sorter: tableSortByKeyByChina("countHour"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "countDay",
      title: "24h告警次数",
      width: 100,
      hidden: property?.countDay,
      sorter: tableSortByKeyByChina("countDay"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "resetNum",
      title: "2h可复位次数",
      width: 100,
      hidden: property?.resetNum,
      sorter: tableSortByKeyByChina("resetNum"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmNum",
      title: "2h告警次数",
      width: 100,
      hidden: property?.alarmNum,
      sorter: tableSortByKeyByChina("alarmNum"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "resetNumLeft",
      title: "2h剩余复位次数",
      width: 100,
      hidden: property?.resetNumLeft,
      sorter: tableSortByKeyByChina("resetNumLeft"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    // { dataIndex: "confirmFlag", title: "确认" },
    {
      dataIndex: "confirmBy",
      title: "确认人",
      width: 100,
      hidden: property?.confirmBy,
      sorter: tableSortByKeyByChina("confirmBy"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "confirmTime",
      title: "确认时间",
      width: 100,
      hidden: property?.confirmTime,
      sorter: tableSortByKeyByChina("confirmTime"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "confirmMsg",
      title: "备注",
      width: 100,
      hidden: property?.confirmMsg,
      sorter: tableSortByKeyByChina("confirmMsg"),
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    ...getTableActColumn<AlarmListData, TAlarmHistoryTbActInfo>(
      !btn ? TABLE_ACTION : TABLE_ACTION1,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          ensure: { disabled: record.confirmFlag },
          toMonitor: { disabled: !record.lastStartTime },
        },
      }),
      null,
      { width: 150, fixed: "right" },
    ),
    // { dataIndex: "confirmMsg", title: "备注" },
  ]
}

export const allDeviceTypeSearchList = [
  { dataIndex: "WT", name: "风机", num: 0, code: "WT" },
  { dataIndex: "PVINV", name: "逆变器", num: 0, code: "PVINV" },
  { dataIndex: "ESPCS", name: "变流器", num: 0, code: "ESPCS" },
  { dataIndex: "SYZZZ", name: "升压站", num: 0, code: "SYZZZ" },
  // { dataIndex: "AGVC", name: "AGVC", num: 0, code: "AGVC" },
  // { dataIndex: "DNJL", name: "电计量", num: 0, code: "DNJL" },
]
export const confirmFlagSearchList = [
  { dataIndex: "true", name: "已确认", num: 0, code: "1" },
  { dataIndex: "false", name: "未确认", num: 0, code: "2" },
]
export const alarmLevelIdListSearchList = [
  { dataIndex: "1", name: "故障", num: 0, code: "1" },
  { dataIndex: "2", name: "告警", num: 0, code: "2" },
  { dataIndex: "11", name: "事故", num: 0, code: "11" },
  { dataIndex: "12", name: "异常", num: 0, code: "12" },
  { dataIndex: "13", name: "越限", num: 0, code: "13" },
  { dataIndex: "14", name: "变位", num: 0, code: "14" },
]

export const REAL_CHECKBOX_OPTS = [
  // { label: "设备型号", value: "deviceModel" },
  // { label: "故障码", value: "alarmId" },
  // { label: "故障描述", value: "alarmDesc" },
  // { label: "告警等级", value: "alarmLevelName" },
  { label: "停机等级", value: "brakeLevelName" },
  { label: "复位等级", value: "resetLevel" },
  { label: "归属系统", value: "systemName" },
  { label: "故障条件", value: "condition" },
  { label: "6h告警次数", value: "countHour" },
  { label: "24h告警次数", value: "countDay" },
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
