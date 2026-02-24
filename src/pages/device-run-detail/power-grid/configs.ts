/*
 * @Author: xiongman
 * @Date: 2023-09-26 17:58:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-31 14:16:02
 * @Description: 涉网信息-配置数据们
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"

interface IGridInfoItem extends Partial<IDvsRunStateInfo<any>> {
  children?: IGridInfoItem[]
  unit?: string
}
interface IGridTypeInfo {
  [type: string]: IGridInfoItem[]
}
// 涉网信息内容配置
export const GRID_INFO: IGridTypeInfo = {
  WT: [
    {
      title: "A相",
      color: "#E67726",
      children: [
        { title: "A相" },
        { title: "相电压", field: "phaseVoltageA", unit: UNIT.PHASE_VOLAGE, subField: "ConGridsidePhaseVolL1" },
        { title: "相电流", field: "phaseCurrentA", unit: UNIT.CURRENT, subField: "ConGridsidePhaseCurrentL1" },
        { title: "无功功率", color: "#00F7FE" },
        {
          title: "无功功率_值",
          field: "reactivePower",
          unit: UNIT.REACTIVE,
          color: "#00F7FE",
          subField: "GridsideReactivePower",
        },
      ],
    },
    {
      title: "B相",
      color: "#00E287",
      children: [
        { title: "B相" },
        { title: "相电压", field: "phaseVoltageB", unit: UNIT.PHASE_VOLAGE, subField: "ConGridsidePhaseVolL2" },
        { title: "相电流", field: "phaseCurrentB", unit: UNIT.CURRENT, subField: "ConGridsidePhaseCurrentL2" },
        { title: "功率因数", color: "#00F7FE" },
        { title: "功率因数_值", field: "powerFactor", color: "#00F7FE", subField: "TurbinePowFactor" },
      ],
    },
    {
      title: "C相",
      color: "#FF4B3A",
      children: [
        { title: "C相" },
        { title: "相电压", field: "phaseVoltageC", unit: UNIT.PHASE_VOLAGE, subField: "ConGridsidePhaseVolL3" },
        { title: "相电流", field: "phaseCurrentC", unit: UNIT.CURRENT, subField: "ConGridsidePhaseCurrentL3" },
        { title: "电网频率", color: "#00F7FE" },
        {
          title: "电网频率_值",
          field: "gridFrequency",
          unit: UNIT.FREQUENCY,
          subField: "GridFrq",
          color: "#00F7FE",
        },
      ],
    },
  ],
  PVINV: [
    {
      title: "A相",
      color: "#E67726",
      children: [
        { title: "A相" },
        { title: "相电压", field: "phaseVoltageA", unit: UNIT.PHASE_VOLAGE, subField: "PhaseAVoltage", actualShowSubField: "InverterPhaseVoltageA" },
        { title: "相电流", field: "phaseCurrentA", unit: UNIT.CURRENT, subField: "PhaseACurrent", actualShowSubField: "InverterPhaseCurrentA" },
        { title: "无功功率", color: "#00F7FE" },
        {
          title: "无功功率_值",
          field: "reactivePower",
          unit: UNIT.REACTIVE,
          subField: "ReactivePower",
          actualShowSubField: "InverterReactivePower",
          color: "#00F7FE",
        },
      ],
    },
    {
      title: "B相",
      color: "#00E287",
      children: [
        { title: "B相" },
        { title: "相电压", field: "phaseVoltageB", unit: UNIT.PHASE_VOLAGE, subField: "PhaseBVoltage", actualShowSubField: "InverterPhaseVoltageB" },
        { title: "相电流", field: "phaseCurrentB", unit: UNIT.CURRENT, subField: "PhaseBCurrent", actualShowSubField: "InverterPhaseCurrentB" },
        { title: "功率因数", color: "#00F7FE" },
        {
          title: "功率因数_值",
          field: "powerFactor",
          subField: "PowerFactor",
          actualShowSubField: "InverterPowerFactor",
          color: "#00F7FE",
        },
      ],
    },
    {
      title: "C相",
      color: "#FF4B3A",
      children: [
        { title: "C相" },
        { title: "相电压", field: "phaseVoltageC", unit: UNIT.PHASE_VOLAGE, subField: "PhaseCVoltage", actualShowSubField: "InverterPhaseVoltageC" },
        { title: "相电流", field: "phaseCurrentC", unit: UNIT.CURRENT, subField: "PhaseCCurrent", actualShowSubField: "InverterPhaseCurrentC" },
        { title: "电网频率", color: "#00F7FE" },
        {
          title: "电网频率_值",
          field: "gridFrequency",
          unit: UNIT.FREQUENCY,
          subField: "GridFrequency",
          actualShowSubField: "InverterGridFrequency",
          color: "#00F7FE",
        },
      ],
    },
  ],
  ESPCS: [
    {
      title: "A相",
      color: "#E67726",
      children: [
        { title: "A相" },
        { title: "相电压", field: "phaseVoltageA", unit: UNIT.PHASE_VOLAGE, subField: "pcsua" },
        { title: "相电流", field: "phaseCurrentA", unit: UNIT.CURRENT, subField: "pcsia" },
        { title: "无功功率", color: "#00F7FE" },
        { title: "无功功率_值", field: "reactivePower", unit: UNIT.REACTIVE, subField: "qtll", color: "#00F7FE" },
      ],
    },
    {
      title: "B相",
      color: "#00E287",
      children: [
        { title: "B相" },
        { title: "相电压", field: "phaseVoltageB", unit: UNIT.PHASE_VOLAGE, subField: "pcsub" },
        { title: "相电流", field: "phaseCurrentB", unit: UNIT.CURRENT, subField: "pcsib" },
        { title: "功率因数", color: "#00F7FE" },
        { title: "功率因数_值", field: "powerFactor", subField: "pcspf", color: "#00F7FE" },
      ],
    },
    {
      title: "C相",
      color: "#FF4B3A",
      children: [
        { title: "C相" },
        { title: "相电压", field: "phaseVoltageC", unit: UNIT.PHASE_VOLAGE, subField: "pcsuc" },
        { title: "相电流", field: "phaseCurrentC", unit: UNIT.CURRENT, subField: "pcsic" },
        { title: "电网频率", color: "#00F7FE" },
        {
          title: "电网频率_值",
          field: "gridFrequency",
          unit: UNIT.FREQUENCY,
          subField: "pcsgfreq",
          color: "#00F7FE",
        },
      ],
    },
  ],
}
