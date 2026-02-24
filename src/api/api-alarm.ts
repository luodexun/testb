/*
 * @Author: chenmeifeng
 * @Date: 2023-10-13 14:46:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-14 17:13:55
 * @Description:
 */
import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/alarm"
const SERVE_NAME1 = "/defenses"

export const alarmListApi: IApiMapItem = {
  getAlarmList: {
    url: `${SERVE_NAME}/alarmmsg/filterMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "告警中心-历史告警列表",
  },
  geAlarmCounts: {
    url: `${SERVE_NAME}/alarmmsg/alarmCounts`,
    method: "get",
    desc: "告警中心-实时告警数量",
    repeat_request: true,
  },
  getfilterRealTimeMsgData: {
    url: `${SERVE_NAME}/alarmmsg/filterRealTimeMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "设备详情-故障报警信息",
  },
  exportAlarmHistory: {
    url: `${SERVE_NAME}/alarmmsg/export`,
    method: "post",
    responseType: "blob",
    desc: "告警中心-导出告警",
  },
  exportRealTimeMsg: {
    url: `${SERVE_NAME}/alarmmsg/exportRealTimeMsg`,
    method: "post",
    responseType: "blob",
    desc: "告警中心-实时告警导出",
  },
  confirmAlarmmsg: {
    url: `${SERVE_NAME}/alarmmsg/confirm`,
    method: "post",
    data: "data",
    desc: "告警中心-批量确认",
  },
  alarmBlockRule: {
    url: `${SERVE_NAME}/alarmBlock/pageRule`,
    method: "post",
    param_field: "hybrid",
    desc: "告警中心-告警屏蔽列表",
  },
  alarmExportRule: {
    url: `${SERVE_NAME}/alarmBlock/exportRule`,
    method: "post",
    responseType: "blob",
    desc: "告警中心-导出告警屏蔽列表",
  },
  queryBlockMsg: {
    url: `${SERVE_NAME}/alarmBlock/queryBlockMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "告警中心-告警屏蔽记录",
  },
  queryMapByModel: {
    url: `${SERVE_NAME}/alarmBlock/queryMapByModel`,
    method: "post",
    param_field: "hybrid",
    desc: "告警中心-根据型号查询告警规则",
  },
  addBlock: {
    url: `${SERVE_NAME}/alarmBlock/addBlock`,
    method: "post",
    desc: "告警中心-新增告警屏蔽",
  },
  deleteBlock: {
    url: `${SERVE_NAME}/alarmBlock/deleteBlock`,
    method: "post",
    desc: "告警中心-取消告警屏蔽",
  },
  queryAnalyze: {
    url: `${SERVE_NAME}/alarmAnalyze/queryAnalyze`,
    method: "post",
    desc: "告警中心-告警分析",
  },
  exportAnalyze: {
    url: `${SERVE_NAME}/alarmAnalyze/exportAnalyze`,
    method: "post",
    responseType: "blob",
    desc: "告警中心-告警分析导出",
  },
  queryGroup: {
    url: `${SERVE_NAME}/alarmAnalyze/queryGroup`,
    method: "post",
    param_field: "hybrid",
    desc: "告警中心-告警分组信息查询",
  },
  exportGroup: {
    url: `${SERVE_NAME}/alarmAnalyze/exportGroup`,
    method: "post",
    responseType: "blob",
    desc: "告警中心-告警分组信息导出",
  },
  groupByAlarmDetail: {
    url: `${SERVE_NAME}/alarmAnalyze/groupByAlarmDetail`,
    method: "post",
    param_field: "hybrid",
    desc: "告警中心-告警分组-详情查询(1-按首发故障分组)",
  },
  exportAlarmDetail: {
    url: `${SERVE_NAME}/alarmAnalyze/exportAlarmDetail`,
    method: "post",
    responseType: "blob",
    desc: "告警中心-告警分组-详情导出(1-按首发故障分组)",
  },
  alarmUpdateMap: {
    url: `${SERVE_NAME}/alarmBlock/updateMap`,
    method: "post",
    desc: "告警中心-告警屏蔽-更新告警规则映射表)",
  },
  queryRoughMsg: {
    url: `${SERVE_NAME}/alarmmsg/queryRoughMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "设备详情页面-实时告警查询",
  },
  getFinalAlarm: {
    url: `/ttsalarm/api/getFinalAlarm`,
    method: "get",
    desc: "请求mp3文件",
  },
  getAlarmAudio: {
    url: `/ttsalarm/api/getAlarmAudio`,
    method: "post",
    desc: " 生成任意音频",
  },
  queryFoldMsg: {
    url: `${SERVE_NAME}/alarmmsg/queryFoldMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "告警中心-新实时告警-查询",
  },
  exportFoldMsg: {
    url: `${SERVE_NAME}/alarmmsg/exportFoldMsg`,
    method: "post",
    responseType: "blob",
    desc: "导出",
  },
  flodBatchConfirm: {
    url: `${SERVE_NAME}/alarmmsg/batchConfirm`,
    method: "post",
    desc: "确认",
  },
  queryExpandMsg: {
    url: `${SERVE_NAME}/alarmmsg/queryExpandMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "告警中心-新实时告警-详情-查询",
  },
  exportExpandMsg: {
    url: `${SERVE_NAME}/alarmmsg/exportExpandMsg`,
    method: "post",
    responseType: "blob",
    desc: "详情导出",
  },
  confirmFoldMsg: {
    url: `${SERVE_NAME}/alarmmsg/confirmFoldMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "确认",
  },
}
export const alarmRuleApi: IApiMapItem = {
  customAlarm: {
    url: `${SERVE_NAME1}/customAlarm/select`,
    method: "post",
    param_field: "hybrid",
    desc: "告警规则-自定义规则查询",
  },
  customAlarmSave: {
    url: `${SERVE_NAME1}/customAlarm/save`,
    method: "post",
    desc: "告警规则-自定义规则新增",
  },
  customAlarmUpdate: {
    url: `${SERVE_NAME1}/customAlarm/update`,
    method: "post",
    desc: "告警规则-自定义规则修改",
  },
  customAlarmDelete: {
    url: `${SERVE_NAME1}/customAlarm/delete`,
    method: "post",
    desc: "告警规则-自定义规则删除",
  },
  updateRulesEnable: {
    url: `/devicemng/alarmRule/updateRulesEnable`,
    method: "post",
    desc: "告警规则-是否启用",
  },
  updateRulesAction: {
    url: `/devicemng/alarmRule/updateRulesAction`,
    method: "post",
    desc: "告警规则-关联停机",
  },
  exportRuleAlarm: {
    url: `${SERVE_NAME1}/customAlarm/exportRule`,
    method: "post",
    responseType: "blob",
    desc: "告警规则-导出",
  },
  pointLastedValue: {
    url: `${SERVE_NAME1}/customAlarm/pointValue`,
    method: "post",
    desc: "告警规则-测点最新值查询",
  },
  selectRptMsg: {
    url: `${SERVE_NAME1}/customAlarm/selectMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "自定义告警结果-查询",
  },
  exportRptMsg: {
    url: `${SERVE_NAME1}/customAlarm/exportMsg`,
    method: "post",
    responseType: "blob",
    desc: "自定义告警结果-导出",
  },
  confirmRptMsg: {
    url: `${SERVE_NAME1}/customAlarm/confirmMsg`,
    method: "post",
    desc: "自定义告警结果-确认",
  },
  happeningMsg: {
    url: `${SERVE_NAME}/alarmmsg/happeningMsg`,
    method: "post",
    param_field: "hybrid",
    desc: "未结束实时告警数据",
  },
}

