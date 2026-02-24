/*
 * @Author: chenmeifeng
 * @Date: 2025-08-13 10:07:06
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-25 17:01:48
 * @Description:
 */
import { ColumnsType } from "antd/es/table"
import { Link } from "react-router-dom"

import PointText from "@/components/trend-line-by-dvs/text"
import { getStationMainId, judgeNull } from "@/utils/util-funs"

import ControlItem from "../components/control"
import InputSet from "../components/input"

export const AREA_ENERGE_ACTIVE_COLUMNS = (dataSource): ColumnsType<any> => {
  return [
    {
      dataIndex: "stationName",
      title: "场站",
      align: "center",
      // 合并相同部门的列
      render: (text, record, index) => {
        // 当前行是否与上一行部门相同
        const prevSame = index > 0 && dataSource[index - 1].stationName === text
        // 当前行是否与下一行部门相同
        const nextSame = index < dataSource.length - 1 && dataSource[index + 1].stationName === text

        // 仅在第一行显示合并单元格
        if (!prevSame) {
          let rowSpan = 1
          // 计算需要合并的行数
          for (let i = index + 1; i < dataSource.length; i++) {
            if (dataSource[i].stationName === text) {
              rowSpan++
            } else {
              break
            }
          }
          return {
            children: (
              <Link to={`/site/${record.maintenanceComId}/${record.stationCode}/nlgl`}>
                <span style={{ color: "var(--deep-font-color)" }}>{text}</span>
              </Link>
            ),
            props: {
              rowSpan,
            },
          }
        }
        // 其他相同部门行隐藏单元格
        return {
          children: text,
          props: {
            rowSpan: 0,
          },
        }
      },
    },
    {
      dataIndex: "deviceName",
      title: "设备",
      align: "center",
    },
    {
      dataIndex: "OnlineCapacity",
      title: "机群容量（MW）",
      align: "center",
      render: (text, record) => <span>{judgeNull(record.deviceTags?.rated_power, 1000, 2, "-")}</span>,
    },
    {
      dataIndex: "ActivePowerControlModeFeedback",
      title: "控制模式",
      align: "center",
      render: (text, record) => (
        <ControlItem value={text} type="agc" device={record} valkey="ActivePowerControlModeFeedback" />
      ),
    },
    {
      dataIndex: "ActivePowerSetFeedback",
      title: "有功计划值（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="ActivePowerSetFeedback" />,
    },
    {
      dataIndex: "RealTimeTotalActivePower",
      title: "有功实时值（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="RealTimeTotalActivePower" />,
    },
    {
      dataIndex: "RealTimeTotalTheoryPower",
      title: "理论功率（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="RealTimeTotalTheoryPower" />,
    },
    {
      dataIndex: "RealTimeTotalAvailablePower",
      title: "可用功率（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="RealTimeTotalAvailablePower" />,
    },
    {
      dataIndex: "408",
      title: "限电状态",
      align: "center",
      render: (text, record) => <JudgeLimitPower record={record} />,
    },
    {
      dataIndex: "ActivePowerSet",
      title: "有功计划值遥调",
      width: 200,
      align: "center",
      render: (text, record) => (
        <InputSet valKey="ActivePowerSet" valLabel="有功计划值遥调" valControlType="33" device={record} />
      ),
    },
    {
      dataIndex: "ActivePowerSetoffset",
      title: "有功计划值优化",
      width: 200,
      align: "center",
      render: (text, record) => (
        <InputSet valKey="ActivePowerSetoffset" valLabel="有功计划值优化" valControlType="40" device={record} />
      ),
    },
  ]
}
export const AREA_ENERGE_REACTIVE_COLUMNS = (dataSource): ColumnsType<any> => {
  return [
    {
      dataIndex: "stationName",
      title: "场站",
      align: "center",
      // 合并相同部门的列
      render: (text, record, index) => {
        // 当前行是否与上一行部门相同
        const prevSame = index > 0 && dataSource[index - 1].stationName === text
        // 当前行是否与下一行部门相同
        const nextSame = index < dataSource.length - 1 && dataSource[index + 1].stationName === text

        // 仅在第一行显示合并单元格
        if (!prevSame) {
          let rowSpan = 1
          // 计算需要合并的行数
          for (let i = index + 1; i < dataSource.length; i++) {
            if (dataSource[i].stationName === text) {
              rowSpan++
            } else {
              break
            }
          }
          return {
            children: (
              <Link to={`/site/${record.maintenanceComId}/${record.stationCode}/nlgl`}>
                <span style={{ color: "var(--deep-font-color)" }}>{text}</span>
              </Link>
            ),
            props: {
              rowSpan,
            },
          }
        }
        // 其他相同部门行隐藏单元格
        return {
          children: text,
          props: {
            rowSpan: 0,
          },
        }
      },
    },
    {
      dataIndex: "deviceName",
      title: "设备",
      align: "center",
    },
    {
      dataIndex: "OnlineCapacity",
      title: "机群容量（MW）",
      align: "center",
      render: (text, record) => <span>{judgeNull(record.deviceTags?.rated_power, 1000, 2, "-")}</span>,
    },
    {
      dataIndex: "ReactivePowerControlModeFeedback",
      title: "控制模式",
      align: "center",
      render: (text, record) => (
        <ControlItem value={text} type="avc" device={record} valkey="ReactivePowerControlModeFeedback" />
      ),
    },
    {
      dataIndex: "ReactivePowerSetFeedback",
      title: "无功计划值（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="ReactivePowerSetFeedback" />,
    },
    {
      dataIndex: "RealTimeTotalReactivePower",
      title: "无功实时值（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="RealTimeTotalReactivePower" />,
    },
    {
      dataIndex: "ReactivePowerSet",
      title: "无功计划值遥调",
      width: 200,
      align: "center",
      render: (text, record) => (
        <InputSet valKey="ReactivePowerSet" valLabel="无功计划值遥调" valControlType="34" device={record} />
      ),
    },
  ]
}
export const AGVC_CONTROL = {
  agc: [
    {
      name: "控制退出",
      value: 0,
      valKey: "ActivePowerControlModeFeedback",
      controlKey: "ActivePowerControlMode",
      controlType: 25,
      controlPointName: "控制退出",
    },
    {
      name: "本地控制",
      value: 1,
      valKey: "ActivePowerControlModeFeedback",
      controlKey: "ActivePowerControlMode",
      controlType: 26,
      controlPointName: "本地控制",
    },
    {
      name: "AGC控制",
      value: 2,
      valKey: "ActivePowerControlModeFeedback",
      controlKey: "ActivePowerControlMode",
      controlType: 27,
      controlPointName: "AGC控制",
    },
    {
      name: "集控控制",
      value: 3,
      valKey: "ActivePowerControlModeFeedback",
      controlKey: "ActivePowerControlMode",
      controlType: 28,
      controlPointName: "集控控制",
    },
  ],
  avc: [
    {
      name: "控制退出",
      value: 0,
      valKey: "ReactivePowerControlModeFeedback",
      controlKey: "ReactivePowerControlMode",
      controlType: 29,
      controlPointName: "控制退出",
    },
    {
      name: "本地控制",
      value: 1,
      valKey: "ReactivePowerControlModeFeedback",
      controlKey: "ReactivePowerControlMode",
      controlType: 30,
      controlPointName: "本地控制",
    },
    {
      name: "AVC控制",
      value: 2,
      valKey: "ReactivePowerControlModeFeedback",
      controlKey: "ReactivePowerControlMode",
      controlType: 31,
      controlPointName: "AVC控制",
    },
    {
      name: "集控控制",
      value: 3,
      valKey: "ReactivePowerControlModeFeedback",
      controlKey: "ReactivePowerControlMode",
      controlType: 32,
      controlPointName: "集控控制",
    },
  ],
}

// 限电判断，有功计划值（单位MW）＜（可用功率-2MW) 为限电，限电标记为红色圆圈，不限电标记为绿色圆圈
const JudgeLimitPower = ({ record }) => {
  const { ActivePowerSetFeedback, RealTimeTotalAvailablePower } = record
  if (ActivePowerSetFeedback < RealTimeTotalAvailablePower - 2) {
    return (
      <div>
        <i style={{ backgroundColor: "red" }} className="iconfont"></i>限电
      </div>
    )
  }
  return <i style={{ backgroundColor: "green" }} className="iconfont"></i>
}
