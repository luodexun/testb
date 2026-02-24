/*
 * @Author: chenmeifeng
 * @Date: 2023-11-20 17:12:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-09 17:06:32
 * @Description:
 */
import { ColumnsType } from "antd/es/table"
export const helpMenu = [
  { name: "版本信息", key: "version" },
  { name: "风机状态", key: "wt_seasion", type: "wt" },
  { name: "逆变器状态", key: "pv_seasion", type: "pv" },
  { name: "储能变流器状态", key: "es_seasion", type: "es" },
  { name: "电气总览圆环状态说明", key: "elec" },
  { name: "测试声音", key: "audio" },
  { name: "告警配置", key: "alarm_setting" },
]
export const WT_TABLE_CONTENT_LIST: ColumnsType = [
  {
    title: "一级状态",
    width: 100,
    dataIndex: "oneName",
    onCell: (_, index) => {
      if (index === 1) {
        return { rowSpan: 4 }
      }
      if (index === 5) {
        return { rowSpan: 5 }
      }
      if (index === 10) {
        return { rowSpan: 2 }
      }
      // These two are merged into above cell
      if (
        index === 2 ||
        index === 3 ||
        index === 4 ||
        index === 6 ||
        index === 7 ||
        index === 8 ||
        index === 9 ||
        index === 11
      ) {
        return { rowSpan: 0 }
      }
      // if (index === 1) {
      //   return { colSpan: 0 }
      // }

      return {}
    },
  },
  {
    title: "二级状态",
    width: 140,
    dataIndex: "twoName",
  },
  {
    title: "状态解释",
    dataIndex: "state",
  },
]
export const PV_TABLE_CONTENT_LIST: ColumnsType = [
  {
    title: "一级状态",
    width: 100,
    dataIndex: "oneName",
    onCell: (_, index) => {
      if (index === 1) {
        return { rowSpan: 3 }
      }
      if (index === 5) {
        return { rowSpan: 2 }
      }
      // These two are merged into above cell
      if (index === 2 || index === 3 || index === 6) {
        return { rowSpan: 0 }
      }

      return {}
    },
  },
  {
    title: "二级状态",
    width: 140,
    dataIndex: "twoName",
  },
  {
    title: "状态解释",
    dataIndex: "state",
  },
]

export const ES_TABLE_CONTENT_LIST: ColumnsType = [
  {
    title: "一级状态",
    width: 100,
    dataIndex: "oneName",
  },
  {
    title: "二级状态",
    width: 140,
    dataIndex: "twoName",
  },
  {
    title: "状态解释",
    dataIndex: "state",
  },
]
export const WT_VERSION_LIST = [
  { oneName: "正常发电", twoName: "正常运行", state: "风机发电运行，无故障，无限功率" },
  { oneName: "限功率", twoName: "电网限功率", state: "风机发电运行，无故障，调度限功率，含调度限功率停机" },
  { oneName: "限功率", twoName: "主控限功率", state: "风机发电运行，无故障，主控自动限功率，包括扇区管理限功率）" },
  { oneName: "限功率", twoName: "手动限功率", state: "风机发电运行，无故障，本地或远程手动设置限功率" },
  { oneName: "限功率", twoName: "结冰限功率", state: "风机发电运行，无故障，通过逻辑判断风机结冰，自动限功率" },
  { oneName: "待机", twoName: "小风待机", state: "风机正常，非并网状态，无故障，风速小于启动风速" },
  { oneName: "待机", twoName: "大风切出", state: "风机正常，非并网状态，无故障，风速大于启动风速" },
  { oneName: "待机", twoName: "温度低待机", state: "风机正常，非并网状态，无故障,环境温度低于运行参数" },
  { oneName: "待机", twoName: "温度高待机", state: "风机正常，非并网状态，无故障,环境温度高于运行参数" },
  {
    oneName: "待机",
    twoName: "技术性待机",
    state: "风机正常，因机组技术需要待机，例如偏航、解缆、自检、润滑加脂，抗涡激等",
  },
  {
    oneName: "主动停机",
    twoName: "检修停机",
    state: "停机状态，风机维护开关闭合，人工挂牌，如检测、定检、巡检、消缺、技改、大部件计划性更换等",
  },
  { oneName: "主动停机", twoName: "其他停机", state: "停机状态，覆冰，台风，地震，民事原因导致的停机" },
  { oneName: "故障停机", twoName: "故障停机", state: "风机故障状态" },
  {
    oneName: "无通讯",
    twoName: "无通讯",
    state: "因电网故障，电气设备停运导致的停电，网络断开，数据不刷新等原因引起的无通讯",
  },
]

export const PV_VERSION_LIST = [
  { oneName: "正常发电", twoName: "正常发电", state: "逆变器正常运行" },
  { oneName: "限功率", twoName: "电网限功率", state: "逆变器正常运行，无故障，调度限功率，含限电停机" },
  { oneName: "限功率", twoName: "主控限功率", state: "逆变器正常运行，无故障，主控限功率（自动触发）" },
  { oneName: "限功率", twoName: "手动限功率", state: "逆变器正常运行，无故障，本地或SCADA限功率（人工手动限制）" },
  {
    oneName: "待机",
    twoName: "待机",
    state: "在“运行”状态下，如果直流侧电流很小（近似于0A）并保持一段时间，逆变器进入待机模式",
  },
  { oneName: "主动停机", twoName: "其他停机", state: "覆冰，台风，地震，民事原因导致的停机" },
  {
    oneName: "主动停机",
    twoName: "检修停机",
    state: "设备因检修需求主动停机，支持人工挂牌，如检测、定检、巡检、消缺、技改、大部件计划性更换等",
  },
  { oneName: "故障停机", twoName: "故障停机", state: "逆变器故障状态" },
  {
    oneName: "无通讯",
    twoName: "无通讯",
    state: "因电网故障，电气设备停运导致的停电，网络断开，数据不刷新等原因引起的无通讯",
  },
]

export const ES_VERSION_LIST = [
  { oneName: "充电", twoName: "充电", state: "储能系统正常运行状态，吸收有功功率，增加自身能量的存储" },
  { oneName: "放电", twoName: "放电", state: "储能系统正常运行状态，释放自身存储的能量，向外输出有功功率" },
  { oneName: "待机", twoName: "待机", state: "储能系统正常运行状态，既不充电也不放电，待机状态" },
  { oneName: "主动停机", twoName: "主动停机", state: "储能系统停机状态，若需进行充放电，需先启动至待机状态" },
  { oneName: "故障停机", twoName: "故障停机", state: "储能系统存在故障信号，无法正常运行" },
  {
    oneName: "无通讯",
    twoName: "无通讯",
    state: "因电网故障，电气设备停运导致的停电，网络断开，数据不刷新等原因引起的无通讯",
  },
]

export const OV_HELP = [
  { id: 1, text: "红外环红实心“表示运行状态”", icon: "hh" },
  { id: 2, text: "红外环绿实心“表示热备状态”", icon: "hl" },
  { id: 3, text: "绿外环红实心“表示试验状态”", icon: "lh" },
  { id: 4, text: "绿外环绿实心“表示冷备状态”", icon: "ll" },
  { id: 5, text: "灰外环灰实心“通讯中断状态”", icon: "gg" },
]
