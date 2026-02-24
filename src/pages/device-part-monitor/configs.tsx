/*
 * @Author: xiongman
 * @Date: 2023-10-23 15:02:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-29 14:50:37
 * @Description: 设备部件监视-配置数据
 */

import { ColumnsType } from "antd/es/table"

import MetricTag from "@/components/metric-tag"

import { IDvsSystemTelemetryTableData } from "./types.ts"

export function devicePartImg(partName: string) {
  switch (partName) {
    case "主控柜":
      return "/images/fanParts/part1.png"
    case "齿轮箱":
      return "/images/fanParts/part2.png"
    case "发电机":
      return "/images/fanParts/part3.png"
    case "机舱":
      return "/images/fanParts/part5.png"
    case "叶片":
      return "/images/fanParts/part6.png"
    case "变桨":
      return "/images/fanParts/part7.png"
    case "主轴":
      return "/images/fanParts/part8.png"
    default:
      return "/images/fanParts/part4.png"
  }
}

export function dealPartName(partName: string, interverType) {
  switch (partName) {
    case "传动系统":
      return "齿轮箱，主轴"
    case "主控系统":
      return "中控柜系统"
    case "偏航系统":
      return "偏航装置"
    case "箱变":
      return "pcs_4405_01.001_pcs_4405_01.005"
    case "组串式逆变器数据采集器":
      return "Plane.001，Plane.003，Plane.004"
    case "直流汇流箱":
      return interverType !== "组串式" ? "pcs_4405_01.002，pcs_4405_01.004，pcs_4405_01.005" : "pcs_4405_01.002"
    case "组串式逆变器":
      return interverType !== "组串式" ? "" : "pcs_4405_01.004，pcs_4405_01.005，pcs_4405_01.006"
    case "集中式逆变器":
      return "pcs_4405_01.006"
    default:
      return partName
  }
}

// 风机部件实时状态表格列, 表格数据根据接口数据生成
export const DVS_PART_COLUMNS: ColumnsType<IDvsSystemTelemetryTableData> = [
  { title: "名称", dataIndex: "name" },
  {
    title: "值",
    dataIndex: "value",
    render: (value, record) => <MetricTag value={value} unit={record.unit} color={record.color} />,
  },
]
