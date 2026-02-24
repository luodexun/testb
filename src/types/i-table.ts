/*
 * @Author: xiongman
 * @Date: 2022-11-09 16:24:33
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-09 16:24:33
 * @Description: 表格组件-数据类型们
 */

export interface IPageInfo {
  current: number
  pageSize: number
}

export interface ISearchPage {
  pageNum: number
  pageSize: number
}

// 分页查询参数
export interface ISchPageParams {
  pageNum?: number
  pageSize?: number
}
