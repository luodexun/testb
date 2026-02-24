/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 10:32:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-20 10:05:12
 * @Description: 湖北大屏接口
 */
import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/monitor"
const DEVS = "/devicemng"

// 批量控制
//获取设备
export const hubeiScnApiMap: IApiMapItem = {
  getStationStat: {
    url: `${SERVE_NAME}/info/getStationStat`,
    method: "get",
    desc: "地图“大区/检修公司/场站”基础装机数据",
  },
  getScreenPoint: {
    url: `${SERVE_NAME}/info/getScreenPoint`,
    method: "get",
    desc: "地图统计指标-大区维度",
    repeat_request: true,
  },
  queryBrand: {
    url: `${DEVS}/screenDisplay/queryBrand`,
    method: "get",
    desc: "品牌占比",
  },
  getCenterProduction: {
    url: `${SERVE_NAME}/info/getCenterProduction`,
    method: "get",
    desc: "发电量概览",
  },
}
