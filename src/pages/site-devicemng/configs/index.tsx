/*
 * @Author: chenmeifeng
 * @Date: 2024-04-08 11:28:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-12 17:25:43
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import { StorageStationData } from "@/configs/storage-cfg"
import { getStorage } from "@/utils/util-funs"
export const stationAllInfo = getStorage(StorageStationData)

import PointText from "@/components/trend-line-by-dvs/text"

import { transColor } from "../methods"
import { ITbColAction } from "../types/index"

export const BTNLIST = [
  {
    key: 15,
    value: "高压侧分闸",
    name: "TrsHighVolsideswitchoffEn",
    target: 0,
  },
  {
    key: 14,
    value: "高压侧合闸",
    name: "TrsHighVolsideswitchonEn",
    target: 1,
  },
  {
    key: 17,
    value: "低压侧分闸",
    name: "TrsLowVolsideswitchoffEn",
    target: 0,
  },
  {
    key: 16,
    value: "低压侧合闸",
    name: "TrsLowVolsideswitchonEn",
    target: 1,
  },
]

export function CONTROL_DEVICEMNG_COLUMNS(config: ITbColAction<any>): ColumnsType<any> {
  const { onClick } = config
  return [
    { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
    {
      dataIndex: "deviceName",
      title: "箱变名称",
      render: (text, record) => (
        <span style={{ cursor: "pointer" }} onClick={() => onClick(record)}>
          {record.deviceName}
        </span>
      ),
    },
    {
      dataIndex: "Trshighvoltagesideswitchon",
      title: "高压侧负荷开关",
      align: "center",
      render: (text, record) => (
        <span
          style={{
            color: "var(--alarm)",
            width: "16px",
            height: "16px",
            borderRadius: "8px",
            display: "inline-block",
            background: transColor(record, "Trshighvoltagesideswitchon"),
          }}
        >
          {record.Trshighvoltagesideswitchon}
        </span>
      ),
    },
    {
      dataIndex: "TrsLowvoltagesideswitchon",
      title: "低压断路器",
      align: "center",
      render: (text, record) => (
        <span
          style={{
            color: "var(--alarm)",
            width: "16px",
            height: "16px",
            borderRadius: "8px",
            display: "inline-block",
            background: transColor(record, "TrsLowvoltagesideswitchon"),
          }}
        >
          {record.TrsLowvoltagesideswitchon}
        </span>
      ),
    },
    {
      dataIndex: "TrsEarthingSwitchCloseSignal",
      title: "接地开关",
      align: "center",
      render: (text, record) => (
        <span
          style={{
            color: "var(--alarm)",
            width: "16px",
            height: "16px",
            borderRadius: "8px",
            display: "inline-block",
            background: transColor(record, "TrsEarthingSwitchCloseSignal"),
          }}
        >
          {record.TrsEarthingSwitchCloseSignal}
        </span>
      ),
    },
    //河南个性化
    // {
    //   dataIndex: "TrsLowVolRoomAmbientTemp",
    //   title: "低压室环境温度",
    //   align: "center",
    //   render: (value, record) => <PointText text={value} record={record} valkey="TrsLowVolRoomAmbientTemp" />,
    // },
    {
      dataIndex: "TrsOilTemp",
      title: "变压器油温",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="TrsOilTemp" />,
    },
    // { dataIndex: "TrsOilLevel", title: "变压器油位", align: "center" },
    {
      dataIndex: "HvSidep",
      title: "高压侧P",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="HvSidep" />,
    },
    {
      dataIndex: "HvSideq",
      title: "高压侧Q",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="HvSideq" />,
    },
    {
      dataIndex: "HvSideuab",
      title: "高压侧Uab",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="HvSideuab" />,
    },
    {
      dataIndex: "LvSidep1",
      title: "低压侧P",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="LvSidep1" />,
    },
    {
      dataIndex: "LvSideq1",
      title: "低压侧Q",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="LvSideq1" />,
    },
    {
      dataIndex: "LvSideuab1",
      title: "低压侧Uab",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="LvSideuab1" />,
    },
  ]
}
