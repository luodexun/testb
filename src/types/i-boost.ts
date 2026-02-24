/*
 * @Author: xiongman
 * @Date: 2023-11-07 10:16:21
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-07 10:16:21
 * @Description: 升压站电气页面数据类型
 */

import { TDeviceType } from "@/types/i-config.ts"

export interface IBoostSvgPath {
  stationCode: string
  svgName: string
  stationName?: string
}

/*
 * 收集svg中的节点信息;
 * ON:CTL5567:LineESClosedPosition 开关;
 * OFF:CTL5567:LineESClosedPosition 开关;
 * CB:CTL2255:CBClosedPosition 断路器;
 * TP:ActivePower 数据点;
 * CLK:menu 菜单按钮;
 * ARM:遥测点 光字牌;
 * UP:遥控点 档位升;
 * DOWN:遥控点 档位降;
 * STOP:遥控点 档位停;
 */
export type INodeIdType = "CB" | "ARM" | "CLK" | "TP" | "ON" | "OFF" | "UP" | "DOWN" | "STOP" | "LINE" | "YT"
export type TSvgDom = SVGGElement | SVGTextElement | SVGPathElement

export interface INodeIdField2DomInfo {
  type: INodeIdType
  dom: TSvgDom
  field: string
  name: string
  childrenId: string[]
  domLabel?: string
  value?: string | number | boolean
}

export interface IBoostMQDataMap {
  [deviceCode: string]: IBoostMQData | any
}

interface IBoostMQPayload {
  code: string
  success: boolean
  msg: string
  data: IBoostMQData | IBoostMQDataMap
}
export interface IBoostMQDataRes {
  uri: string
  payload: IBoostMQPayload
}

