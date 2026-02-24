/*
 * @Author: xiongman
 * @Date: 2023-10-10 15:16:29
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-10 15:16:29
 * @Description: 日电量趋势-数据类型们
 */

export interface IStnPduTrend {
  stationCode: string // "441882S01" //场站编码
  Time: number // 1696089600000 //时间
  dailyProduction: number | null //日电量
}

export interface IStnPduTrendData {
  [stnCode: string]: IStnPduTrend[]
}

export interface IStnPduTrendDataAfterDeal {
  xAxis: string[]
  dataMap: Record<string, number[]> | null
}
