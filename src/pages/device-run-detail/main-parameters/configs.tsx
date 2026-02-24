/*
 * @Author: xiongman
 * @Date: 2023-09-27 15:10:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-31 14:09:19
 * @Description: 主要运行参数-配置数据
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"

import { TDeviceType } from "@/types/i-config.ts"

export const DVS_MAIN_PARAMETER_MAP: Partial<Record<TDeviceType, IDvsRunStateInfo[][]>> = {
  WT: [
    [
      { title: "风速", field: "windSpeed", subField: "WindSpeed1", icon: "icon-fengsu", unit: UNIT.WIND },
      { title: "舱外温度", field: "ambientTemp", subField: "AmbientTemp", icon: "icon-wendu", unit: UNIT.TEMPER },
      { title: "风向", field: "windDirection", subField: "WindDirection1", icon: "icon-fengxiang", unit: UNIT.ANGLE },
      {
        title: "机舱位置",
        field: "nacellePosition",
        subField: "NacPosDevToNorth",
        icon: "icon-weizhi",
        unit: UNIT.ANGLE,
      },
      {
        title: "变桨角度2",
        field: "pitchAngle2",
        subField: "PitActualAngle2",
        icon: "icon-yuansu-jiaodu",
        unit: UNIT.ANGLE,
      },
    ],
    [
      {
        title: "有功功率",
        field: "activePower",
        subField: "GridsideActivePower",
        icon: "icon-yougonggongshuai",
        unit: UNIT.POWER_K,
      },
      {
        title: "发电机转速",
        field: "generatorSpeed",
        subField: "GenSpeedModuleSpeed1",
        icon: "icon-gongzuozhuansu",
        unit: UNIT.ROTATE,
      },
      {
        title: "扭缆角度",
        field: "yawCableAngle",
        subField: "YwCableAngle",
        icon: "icon-xuanzhuanjiaodu",
        unit: UNIT.ANGLE,
      },
      {
        title: "变桨角度1",
        field: "pitchAngle1",
        subField: "PitActualAngle1",
        icon: "icon-yuansu-jiaodu",
        unit: UNIT.ANGLE,
      },
      {
        title: "变桨角度3",
        field: "pitchAngle3",
        subField: "PitActualAngle3",
        icon: "icon-yuansu-jiaodu",
        unit: UNIT.ANGLE,
      },
    ],
  ],
  PVINV: [
    [
      { title: "转换效率", field: "efficiency", subField: "Efficiency", icon: "icon-synchronize", unit: UNIT.PERCENT }, // valueFun: calcRate,
      {
        title: "输入功率",
        field: "inverterDcActivePower",
        subField: "TotalDcPower",
        actualShowSubField: "InverterDcActivePower",
        icon: "icon-gongshuai",
        unit: UNIT.POWER_K,
      },
      { title: "直流总电流", field: "dcCurrent", subField: "DcCurrent", icon: "icon-dianliu", unit: UNIT.CURRENT },
      { title: "机内温度", field: "innerTemp", subField: "InternalAirTemperature", actualShowSubField: "Unit1InnerTemp", icon: "icon-wendu", unit: UNIT.TEMPER },
    ],
    [
      {
        title: "有功功率",
        field: "activePower",
        subField: "ActivePower",
        actualShowSubField: "InverterActivePower",
        icon: "icon-pinshuai",
        unit: UNIT.POWER_K,
      },
      {
        title: "累计发电量",
        field: "inverterTotalProduction",
        subField: "TotalYield",
        actualShowSubField: "InverterTotalProduction",
        icon: "icon-fadianliang",
        unit: UNIT.ELEC,
      },
      { title: "直流总电压", field: "busVoltage", subField: "BusVoltage", icon: "icon-dianya", unit: UNIT.VOLAGE },
      { title: "IGBT温度", field: "IGBTTemp", subField: "Unit1Module1Temp", icon: "icon-wendu", unit: UNIT.TEMPER },
    ],
  ],
  ESPCS: [
    [
      { title: "有功功率", field: "activePower", subField: "ptll", icon: "icon-gongshuai", unit: UNIT.POWER_K },
      {
        title: "最大可充功率",
        field: "maxChargePower",
        subField: "pmaxchar",
        icon: "icon-chongdianzhanguanli",
        unit: UNIT.POWER_K,
      },
      {
        title: "最大可放功率",
        field: "maxDischargePower",
        subField: "pmaxdischar",
        icon: "icon-gongshuai",
        unit: UNIT.POWER_K,
      },
    ],
  ],
  SYZZZ: [],
}
