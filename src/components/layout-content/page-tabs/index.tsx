/*
 * @Author: xiongman
 * @Date: 2022-10-31 16:25:36
 * @LastEditors: xiongman
 * @LastEditTime: 2022-10-31 16:25:36
 * @Description: 页面内容页签容器
 */

import "./index.less"

import { AtomPageCarousel, AtomTabsOfMenu } from "@store/atom-menu.ts"
import { Tabs, TabsProps } from "antd"
import { useAtomValue } from "jotai"
import { useContext, useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

import TreeMenuContext from "../context"

export default function PageTabs() {
  const [activeKey, setActiveKey] = useState<string>()
  // 先将TabsProps内属性全部变必选，再取 items 项的类型
  const [tabsList, setTabsList] = useState<Required<TabsProps>["items"]>([])
  const menuPath2TabsMap = useAtomValue(AtomTabsOfMenu)
  const { checkedMenu } = useContext(TreeMenuContext)
  const pageCarousel = useAtomValue(AtomPageCarousel)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!checkedMenu?.length) return
    const menuStr = `${checkedMenu.join("/")}`
    const pathNames = location.pathname.split("/").filter(Boolean)
    const tabsMenuList = menuPath2TabsMap[menuStr]
    setActiveKey(pathNames.join("/"))
    return setTabsList(tabsMenuList || [])
  }, [checkedMenu, location.pathname, menuPath2TabsMap])

  const pageCarouselRef = useRef(pageCarousel)
  pageCarouselRef.current = pageCarousel
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const onTabsChgRef = useRef((key: string) => {
    if (pageCarouselRef.current.isCarousel) return
    setActiveKey(key)
    navigateRef.current(`/${key}`)
  })

  return (
    <div className="l-full page-tabs-wrap">
      <Tabs
        type="editable-card"
        hideAdd
        tabBarGutter={4}
        items={tabsList}
        activeKey={activeKey}
        onChange={onTabsChgRef.current}
      />
      <div className="page-content" children={<Outlet />} />
    </div>
  )
}
