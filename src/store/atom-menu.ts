/*
 * @Author: xiongman
 * @Date: 2022-12-23 11:25:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-27 15:34:06
 * @Description: 菜单数据全局变量
 */

import { SCEND_20 } from "@configs/time-constant.ts"
import { LOGIN_INFO_FOR_FUNS } from "@store/atom-auth.ts"
import { AtomStation } from "@store/atom-station.ts"
import {
  collectMenuPath2InnerTabsMap,
  createRouteObject,
  crtRegionSiteSubmenu,
  dealPathOftreeMenuData,
  getMenuItemFromTreeMenuData,
} from "@utils/menu-funs.tsx"
import { atom } from "jotai"
import { RouteObject } from "react-router"

import { StorageCompanyData, StorageRolePermission } from "@/configs/storage-cfg"
import { routesConfig } from "@/router/config"
import type { ITreeMenuItem } from "@/router/interface.ts"
import { TTabsOfMenu } from "@/router/interface.ts"
import { TREE_MENU_DATA } from "@/router/tree-menu-data.tsx"
import { IStationData } from "@/types/i-station.ts"
import { getStorage, setStorage } from "@/utils/util-funs"

// 菜单和路由数据已经准备好的标记
export const AtomRouteReady = atom(false)

// 菜单轮播标记
export const AtomPageCarousel = atom({ isCarousel: false, waitTime: SCEND_20 })

// 页面菜单路径列表
export const AtomPagePathList = atom<string[]>([])

// 获取用户菜单并对 TreeMenuData 过滤后的树形菜单数据
export const AtomUserOfMenuItems = atom<ITreeMenuItem[]>([])
export const AtomUserOfMenuItemsSiteKey = atom<any[]>([])

// 各个菜单下的tabs映射数据，菜单 key -> tabs列表
export const AtomTabsOfMenu = atom<TTabsOfMenu>({})
// 菜单按钮权限
export const AtomMenuBtnPermission = atom<string[]>([])
const ATOM_ROUTER_CONFIG = atom<RouteObject[]>(routesConfig)

// AtomUserOfMenuMap 处理用户菜单按钮的节流标记
let MENU_OF_USER_FLAG = false
// 接口获取的用户角色菜单数据的
export const AtomUserOfMenuMap = atom(
  (get) => get(ATOM_ROUTER_CONFIG),
  async (get, set, stationList?: IStationData[]) => {
    if (!LOGIN_INFO_FOR_FUNS.loginInfo?.token) return set(AtomRouteReady, true)

    if (!stationList) {
      await set(AtomStation)
      return
    }

    if (MENU_OF_USER_FLAG) return
    MENU_OF_USER_FLAG = true

    set(AtomRouteReady, false)

    // 测试数据
    // const testCompanylist = [
    //   {
    //     id: 1,
    //     fullName: "quyu1",
    //     shortName: "区域1", //项目公司或检修公司名称
    //     parentComId: 1, //项目公司或检修公司id
    //     type: "MAINTENANCE", //项目公司'PROJECT'、检修基地'MAINTENANCE'
    //   },
    // ]
    // const testStationList = [
    //   {
    //     id: 1,
    //     stationCode: "441882W01", //场站编码
    //     fullName: "清远连州风电场",
    //     shortName: "连州风电场", //场站名称
    //     stationType: "W",
    //     parentComId: 1,
    //     maintenanceComId: 1,
    //     tags: null,
    //   },
    //   {
    //     id: 2,
    //     stationCode: "441882W02", //场站编码
    //     fullName: "清远连州光伏电场1",
    //     shortName: "连州光伏电场1", //场站名称
    //     stationType: "S",
    //     parentComId: 1,
    //     maintenanceComId: 1,
    //     tags: null,
    //   },
    // ]
    const siteMenuItem = TREE_MENU_DATA.find((item) => item.key === "site")
    const companyList = getStorage(StorageCompanyData)
    if (siteMenuItem) {
      siteMenuItem.children = await crtRegionSiteSubmenu(stationList, companyList)
      // console.log(siteMenuItem.children, "siteMenuItem.children")
      set(AtomUserOfMenuItemsSiteKey, siteMenuItem.children?.map((i) => i.key?.toString()) || [])
      // siteMenuItem.children = await crtRegionSiteSubmenu(stationList || testStationList, companyList || testCompanylist)
    }
    const currentRolePermission = LOGIN_INFO_FOR_FUNS.loginInfo?.permission
    set(AtomMenuBtnPermission, currentRolePermission)
    setStorage(currentRolePermission, StorageRolePermission)
    // 处理 path 后的全量菜单数据，用于获取 Tabs 菜单列表，数据中的 key 用于匹配 Menu 选中的 key
    const menuItems = dealPathOftreeMenuData(TREE_MENU_DATA, currentRolePermission, 0)
    // 获取左侧菜单下的页面内二级菜单映射数据，menuPath->tabsList
    set(AtomTabsOfMenu, collectMenuPath2InnerTabsMap(menuItems))

    // 获取用户菜单并对 TreeMenuData 过滤后的树形菜单数据
    set(AtomUserOfMenuItems, getMenuItemFromTreeMenuData(menuItems))

    // 根据用户菜单数据创建路由数据
    const routesConfig = get(ATOM_ROUTER_CONFIG)
    routesConfig[0].children = createRouteObject(menuItems)
    set(ATOM_ROUTER_CONFIG, [...routesConfig])
    // 收集页面路径数组，用于页面轮播
    const PagePathList = routesConfig[0].children.map((item) => item.path)
    set(AtomPagePathList, PagePathList)

    // 权限数据准备好了
    window.setTimeout(() => {
      set(AtomRouteReady, true)
      MENU_OF_USER_FLAG = false
    }, 1000)
  },
)

// AtomUserOfMenuMap 挂载时获取菜单数据的节流标记
let MENU_MAP_MOUNT_FLAG = false
// 加载时获取本地存储的映射数据，调用write方法生成菜单及路由数据
AtomUserOfMenuMap.onMount = (setAtom) => {
  ;(async function () {
    if (MENU_MAP_MOUNT_FLAG) return
    MENU_MAP_MOUNT_FLAG = true
    await setAtom()
    window.setTimeout(() => (MENU_MAP_MOUNT_FLAG = false), 1000)
  })()
}
