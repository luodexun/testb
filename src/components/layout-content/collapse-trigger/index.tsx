/*
 * @Author: xiongman
 * @Date: 2023-04-14 10:19:14
 * @LastEditors: xiongman
 * @LastEditTime: 2023-04-14 10:19:14
 * @Description: 菜单折叠触发按钮组件
 */

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { createElement } from "react"

export default function CollapseTrigger(props: { value: boolean; onChange: (value: boolean) => void }) {
  const { value, onChange } = props
  return createElement(value ? MenuUnfoldOutlined : MenuFoldOutlined, {
    style: { margin: "0 4px" },
    title: value ? "向右展开菜单" : "向左收起菜单",
    onClick: () => onChange(!value),
  })
}
