/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-10 14:48:11
 * @Description: 区域中心-指标总览
 */

import "./index_v2.less"

import { Tabs } from "antd"

import Comprehensive from "./comprehensive"
import GeneratingSet from "./generating-set"
import PowerCompleteRate from "./power-complete-rate"
import CompleteState from "./power-complete-state/index_v2"
import PowerDailyTrend from "./power-daily-trend"
import RunTrend from "./run-trend"
import SiteDetail from "./site-detail"
import UtilizationHours from "./utilization-hours"

const items = [
  {
    key: "1",
    label: "日电量趋势",
    destroyOnHidden: true,
    children: <PowerDailyTrend title="日电量趋势" />,
  },
  {
    key: "2",
    label: "等效利用小时数",
    destroyOnHidden: true,
    children: <UtilizationHours title="等效利用小时数" />,
  },
  {
    key: "3",
    label: "运行趋势",
    destroyOnHidden: true,
    children: <RunTrend title="运行趋势" />,
  },
  {
    key: "4",
    label: "场站详情",
    destroyOnHidden: true,
    children: <SiteDetail title="场站详情" />,
  },
  {
    key: "5",
    label: "发电量完成率",
    destroyOnHidden: true,
    children: <PowerCompleteRate title="发电量完成率" />,
  },
]
export default function AreaIndex() {
  return (
    <div className="l-full area-index-wrap">
      <div className="area-index-top">
        <Comprehensive title="综合指标" />
        <GeneratingSet title="机组指标" />
        <CompleteState title="发电量完成情况" />
      </div>
      <div className="area-index-bottom">
        <Tabs defaultActiveKey="1" destroyOnHidden items={items} />
      </div>
    </div>
  )
}
