/*
 *@Author: chenmeifeng
 *@Date: 2023-10-17 14:54:26
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-30 16:50:32
 *@Description: 计划电量api
 */
import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/devicemng"
export const planQuantityApiMap: IApiMapItem = {
  getProductionPlan: {
    url: `${SERVE_NAME}/productionPlan`,
    method: "get",
    param_field: "params",
    desc: "计划电量-查询列表",
  },
  fetchInsert: {
    url: `${SERVE_NAME}/productionPlan/batchInsert`,
    method: "post",
    data: "data",
    desc: "计划电量-插入计划",
  },
  fetchDeletePlan: {
    url: `${SERVE_NAME}/productionPlan/batchDelete`,
    method: "post",
    param_field: "params",
    desc: "计划电量-删除计划",
  },
  fetchEditPlan: {
    url: `${SERVE_NAME}/productionPlan/batchUpdate`,
    method: "post",
    data: "data",
    desc: "计划电量-编辑计划",
  },
  getProductionPlanDetail: {
    url: `/monitor/info/getStationMonthlyProduction`,
    method: "get",
    param_field: "params",
    desc: "计划电量-详情",
  },
  getWTSvg: {
    url: `/WT/icon_WT.svg`,
    baseURL: `/`,
    withCredentials: false,
    desc: "风机-SVG",
  },
}
