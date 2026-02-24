/*
 * @Author: xiongman
 * @Date: 2023-09-27 14:33:30
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 09:48:20
 * @Description: 设备控制配置数据
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"

import { TDeviceType } from "@/types/i-config.ts"

// 设备控制代码
export type TControlType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

export const CTRL = {
  // START: "启动",
  START: "启动",
  // STOP: "停止",
  STOP: "停止",
  // RESET: "复位",
  RESET: "复位",
  Batch: "批量控制",
  // POWER_SET: "有功设定",
  POWER_SET: "有功设定",
  // REACTIVE_SET: "无功设定",
  REACTIVE_SET: "无功设定",
  YT: "遥调",
  // CLOSING: "合闸",
  CLOSING: "合闸",
  // OPENING: "分闸",
  OPENING: "分闸",
  // UP: "升档",
  ZB_UP: "变压器升档",
  // DOWN: "降档",
  ZB_DOWN: "变压器降档",
  // ZB_STOP: "档位停",
  ZB_STOP: "变压器档位停",
}

type TCtrlType4Dvs = Partial<Record<TDeviceType, IDvsRunStateInfo<TControlType, string>[][]>>
export const SYZZZ_CONTROL_TYPE_4DEVICE: IDvsRunStateInfo<TControlType, string>[] = [
  { title: CTRL.CLOSING, field: 7, value: "closing", icon: "start", valueFun: () => 1 },
  { title: CTRL.OPENING, field: 8, value: "opening", icon: "stop", valueFun: () => 0 },
  { title: CTRL.ZB_UP, field: 10, value: "up", icon: "start", valueFun: () => 1 },
  { title: CTRL.ZB_DOWN, field: 11, value: "down", icon: "stop", valueFun: () => 0 },
  { title: CTRL.ZB_STOP, field: 12, value: "stop", icon: "stop", valueFun: () => 1 },
]
export const CONTROL_TYPE_4DEVICE: TCtrlType4Dvs = {
  WT: [
    [
      {
        title: CTRL.START,
        field: 1,
        value: "TurbineStart",
        icon: "start",
        prohibitControl: [1, 2],
        prohibitNewStateControl: [1, 2],
        valueFun: () => 1,
      },
      {
        title: CTRL.STOP,
        field: 2,
        value: "TurbineStop",
        icon: "stop",
        prohibitModelIdControl: true,
        prohibitControl: [4, 5],
        prohibitNewStateControl: [4, 5, 6],
        valueFun: () => 1,
      },
      { title: CTRL.RESET, field: 3, value: "TurbineReset", icon: "reset", valueFun: () => 1 },
      { title: CTRL.Batch, field: 4, value: "TurbineBatch", icon: "batch", valueFun: () => 1 },
    ],
    [{ title: CTRL.POWER_SET, field: 6, unit: UNIT.POWER_K, value: "GenPowSetp", icon: "limit", valueFun: (v) => v }],
    [
      {
        title: CTRL.REACTIVE_SET,
        field: 9,
        unit: UNIT.REACTIVE,
        value: "GenReactPowSetp",
        icon: "limit",
        valueFun: (v) => v,
      },
    ],
  ],
  ESPCS: [
    [
      {
        title: CTRL.START,
        field: 1,
        value: "pcsgstatecmd",
        icon: "start",
        prohibitControl: [1, 2],
        prohibitNewStateControl: [1, 2],
        valueFun: () => 0,
      },
      {
        title: CTRL.STOP,
        field: 2,
        value: "pcsgstatecmd",
        icon: "stop",
        prohibitControl: [4, 5],
        prohibitNewStateControl: [4, 5],
        valueFun: () => 1,
      },
      { title: CTRL.Batch, field: 4, value: "TurbineBatch", icon: "batch", valueFun: () => 1 },
    ],
    [{ title: CTRL.POWER_SET, field: 6, unit: UNIT.POWER_K, value: "pcspcmd", icon: "limit", valueFun: (v) => v }],
    [{ title: CTRL.REACTIVE_SET, field: 9, unit: UNIT.REACTIVE, value: "pcsqcmd", icon: "limit", valueFun: (v) => v }],
  ],
  PVINV: [
    [
      {
        title: CTRL.START,
        field: 1,
        value: "StartStop",
        icon: "start",
        prohibitControl: [1, 2],
        prohibitNewStateControl: [1, 2],
        valueFun: () => 0,
      },
      {
        title: CTRL.STOP,
        field: 2,
        value: "StartStop",
        icon: "stop",
        prohibitControl: [4, 5],
        prohibitNewStateControl: [4, 5],
        valueFun: () => 1,
      },
      { title: CTRL.Batch, field: 4, value: "TurbineBatch", icon: "batch", valueFun: () => 1 },
    ],
    [
      {
        title: CTRL.POWER_SET,
        field: 6,
        unit: UNIT.POWER_K,
        value: "ActivePowerSetPoint",
        icon: "limit",
        valueFun: (v) => v,
      },
    ],
    [
      {
        title: CTRL.REACTIVE_SET,
        field: 9,
        unit: UNIT.REACTIVE,
        value: "ReactivePowerSetPoint",
        icon: "limit",
        valueFun: (v) => v,
      },
    ],
  ],
  SYZZZ: [SYZZZ_CONTROL_TYPE_4DEVICE],
  PVCOL: [
    [
      { title: "遥控0", field: 1, value: "StartStopCommand", icon: "start", valueFun: () => 0 },
      { title: "遥控1", field: 2, value: "StartStopCommand", icon: "stop", valueFun: () => 1 },
    ],
    [
      {
        title: CTRL.YT,
        field: 13,
        icon: "limit",
        valueFun: (v) => v,
      },
    ],
  ],
  // 其他设备类型
  OTHERTYPE: [
    [
      { title: "遥控0", field: 1, value: "StartStopCommand", icon: "start", valueFun: () => 0 },
      { title: "遥控1", field: 2, value: "StartStopCommand", icon: "stop", valueFun: () => 1 },
    ],
  ],
}
export const IS_SHOW_BTN_LIST = [CTRL.Batch]

export const TIME_STATE = "time-state"
export const EXECUTE_LOG = "execute-log"

export type TControlTableType = typeof TIME_STATE | typeof EXECUTE_LOG

export const CONTROL_TABLE_TYPE_BUTTON: IDvsRunStateInfo<TControlTableType>[] = [
  { title: "实时状态", field: TIME_STATE },
  { title: "执行日志", field: EXECUTE_LOG },
]

export const CONTROL_DEFAULT_TYPE = {
  WT: "风机",
  PVINV: "光伏逆变器",
  ESPCS: "储能变流器系统",
  // SYZZZ: "升压站",
}

export const COMMON_DEVICE_TYPE = {
  WT: "风机",
  PVINV: "光伏逆变器",
  ESPCS: "储能变流器系统",
  SYZZZ: "升压站",
}

// export const DVS_CONTROL_TYPES = [
//   { id: 1, name: "启动" },
//   { id: 2, name: "停止" },
//   { id: 3, name: "复位" },
//   { id: 4, name: "左偏航" },
//   { id: 5, name: "右偏航" },
//   { id: 6, name: "限功率" },
//   { id: 7, name: "合闸" },
//   { id: 8, name: "分闸" },
//   { id: 9, name: "无功设定" },
// ]

// export const DVS_CONTROL_CODE_2LABEL = reduceList2KeyValueMap(DVS_CONTROL_TYPES, { vField: "id", lField: "name" })
