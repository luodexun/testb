/*
 * @Author: xiongman
 * @Date: 2023-09-06 17:06:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-15 16:55:22
 * @Description: 集中合并各个模块的接口信息
 */

import { alarmListApi, alarmRuleApi, alarmConfigs, serverApi } from "@/api/api-alarm.ts"
import { boostElectApiMap } from "@/api/api-boost.ts"
import { controlApiMap, controlBatchApiMap } from "@/api/api-control"
import {
  alarmFiveRuleApi,
  configApiMap,
  dataPointApiMap,
  deviceApiMap,
  dvsSignRecord,
  settingApiMap,
  stationApiMap,
} from "@/api/api-devicemng.ts"
import { areaElecApiMap } from "@/api/api-elec.ts"
import { gxScnApiMap } from "@/api/api-gx-screen"
import { hubeiScnApiMap } from "@/api/api-hb-screen"
import { dvsDetailApiMap, dvsSignalApiMap, dvsState, infoApiMap } from "@/api/api-monitor.ts"
import { planQuantityApiMap } from "@/api/api-quantity"
import { ruleApi } from "@/api/api-rule"
import { ssoApiMap } from "@/api/api-sso.ts"
import {
  communicationMap,
  crashTrackApiMap,
  dataAnalysisApiMap,
  dataQualityApiMap,
  getPowerDataApiMap,
  pointAnalysisApiMap,
  qualityAnalysisApiMap,
  reportEfficencyApi,
  reportGridApi,
  reportMeterApi,
  reportOperationApi,
  reportProductionApi,
  planEcle,
  reportDvsApiMap,
  reportLostDvsApiMap,
  reportHenanApi,
  templateApiMap,
  stationQuotaTrend,
} from "@/api/api-statistics.ts"
import { userMngApi } from "@/api/api-user"
import { IApiMapItem } from "@/types/i-api.ts"
const API_LIST = {
  alarmListApi,
  alarmRuleApi,
  alarmConfigs,
  serverApi,
  stationApiMap,
  deviceApiMap,
  configApiMap,
  infoApiMap,
  dvsDetailApiMap,
  controlApiMap,
  controlBatchApiMap,
  ssoApiMap,
  settingApiMap,
  planQuantityApiMap,
  dataPointApiMap,
  dataQualityApiMap,
  boostElectApiMap,
  areaElecApiMap,
  dataAnalysisApiMap,
  dvsState,
  userMngApi,
  reportGridApi,
  reportOperationApi,
  reportMeterApi,
  pointAnalysisApiMap,
  reportEfficencyApi,
  qualityAnalysisApiMap,
  crashTrackApiMap,
  getPowerDataApiMap,
  dvsSignalApiMap,
  reportProductionApi,
  stationQuotaTrend,
  gxScnApiMap,
  ruleApi,
  hubeiScnApiMap,
  communicationMap,
  planEcle,
  reportDvsApiMap,
  reportLostDvsApiMap,
  reportHenanApi,
  templateApiMap,
  alarmFiveRuleApi,
  dvsSignRecord,
}

const API_MAP = (function () {
  const result = { apiMap: {} as IApiMapItem, urlMap: {} as Record<string, string> }
  const { apiMap } = Object.values(API_LIST).reduce((prev, next) => {
    Object.entries(next).forEach(([apiKey, apiInfo]) => {
      if (prev.apiMap[apiKey]) {
        console.error(`有重复的apiKey：`, apiKey, prev.apiMap[apiKey], apiInfo)
        console.warn("将以后者为准")
      }
      prev.apiMap[apiKey] = apiInfo
      if (prev.urlMap[apiInfo.url]) {
        console.error(
          `有重复的apiUrl信息：url:${apiInfo.url}, apiKey1: ${prev.urlMap[apiInfo.url]}, apiKey2: ${apiKey}`,
        )
        console.warn("请去除重复的接口信息！")
      }
      prev.urlMap[apiInfo.url] = apiKey
    })
    return prev
  }, result)
  return apiMap
})()

export default API_MAP
