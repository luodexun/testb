/*
 * @Author: xiongman
 * @Date: 2023-09-06 15:54:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-03 15:17:39
 * @Description:
 */

import { EXECUTE_LOG, TIME_STATE } from "@configs/dvs-control.ts"
import { DEVICE_RUN_CARD_FIELD_4TYPE } from "@configs/dvs-state-info.ts"
import { CONTROL_LOG_COLUMNS } from "@pages/control-log/configs"
import { cocatUnit } from "@utils/util-funs.tsx"
import { ColumnsType } from "antd/es/table"

import { TOptions } from "@/types/i-antd.ts"
import { TDeviceType } from "@/types/i-config.ts"

import { IBatchRealTimeData } from "../types/i-batch.ts"

export const CONTROL_SELECT: TOptions<TDeviceType> = [
  { label: "风机", value: "WT" },
  { label: "光伏逆变器", value: "PVINV" },
  { label: "储能变流器", value: "ESPCS" },
  // { label: "升压站批量控制", value: "SYZZZ" },
]
const tableSortByKey = (key) => {
  return (a, b) => a[key] - b[key]
}

function renderState(field: keyof IBatchRealTimeData) {
  if (field !== "mainState") return undefined
  return (val: string | number, record: IBatchRealTimeData) => {
    return <span style={{ color: record?.mainStateStyle?.color }}>{val}</span>
  }
}
export const TIME_STATE_COLUMNS = Object.entries(DEVICE_RUN_CARD_FIELD_4TYPE).reduce(
  (prev, [dvsType, cardList]) => {
    prev[dvsType] = cardList.map(({ field, title, unit }) => {
      return {
        dataIndex: field === "mainState" ? "stateLabel" : field,
        title: cocatUnit(title, unit),
        render: renderState(field),
        sorter: tableSortByKey(field),
      }
    })
    prev[dvsType].unshift({ dataIndex: "deviceNumber", title: "设备", width: 80 })
    return prev
  },
  {} as Record<TDeviceType, ColumnsType<IBatchRealTimeData>>,
)

type TCtrlColumnsMap = {
  [TIME_STATE]: typeof TIME_STATE_COLUMNS
  [EXECUTE_LOG]: typeof CONTROL_LOG_COLUMNS
}
export const CONTROL_BATCH_COLUMNS_MAP: TCtrlColumnsMap = {
  [TIME_STATE]: TIME_STATE_COLUMNS,
  [EXECUTE_LOG]: CONTROL_LOG_COLUMNS,
}