export interface IBoostMQData extends Record<string, string | number | boolean | null> {
  Time: number
  TimeStr?: string // 处理附加字段
  deviceCode: string // "441882W01SS11011120"
  device_type: TDeviceType // "SYZZZ"
  stationCode: string // "441882W01"
  // PhaseACurrent: number // 48.4
  // BusbarDSOpenPosition: boolean //false
  // CBClosedPosition: boolean //false
  // ZeroSequenceCurrentDirectionalProtectionSectionIITripping: boolean // true
  // GroupITripping: boolean //false
  // PhaseCCurrent: number // 13
  // UnderFrequencyLoadSheddingTripping: boolean // true
  // ZeroSequenceCurrentDirectionalProtectionSectionIIITripping: boolean // true
  // PhaseBCurrent: number // 81.8
  // LineReclosing: boolean // true
  // ZeroSequenceInsensitivenessProtectionSectionIOperation: boolean //false
  // CBThreePoleClosedPosition: boolean //false
  // maintenance_com_id: string // "`1`"
  // CBControlPowerSupplyIsFaulty: boolean // true
  // CBOpenPosition: boolean // true
  // OvercurrentProtectionSpeedSectionTripping: boolean // true
  // LineFESClosedPosition: boolean // true
  // model: string // "NR20230720"
  // CALineVoltage: number // 37.7
  // period: string // "`1`"
  // CBControlLoopDisconnected: boolean // true
  // CBClosedPosition_2213: boolean // true
  // PTSecondaryBreakageOfClass3P: boolean //false
  // UndervoltageProtectionTripping: boolean //false
  // FiberInterfaceDeviceFaultAlarm: boolean //false
  // CBLocalOperation: boolean //false
  // LightingACPowerSupplyBlackOut: boolean //false
  // Earthing_FaultDistanceProtectionSpeedSectionTripping: boolean // true
  // FullCurrentOfArrester: number // 30.7
  // AbnormalPressurePreventsOperating: boolean // true
  // OtherLowPressureAlarm: boolean // true
  // CBMotorRunsOutOfTime: boolean //false
  // project_com_id: string // "`1`"
  // ZeroSequenceOvercurrentProtectionInverseTimeTripping: boolean // true
  // ZeroSequenceOvercurrentProtectionSectionIITripping: boolean //false
  // ESControlPowerSupplyBlackOut: boolean //false
  // FiberChannel2Alarm: boolean //false
  // ESMotorlPowerSupplyBlackOut: boolean //false
  // manufacturer: string // "NANRUI"
  // BusbarESClosedPosition: boolean //false
  // KSDACPowerSupplyBlackOut: boolean // true
  // CBThreePoleIsInconsistent: boolean // true
  // LowPressurePreventsTripping: boolean //false
  // Earthing_FaultDistanceProtectionSectionITripping: boolean //false
  // NumberOfArresterActions: number // 89
  // CBGroup1ControlPowerSupplyIsFaulty: boolean // true
  // LineESClosedPosition: boolean // true
  // LineESOpenPosition: boolean // true
  // MechanicalClosingAndlLockingOfCircuitBreaker: boolean // true
  // PhaseCVoltage: number // 60.8
  // ZeroSequenceOvercurrentProtectionSectionIIITripping: boolean // true
  // InterlockRelease: boolean // true
  // VoltageDetecorFaultAlarm: boolean //false
  // GISLocalAmplitude: number // 61.5
  // LineProtectionDevicBlock: boolean // true
  // ESLocalOperation: boolean // true
  // ZeroSequenceVoltage: number // 38.2
  // LineFESOpenPosition: boolean // true
  // CommunicationInterruptionOfLineProtectionDevice: boolean //false
  // OvercurrentProtectionSectionIIITripping: boolean // true
  // Frequency: number // 14
  // CBLowPressureLocking: boolean //false
  // CBRemotOperation: boolean //false
  // SynchronismVoltage: number // 8.8
  // CBGroup2ControlLoopDisconnected: boolean //false
  // CBLowPressureAlarm: boolean // true
  // LineDSClosedPosition: boolean // true
  // BusbarDSClosedPosition: boolean // true
  // LineProtectionPTBreakage: boolean // true
  // LowPressurePreventsReclosing: boolean //false
  // CBThreePoleOpenPosition: boolean // true
  // CircuitBreakerHeaterIsFaulty: boolean // true
  // CBGroup2ControlPowerFailure: boolean //false
  // OvervoltageProtectionTripping: boolean // true
  // ZeroSequenceOvervoltageProtectionTripping: boolean //false
  // CBSpringUnchargedSignal: boolean //false
  // ActivePower: number // 95.2
  // LineDSOpenPosition: boolean // true
  // LineProtectionCTBreakage: boolean //false
  // CBGroup1ControlLoopDisconnected: boolean // true
  // ESRemotOperation: boolean //false
  // HighFrequencySeparationTripping: boolean // true
  // OvercurrentProtectionSectionITripping: boolean // true
  // LowPressurePreventsClosing: boolean //false
  // PhaseBVoltage: number // 80.2
  // MeasuringAndControlDeviceAlarm: boolean //false
  // OvercurrentProtectionInverseTimeTripping: boolean // true
  // SignalPowerSupplyBlackOut: boolean // true
  // ZeroSequenceOvercurrentProtectionSpeedSectionTripping: boolean // true
  // OverloadProtectionTripping: boolean //false
  // VoltageDetecorWithoutElectricity: boolean // true
  // Phase_DistanceProtectionSectionIIITripping: boolean //false
  // PTSecondaryBreakageOfClass05: boolean // true
  // GroupOfLineProtectionDeviceStartUp: boolean // true
  // BCLineVoltage: number // 30.3
  // ZeroSequenceCurrentDirectionalProtectionSectionITripping: boolean //false
  // line: string // "`1`"
  // BusbarESOpenPosition: boolean //false
  // CBMotorlPowerSupplyBlackOut: boolean //false
  // ABLineVoltage: number // 92
  // VoltageDetecorWithElectricity: boolean // true
  // ZeroSequenceOvercurrentProtectionSectionITripping: boolean // true
  // FiberChannel1Alarm: boolean // true
  // Phase_DistanceProtectionSectionIITripping: boolean //false
  // GroupIITripping: boolean // true
  // PhaseAVoltage: number // 86.3
  // LineDifferentialProtectionTripping: boolean // true
  // ReactivePower: number // 56.5
  // Earthing_FaultDistanceProtectionSectionIIITripping: boolean // true
  // Earthing_FaultDistanceProtectionSectionIITripping: boolean //false
  // OvercurrentProtectionSectionIITripping: boolean //false
  // LineProtectionDeviceAlarm: boolean // true
  // region_com_id: string // "`1`"
  // ZeroSequenceCurrent: number // 21.9
  // CircuitBreakerMotorIsFaulty: boolean // true
  // ZeroSequenceInsensitivenessProtectionSectionIIOperation: boolean //false
  // PF: number // 43.1
  // CommunicationInterruptionOfMeasuringAndControlDevice: boolean //false
  // TimeUNIT: string // "SEC"
  // Phase_DistanceProtectionSectionITripping: boolean // true
}
