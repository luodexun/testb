/*
 * @Author: xiongman
 * @Date: 2023-09-06 16:24:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-12 17:29:49
 * @Description:
 */

// import SiteAgvc from "@pages/site-agvc"
// import SiteAlarm from "@pages/site-alarm"
// import SiteBoost from "@pages/site-boost"
// import SiteControl from "@pages/site-control"
// import SiteEnergy from "@pages/site-energy"
// import SiteFireProtect from "@pages/site-fire-protect"
// import SiteGisMap from "@pages/site-gis-map"
// import SiteMatrix from "@pages/site-matrix"
// import SiteReport from "@pages/site-report"
// import SiteTower from "@pages/site-tower"
// import SiteWeather from "@pages/site-weather"
import { lazy } from "react"

import { StorageStnDvsType } from "@/configs/storage-cfg"
import {
  SITE_AGVC,
  SITE_BOOST,
  SITE_DEVICEMNG,
  SITE_GIS,
  SITE_MATRIX,
  SITE_TOWER,
  SITE_WEATHER,
} from "@/router/variables.ts"
import { TSiteType } from "@/types/i-config.ts"
import { IStnDvsType4LocalStorage } from "@/types/i-device.ts"
import { getStorage } from "@/utils/util-funs"

import { ITreeMenuItem } from "./interface"

const MenuLeft: ITreeMenuItem[] = [
  { key: SITE_MATRIX, title: "场站设备矩阵", innerPage: true, element: lazy(() => import("@pages/site-matrix")) },
  { key: SITE_BOOST, title: "升压站", innerPage: true, element: lazy(() => import("@pages/site-boost")) },
  { key: SITE_AGVC, title: "AGC/AVC", innerPage: true, element: lazy(() => import("@pages/site-agvc")) },
  // { key: SITE_ENERGY, title: "能量管理", innerPage: true, element: SiteEnergy },
]

const MenuRight: ITreeMenuItem[] = [
  // { key: SITE_CONTROL, title: "设备控制", innerPage: true, element: SiteControl },
  // { key: SITE_ALARM, title: "场站报警", innerPage: true, element: SiteAlarm },
  // { key: SITE_FIRE_PROTECT, title: "消防系统", innerPage: true, element: SiteFireProtect },
  // { key: SITE_GIS_MAP, title: "GIS地图", innerPage: true, element: SiteGisMap },
  // { key: SITE_REPORT, title: "报表", innerPage: true, element: SiteReport },
]

// 含有箱变的菜单
const MenuDevicemng: ITreeMenuItem[] = [
  { key: SITE_DEVICEMNG, title: "箱变", innerPage: true, element: lazy(() => import("@pages/site-devicemng")) },
]

// // 风电含有的菜单
// const MenuWind: ITreeMenuItem[] = [
//   { key: SITE_TOWER, title: "测风塔", innerPage: true, element: lazy(() => import("@pages/site-tower")) },
//   // { key: SITE_GIS, title: "GIS地图", innerPage: true, element: lazy(() => import("@pages/site-gis")) },
// ]
// // 光伏含有的菜单
// const MenuPV: ITreeMenuItem[] = [
//   { key: SITE_WEATHER, title: "气象站", innerPage: true, element: lazy(() => import("@pages/site-weather-station")) },
// ]

// 动态生成风电菜单（仅当 deviceTypes 包含 WTFIR 时显示测风塔）
const getMenuWind = (deviceTypes?: string[]) => {
  if (!deviceTypes?.includes("CFT")) return [];
  return [
    { key: SITE_TOWER, title: "测风塔", innerPage: true, element: lazy(() => import("@pages/site-tower")) },
  ];
};

// 动态生成光伏菜单（仅当 deviceTypes 包含 PVWS 时显示气象站）
const getMenuPV = (deviceTypes?: string[]) => {
  if (!deviceTypes?.includes("JCY")) return [];
  return [
    { key: SITE_WEATHER, title: "气象站", innerPage: true, element: lazy(() => import("@pages/site-weather-station")) },
  ];
};

// 变电站含有的菜单
const MenuT: ITreeMenuItem[] = [
  { key: SITE_BOOST, title: "升压站", innerPage: true, element: lazy(() => import("@pages/site-boost")) },
]

// W(风电),S(光伏/光热),F(风储),G(光储),H(风光储),P(分布式光伏),E(独立储能),T(独立变电站)
export function getSiteOfMenu(type: TSiteType, id?: number) {
  const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
  const deviceTypes = deviceTypesOfSt?.filter((item) => item.stationId == id)[0]?.deviceTypes
  // const deviceTypes = ["PVDCB", "PVTRS", "WTFIR", "YCTP", "SYZZZFIR", "NLGL", "PVTRA"]
  const tmpMenuDevicemng =
    deviceTypes?.includes("WTTRA") || deviceTypes?.includes("PVTRA") || deviceTypes?.includes("ESTRA")
      ? MenuDevicemng
      : []
  // 光伏、储能按接口返回新增tab
  // const otherTabs = []
  const MenuWind = getMenuWind(deviceTypes)
  const MenuPV = getMenuPV(deviceTypes)
  const otherTabs = MenuOther(deviceTypes) || []
  if (type === "W") return [...MenuLeft, ...tmpMenuDevicemng, ...MenuWind, ...MenuRight, ...otherTabs]
  if (type === "S") return [...MenuLeft, ...tmpMenuDevicemng, ...MenuPV, ...MenuRight, ...otherTabs]
  if (type === "E") return [...MenuLeft, ...tmpMenuDevicemng, ...MenuRight, ...otherTabs]
  if (type === "H") return [...MenuLeft, ...tmpMenuDevicemng, ...MenuWind, ...MenuPV, ...MenuRight, ...otherTabs]
  if (type === "T") return [...MenuT, ...tmpMenuDevicemng, ...otherTabs]
  return []
}

const MenuOther = (dvTypes: string[]) => {
  const ADD_MENU = [
    { key: "PVDCB", name: "直流汇流箱", routeKey: "deivce" },
    { key: "PVTRS", name: "光伏跟踪系统", routeKey: "deivce" },
    { key: "PVCOL", name: "光伏数采", routeKey: "deivce" },
    { key: "ESMON", name: "储能监控系统", routeKey: "deivce" },
    { key: "ESCTL", name: "储能群控系统", routeKey: "deivce" },
    { key: "ESBAT", name: "储能电池系统", routeKey: "deivce" },
    { key: "WTFIR", name: "消防系统", routeKey: "protect" },
    { key: "NLGL", name: "能量管理", routeKey: "protect" },
    { key: "SYZZZFIR", name: "升压站消防", routeKey: "protect" },
    { key: "YCTP", name: "一次调频", routeKey: "frequency" },
  ]
  const filterDvTypes = dvTypes?.filter((i) => ADD_MENU?.map((i) => i.key).includes(i))
  return filterDvTypes?.map((i) => {
    const name = ADD_MENU?.find((j) => j.key === i)?.name
    const routeKey = ADD_MENU?.find((j) => j.key === i)?.routeKey
    return {
      key: i.toLowerCase(),
      title: name,
      innerPage: true,
      element:
        routeKey === "protect"
          ? lazy(() => import(`@pages/site-fire-protect`))
          : routeKey === "deivce"
            ? lazy(() => import(`@pages/site-device`))
            : lazy(() => import(`@pages/site-frequency`)),
    }
  })
}
export function getsiteUrl(type) {
  return type === "T" ? SITE_BOOST : SITE_MATRIX
}
