/*
 * @Author: xiongman
 * @Date: 2023-09-21 12:05:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-29 10:08:04
 * @Description: 监控信息接口
 */

import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/monitor/info"

// 综合统计信息
export const infoApiMap: IApiMapItem = {
  getStationInfoData: {
    url: `${SERVE_NAME}/getStationInfo`,
    method: "get",
    desc: "综合统计信息-获取场站综合信息",
    repeat_request: true,
  },
  getStationEnergyData: {
    url: `${SERVE_NAME}/getStationEnergy`,
    method: "get",
    desc: "综合统计信息-获取场站能量综合信息",
  },
  getPowerDeviceInfoData: {
    url: `${SERVE_NAME}/getPowerDeviceInfo`,
    method: "get",
    desc: "综合统计信息-获取发电设备信息",
  },
  getCenterInfoData: {
    url: `${SERVE_NAME}/getCenterInfo`,
    method: "get",
    desc: "综合统计信息-获取区域中心综合信息",
  },
  // getCenterProductionData: {
  //   url: `${SERVE_NAME}/getCenterProduction`,
  //   method: "get",
  //   desc: "综合统计信息-获取区域中心能量信息",
  // },
  getAllDeviceInfoData: {
    url: `${SERVE_NAME}/getAllDeviceInfo`,
    method: "get",
    desc: "综合统计信息-获取区域中心所有设备信息信息",
  },
  getStationProductionData: {
    url: `${SERVE_NAME}/getStationProduction`,
    method: "get",
    desc: "综合统计信息-场站发电量完成率",
  },
  getStationProductionTrendData: {
    url: `${SERVE_NAME}/getStationProductionTrend`,
    method: "get",
    desc: "综合统计信息-场站日电量趋势",
  },
  getStationUtilizationHourTrendData: {
    url: `${SERVE_NAME}/getStationUtilizationHourTrend`,
    method: "get",
    desc: "综合统计信息-场站日电量趋势",
  },
  getStationPointTrendData: {
    url: `${SERVE_NAME}/getStationPointTrend`,
    method: "get",
    desc: "综合统计信息-运行趋势",
  },
}

// 机组监视
export const dvsDetailApiMap: IApiMapItem = {
  getDvsStateTrendData: {
    url: `${SERVE_NAME}/getDeviceStateTrend`,
    method: "get",
    desc: "机组监视-状态转换",
  },
  getDvsStateTrendDataV2: {
    url: `${SERVE_NAME}/getDeviceStateTrendV2`,
    method: "get",
    desc: "机组监视-状态转换V2",
  },
  getDvsStateTrendDataV3: {
    url: `${SERVE_NAME}/getDeviceStateTrendV3`,
    method: "get",
    desc: "机组监视-状态转换V2",
  },
  getDeviceStateData: {
    url: `${SERVE_NAME}/getDeviceState`,
    method: "get",
    desc: "机组监视-设备控制中的实时状态",
  },
  getDevicePointTrendData: {
    url: `${SERVE_NAME}/getDevicePointTrend`,
    method: "get",
    desc: "机组监视-设备控制中的实时状态",
  },
  getDeviceSystemTempTrendData: {
    url: `${SERVE_NAME}/getDeviceSystemTempTrend`,
    method: "get",
    desc: "机组监视-设备控制中的实时状态",
  },
  getDeviceSystemPointRealTimeData: {
    url: `${SERVE_NAME}/getDeviceSystemPoint`,
    method: "get",
    desc: "机组部件监视-测点实时数据",
  },
  exportDeviceSystemPoint: {
    url: `${SERVE_NAME}/exportDeviceSystemPoint`,
    method: "get",
    responseType: "blob",
    desc: "机组部件监视-导出数据",
  },
  testSyzz: {
    url: `${SERVE_NAME}/test`,
    method: "get",
    desc: "测试",
  },
}

export const dvsSignalApiMap: IApiMapItem = {
  getDeviceSignInfo: {
    url: `${SERVE_NAME}/getDeviceSignInfo`,
    method: "get",
    desc: "设备挂牌-设备挂牌信息",
  },
  getDeviceSignRecord: {
    url: `${SERVE_NAME}/getDeviceSignRecord`,
    method: "get",
    desc: "设备挂牌-设备挂牌信息",
  },
  updateDeviceSignRecord: {
    url: `${SERVE_NAME}/updateDeviceSignRecord`,
    method: "post",
    desc: "设备挂牌-设备挂牌信息",
  },
  getDeviceSignRecordV2: {
    url: `${SERVE_NAME}/getDeviceSignRecordV2`,
    method: "get",
    desc: "设备挂牌-设备挂牌信息V2",
  },
  exportDeviceSignRecord: {
    url: `${SERVE_NAME}/exportDeviceSignRecord`,
    method: "get",
    responseType: "blob",
    desc: "设备挂牌-导出",
  },
}

export const dvsState: IApiMapItem = {
  confirmDeviceState: {
    url: `${SERVE_NAME}/confirmDeviceState`,
    method: "get",
    desc: "确认首发状态方法 ",
  },
  getStationMngPoint: {
    url: `${SERVE_NAME}/getStationMngPoint`,
    method: "get",
    desc: "江苏实时巡视 ",
  },
}
