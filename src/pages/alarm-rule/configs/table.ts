/*
 * @Author: chenmeifeng
 * @Date: 2024-08-29 10:43:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-14 16:09:10
 * @Description: 表格配置文件
 */
import { ColumnsType } from "antd/es/table"

import { ITbColAction } from "@/components/action-buttons/types"
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import { getTableActColumn } from "@/utils/table-funs"

import { IAlarmRuleLs, TAlarmRuleTbActInfo } from "../types/table"
const TABLE_ACTION = [
  { key: "edit", label: "编辑" },
  { key: "delete", label: "删除" },
]
export const BATCH_CONTROL_KEYS = ["batchDelete", "disable", "enable", "shutdown"]
export const AR_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "add", label: "新增" },
  { name: "batchDelete", label: "批量删除" },
  { name: "disable", label: "批量禁用" },
  { name: "enable", label: "批量启用" },
  { name: "shutdown", label: "批量关联停机" },
  { name: "export", label: "导出" },
]
export function ALARM_RULE_COLUMNS(config: ITbColAction<TAlarmRuleTbActInfo, IAlarmRuleLs>): ColumnsType<IAlarmRuleLs> {
  const { onClick } = config
  return [
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
    { dataIndex: "calPeriod", title: "计算周期(S)" },
    { dataIndex: "enableFlag", title: "是否启用", render: (text, record) => (record.enableFlag === 1 ? "是" : "否") },
    { dataIndex: "actionFlag", title: "关联停机", render: (text, record) => (record.actionFlag === 1 ? "是" : "否") },
    // { dataIndex: "deviceName", title: "操作人" }, // 没有字段
    ...getTableActColumn<IAlarmRuleLs, TAlarmRuleTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          edit: {
            // disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15,
          },
        },
      }),
      null,
      { width: 150 },
    ),
  ]
}
