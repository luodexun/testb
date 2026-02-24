/*
 * @Author: xiongman
 * @Date: 2023-11-10 15:29:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-26 16:48:15
 * @Description:
 */

import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/statistics"

export const dataAnalysisApiMap: IApiMapItem = {
  getTrendData: {
    url: `${SERVE_NAME}/analysis/getTrendData`,
    method: "get",
    param_field: "params",
    desc: "数据分析-趋势分析-查询列表",
  },
  getTrendDataV2: {
    url: `${SERVE_NAME}/analysis/getTrendDataV2`,
    method: "get",
    desc: "数据分析-趋势分析-查询列表",
  },
  exportTrendData: {
    url: `${SERVE_NAME}/analysis/exportTrendData`,
    method: "get",
    responseType: "blob",
    desc: "数据分析-趋势分析-下载数据",
  },
}

export const pointAnalysisApiMap: IApiMapItem = {
  getScatterData: {
    url: `${SERVE_NAME}/analysis/getScatterData`,
    method: "get",
    param_field: "params",
    desc: "数据分析-散点分析-查询列表",
  },
  scatterDataExport: {
    url: `${SERVE_NAME}/analysis/exportScatterData`,
    method: "get",
    responseType: "blob",
    desc: "数据分析-散点分析-下载数据",
  },
}

export const stationQuotaTrend: IApiMapItem = {
  getStationQtData: {
    url: `${SERVE_NAME}/report/getStationData`,
    method: "get",
    desc: "场站数据",
  },
  exportStationData: {
    url: `${SERVE_NAME}/report/exportStationData`,
    method: "get",
    responseType: "blob",
    desc: "场站数据导出",
  },
}

export const reportProductionApi: IApiMapItem = {
  getProductionData: {
    url: `${SERVE_NAME}/report/getProductionData`,
    method: "get",
    param_field: "params",
    desc: "报表管理-电计量报表-查询列表",
  },
  getProductionDataV2: {
    url: `${SERVE_NAME}/report/getProductionDataV2`,
    method: "get",
    param_field: "params",
    desc: "报表管理-电计量报表-查询列表",
  },
  exportProductionData: {
    url: `${SERVE_NAME}/report/exportProductionData`,
    method: "get",
    responseType: "blob",
    desc: "报表管理-电计量报表-导出",
  },
}

export const reportGridApi: IApiMapItem = {
  getGridProductionData: {
    url: `${SERVE_NAME}/report/getGridProductionData`,
    method: "get",
    param_field: "params",
    desc: "报表管理-涉网电量报表-查询列表",
  },
  exportGridProductionData: {
    url: `${SERVE_NAME}/report/exportGridProductionData`,
    method: "get",
    responseType: "blob",
    desc: "报表管理-涉网电量报表-导出",
  },
  getGridProductionDataV2: {
    url: `${SERVE_NAME}/report/getGridProductionDataV2`,
    method: "get",
    param_field: "params",
    desc: "报表管理-涉网电量报表-新查询列表",
  },
  exportGridProductionDataV2: {
    url: `${SERVE_NAME}/report/exportGridProductionDataV2`,
    method: "get",
    responseType: "blob",
    desc: "报表管理-涉网电量报表-新导出",
  },
}

export const reportOperationApi: IApiMapItem = {
  getOperationData: {
    url: `${SERVE_NAME}/report/getOperationData`,
    method: "get",
    param_field: "params",
    desc: "报表管理-并网运行报表-查询列表",
  },
  exportOperationData: {
    url: `${SERVE_NAME}/report/exportOperationData`,
    method: "get",
    responseType: "blob",
    desc: "报表管理-并网运行报表-导出",
  },
  getIndicatorByPage: {
    url: `/devicemng/indicator/selectPage`,
    method: "post",
    desc: "AGVC-列表",
  },
  exportDataIndicator: {
    url: `/devicemng/indicator/exportData`,
    method: "post",
    responseType: "blob",
    desc: "AGVC-导出",
  },
}

export const reportHenanApi: IApiMapItem = {
  getHenanData: {
    url: `${SERVE_NAME}/report/custom/get/1`,
    method: "get",
    param_field: "params",
    desc: "报表管理-河南日报-查询列表",
  },
  exportHenanData: {
    url: `${SERVE_NAME}/report/custom/export/1`,
    method: "get",
    responseType: "blob",
    desc: "报表管理-河南日报-导出",
  },
  getHubeiData: {
    url: `${SERVE_NAME}/report/custom/get/2`,
    method: "get",
    param_field: "params",
    desc: "报表管理-湖北现货-查询列表",
  },
  exportHubeiData: {
    url: `${SERVE_NAME}/report/custom/export/2`,
    method: "get",
    responseType: "blob",
    desc: "报表管理-湖北现货-导出",
  },
}

export const reportMeterApi: IApiMapItem = {
  getDNJLData: {
    url: `${SERVE_NAME}/report/getDNJLData`,
    method: "get",
    param_field: "params",
    desc: "报表管理-电计量报表-查询列表",
  },
  exportDNJLData: {
    url: `${SERVE_NAME}/report/exportDNJLData`,
    method: "get",
    responseType: "blob",
    desc: "报表管理-电计量报表-导出",
  },
}

