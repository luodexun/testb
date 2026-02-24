/*
 * @Author: chenmeifeng
 * @Date: 2024-01-23 10:03:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-13 10:19:05
 * @Description:
 */
import "./index.less"

import { AtomPageCarousel, AtomTabsOfMenu, AtomUserOfMenuItems, AtomUserOfMenuItemsSiteKey } from "@store/atom-menu.ts"
import { filterMenuUrlStr, getRootSubmenuKeys } from "@utils/menu-funs.tsx"
import { isArraySame } from "@utils/util-funs.tsx"
import { Menu } from "antd"
import type { ItemType } from "antd/lib/menu/hooks/useItems"
import { useAtomValue } from "jotai"
import { useContext, useEffect, useMemo, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import TreeMenuContext from "../context"

export default function PageMenu() {
  const { checkedMenu, setCheckedMenu } = useContext(TreeMenuContext)
  // const [openKeys, setOpenKeys] = useState<string[]>([])
  const rootSubKeysRef = useRef<string[]>([])
  // 根据用户角色过滤后的树形菜单数据
  const menuItems = useAtomValue(AtomUserOfMenuItems)
  const siteMenuKeys = useAtomValue(AtomUserOfMenuItemsSiteKey)
  const menuPath2TabsMap = useAtomValue(AtomTabsOfMenu)
  const pageCarousel = useAtomValue(AtomPageCarousel)
  const location = useLocation()
  const navigate = useNavigate()

  const defaultOpenSiteKeys = useMemo(() => {
    return siteMenuKeys
  }, [siteMenuKeys])
  useEffect(() => {
    if (!rootSubKeysRef.current?.length) rootSubKeysRef.current = getRootSubmenuKeys(menuItems)
    const pathNames = location.pathname.split("/").filter(Boolean)
    // 当页面刷新时要定位当前选中的菜单
    const menus = filterMenuUrlStr(menuItems, pathNames)
    // setOpenKeys((prevState) => (isArraySame(prevState, menus) ? prevState : menus))
    setCheckedMenu((prevState) => (isArraySame(prevState, menus) ? prevState : menus))
  }, [location.pathname, menuItems, setCheckedMenu])

  const pageCarouselRef = useRef(pageCarousel)
  pageCarouselRef.current = pageCarousel
  const setCheckedMenuRef = useRef(setCheckedMenu)
  setCheckedMenuRef.current = setCheckedMenu
  const menuPath2TabsMapRef = useRef(menuPath2TabsMap)
  menuPath2TabsMapRef.current = menuPath2TabsMap
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const handleSelectRef = useRef(({ keyPath }: { keyPath: string[] }) => {
    if (pageCarouselRef.current.isCarousel) return
    const theMenuPath = keyPath.reverse()
    setCheckedMenuRef.current(theMenuPath)
    // 选中菜单后跳转到目标菜单下的第一个tabs页面
    const menuPathStr = theMenuPath.join("/")
    const menuOfTabs = menuPath2TabsMapRef.current[menuPathStr]
    if (!menuOfTabs?.length) return
    navigateRef.current(menuOfTabs[0].key)
  })

  // function onOpenChange(keys: string[]) {
  //   const latestOpenKey = keys.find((key) => !openKeys.includes(key))
  //   if (!latestOpenKey) return setOpenKeys([])
  //   if (!rootSubKeysRef.current.includes(latestOpenKey)) return setOpenKeys(keys)
  //   setOpenKeys([latestOpenKey])
  // }
  return (
    <Menu
      mode="inline"
      items={menuItems as ItemType[]}
      selectedKeys={checkedMenu}
      defaultOpenKeys={defaultOpenSiteKeys}
      onSelect={handleSelectRef.current}
      // openKeys={openKeys}
      // onOpenChange={onOpenChange}
      className="sider-menu"
    />
  )
}
