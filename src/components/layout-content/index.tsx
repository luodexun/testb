/*
 * @Author: xiongman
 * @Date: 2022-11-01 11:00:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-17 16:48:33
 * @Description: 模块内容公共组件
 */

import "./index.less"

import { CaretLeftFilled, InfoOutlined } from "@ant-design/icons"
import { Layout, notification } from "antd"
import classnames from "classnames"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { StorageShielRemindTime } from "@/configs/storage-cfg"
import { getStorage, setStorage } from "@/utils/util-funs"

import TreeMenuContext from "./context"
import PageMenu from "./page-menu"
import PageTabs from "./page-tabs"

export default function LayoutContent() {
  const [checkedMenu, setCheckedMenu] = useState<string[]>([])
  const [shieldRemindTime, setShieldRemindTime] = useState(null) // 屏蔽提醒时间
  const [collapsed, setCollapsed] = useState(false)
  const triggerClkRef = useRef(() => setCollapsed((prevState) => !prevState))
  const triggerCls = useMemo(() => classnames("collapse-icon", collapsed ? "off" : "on"), [collapsed])
  const [memoryInfo, setMemoryInfo] = useState({
    memory: null,
    memoryLimit: null,
  })
  // 屏蔽规则提醒弹框
  const [api, contextHolder] = notification.useNotification()
  const timeout = useRef<any>()
  const navigate = useNavigate()

  const openNotification = () => {
    api.warning({
      key: "shield",
      icon: <InfoOutlined style={{ color: "var(--fault)" }} />,
      message: "取消提醒",
      style: { color: "red" },
      description: "您有告警规则需要取消屏蔽",
      placement: "topLeft",
      duration: null,
      onClose: () => {
        navigate("/alarm/shield")
        setStorage(JSON.stringify(""), StorageShielRemindTime)
      },
    })
  }
  const refreshPage = useRef(() => {
    const memory = (performance as any)?.memory?.usedJSHeapSize
    const memoryLimit = (performance as any)?.memory?.jsHeapSizeLimit
    setMemoryInfo({
      memory,
      memoryLimit,
    })
    //0.95 * 1024 * 1024 * 1024
    // 如果分配的内存大于1G且小于2G时
    if (memoryLimit < 1.2 * 1024 * 1024 * 1024 && memory / memoryLimit > 0.85) {
      window.location.reload()
    } else if (
      memoryLimit >= 1.2 * 1024 * 1024 * 1024 &&
      memoryLimit < 2.1 * 1024 * 1024 * 1024 &&
      memory / memoryLimit > 0.8
    ) {
      window.location.reload()
    } else if (memory / memoryLimit > 0.7) {
      window.location.reload()
    }
  })
  useEffect(() => {
    const time = getStorage(StorageShielRemindTime)
    setShieldRemindTime(JSON.parse(time) || null)
    // 监控内存并自动刷新
    // const interval = setInterval(refreshPage.current, 5000) // 每5s检查一次
    // return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if (shieldRemindTime) {
      clearTimeout(timeout.current)
      setStorage(shieldRemindTime, StorageShielRemindTime)
      // 获取当前时间戳
      const timestamp = Date.now()
      timeout.current = setTimeout(() => {
        openNotification()
        setStorage(JSON.stringify(""), StorageShielRemindTime)
      }, shieldRemindTime - timestamp)
    }
    return () => clearTimeout(timeout.current)
  }, [shieldRemindTime])
  return (
    <Layout className="layout-content">
      <TreeMenuContext.Provider value={{ checkedMenu, setCheckedMenu, setShieldRemindTime }}>
        {contextHolder}
        <Layout.Sider
          collapsible
          width={220}
          collapsedWidth={50}
          collapsed={collapsed}
          trigger={null}
          className="layout-sider"
          children={
            <>
              <CaretLeftFilled className={triggerCls} onClick={triggerClkRef.current} />
              <PageMenu />
            </>
          }
        />
        <Layout.Content className="layout-content-inner" children={<PageTabs />} />
      </TreeMenuContext.Provider>
      {/* <div className="layout-memory">
        最大允许内存：{memoryInfo?.memoryLimit}B 当前内存：{memoryInfo?.memory}B
      </div> */}
    </Layout>
  )
}
