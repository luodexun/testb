/*
 * @Author: xiongman
 * @Date: 2023-09-19 12:25:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 10:43:49
 * @Description: 新能源集控 设备管理台账 后台api
 */

import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/devicemng"

// 场站管理
export const stationApiMap: IApiMapItem = {
  allStationsData: {
    url: `${SERVE_NAME}/station`,
    method: "get",
    desc: "场站管理-获取所有场站数据",
  },
  updateStationsData: {
    url: `${SERVE_NAME}/station/update`,
    method: "post",
    desc: "场站管理-更新场站数据",
  },
  queryStationsDataByParams: {
    url: `${SERVE_NAME}/station/detail`,
    method: "post",
    desc: "场站管理-根据参数获取场站数据",
  },
  getStnDeviceType: {
    url: `${SERVE_NAME}/station/allDeviceType`,
    method: "get",
    desc: "控制中心-控制日志-查询所有所有设备类型",
  },
  getProjectCompany: {
    url: `${SERVE_NAME}/projectCompany`,
    method: "get",
    desc: "所有检修公司/项目公司",
  },
  getLineInfo: {
    url: `${SERVE_NAME}/config/lineInfo`,
    method: "get",
    desc: "线路",
  },
  getStationSvg: {
    url: `${SERVE_NAME}/static/stationSvg/{stationCode}/{svgName}.svg`,
    method: "get",
    desc: "svg图",
  },
}

// 设备管理
export const deviceApiMap: IApiMapItem = {
  allDevicesData: {
    url: `${SERVE_NAME}/device`,
    method: "get",
    desc: "设备管理-获取所有设备数据",
  },
  queryDevicesDataByParams: {
    url: `${SERVE_NAME}/device/detail`,
    method: "post",
    desc: "设备管理-根据参数获取设备数据",
    repeat_request: true,
  },
  getDeviceInfoById: {
    url: `${SERVE_NAME}/device/{id}`,
    method: "get",
    desc: "设备管理-根据设备id获取设备信息",
  },
  updateDevicesData: {
    url: `${SERVE_NAME}/device/updateDeviceTags`,
    method: "post",
    desc: "设备管理-更新设备数据",
  },
}

// 配置管理
export const configApiMap: IApiMapItem = {
  getCfgDeviceType: {
    url: `${SERVE_NAME}/config/deviceType`,
    method: "get",
    desc: "配置管理-查询所有设备类型",
  },
  getStationType: {
    url: `${SERVE_NAME}/config/stationType`,
    method: "get",
    desc: "配置管理-查询所有场站类型",
  },
  getDeviceStdState: {
    url: `${SERVE_NAME}/config/deviceStdState`, // 旧状态
    // url: `${SERVE_NAME}/config/deviceStdNewState`, // 新状态
    method: "get",
    desc: "配置管理-查询所有设备的标准状态",
    repeat_request: true,
  },
  deviceStdNewState: {
    url: `${SERVE_NAME}/config/deviceStdNewState`,
    method: "get",
    desc: "配置管理-查询所有设备的标准状态",
    repeat_request: true,
  },
  getControlType: {
    url: `${SERVE_NAME}/config/controlType`,
    method: "get",
    desc: "配置管理-查询所有的控制类型",
  },
  getAllAlarmLevel: {
    url: `${SERVE_NAME}/config/alarmLevel`,
    method: "get",
    desc: "告警中心-告警等级",
  },
  getAllBrakeLevel: {
    url: `${SERVE_NAME}/config/brakeLevel`,
    method: "get",
    desc: "告警中心-停机等级",
  },
  getSubSystemTypeData: {
    url: `${SERVE_NAME}/config/system`,
    method: "get",
    desc: "设备管理-查询子系统分类数据",
    repeat_request: true,
  },
}

