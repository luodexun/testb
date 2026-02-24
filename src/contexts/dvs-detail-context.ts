/*
 * @Author: xiongman
 * @Date: 2023-09-27 10:14:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-10 17:16:54
 * @Description: 设备详情页面的context对象
 */

import { createContext, Dispatch, SetStateAction } from "react"

import { TDeviceType } from "@/types/i-config"
import { ICheckList, IDeviceData, TDvsMainState, TMatrixDrawerMap, TModeShow } from "@/types/i-device.ts"

export interface IDvsDetailContext {
  device: Omit<IDeviceData, "runData"> | null
  setDevice: Dispatch<SetStateAction<IDvsDetailContext["device"]>>
  drawerOpenMap: TMatrixDrawerMap
  setDrawerOpenMap: Dispatch<SetStateAction<IDvsDetailContext["drawerOpenMap"]>>
  deviceList?: Array<IDeviceData>
  setDeviceList?: Dispatch<SetStateAction<IDvsDetailContext["deviceList"]>>
  chooseColumnKey?: ICheckList
  setChooseColumnKey?: Dispatch<SetStateAction<IDvsDetailContext["chooseColumnKey"]>>
  isTableMode?: boolean
  setIsTableMode?: Dispatch<SetStateAction<IDvsDetailContext["isTableMode"]>>
  showMode?: TModeShow
  setShowMode?: Dispatch<SetStateAction<IDvsDetailContext["showMode"]>>
  currentDevicePoistion?: any
  setCurrentDevicePoistion?: Dispatch<SetStateAction<IDvsDetailContext["currentDevicePoistion"]>>
  deviceType?: TDeviceType
  setDeviceType?: Dispatch<SetStateAction<IDvsDetailContext["deviceType"]>>
  currentChooseState?: Array<TDvsMainState>
  setCurrentChooseState?: Dispatch<SetStateAction<IDvsDetailContext["currentChooseState"]>>
  currentLayout?: string
  setCurrentLayout?: Dispatch<SetStateAction<IDvsDetailContext["currentLayout"]>>
  closeCtxMenu?: boolean
  setCloseCtxMenu?: Dispatch<SetStateAction<IDvsDetailContext["closeCtxMenu"]>>
  showSign?: boolean
  setShowSign?: Dispatch<SetStateAction<IDvsDetailContext["showSign"]>>
  needShangdevice?: Array<string>
  setNeedShangdevice?: Dispatch<SetStateAction<IDvsDetailContext["needShangdevice"]>>
  siteChooseColumnKey?: ICheckList
  setSiteChooseColumnKey?: Dispatch<SetStateAction<IDvsDetailContext["siteChooseColumnKey"]>>
  isUseNewDvsState?: boolean
  setIsUseNewDvsState?: Dispatch<SetStateAction<IDvsDetailContext["isUseNewDvsState"]>>
}

const DvsDetailContext = createContext<IDvsDetailContext>({
  device: null, // 单条设备详情
  setDevice: () => {}, // 设置单条设备详情
  drawerOpenMap: {},
  setDrawerOpenMap: () => {},
  deviceList: [], // 设备列表
  setDeviceList: () => {},
  chooseColumnKey: {}, // 选中的表格列key数组
  setChooseColumnKey: () => {},
  siteChooseColumnKey: {}, // 选中的场站级key数组
  setSiteChooseColumnKey: () => {},
  isTableMode: false, // 是否是显示表格模式/设备名称模式
  setIsTableMode: () => {},
  currentDevicePoistion: null, // 当前设备所处的位置
  setCurrentDevicePoistion: () => {},
  currentChooseState: [], // 当前选中的设备状态数组
  setCurrentChooseState: () => {},
  deviceType: "WT", // 当前设备类型
  setDeviceType: () => {},
  currentLayout: "site", // 当前排序状态
  setCurrentLayout: () => {},
  closeCtxMenu: true,
  setCloseCtxMenu: () => {},
  needShangdevice: [], // 处于故障或通讯的设备，需要闪烁的设备
  setNeedShangdevice: () => [],
  isUseNewDvsState: false,
})

export default DvsDetailContext