export const reportEfficencyApi: IApiMapItem = {
  getGLYCData: {
    url: `${SERVE_NAME}/analysis/getGLYCData`,
    method: "get",
    param_field: "params",
    desc: "报表管理-功率预测报表-查询列表",
  },
  exportGLYCata: {
    url: `${SERVE_NAME}/report/exportGLYCData`,
    method: "get",
    responseType: "blob",
    desc: "报表管理-功率预测报表-导出",
  },
  getReportGLYCData: {
    url: `${SERVE_NAME}/report/getGLYCData`,
    method: "get",
    param_field: "params",
    desc: "总览-功率总览",
  },
  getGLYCFutureData: {
    url: `${SERVE_NAME}/report/getGLYCFutureData`,
    method: "get",
    param_field: "params",
    desc: "总览-未来七天功率总览",
  },
}

export const getPowerDataApiMap: IApiMapItem = {
  getPowerList: {
    url: `${SERVE_NAME}/analysis/getPowerData`,
    method: "get",
    timeout: 0,
    param_field: "params",
    desc: "数据分析-功率曲线分析-数据查询",
  },
  exportPowerData: {
    url: `${SERVE_NAME}/analysis/exportPowerData`,
    method: "get",
    timeout: 0,
    responseType: "blob",
    desc: "数据分析-功率曲线分析-导出数据",
  },
}

export const crashTrackApiMap: IApiMapItem = {
  getCrashTrackData: {
    url: `${SERVE_NAME}/analysis/getAccidentData`,
    method: "get",
    timeout: 0,
    desc: "数据分析-事故追忆-获取追忆数据",
  },
  exportCrashTrackData: {
    url: `${SERVE_NAME}/analysis/exportAccidentData`,
    method: "get",
    timeout: 0,
    responseType: "blob",
    desc: "数据分析-事故追忆-导出追忆数据",
  },
}

export const qualityAnalysisApiMap: IApiMapItem = {
  getReceptionQualityData: {
    url: `${SERVE_NAME}/analysis/getReceptionQualityData`,
    method: "get",
    desc: "数据分析-数据质量-查询",
  },
  exportReceptionQualityData: {
    url: `${SERVE_NAME}/analysis/exportReceptionQualityData`,
    method: "get",
    responseType: "blob",
    desc: "数据分析-数据质量-导出",
  },
}

export const communicationMap: IApiMapItem = {
  getComDeviceState: {
    url: `${SERVE_NAME}/report/getDeviceState`,
    method: "get",
    desc: "通讯中断-列表详情",
  },
  getCenterTrend: {
    url: `${SERVE_NAME}/screen/getCenterTrend`,
    method: "get",
    desc: "功率预测",
  },
  getCenterPoint: {
    url: `${SERVE_NAME}/screen/getCenterPoint`,
    method: "get",
    desc: "统计功率预测",
  },
}

export const planEcle: IApiMapItem = {
  getDailyProductionData: {
    url: `${SERVE_NAME}/mock/getDailyProductionData`,
    method: "get",
    desc: "计划电量-修正列表-列表详情",
  },
  importMockDailyProduction: {
    url: `${SERVE_NAME}/mock/importMockDailyProduction`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data;charset=UTF-8",
    },
    desc: "计划电量-修正列表-导入",
  },
  exportMockDailyProduction: {
    url: `${SERVE_NAME}/mock/exportMockDailyProduction`,
    method: "get",
    responseType: "blob",
    desc: "计划电量-修正列表-导出",
  },
}

export const reportDvsApiMap: IApiMapItem = {
  getDeviceProductionData: {
    url: `${SERVE_NAME}/report/getDeviceProductionData`,
    method: "get",
    desc: "单机发电量-数据质量-查询",
  },
  exportDeviceProductionData: {
    url: `${SERVE_NAME}/report/exportDeviceProductionData`,
    method: "get",
    responseType: "blob",
    desc: "单机发电量-数据质量-导出",
  },
}

export const reportLostDvsApiMap: IApiMapItem = {
  getDeviceStateLossProduction: {
    url: `${SERVE_NAME}/report/getDeviceStateLossProduction`,
    method: "get",
    desc: "单机损失电量-数据质量-查询",
  },
  exportDeviceStateLossProduction: {
    url: `${SERVE_NAME}/report/exportDeviceStateLossProduction`,
    method: "get",
    responseType: "blob",
    desc: "单机损失电量-数据质量-导出",
  },
}

export const dataQualityApiMap: IApiMapItem = {
  getQualityStation: {
    url: `${SERVE_NAME}/quality/getStation`,
    method: "get",
    desc: "数据质量-今日数据质量一览",
  },
  getErrorDevice: {
    url: `${SERVE_NAME}/quality/getErrorDevice`,
    method: "get",
    desc: "数据质量-数据分析",
  },
  getQualityCenterTrend: {
    url: `${SERVE_NAME}/quality/getCenterTrend`,
    method: "get",
    desc: "数据质量-近14日阶段数据质量趋势图",
  },
  getLowestDevice: {
    url: `${SERVE_NAME}/quality/getLowestDevice`,
    method: "get",
    desc: "数据质量-今日数据质量最低的N个设备",
  },
  getDeviceTrend: {
    url: `${SERVE_NAME}/quality/getDeviceTrend`,
    method: "get",
    desc: "数据质量-单个设备质量最低趋势",
  },
}

export const templateApiMap: IApiMapItem = {
  getTemplate: {
    url: `${SERVE_NAME}/template/get`,
    method: "get",
    desc: "获取模板",
  },
  addTemplate: {
    url: `${SERVE_NAME}/template/add`,
    method: "post",
    desc: "新增模板",
  },
  updateTemplate: {
    url: `${SERVE_NAME}/template/update`,
    method: "post",
    desc: "更新模板",
  },
  deleteTemplate: {
    url: `${SERVE_NAME}/template/delete`,
    method: "get",
    desc: "删除模板",
  },
}
