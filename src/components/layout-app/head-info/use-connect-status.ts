/*
 * @Author: xiongman
 * @Date: 2023-10-19 14:26:25
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-19 14:26:25
 * @Description:
 */

import { notification } from "antd"
import { useEffect, useState } from "react"

export default function useConnectStatus() {
  const [, setHasNet] = useState(true)
  const [openNotify, notyfyHolder] = notification.useNotification()

  useEffect(() => {
    function updateConnectionStatus(e: Event) {
      const isOnline = e.type === "online"
      const message = isOnline ? "当前网络已连接！" : "网络已断开，请检查当前网络连接！"
      const duration = isOnline ? 4 : 0
      openNotify.info({ key: "net-status", placement: "topRight", message, duration })
      setHasNet(isOnline)
    }

    window.addEventListener("online", updateConnectionStatus, false)
    window.addEventListener("offline", updateConnectionStatus, false)

    return () => {
      window.removeEventListener("online", updateConnectionStatus)
      window.removeEventListener("offline", updateConnectionStatus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { notyfyHolder }
}
