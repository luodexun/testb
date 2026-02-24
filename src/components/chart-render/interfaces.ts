/*
 * @Author: xiongman
 * @Date: 2022-11-09 17:38:25
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-09 17:38:25
 * @Description: 图表组件-数据类型们
 */

import { EChartsReactProps } from "echarts-for-react/src/types"

export interface IChartProps extends EChartsReactProps {
  option: any
  loading?: boolean
  wrapClass?: string
  empty?: boolean
  mapJson?: any
  onClick?: any
}

export interface IChartRef {
  resize: () => void
  getEchartsInstance: () => any
  setChartHeight: (h: string) => void
  getWrapDom: () => HTMLDivElement
}
