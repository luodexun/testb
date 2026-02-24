/*
 * @Author: xiongman
 * @Date: 2023-02-06 13:46:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-10 16:25:28
 * @Description: 保存到本地数据的配置
 */

import { TStorageInfo } from "@/types/i-api"

const StorageUserInfo: TStorageInfo = { key: "ANY_INFO", store: "localStorage", desc: "登录用户信息" }

const StorageSubSysType: TStorageInfo = {
  key: "SUB_SYS_TYPE",
  store: "localStorage",
  urlKey: "getSubSystemTypeData",
  desc: "子系统分类数据",
}

const StorageStationData: TStorageInfo = {
  key: "stationData",
  store: "localStorage",
  refresh: true,
  urlKey: "allStationsData",
  desc: "所有的场站数据",
}

const StorageCompanyData: TStorageInfo = {
  key: "proAndComList",
  store: "localStorage",
  refresh: true,
  urlKey: "getProjectCompany",
  desc: "检修公司或者区域公司",
}

const StorageDeviceType: TStorageInfo = {
  key: "DEVICE_TYPE",
  store: "localStorage",
  urlKey: "getCfgDeviceType",
  desc: "所有设备类型",
}
const StorageStationType: TStorageInfo = {
  key: "STATION_TYPE",
  store: "localStorage",
  urlKey: "getStationType",
  desc: "所有设备类型",
}
const StorageStnDvsType: TStorageInfo = {
  key: "STATION_DEVICE_TYPE",
  store: "localStorage",
  urlKey: "getStnDeviceType",
  desc: "各个场站的设备类型",
}
const StorageDeviceStdState: TStorageInfo = {
  key: "DEVICE_STD_STATE",
  store: "localStorage",
  urlKey: "getDeviceStdState",
  desc: "所有设备类型状态",
}
const StorageDeviceStdNewState: TStorageInfo = {
  key: "DEVICE_STD_NEW_STATE",
  store: "localStorage",
  urlKey: "deviceStdNewState",
  desc: "所有设备类型",
}
const StorageControlType: TStorageInfo = {
  key: "CONTROL_TYPE",
  store: "localStorage",
  urlKey: "getControlType",
  desc: "所有操作类型",
}

const StorageDeviceSystem: TStorageInfo = {
  key: "DEVICE_SYSTEM",
  store: "localStorage",
  urlKey: "getSubSystemTypeData",
  desc: "子系统映射",
}
const StorageDeviceSignal: TStorageInfo = {
  key: "DEVICE_SIGNAL",
  store: "localStorage",
  urlKey: "getDeviceSignInfo",
  desc: "设备挂牌信息",
}

const StorageConfigSystem: TStorageInfo = {
  key: "CONFIG_SYSTEM_MAP",
  store: "localStorage",
  desc: "子系统映射",
}

const StorageDeviceModelMap: TStorageInfo = {
  key: "DEVICE_MODEL_MAP",
  store: "localStorage",
  desc: "设备型号数据字典",
}

//全部测点
const StorageConfigPoint: TStorageInfo = {
  key: "POINT_DATA",
  store: "localStorage",
  desc: "全部测点",
}

const StorageAlarmList: TStorageInfo = {
  key: "alarmList20",
  store: "localStorage",
  desc: "实时告警存储",
}
const StorageAlarmLevels: TStorageInfo = {
  key: "alarmlevelLs",
  store: "localStorage",
  urlKey: "getAllAlarmLevel",
  desc: "告警等级",
}

const StorageAlarmVoice: TStorageInfo = { key: "alarmVoice", store: "localStorage", desc: "记录是否播放告警录音" }

const StorageChartChoose: TStorageInfo = { key: "chartChoose", store: "sessionStorage", desc: "记录组合echart图的选择" }
const StorageIsAlarmGo: TStorageInfo = {
  key: "isAlarmGo",
  store: "sessionStorage",
  desc: "记录是否是从告警弹框跳转到场站设备矩阵",
}
const StorageOtherMsg: TStorageInfo = {
  key: "otherMsg",
  store: "sessionStorage",
  desc: "记录零碎信息，格式自定义",
}
const StorageCurDvsInfo: TStorageInfo = {
  key: "curDeviceInfo",
  store: "sessionStorage",
  desc: "记录当前设备信息",
}
const StorageStateChoose: TStorageInfo = {
  key: "stateChoose",
  store: "sessionStorage",
  desc: "记录状态总览下的状态选择状态",
}
const StorageRolePermission: TStorageInfo = {
  key: "ROLE_PERMISSION",
  store: "localStorage",
  desc: "用户菜单按钮权限",
}
const StorageFakeData: TStorageInfo = { key: "fakeData", store: "localStorage", desc: "样例数据使用标记" }
const StorageGenerateSet: TStorageInfo = { key: "GenerateSetFake", store: "localStorage", desc: "机组指标临时数据" }
const StorageComprehensive: TStorageInfo = { key: "ComprehensiveFake", store: "localStorage", desc: "综合指标临时数据" }
const StorageSvgAnalogSet: TStorageInfo = {
  key: "SvgAnalogDataFake",
  store: "localStorage",
  desc: "升压站svg中临时数据",
}

const StorageShielRemindTime: TStorageInfo = {
  key: "shieldRemindTime",
  store: "localStorage",
  desc: "记录告警屏蔽提醒时间",
}

const StorageRptPowerClmn: TStorageInfo = {
  key: "rptPowerColumns",
  store: "localStorage",
  desc: "发电量报表表头",
}

// 刷新时需要清理存储的列表，用 TStorageInfo 的refresh判断收集
export const REFRESH_STORAGE: Record<"list", TStorageInfo[]> = { list: [] }

export {
  StorageAlarmLevels,
  StorageAlarmList,
  StorageAlarmVoice,
  StorageChartChoose,
  StorageCompanyData,
  StorageComprehensive,
  StorageConfigPoint,
  StorageConfigSystem,
  StorageControlType,
  StorageCurDvsInfo,
  StorageDeviceModelMap,
  StorageDeviceSignal,
  StorageDeviceStdNewState,
  StorageDeviceStdState,
  StorageDeviceSystem,
  StorageDeviceType,
  StorageFakeData,
  StorageGenerateSet,
  StorageIsAlarmGo,
  StorageOtherMsg,
  StorageRolePermission,
  StorageRptPowerClmn,
  StorageShielRemindTime,
  StorageStateChoose,
  StorageStationData,
  StorageStationType,
  StorageStnDvsType,
  StorageSubSysType,
  StorageSvgAnalogSet,
  StorageUserInfo,
}
