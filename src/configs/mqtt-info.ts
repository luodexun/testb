/*
 * @Author: xiongman
 * @Date: 2023-09-20 14:22:27
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 11:07:27
 * @Description:
 */

import { TDeviceType } from "@/types/i-config.ts"

// 风机/光伏逆变器/储能变流器 websocket 订阅主题
export const DEVICE_POINT_DATA_WS_TOPIC: Partial<Record<TDeviceType, string>> = {
  // 旧状态
  WT: "/ness/global/wt/pointData",
  PVINV: "/ness/global/pvinv/pointData",
  ESPCS: "/ness/global/espcs/pointData",
  SYZZZ: "/ness/monitor/syzzz/pointData",
  // // 新状态
  // WT: "/ness/global/wt/pointDataTest",
  // PVINV: "/ness/global/pvinv/pointDataTest",
  // ESPCS: "/ness/global/espcs/pointDataTest",
  // SYZZZ: "/ness/monitor/syzzz/pointDataTest",
}
export const DEVICE_POINT_DATA_WS_TOPIC_TEST: Partial<Record<TDeviceType, string>> = {
  WT: "/ness/global/wt/pointDataTest",
  PVINV: "/ness/global/pvinv/pointDataTest",
  ESPCS: "/ness/global/espcs/pointDataTest",
  SYZZZ: "/ness/monitor/syzzz/pointDataTest",
}
export const BASE_DATA_WS_TOPIC: Record<"globalCenter" | "center" | "station" | "boost", string> = {
  globalCenter: "/ness/global/center/pointData",
  // 集控数据：
  center: "/ness/monitor/center/pointData",
  // 场站数据：
  station: "/ness/global/station/pointData",
  boost: DEVICE_POINT_DATA_WS_TOPIC["SYZZZ"],
}

interface IWithPubWsTopicInfo {
  topicSuffix: string
  publicTopic: string
  uri: string
  desc: string
}
export const WITH_PUBLIC_WS_TOPIC: Record<
  "agvc" | "boost" | "cft" | "alarm" | "qxz" | "proxy" | "devicemng" | "deviceState" | "customAlarm",
  IWithPubWsTopicInfo
> = {
  agvc: {
    topicSuffix: "/ness",
    publicTopic: "global/api",
    uri: "/ness/monitor/agvc/pointData",
    desc: "AGVC的mqtt信息",
  },
  boost: {
    topicSuffix: "/ness",
    publicTopic: "global/api",
    uri: "/ness/monitor/syzzz/pointData",
    desc: "升压站电气设备的mqtt信息",
  },
  cft: {
    topicSuffix: "/ness",
    publicTopic: "global/api",
    uri: "/ness/monitor/cft/pointData",
    desc: "cft的mqtt信息",
  },
  qxz: {
    topicSuffix: "/ness",
    publicTopic: "global/api",
    uri: "/ness/monitor/jcy/pointData",
    desc: "气象站的mqtt信息",
  },
  alarm: {
    topicSuffix: "/alarm/#", ///alarm/441882W01/WT
    publicTopic: "global/api",
    uri: "/alarm/#",
    desc: "告警的mqtt信息",
  },
  customAlarm: {
    topicSuffix: "custom/alarm",
    publicTopic: "global/api",
    uri: "custom/alarm",
    desc: "自定义告警的mqtt信息",
  },
  proxy: {
    topicSuffix: "/ness",
    publicTopic: "global/proxy/api",
    uri: "/ness/uuid",
    desc: "mqtt代理请求http",
  },
  devicemng: {
    topicSuffix: "/ness",
    publicTopic: "global/api",
    uri: "/ness/monitor/tra/pointData",
    desc: "查询场站所有箱变的实时关键测点/遥信/遥测",
  },
  deviceState: {
    topicSuffix: "/ness/monitor/device/alarm",
    publicTopic: "global/api",
    uri: "/ness/monitor/device/alarm",
    desc: "设备状态消息告警",
  },
}

export const getOtherMqttDvs = (deviceType) => {
  const mqttInfo = {
    topicSuffix: "/ness",
    publicTopic: "global/api",
    uri: `/ness/monitor/${deviceType}/pointData`,
    desc: "光伏或储能其它设备类型测点数据",
  }
  return mqttInfo
}
