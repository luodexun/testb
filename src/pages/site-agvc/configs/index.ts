/*
 * @Author: xiongman
 * @Date: 2023-09-07 09:51:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-08 10:58:38
 * @Description:
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"

import { IAgvcMQDataMap } from "@/types/i-agvc.ts"

const agcCommonParam: IDvsRunStateInfo<keyof IAgvcMQDataMap[string], string>[] = [
  { field: "AGCActivePowerOrderBySchedule", title: "调度负荷", unit: UNIT.POWER ,subField: "AGCActivePowerOrderBySchedule" },
  // { field: "additionalActivePowerOfSubStation", title: "全场可增有功", unit: UNIT.POWER ,subField: "AdditionalActivePowerOfSubStation"  },
  // { field: "decreaseActivePowerOfSubStation", title: "全场可减有功", unit: UNIT.POWER ,subField: "DecreaseActivePowerOfSubStation"  },
  { field: "TheoreticalPower", title: "理论有功", unit: UNIT.POWER ,subField: "TotalTheorypower" },
  { field: "AvailablePower", title: "可用有功", unit: UNIT.POWER ,subField: "TotalAvailablePower" },
]

// AVC 参数页面字段
const avcCommonParam: IDvsRunStateInfo<keyof IAgvcMQDataMap[string], string>[] = [
  { field: "realTimeGirdVolt", title: "母线电压实际值", unit: UNIT.VOLAGE_K ,subField: "RealTimeGirdVolt"},
  { field: "AVCVoltageOrderBySchedule", title: "母线电压调控值", unit: UNIT.VOLAGE_K ,subField: "AVCVoltageOrderBySchedule" },
  // 安徽个性化变更字段
  // { field: "realTimeGirdVolt", title: "无功功率实际值", unit: UNIT.REACTIVE_M ,subField: "RealTimeGirdVolt"  },
  // { field: "AVCVoltageOrderBySchedule", title: "无功功率调控值", unit: UNIT.REACTIVE_M ,subField: "AVCVoltageOrderBySchedule"  },
  { field: "additionalReactivePowerOfSubStation", title: "全场可增无功", unit: UNIT.REACTIVE_M ,subField: "AdditionalReactivePowerOfSubStation" },
  { field: "decreaseReactivePowerOfSubStation", title: "全场可减无功", unit: UNIT.REACTIVE_M ,subField: "DecreaseReactivePowerOfSubStation" },
]

// 定义 agc/avc 实时显示测点, 默认 default 供给所有场站使用
const agcParamDefault: IDvsRunStateInfo<keyof IAgvcMQDataMap[string]>[] = [
  // 场站风机实时总功率，处理附加字段，非常关键
  { field: "realTimeTotalActivePowerOfSubStation", title: "实际功率", unit: UNIT.POWER ,subField: "RealTimeTotalActivePowerOfSubStation" },
  ...agcCommonParam,
  { field: "AGCInput", title: "子站投退状态", valueFun: (val) => ["投入", "未投入"][!val ? 1 : 0] },
  { field: "AGCRemoteOperation", title: "子站运行状态", valueFun: (val) => ["远方", "就地"][!val ? 1 : 0] },
  { field: "additionalActivePowerBlock", title: "子站增闭锁", valueFun: (val) => ["闭锁", "未闭锁"][!val ? 1 : 0] },
  { field: "decreaseActivePowerBlock", title: "子站减闭锁", valueFun: (val) => ["闭锁", "未闭锁"][!val ? 1 : 0] },
]
const avcParamDefault: IDvsRunStateInfo<keyof IAgvcMQDataMap[string], string>[] = [
  ...avcCommonParam,
  { field: "AVCInput", title: "子站投退状态", valueFun: (val) => ["投入", "未投入"][!val ? 1 : 0] },
  { field: "AVCRemoteOperation", title: "子站运行状态", valueFun: (val) => ["远方", "就地"][!val ? 1 : 0] },
  { field: "additionalReactivePowerBlock", title: "子站增闭锁", valueFun: (val) => ["闭锁", "未闭锁"][!val ? 1 : 0] },
  { field: "decreaseReactivePowerBlock", title: "子站减闭锁", valueFun: (val) => ["闭锁", "未闭锁"][!val ? 1 : 0] },
]

// 获取AGC/AVC 参数配置数据， type: AGC,AVC
export function getAGVCParam(type: "AGC" | "AVC") {
  if (type === "AGC") return agcParamDefault
  return avcParamDefault
}
