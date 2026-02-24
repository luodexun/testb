/*
 *@Author: chenmeifeng
 *@Date: 2023-10-11 10:05:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 16:41:11
 *@Description: 模块描述
 */
import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/control"

// 批量控制
//获取设备
export const controlBatchApiMap: IApiMapItem = {
  fetchControlAction: {
    url: `${SERVE_NAME}/action/execute`,
    method: "post",
    param_field: "params",
    desc: "控制中心-批量控制-控制下发",
  },
}

// 控制日志
export const controlApiMap: IApiMapItem = {
  getControlLog: {
    url: `${SERVE_NAME}/log/query`,
    method: "post",
    param_field: "params",
    desc: "控制中心-控制日志-日志列表",
  },
  resetVarify: {
    url: `${SERVE_NAME}/reset/verify`,
    method: "post",
    param_field: "hybrid",
    desc: "控制中心-复位校验",
  },
  fetchLogExportExcel: {
    url: `${SERVE_NAME}/log/exportExcel`,
    method: "post",
    responseType: "blob",
    param_field: "params",
    desc: "控制中心-控制日志-导出",
  },
}
