/*
 * @Author: chenmeifeng
 * @Date: 2023-10-25 18:16:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-10 17:06:17
 * @Description:
 */

import "./App.less"

import {
  StorageAlarmList,
  StorageAlarmVoice,
  StorageComprehensive,
  StorageGenerateSet,
  StorageRolePermission,
  StorageRptPowerClmn,
  StorageShielRemindTime,
  StorageSvgAnalogSet,
  StorageUserInfo,
} from "@configs/storage-cfg.ts"
import usePageResize from "@hooks/use-page-resize.ts"
import { AtomUserOfMenuMap } from "@store/atom-menu.ts"
import { calcRootFontSize, getStorage, removeStorage, setStorage } from "@utils/util-funs.tsx"
import { App as AntdApp, ConfigProvider } from "antd"
import { useAtomValue } from "jotai"
import { useEffect, useRef, useState } from "react"

import { ILoginInfo } from "@/types/i-auth.ts"

import Routes from "./router"

function App() {
  const [appFontSize, setAppFontSize] = useState(16)
  useAtomValue(AtomUserOfMenuMap)

  useEffect(() => {
    // 刷新时在此清除保存的数据
    const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)
    const realAlarmList = getStorage(StorageAlarmList)
    const recordAlarmVoice = getStorage<ILoginInfo>(StorageAlarmVoice)
    const generateSetFake = getStorage<ILoginInfo>(StorageGenerateSet)
    const comprehensiveFake = getStorage<ILoginInfo>(StorageComprehensive)
    const analogStorage = getStorage(StorageSvgAnalogSet)
    const shieldCancelTime = getStorage(StorageShielRemindTime)
    const currentRolePermission = getStorage(StorageRolePermission)
    const storageRptClmn = getStorage(StorageRptPowerClmn)
    removeStorage()
    setStorage(userInfoLocal, StorageUserInfo)
    setStorage(recordAlarmVoice, StorageAlarmVoice)
    setStorage(generateSetFake, StorageGenerateSet)
    setStorage(comprehensiveFake, StorageComprehensive)
    setStorage(analogStorage, StorageSvgAnalogSet)
    setStorage(shieldCancelTime, StorageShielRemindTime)
    setStorage(realAlarmList, StorageAlarmList)
    setStorage(currentRolePermission, StorageRolePermission)
    setStorage(storageRptClmn, StorageRptPowerClmn)
  }, [])

  const resizeRef = useRef(() => {
    const fontSize = calcRootFontSize()
    setAppFontSize(fontSize)
    document.documentElement.style.fontSize = `${fontSize}px`
  })
  usePageResize(resizeRef.current, 0)

  return (
    <ConfigProvider
      theme={{ token: { fontSize: appFontSize } }}
      children={<AntdApp className="App" children={<Routes />} />}
    />
  )
}

export default App
