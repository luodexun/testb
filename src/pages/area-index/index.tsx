/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-23 15:31:01
 * @Description: 区域中心-指标总览
 */

import "./index.less"

import Comprehensive from "./comprehensive"
import GeneratingSet from "./generating-set"
import PowerCompleteRate from "./power-complete-rate"
import CompleteState from "./power-complete-state"
import PowerDailyTrend from "./power-daily-trend"
import RunTrend from "./run-trend"
import SiteDetail from "./site-detail"
import UtilizationHours from "./utilization-hours"

export default function AreaIndex() {
  return (
    <div className="l-full area-index-wrap">
      <div className="col-0">
        <Comprehensive title="综合指标" />
        <GeneratingSet title="机组指标" />
        <CompleteState title="发电量完成情况" />
        <PowerCompleteRate title="发电量完成率" />
      </div>
      <div className="l-full col-1">
        <PowerDailyTrend title="日电量趋势" />
        <UtilizationHours title="等效利用小时数" />
        <RunTrend title="运行趋势" />
        <SiteDetail title="场站详情" />
      </div>
    </div>
  )
}
