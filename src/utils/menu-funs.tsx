/*
 * @Author: xiongman
 * @Date: 2022-11-01 17:12:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-11 10:53:08
 * @Description: 处理菜单数据发方法们
 */

import { createElement, Suspense } from "react"
import { RouteObject } from "react-router"

import { doNoParamServer } from "@/api/serve-funs"
import { BoxLoading } from "@/components/box-loading"
import { ITreeMenuItem, TTabsOfMenu } from "@/router/interface"
import { getSiteOfMenu } from "@/router/menu-site.ts"
import { TSiteType } from "@/types/i-config.ts"
import { IProjectCompany, IStationData } from "@/types/i-station.ts"

// 处理菜单的图标
export function dealMenuIcon(icon?: ITreeMenuItem["icon"]) {
  return typeof icon === "string" && icon ? <i className={`icon-item iconfont ${icon}`} /> : icon || undefined
}

// 用原始树形菜单数据生成路由对象数据
export function createRouteObject(treeData: ITreeMenuItem[]): RouteObject[] {
  return treeData.reduce((prev, next) => {
    const { title, path, key, element, children } = next
    if (element) {
      const elementComp = (
        <Suspense fallback={<BoxLoading />}>
          {element ? createElement(element, { key }) : <div children={`${title}`} />}
        </Suspense>
      )
      prev.push({ path, element: elementComp })
    }
    if (children?.length) {
      prev.push(...createRouteObject(children))
    }
    return prev
  }, [] as RouteObject[])
}
let curPosition = 0
// 将 ITreeMenuItem 类型数据处理成菜单组件所需数据
export function dealPathOftreeMenuData(
  treeMenuData: ITreeMenuItem[],
  currentRolePermission: string[] | null,
  position: number,
  parentKey?: string,
): ITreeMenuItem[] {
  let path: string
  const roleMenu = currentRolePermission?.map((i) => i?.split(":")[position])
  return treeMenuData
    .filter((tree) => roleMenu?.includes(tree.key))
    ?.reduce((prev, next) => {
      if (next.key === "site") {
        const site = dealPathOfSitetreeMenuData(treeMenuData.filter((i) => i.key === "site"))
        return prev.concat(site)
      }
      path = parentKey ? `${parentKey}/${next.key}` : `${next.key}`
      // 去掉 ITreeMenuItem 中的 selectable，避免menu 组件报警
      const newMenu: ITreeMenuItem = {
        ...next,
        path, // 父子菜单路径拼接，用于路由跳转
        label: next.title,
        icon: dealMenuIcon(next.icon), // 设置的图标
      }
      if (next.children?.length) {
        newMenu.children = dealPathOftreeMenuData(next.children, currentRolePermission, 1, path)
      }
      prev.push(newMenu)
      return prev
    }, [] as ITreeMenuItem[])
}
// 处理场站下的菜单
export function dealPathOfSitetreeMenuData(treeMenuData: ITreeMenuItem[], parentKey?: string): ITreeMenuItem[] {
  let path: string
  return treeMenuData?.reduce((prev, next) => {
    path = parentKey ? `${parentKey}/${next.key}` : `${next.key}`
    // 去掉 ITreeMenuItem 中的 selectable，避免menu 组件报警
    const newMenu: ITreeMenuItem = {
      ...next,
      path, // 父子菜单路径拼接，用于路由跳转
      label: next.title,
      icon: dealMenuIcon(next.icon), // 设置的图标
    }
    if (next.children?.length) {
      newMenu.children = dealPathOfSitetreeMenuData(next.children, path)
    }
    prev.push(newMenu)
    return prev
  }, [] as ITreeMenuItem[])
}
// 整理 ITreeMenuItem 结果数据为菜单结果数据
export function getMenuItemFromTreeMenuData(treeMenuData: ITreeMenuItem[]): ITreeMenuItem[] {
  return treeMenuData.reduce((prev, { key, title, icon, children, innerPage }) => {
    if (innerPage) return prev
    // 去掉 ITreeMenuItem 中的 无关字段，避免menu 组件报警, icon: 设置的图标
    const newMenu: ITreeMenuItem = { key, label: title, icon: dealMenuIcon(icon) }
    if (children?.length) {
      newMenu.children = getMenuItemFromTreeMenuData(children)
    }
    if (!newMenu.children?.length) newMenu.children = undefined
    prev.push(newMenu)
    return prev
  }, [] as ITreeMenuItem[])
}