export const alarmConfigs: IApiMapItem = {
  queryBroadcastConfig: {
    url: `${SERVE_NAME}/alarmBlock/broadcastConfig/query`,
    method: "get",
    desc: "查询播放配置",
  },
  updateBroadcastConfig: {
    url: `${SERVE_NAME}/alarmBlock/broadcastConfig/update`,
    method: "post",
    desc: "修改播放配置",
  },
  queryIsAlarm: {
    url: `/transfer/config/queryIsAlarm`,
    method: "get",
    desc: "挂牌关联是否告警",
  },
  updateIsAlarm: {
    url: `/transfer/config/updateIsAlarm`,
    method: "post",
    desc: "配置关闭告警",
  },
  closeAlarm: {
    url: `/devicemng/alarmMqtt/closeAlarm`,
    method: "get",
    desc: "所有用户关闭告警弹窗",
  },
  getSecondEamOrder: {
    url: `/devicemng/eamOrder/getSecondEamOrder`,
    method: "get",
    desc: "挂牌选择列表",
  },
  secondSignRecord: {
    url: `/devicemng/eamOrder/secondSignRecord`,
    method: "post",
    desc: "用户选择需要挂牌",
  },
  secondCancelRecord: {
    url: `/devicemng/eamOrder/secondCancelRecord`,
    method: "post",
    desc: "用户选择无需挂牌",
  },
  selectPage: {
    url: `/devicemng/eamOrder/selectPage`,
    method: "post",
    desc: "工单日志查询",
  },
  exportEamOrder: {
    url: `/devicemng/eamOrder/exportEamOrder`,
    method: "post",
    responseType: "blob",
    desc: "工单日志导出",
  },
}

export const serverApi: IApiMapItem = { 
  overview: {
    url: `${SERVE_NAME1}/sysMonitor/overview`,
    method: "get",
    param_field: "hybrid",
    desc: "获取全局概览",
  },
  region: {
    url: `${SERVE_NAME1}/sysMonitor/region`,
    method: "post",
    // param_field: "hybrid",
    desc: "查询集控服务器监控数据列表",
  },
  station: {
    url: `${SERVE_NAME1}/sysMonitor/station`,
    method: "post",
    // param_field: "hybrid",
    desc: "查询场站服务器监控数据列表",
  },
  detail: {
    url: `${SERVE_NAME1}/sysMonitor/detail`,
    method: "post",
    // param_field: "hybrid",
    desc: "获取指定服务器的完整指标",
  },
  trend: {
    url: `${SERVE_NAME1}/sysMonitor/trend`,
    method: "post",
    // param_field: "hybrid",
    desc: "获取近5min CPU/内存/磁盘趋势",
  },
  queryOrgInfo: {
    url: `${SERVE_NAME1}/sysMonitor/queryOrgInfo`,
    method: "get",
    param_field: "hybrid",
    desc: "获取org_monitor表配置信息",
  },
}