export const settingApiMap: IApiMapItem = {
  getAllDeviceModel: {
    url: `${SERVE_NAME}/deviceModel`,
    method: "get",
    desc: "配置管理-功率曲线-设备型号数据字典",
  },
  getWtPowerCurveByStn: {
    url: `${SERVE_NAME}/wtPowerCurve`,
    method: "get",
    param_field: "params",
    desc: "配置管理-根据场站和设备型号查询功率曲线",
  },
  getWtPowerCurveById: {
    url: `${SERVE_NAME}/wtPowerCurve/id`,
    method: "get",
    param_field: "params",
    desc: "配置管理-功率曲线-根据功率曲线id查询功率曲线",
  },
  updateWtPowerCurve: {
    url: `${SERVE_NAME}/wtPowerCurve/update`,
    method: "post",
    data: "data",
    desc: "配置管理-功率曲线-更新功率曲线",
  },
  insertWtPowerCurve: {
    url: `${SERVE_NAME}/wtPowerCurve/insert`,
    method: "post",
    data: "data",
    desc: "配置管理-功率曲线-插入功率曲线",
  },
  getPvPowerCurveByStn: {
    url: `${SERVE_NAME}/pvPowerCurve`,
    method: "get",
    param_field: "params",
    desc: "配置管理-光伏根据场站和设备型号查询功率曲线",
  },
  updatePvPowerCurve: {
    url: `${SERVE_NAME}/pvPowerCurve/update`,
    method: "post",
    data: "data",
    desc: "配置管理-功率曲线-更新光伏功率曲线",
  },
  insertPvPowerCurve: {
    url: `${SERVE_NAME}/pvPowerCurve/insert`,
    method: "post",
    data: "data",
    desc: "配置管理-功率曲线-插入光伏功率曲线",
  },
  deleteWtPowerCurveById: {
    url: `${SERVE_NAME}/wtPowerCurve/delete/{id}`,
    method: "post",
    desc: "配置管理-功率曲线-删除单台风机功率曲线",
  },
  batchDltWtPowerCurveById: {
    url: `${SERVE_NAME}/wtPowerCurve/batchDelete`,
    method: "post",
    desc: "配置管理-功率曲线-删除单台风机功率曲线",
  },
  batchDltPvPowerCurveById: {
    url: `${SERVE_NAME}/pvPowerCurve/batchDelete`,
    method: "post",
    desc: "配置管理-功率曲线-删除单台风机功率曲线",
  },
  deletePvPowerCurveById: {
    url: `${SERVE_NAME}/pvPowerCurve/delete/{id}`,
    method: "post",
    desc: "配置管理-功率曲线-删除单台风机功率曲线",
  },
}

export const dataPointApiMap: IApiMapItem = {
  getDeviceSubPartPointData: {
    url: `${SERVE_NAME}/dataPoint`,
    method: "get",
    desc: "设备管理-查询设备测点数据",
    repeat_request: true,
  },
  updatePointData: {
    url: `${SERVE_NAME}/dataPoint/update`,
    method: "post",
    desc: "修改测点信息",
  },
}
// 五防规则
export const alarmFiveRuleApi: IApiMapItem = {
  fiveRuleAlarm: {
    url: `${SERVE_NAME}/rule/selectPage`,
    method: "post",
    desc: "查询",
  },
  fiveRuleSave: {
    url: `${SERVE_NAME}/rule/insert`,
    method: "post",
    desc: "新增",
  },
  fiveRuleUpdate: {
    url: `${SERVE_NAME}/rule/update`,
    method: "post",
    desc: "修改",
  },
  fiveRuleDelete: {
    url: `${SERVE_NAME}/rule/delete`,
    method: "post",
    desc: "删除",
  },
  fiveRuleExport: {
    url: `${SERVE_NAME}/rule/exportData`,
    method: "post",
    responseType: "blob",
    desc: "导出",
  },
}

// 挂牌
export const dvsSignRecord: IApiMapItem = {
  getSignRecordPage: {
    url: `${SERVE_NAME}/deviceSignRecord/getRecordPage`,
    method: "get",
    desc: "升压站挂牌-列表",
  },
  upSignRecord: {
    url: `${SERVE_NAME}/deviceSignRecord/upSignRecord`,
    method: "post",
    desc: "升压站挂牌-挂牌",
  },
  upDownSign: {
    url: `${SERVE_NAME}/deviceSignRecord/upDownSign`,
    method: "post",
    desc: "挂牌",
  },
  downSignRecord: {
    url: `${SERVE_NAME}/deviceSignRecord/downSignRecord`,
    method: "post",
    desc: "升压站挂牌-摘牌",
  },
  getSyzzzDeviceSignRecord: {
    url: `${SERVE_NAME}/deviceSignRecord/getDeviceSignRecord`,
    method: "get",
    desc: "设备挂牌-设备挂牌信息",
  },
  exportSyzzzDeviceSignRecord: {
    url: `${SERVE_NAME}/deviceSignRecord/exportDeviceSignRecord`,
    method: "get",
    responseType: "blob",
    desc: "导出",
  },
}