function getTabsItemsByMenuItem({ path, title }: ITreeMenuItem) {
  return { key: path, label: title, closable: false, children: null }
}

// 获取左侧菜单下的页面内二级菜单映射数据，menuPath->tabsList
export function collectMenuPath2InnerTabsMap(treeMenuData: ITreeMenuItem[]): TTabsOfMenu {
  const result: TTabsOfMenu = {}
  ;(function doFilter(dataList: ITreeMenuItem[]) {
    if (!dataList?.length) return
    dataList.forEach((menuItem) => {
      if (!menuItem.children?.length) return
      const innerPageTabList = menuItem.children.filter((i) => i.innerPage).map(getTabsItemsByMenuItem)
      if (innerPageTabList.length) {
        return (result[menuItem.path] = innerPageTabList)
      }
      doFilter(menuItem.children)
    })
  })(treeMenuData)
  return result
}

// 在菜单数据中比对指定路径数组，以过滤不在菜单数据中的路径项
export function filterMenuUrlStr(menuList: ITreeMenuItem[], urlList: string[]) {
  const result = new Set<string>()
  ;(function doFind(list: ITreeMenuItem[], index: number) {
    const theUrl = urlList[index]
    if (!theUrl) return
    list.forEach((item) => {
      if (`${item.key}` !== `${theUrl}` || item.innerPage) return
      result.add(theUrl)
      if (item.children?.length) doFind(item.children, index + 1)
    })
  })(menuList, 0)
  return Array.from(result)
}

// 获取菜单中所有含子目录的菜单path
export function getRootSubmenuKeys(treeData: ITreeMenuItem[]) {
  if (!treeData?.length) return []
  return treeData.reduce((prev, next) => {
    const { key, children } = next
    if (children?.length) prev.push(key as string)
    return prev
  }, [] as string[])
}
// 存放在/public下的图片
const SITE_TYPE_2ICON_MAP: Partial<Record<TSiteType, string>> = {
  W: "/images/siteIcon/wt.png",
  S: "/images/siteIcon/pvinv.png",
  E: "/images/siteIcon/espcs.png",
}
// 根据场站创建场站二级菜单数据
export function crtSiteSubmenu({ stationCode, shortName, stationType }: IStationData) {
  const iconSrc = SITE_TYPE_2ICON_MAP[stationType] || SITE_TYPE_2ICON_MAP["W"]
  return {
    title: shortName,
    key: stationCode,
    icon: <img src={iconSrc} alt="" style={{ width: "1em", height: "1em" }} />,
    children: getSiteOfMenu(stationType),
  }
}

// 根据场站创建场站二级菜单数据
export async function crtRegionSiteSubmenu(stationList: IStationData[], companyList) {
  let titleStNm: string // getProjectCompany
  let actCompanyList = companyList
  if (!actCompanyList?.length) {
    actCompanyList = await doNoParamServer<Array<IProjectCompany>>("getProjectCompany")
  }
  return stationList.reduce((acc, cur) => {
    const info = acc.filter((i) => i.maintenanceComId === cur.maintenanceComId)
    if (!info?.length) {
      titleStNm = actCompanyList?.find(
        (item) => item?.type === "MAINTENANCE" && item?.id === cur?.maintenanceComId,
      )?.shortName
      acc.push({
        key: cur.maintenanceComId,
        title: titleStNm,
        icon: <span style={{ width: "1em" }}></span>,
        maintenanceComId: cur.maintenanceComId,
        selectable: false,
        children: [],
      })
    }
    const iconSrc = SITE_TYPE_2ICON_MAP[cur.stationType] || SITE_TYPE_2ICON_MAP["W"]
    acc?.forEach((i) => {
      if (i.maintenanceComId === cur.maintenanceComId) {
        i.children.push({
          key: cur.stationCode,
          title: cur.shortName,
          icon: <img src={iconSrc} alt="" style={{ width: "1em", height: "1em" }} />,
          children: getSiteOfMenu(cur.stationType, cur.id),
        })
      }
    })
    return acc
  }, [])
}

// 从url路径中获取参数
export function getParamDataFromUrl(url?: string, index = 3): string {
  if (!url) url = window.location.pathname
  return url.split("/")[index]
}
