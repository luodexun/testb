import { TabsProps } from "antd"
import { FC, ReactNode } from "react"

interface IMenuItem {
  key: string
  label?: ReactNode
  icon?: ReactNode
  children?: IMenuItem[]
}

export interface ITreeMenuItem extends Omit<IMenuItem, "children"> {
  path?: string
  level?: number
  title?: ReactNode
  selectable?: boolean
  // 菜单页面下的子页面，内部tabs页面
  innerPage?: boolean
  element?: FC
  children?: ITreeMenuItem[]
}

export type TTabsOfMenu = {
  [menuPath in string]: Required<TabsProps>["items"]
}
