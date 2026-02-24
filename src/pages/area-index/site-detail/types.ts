/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:50:31
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-28 18:50:31
 * @Description: 区域中心-指标总览-场站详情数据类型
 */

export interface ISiteDetailTableData {
  stationCode: string
  stationName: string
  [key: string]: number | string
}
