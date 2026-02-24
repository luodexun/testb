/*
 * @Author: xiongman
 * @Date: 2023-09-05 10:41:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-19 10:52:19
 * @Description: 树型菜单初始数据-全部页面
 */

import MenuAlarm from "@/router/menu-alarm.ts"
import MenuAnalysis from "@/router/menu-analysis"
import MenuArea from "@/router/menu-area.ts"
import MenuControl from "@/router/menu-control.ts"
import MenuQuantity from "@/router/menu-quantity"
import MenuReport from "@/router/menu-report.ts"
import MenuSetting from "@/router/menu-setting.ts"
import MenuCustomize from "@/router/menu-self-alarm"

import { ITreeMenuItem } from "./interface"
import {
  ALARM_CENTER,
  ALARM_CUSTOMIZE,
  AREA_CENTER,
  CONTROL_CENTER,
  DATA_ANALYSIS,
  PLAN_QUANTITY,
  REPORT_CENTER,
  SETTING,
  SITE_CENTER,
} from "./variables"

export const TREE_MENU_DATA: ITreeMenuItem[] = [
  {
    title: "区域监视",
    key: AREA_CENTER,
    icon: <img alt="" src="/images/menu/area_center.png" style={{ width: "1.2em", height: "1.2em" }} />,
    children: MenuArea,
  },
  {
    title: "场站监视",
    key: SITE_CENTER,
    icon: <img alt="" src="/images/menu/site_center.png" style={{ width: "1.2em", height: "1.2em" }} />,
    children: [],
  },
  {
    title: "控制中心",
    key: CONTROL_CENTER,
    icon: <img alt="" src="/images/menu/control_center.png" style={{ width: "1.2em", height: "1.2em" }} />,
    children: MenuControl,
  },
  {
    title: "告警中心",
    key: ALARM_CENTER,
    icon: <img alt="" src="/images/menu/alarm_center.png" style={{ width: "1.2em", height: "1.2em" }} />,
    children: MenuAlarm,
  },
  {
    title: "报表管理",
    key: REPORT_CENTER,
    icon: <img alt="" src="/images/menu/report_center.png" style={{ width: "1.2em", height: "1.2em" }} />,
    children: MenuReport,
  },

  {
    title: "数据分析",
    key: DATA_ANALYSIS,
    icon: <img alt="" src="/images/menu/data_analysis.png" style={{ width: "1.2em", height: "1.2em" }} />,
    children: MenuAnalysis,
  },
  // {
  //   title: "计划电量管理",
  //   key: PLAN_QUANTITY,
  //   icon: <img alt="" src="/images/menu/plan_quantity.png" style={{ width: "1.2em", height: "1.2em" }} />,
  //   children: MenuQuantity,
  // },
  {
    title: "配置管理",
    key: SETTING,
    icon: <img alt="" src="/images/menu/setting.png" style={{ width: "1.2em", height: "1.2em" }} />,
    children: MenuSetting,
  },
  {
    title: "自定义告警",
    key: ALARM_CUSTOMIZE,
    icon: <img alt="" src="/images/menu/plan_quantity.png" style={{ width: "1.2em", height: "1.2em" }} />,
    children: MenuCustomize,
  },
]
