/*
 * @Author: xiongman
 * @Date: 2023-05-16 10:29:40
 * @LastEditors: xiongman
 * @LastEditTime: 2023-05-16 10:29:40
 * @Description: 图表所需数据类型们
 */

// 单条图表数据的必要数据，公共数据格式
export interface ILineInfoBase {
  key: string
  nameInfo: Record<string, string> // 描述单个图表的信息对象
  data: (number | null)[]
}

// 图表组的必要数据，公共数据格式
export interface ILineGroupInfoBase {
  key: string
  xAxis: string[]
  dataList: ILineInfoBase[]
  nameInfo: ILineInfoBase["nameInfo"] // 描图表组的信息对象
}
