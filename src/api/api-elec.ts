/*
 *@Author: chenmeifeng
 *@Date: 2023-10-23 14:49:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-14 14:51:49
 *@Description: 电气总览api
 */
import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/monitor"

// 批量控制
//获取设备
export const areaElecApiMap: IApiMapItem = {
  getSYZZZBreakerPoint: {
    url: `${SERVE_NAME}/info/getSYZZZBreakerPoint`,
    method: "get",
    param_field: "params",
    desc: "电气总览-数据获取",
    // repeat_request: true,
  },
  getNetworkStatus: {
    url: `${SERVE_NAME}/sys/getNetworkStatus`,
    method: "get",
    param_field: "params",
    desc: "网络监视-数据获取",
  },
}
