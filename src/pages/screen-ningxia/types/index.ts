/*
 * @Author: chenmeifeng
 * @Date: 2024-12-31 15:38:20
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-31 15:39:52
 * @Description:
 */
export interface ITableColumn {
  name: string
  key: string
  align?: "left" | "right" | "center"
  width: string | number
  type?: "text" | "process" | "icon"
}
