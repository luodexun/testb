/*
 * @Author: chenmeifeng
 * @Date: 2025-09-10 14:59:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-07 10:08:16
 * @Description:
 */
import { MAIN_DVS_TYPE, PERIOD_OPTIONS } from "@configs/option-const.tsx"
import { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { parseNum } from "@/utils/util-funs"

import ComparePopower from "../components/cellPopover"
import { getTypeColunms, tableSortByKey } from "../methods"
import { IStationMap } from "../types"
export const START_TIME = dayjs(new Date()).subtract(1, "day").startOf("day")
export const TAB_LIST = ["列表", "曲线", "数据"]
export const END_TIME = dayjs(new Date()).subtract(1, "day").endOf("day")
export const RP_POWER_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "configure", label: "配置列" }] //, { name: "export", label: "导出" }

export const WT_COLUMNS: ColumnsType<any> = [
  {
    dataIndex: "totalDeviceCount",
    title: "装机台数",
    sorter: tableSortByKey("totalDeviceCount"),
    align: "center",
    fixed: "left",
    width: 100,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalDeviceCount" />,
  },
  {
    dataIndex: "totalCapacity",
    title: "装机容量（kW）",
    sorter: tableSortByKey("totalCapacity"),
    align: "center",
    fixed: "left",
    width: 120,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalCapacity" />,
  },
  {
    dataIndex: "windSpeed",
    title: "平均风速（m/s）",
    sorter: tableSortByKey("windSpeed"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="windSpeed" />,
  },
  {
    dataIndex: "activePower",
    title: "平均有功功率（kW）",
    sorter: tableSortByKey("activePower"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="activePower" />,
  },
  // {
  //   dataIndex: "activePower1",
  //   title: "平均环境温度",
  //   sorter: tableSortByKey("activePower1"),
  //   align: "center",
  //   width: 170,
  // },
  {
    dataIndex: "dailyProduction",
    title: "实际发电量（kWh）",
    sorter: tableSortByKey("dailyProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="dailyProduction" />,
  },
  {
    dataIndex: "forwardProduction",
    title: "上网电量（kWh）",
    sorter: tableSortByKey("forwardProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="forwardProduction" />,
  },
  {
    dataIndex: "backProduction",
    title: "下网电量（kWh）",
    sorter: tableSortByKey("backProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="backProduction" />,
  },
  {
    dataIndex: "integratedAuxiliaryPowerConsumption",
    title: "综合厂用电量（kWh）",
    sorter: tableSortByKey("integratedAuxiliaryPowerConsumption"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={text} record={record} nameKey="integratedAuxiliaryPowerConsumption" />
    ),
  },
  {
    dataIndex: "normalTime",
    title: "正常发电时长（h）",
    sorter: tableSortByKey("normalTime"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="normalTime" />,
  },
  {
    dataIndex: "rationingTime",
    title: "限功率时长（h）",
    sorter: tableSortByKey("rationingTime"),
    align: "center",
    width: 120,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="rationingTime" />,
  },
  {
    dataIndex: "standbyTime",
    title: "待机时长（h）",
    sorter: tableSortByKey("standbyTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="standbyTime" />,
  },
  {
    dataIndex: "shutdownTime",
    title: "主动停机时长（h）",
    sorter: tableSortByKey("shutdownTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="shutdownTime" />,
  },
  {
    dataIndex: "faultTime",
    title: "故障停机时长（h）",
    sorter: tableSortByKey("faultTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="faultTime" />,
  },
  {
    dataIndex: "noCommunicationTime",
    title: "无通讯时长（h）",
    sorter: tableSortByKey("noCommunicationTime"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="noCommunicationTime" />,
  },
]
export const WT_COLUMNS1: ColumnsType<any> = [
  {
    dataIndex: "totalDeviceCount",
    title: "装机台数",
    sorter: tableSortByKey("totalDeviceCount"),
    align: "center",
    fixed: "left",
    width: 100,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalDeviceCount" />,
  },
  {
    dataIndex: "totalCapacity",
    title: "装机容量（kW）",
    sorter: tableSortByKey("totalCapacity"),
    align: "center",
    fixed: "left",
    width: 120,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalCapacity" />,
  },
  {
    dataIndex: "windSpeed",
    title: "平均风速（m/s）",
    sorter: tableSortByKey("windSpeed"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="windSpeed" />,
  },
  {
    dataIndex: "activePower",
    title: "平均有功功率（kW）",
    sorter: tableSortByKey("activePower"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="activePower" />,
  },
  {
    dataIndex: "ambientTemp",
    title: "平均环境温度（℃）",
    sorter: tableSortByKey("ambientTemp"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="ambientTemp" />,
  },
  {
    dataIndex: "effectiveWindHour",
    title: "有效风时数（h）",
    sorter: tableSortByKey("effectiveWindHour"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="effectiveWindHour" />,
  },
  {
    dataIndex: "dailyProduction",
    title: "实际发电量（kWh）",
    sorter: tableSortByKey("dailyProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="dailyProduction" />,
  },
  {
    dataIndex: "guaranteedTheoryProduction",
    title: "合同理论发电量（kWh）",
    sorter: tableSortByKey("guaranteedTheoryProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="guaranteedTheoryProduction" />,
  },
  {
    dataIndex: "fittedTheoryProduction",
    title: "理论发电量（kWh）",
    sorter: tableSortByKey("fittedTheoryProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="fittedTheoryProduction" />,
  },
  {
    dataIndex: "totalSubLossProduction",
    title: "总损失电量（kWh）",
    sorter: tableSortByKey("totalSubLossProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalSubLossProduction" />,
  },
  {
    dataIndex: "forwardProduction",
    title: "上网电量（kWh）",
    sorter: tableSortByKey("forwardProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="forwardProduction" />,
  },
  {
    dataIndex: "backProduction",
    title: "下网电量（kWh）",
    sorter: tableSortByKey("backProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="backProduction" />,
  },
  {
    dataIndex: "integratedAuxiliaryPowerConsumption",
    title: "综合厂用电量（kWh）",
    sorter: tableSortByKey("integratedAuxiliaryPowerConsumption"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={text} record={record} nameKey="integratedAuxiliaryPowerConsumption" />
    ),
  },
]
export const PVINV_COLUMNS: ColumnsType<any> = [
  {
    dataIndex: "totalDeviceCount",
    title: "装机台数",
    sorter: tableSortByKey("totalDeviceCount"),
    align: "center",
    fixed: "left",
    width: 100,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalDeviceCount" />,
  },
  {
    dataIndex: "totalCapacity",
    title: "装机容量（kW）",
    sorter: tableSortByKey("totalCapacity"),
    align: "center",
    fixed: "left",
    width: 120,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalCapacity" />,
  },
  {
    dataIndex: "activePower",
    title: "平均有功功率（kW）",
    sorter: tableSortByKey("activePower"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="activePower" />,
  },
  {
    dataIndex: "activePower_max",
    title: "最大有功功率（kW）",
    sorter: tableSortByKey("activePower_max"),
    align: "center",
    width: 170,
  },
  {
    dataIndex: "dailyProduction",
    title: "实际发电量（kWh）",
    sorter: tableSortByKey("dailyProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="dailyProduction" />,
  },
  {
    dataIndex: "forwardProduction",
    title: "上网电量（kWh）",
    sorter: tableSortByKey("forwardProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="forwardProduction" />,
  },
  {
    dataIndex: "backProduction",
    title: "下网电量（kWh）",
    sorter: tableSortByKey("backProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="backProduction" />,
  },
  {
    dataIndex: "integratedAuxiliaryPowerConsumption",
    title: "综合厂用电量（kWh）",
    sorter: tableSortByKey("integratedAuxiliaryPowerConsumption"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={text} record={record} nameKey="integratedAuxiliaryPowerConsumption" />
    ),
  },
  {
    dataIndex: "normalTime",
    title: "正常发电时长（h）",
    sorter: tableSortByKey("normalTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="normalTime" />,
  },
  {
    dataIndex: "rationingTime",
    title: "限功率时长（h）",
    sorter: tableSortByKey("rationingTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="rationingTime" />,
  },
  {
    dataIndex: "standbyTime",
    title: "待机时长（h）",
    sorter: tableSortByKey("standbyTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="standbyTime" />,
  },
  {
    dataIndex: "shutdownTime",
    title: "主动停机时长（h） ",
    sorter: tableSortByKey("shutdownTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="shutdownTime" />,
  },
  {
    dataIndex: "faultTime",
    title: "故障停机时长（h）",
    sorter: tableSortByKey("faultTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="faultTime" />,
  },
  // {
  //   dataIndex: "stateF",
  //   title: "未知状态时长（h）",
  //   sorter: tableSortByKey("stateF"),
  //   align: "center",
  //   width: 140,
  // },
  {
    dataIndex: "noCommunicationTime",
    title: "无通讯时长（h）",
    sorter: tableSortByKey("noCommunicationTime"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="noCommunicationTime" />,
  },
]
export const PVINV_COLUMNS1: ColumnsType<any> = [
  {
    dataIndex: "totalDeviceCount",
    title: "装机台数",
    sorter: tableSortByKey("totalDeviceCount"),
    align: "center",
    fixed: "left",
    width: 100,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalDeviceCount" />,
  },
  {
    dataIndex: "totalCapacity",
    title: "装机容量（kW）",
    sorter: tableSortByKey("totalCapacity"),
    align: "center",
    fixed: "left",
    width: 120,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalCapacity" />,
  },
  {
    dataIndex: "activePower",
    title: "平均有功功率（kW）",
    sorter: tableSortByKey("activePower"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="activePower" />,
  },
  {
    dataIndex: "activePower_max",
    title: "最大有功功率（kW）",
    sorter: tableSortByKey("activePower_max"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="activePower_max" />,
  },
  {
    dataIndex: "JCYDirectIrradiance",
    title: "水平面总辐射量（kWh/㎡）",
    sorter: tableSortByKey("JCYDirectIrradiance"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="JCYDirectIrradiance" />,
  },
  {
    dataIndex: "JCYSlantIrradiance",
    title: "倾斜面总辐射量（kWh/㎡）",
    sorter: tableSortByKey("JCYSlantIrradiance"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="JCYSlantIrradiance" />,
  },
  {
    dataIndex: "sunHour",
    title: "日照时数（h）",
    sorter: tableSortByKey("sunHour"),
    align: "center",
    width: 170,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="sunHour" />,
  },
  {
    dataIndex: "efficiency",
    title: "转换效率（%）",
    sorter: tableSortByKey("efficiency"),
    align: "center",
    width: 120,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="efficiency" />,
  },
  {
    dataIndex: "dailyProduction",
    title: "实际发电量（kWh）",
    sorter: tableSortByKey("dailyProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="dailyProduction" />,
  },
  {
    dataIndex: "fittedTheoryProduction",
    title: "理论发电量（kWh）",
    sorter: tableSortByKey("fittedTheoryProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="fittedTheoryProduction" />,
  },
  {
    dataIndex: "totalSubLossProduction",
    title: "总损失电量（kWh）",
    sorter: tableSortByKey("totalSubLossProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalSubLossProduction" />,
  },
  {
    dataIndex: "forwardProduction",
    title: "上网电量（kWh）",
    sorter: tableSortByKey("forwardProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="forwardProduction" />,
  },
  {
    dataIndex: "backProduction",
    title: "下网电量（kWh）",
    sorter: tableSortByKey("backProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="backProduction" />,
  },
  {
    dataIndex: "integratedAuxiliaryPowerConsumption",
    title: "综合厂用电量（kWh）",
    sorter: tableSortByKey("integratedAuxiliaryPowerConsumption"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={text} record={record} nameKey="integratedAuxiliaryPowerConsumption" />
    ),
  },
  {
    dataIndex: "dcProduction",
    title: "输入电量（kWh）",
    sorter: tableSortByKey("dcProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="dcProduction" />,
  },
]
export const ESPCS_COLUMNS: ColumnsType<any> = [
  {
    dataIndex: "totalDeviceCount",
    title: "装机台数",
    sorter: tableSortByKey("totalDeviceCount"),
    align: "center",
    fixed: "left",
    width: 100,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalDeviceCount" />,
  },
  {
    dataIndex: "totalCapacity",
    title: "装机容量（kW）",
    sorter: tableSortByKey("totalCapacity"),
    align: "center",
    fixed: "left",
    width: 120,
    // render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalCapacity" />,
  },
  // {
  //   dataIndex: "activePower",
  //   title: "平均有功功率（kW）",
  //   sorter: tableSortByKey("activePower"),
  //   align: "center",
  //   width: 170,
  // },
  {
    dataIndex: "dailyCharge",
    title: "实际充电量（kWh）",
    sorter: tableSortByKey("dailyCharge"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="dailyCharge" />,
  },
  {
    dataIndex: "forwardProduction",
    title: "上网电量（kWh）",
    sorter: tableSortByKey("forwardProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="forwardProduction" />,
  },
  {
    dataIndex: "backProduction",
    title: "下网电量（kWh）",
    sorter: tableSortByKey("backProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="backProduction" />,
  },
  {
    dataIndex: "integratedAuxiliaryPowerConsumption",
    title: "综合厂用电量（kWh）",
    sorter: tableSortByKey("integratedAuxiliaryPowerConsumption"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={text} record={record} nameKey="integratedAuxiliaryPowerConsumption" />
    ),
  },
  {
    dataIndex: "dailyDischarge",
    title: "实际放电量（kWh）",
    sorter: tableSortByKey("dailyDischarge"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="dailyDischarge" />,
  },
  {
    dataIndex: "stateA",
    title: "充电时长（h）",
    sorter: tableSortByKey("stateA"),
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="stateA" />,
    align: "center",
    width: 100,
  },
  {
    dataIndex: "stateB",
    title: "放电时长（h）",
    sorter: tableSortByKey("stateB"),
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="stateB" />,
    align: "center",
    width: 100,
  },
  {
    dataIndex: "stateC",
    title: "待机时长（h）",
    sorter: tableSortByKey("stateC"),
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="stateC" />,
    align: "center",
    width: 100,
  },
  // { dataIndex: "stateD", title: "警告时长（h）", sorter: tableSortByKey("stateD"), align: "center", width: 100 },
  {
    dataIndex: "shutdownTime",
    title: "主动停机时长（h）",
    sorter: tableSortByKey("shutdownTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="shutdownTime" />,
  },
  {
    dataIndex: "faultTime",
    title: "故障停机时长（h）",
    sorter: tableSortByKey("faultTime"),
    align: "center",
    width: 100,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="faultTime" />,
  },
  // {
  //   dataIndex: "stateG",
  //   title: "未知状态时长（h）",
  //   sorter: tableSortByKey("stateG"),
  //   align: "center",
  //   width: 140,
  // },
  {
    dataIndex: "noCommunicationTime",
    title: "无通信时长（h）",
    sorter: tableSortByKey("noCommunicationTime"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="noCommunicationTime" />,
  },
]
export const WT_AND_PV_COM_COLUMNS: ColumnsType<any> = [
  {
    dataIndex: "utilizationHour",
    title: "等效利用小时(h)",
    sorter: tableSortByKey("utilizationHour"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="utilizationHour" />,
  },
  {
    dataIndex: "theoryProduction",
    title: "理论发电量（kWh）",
    sorter: tableSortByKey("theoryProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="theoryProduction" />,
  },
  {
    dataIndex: "totalSubLossProduction",
    title: "总损失电量（kWh）",
    sorter: tableSortByKey("totalSubLossProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalSubLossProduction" />,
  },
  {
    dataIndex: "faultCount",
    title: "故障次数",
    sorter: tableSortByKey("faultCount"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="faultCount" />,
  },
  {
    dataIndex: "faultLossProduction",
    title: "故障损失电量（kWh）",
    sorter: tableSortByKey("faultLossProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="faultLossProduction" />,
  },
  {
    dataIndex: "rationingLossProduction",
    title: "限电损失电量（kWh）",
    sorter: tableSortByKey("rationingLossProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="rationingLossProduction" />,
  },
  {
    dataIndex: "icingTime",
    title: "覆冰时长（h）",
    sorter: tableSortByKey("icingTime"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="icingTime" />,
  },
  {
    dataIndex: "icingLossProduction",
    title: "覆冰损失电量（kWh）",
    sorter: tableSortByKey("icingLossProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="icingLossProduction" />,
  },
  {
    dataIndex: "maintenanceShutdownTime",
    title: "检修时长（h）",
    sorter: tableSortByKey("maintenanceShutdownTime"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="maintenanceShutdownTime" />,
  },
  {
    dataIndex: "maintenanceLossProduction",
    title: "检修损失电量（kWh）",
    sorter: tableSortByKey("maintenanceLossProduction"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="maintenanceLossProduction" />,
  },
  {
    dataIndex: "availableHour",
    title: "可用小时数（h）",
    sorter: tableSortByKey("availableHour"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="availableHour" />,
  },
  {
    dataIndex: "timeAvailability",
    title: "时间可利用率（%）",
    sorter: tableSortByKey("timeAvailability"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={parseNum(text * 100, 4, null)} record={record} nameKey="timeAvailability" />
    ),
  },
  {
    dataIndex: "productionAvailability",
    title: "电量可利用率（%）",
    sorter: tableSortByKey("productionAvailability"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={parseNum(text * 100, 4, null)} record={record} nameKey="productionAvailability" />
    ),
  },
  {
    dataIndex: "productionEfficiency",
    title: "发电效能（%）",
    sorter: tableSortByKey("productionEfficiency"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={parseNum(text * 100, 4, null)} record={record} nameKey="productionEfficiency" />
    ),
  },
  // {
  //   dataIndex: "unitAvailability",
  //   title: "机组可利用率（%）",
  //   sorter: tableSortByKey("unitAvailability"),
  //   align: "center",
  //   width: 140,
  //   render: (text, record) => (
  //     <ComparePopower text={parseNum(text * 100, 4, null)} record={record} nameKey="unitAvailability" />
  //   ),
  // },
  // {
  //   dataIndex: "plantAvailability",
  //   title: "电场可利用率（%）",
  //   sorter: tableSortByKey("plantAvailability"),
  //   align: "center",
  //   width: 140,
  //   render: (text, record) => (
  //     <ComparePopower text={parseNum(text * 100, 4, null)} record={record} nameKey="plantAvailability" />
  //   ),
  // },
]
export const WT_AND_PV_COM_COLUMNS1: ColumnsType<any> = [
  {
    dataIndex: "utilizationHour",
    title: "等效利用小时(h)",
    sorter: tableSortByKey("utilizationHour"),
    align: "center",
    width: 140,
    render: (text, record) => <ComparePopower text={text} record={record} nameKey="utilizationHour" />,
  },
  // {
  //   dataIndex: "fittedTheoryProduction",
  //   title: "理论发电量（kWh）",
  //   sorter: tableSortByKey("fittedTheoryProduction"),
  //   align: "center",
  //   width: 140,
  //   render: (text, record) => <ComparePopower text={text} record={record} nameKey="fittedTheoryProduction" />,
  // },
  // {
  //   dataIndex: "totalSubLossProduction",
  //   title: "总损失电量（kWh）",
  //   sorter: tableSortByKey("totalSubLossProduction"),
  //   align: "center",
  //   width: 140,
  //   render: (text, record) => <ComparePopower text={text} record={record} nameKey="totalSubLossProduction" />,
  // },
  {
    dataIndex: "unitAvailability",
    title: "机组可利用率（%）",
    sorter: tableSortByKey("unitAvailability"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={parseNum(text * 100, 4, null)} record={record} nameKey="unitAvailability" />
    ),
  },
  {
    dataIndex: "plantAvailability",
    title: "电场可利用率（%）",
    sorter: tableSortByKey("plantAvailability"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={parseNum(text * 100, 4, null)} record={record} nameKey="plantAvailability" />
    ),
  },
  {
    dataIndex: "productionEfficiency",
    title: "发电效能（%）",
    sorter: tableSortByKey("productionEfficiency"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={parseNum(text * 100, 4, null)} record={record} nameKey="productionEfficiency" />
    ),
  },
]
export const WT_PV_ES_COM_COLUMNS: ColumnsType<any> = [
  {
    dataIndex: "peakProduction",
    title: "峰发电量(kWh)",
    sorter: tableSortByKey("peakProduction"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={parseNum(text, 2, null)} record={record} nameKey="peakProduction" />
    ),
  },
  {
    dataIndex: "valleyProduction",
    title: "谷发电量(kWh)",
    sorter: tableSortByKey("valleyProduction"),
    align: "center",
    width: 120,
    render: (text, record) => (
      <ComparePopower text={parseNum(text, 2, null)} record={record} nameKey="valleyProduction" />
    ),
  },
  {
    dataIndex: "flatProduction",
    title: "平发电量(kWh)",
    sorter: tableSortByKey("flatProduction"),
    align: "center",
    width: 140,
    render: (text, record) => (
      <ComparePopower text={parseNum(text, 2, null)} record={record} nameKey="flatProduction" />
    ),
  },
]
export const RP_POWER_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "查询类型",
    props: {
      needFirst: true,
      allowClear: false,
      options: MAIN_DVS_TYPE,
      placeholder: "请选择查询类型",
      style: { minWidth: "4em" },
    },
  },
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      disabled: false,
      multiple: true,
      // options: [],
      placeholder: "全部",
      style: { minWidth: "8em" },
    },
  },
  {
    type: SelectWithAll,
    name: "groupByTime",
    label: "统计周期",
    props: {
      needFirst: true,
      options: PERIOD_OPTIONS,
      placeholder: "请选择统计周期",
      style: { minWidth: "8em" },
      allowClear: false,
    },
  },
  {
    type: SelectWithAll,
    name: "groupByPath",
    label: "统计对象",
    props: {
      placeholder: "请选择统计对象",
      needFirst: true,
      options: [
        { label: "场站", value: "STATION_CODE" },
        { label: "区域公司", value: "REGION_COM_ID" },
        { label: "项目公司", value: "PROJECT_COM_ID" },
        { label: "检修基地", value: "MAINTENANCE_COM_ID" },
        { label: "期次", value: "PERIOD" },
        { label: "线路", value: "LINE" },
        { label: "设备", value: "DEVICE_CODE" },
        { label: "机型", value: "MODEL" },
        // { label: "方阵", value: 5 },
      ],
      style: { minWidth: "10em" },
    },
  },
  // {
  //   type: SelectWithAll,
  //   name: "point",
  //   label: "指标",
  //   props: {
  //     options: [],
  //     mode: "multiple",
  //     placeholder: "全部",
  //     style: { minWidth: "10em" },
  //     fieldNames: { label: "title", value: "dataIndex" },
  //   },
  // },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    // formItemProps: { labelCol: { span: 8 } },
    props: { style: { width: "20em" }, allowClear: false },
  },
]

// 旧的
export const DEFAULT_STATION_MAP: IStationMap = {
  WT: {
    type: ["W", "F", "H"],
    colums: [...WT_COLUMNS, ...WT_AND_PV_COM_COLUMNS, ...WT_PV_ES_COM_COLUMNS],
  },
  PVINV: {
    type: ["S", "G", "H", "P"],
    colums: [...PVINV_COLUMNS, ...WT_AND_PV_COM_COLUMNS, ...WT_PV_ES_COM_COLUMNS],
  },
  ESPCS: {
    type: ["F", "G", "H", "E"],
    colums: [...ESPCS_COLUMNS, ...WT_PV_ES_COM_COLUMNS],
  },
}
// 新的
export const DEFAULT_NEW_STATION_MAP: IStationMap = {
  WT: {
    type: ["W", "F", "H"],
    colums: [
      ...WT_COLUMNS1,
      ...WT_AND_PV_COM_COLUMNS1,
      ...getTypeColunms("WT", "时长", "wtMainStateTime", true, "（h）"),
      ...getTypeColunms("WT", "损失次数", "wtSubStateCount", false),
      ...getTypeColunms("WT", "损失时长", "wtSubStateTime", false, "（h）"),
      ...getTypeColunms("WT", "损失电量", "wtSubLossProduction", false, "（kWh）"),
      ...WT_PV_ES_COM_COLUMNS,
    ],
  },
  PVINV: {
    type: ["S", "G", "H", "P"],
    colums: [
      ...PVINV_COLUMNS1,
      ...WT_AND_PV_COM_COLUMNS1,
      ...getTypeColunms("PVINV", "时长", "pvinvMainStateTime", true, "（h）"),
      ...getTypeColunms("PVINV", "损失次数", "pvinvSubStateCount", false),
      ...getTypeColunms("PVINV", "损失时长", "pvinvSubStateTime", false, "（h）"),
      ...getTypeColunms("PVINV", "损失电量", "pvinvSubLossProduction", false, "（kWh）"),
      ...WT_PV_ES_COM_COLUMNS,
    ],
  },
  ESPCS: {
    type: ["F", "G", "H", "E"],
    colums: [...ESPCS_COLUMNS, ...WT_PV_ES_COM_COLUMNS],
  },
}

export const CONTROL_LOG_COLUMNS: ColumnsType<any> = [
  { dataIndex: "index", title: "序号", align: "center", fixed: "left", width: 80 },
  {
    dataIndex: "transTime",
    title: "时间",
    fixed: "left",
    sorter: tableSortByKey("Time"),
    align: "center",
    width: 120,
  },
]
export const COLOUMNS_QY: ColumnsType<any> = [
  {
    dataIndex: "regionComName",
    title: "区域公司",
    sorter: tableSortByKey("regionComName"),
    align: "center",
    fixed: "left",
    width: 140,
  },
]
export const COLOUMNS_XM: ColumnsType<any> = [
  {
    dataIndex: "projectComName",
    title: "项目公司",
    sorter: tableSortByKey("projectComName"),
    align: "center",
    fixed: "left",
    width: 140,
  },
]
export const COLOUMNS_JD: ColumnsType<any> = [
  {
    dataIndex: "maintenanceComName",
    title: "检修公司",
    sorter: tableSortByKey("maintenanceComName"),
    align: "center",
    fixed: "left",
    width: 140,
  },
]
export const COLOUMNS_CZ: ColumnsType<any> = [
  {
    dataIndex: "stationName",
    title: "场站",
    fixed: "left",
    sorter: tableSortByKey("stationName"),
    align: "center",
    width: 140,
  },
]
export const COLOUMNS_QICI: ColumnsType<any> = [
  {
    dataIndex: "stationName",
    title: "场站",
    fixed: "left",
    sorter: tableSortByKey("stationName"),
    align: "center",
    width: 140,
  },
  {
    dataIndex: "periodName",
    title: "期次",
    fixed: "left",
    sorter: tableSortByKey("periodName"),
    align: "center",
    width: 100,
  },
]

export const COLOUMNS_XL: ColumnsType<any> = [
  {
    dataIndex: "stationName",
    title: "场站",
    fixed: "left",
    sorter: tableSortByKey("stationName"),
    align: "center",
    width: 140,
  },
  {
    dataIndex: "lineName",
    title: "线路",
    fixed: "left",
    sorter: tableSortByKey("lineName"),
    align: "center",
    width: 100,
  },
]
export const COLOUMNS_SB: ColumnsType<any> = [
  {
    dataIndex: "stationName",
    title: "场站",
    fixed: "left",
    sorter: tableSortByKey("stationName"),
    align: "center",
    width: 140,
  },
  {
    dataIndex: "deviceName",
    title: "设备",
    fixed: "left",
    sorter: tableSortByKey("deviceName"),
    align: "center",
    width: 100,
  },
]
export const COLOUMNS_MX: ColumnsType<any> = [
  {
    dataIndex: "stationName",
    title: "场站",
    fixed: "left",
    sorter: tableSortByKey("stationName"),
    align: "center",
    width: 140,
  },
  {
    dataIndex: "model",
    title: "机型",
    fixed: "left",
    sorter: tableSortByKey("model"),
    align: "center",
    width: 100,
  },
]
