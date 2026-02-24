/*
 * @Author: chenmeifeng
 * @Date: 2024-08-28 16:40:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 13:56:58
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import CommonTreeSelect from "@/components/common-tree-select"
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import SelectOrdinary from "@/components/select-ordinary"
import StationTreeSelect from "@/components/station-tree-select"
import { TOptions } from "@/types/i-antd"
import { TDeviceType } from "@/types/i-config"

import { IAlarmRuleLs } from "../types/table"

export const DVS_CONTROL_SELECT: TOptions<TDeviceType> = [
  { label: "风机", value: "WT" },
  { label: "光伏", value: "PVINV" },
  { label: "储能", value: "ESPCS" },
  { label: "升压站", value: "SYZZZ" },
]
export const AR_WAI_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "batchDelete", label: "批量删除" },
  { name: "disable", label: "批量禁用" },
  { name: "enable", label: "批量启用" },
  { name: "shutdown", label: "批量关联停机" },
  { name: "export", label: "导出" },
  { name: "toPage", label: "规则配置" },
]
export const ALARM_RULE_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      options: [],
      needId: true,
      disabled: false,
      placeholder: "全部",
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
]
export const ALARM_NEW_RULE_COLUMNS: ColumnsType<IAlarmRuleLs> = [
  {
    dataIndex: "index",
    title: "序号",
    width: 60,
    align: "center",
  },
  {
    dataIndex: "stationName",
    title: "场站",
    // sorter: tableSortByKeyByChina("stationDesc"),
  },
  {
    dataIndex: "deviceName",
    title: "设备",
    // sorter: tableSortByKeyByChina("deviceDesc"),
  },
  {
    dataIndex: "deviceModel",
    title: "型号",
  },
  {
    dataIndex: "alarmDesc",
    title: "告警描述",
    // sorter: tableSortByKeyByChina("alarmId"),
  },
  {
    dataIndex: "ruleDesc",
    title: "告警规则",
    width: 400,
    // sorter: tableSortByKeyByChina("alarmDesc"),
  },
  {
    dataIndex: "systemName",
    title: "归属系统",
    // sorter: tableSortByKeyByChina("systemName"),
  },
  {
    dataIndex: "alarmLevelName",
    title: "告警等级",
    // sorter: tableSortByKeyByChina("alarmLevelName"),
  },
  {
    dataIndex: "calPeriod",
    title: "计算周期(S)",
    // sorter: tableSortByKeyByChina("alarmLevelName"),
  },
  { dataIndex: "enableFlag", title: "是否启用", render: (text, record) => (record.enableFlag === 1 ? "是" : "否") },
  { dataIndex: "actionFlag", title: "关联停机", render: (text, record) => (record.actionFlag === 1 ? "是" : "否") },
]
