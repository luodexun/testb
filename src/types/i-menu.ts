/*
 * @Author: xiongman
 * @Date: 2023-09-05 11:09:03
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-05 11:09:03
 * @Description:
 */

interface IMenuBaseInfo {
  parentId?: string
  name?: string
  path?: string | null
  // 0 否 1 是
  keepAlive?: "0" | "1"
  sortOrder?: number
  icon?: string | null
  // 按钮权限, 页面 path + 按钮key，下划线拼接
  permission?: string | null
  // 0 菜单 1 按钮
  type?: "0" | "1"
}
// 菜单管理-表格数据
export interface IMenuTreeData extends IMenuBaseInfo {
  id?: string
  weight?: number
  // 表格处理附加字段
  keepAlvLabel?: "否" | "是"
  label?: string
  // 表格处理附加字段
  typeLabel?: "菜单" | "按钮"
  children?: IMenuTreeData[]
}
