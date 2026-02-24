/*
 * @Author: xiongman
 * @Date: 2023-10-24 11:52:10
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-24 11:52:10
 * @Description:
 */

import DeviceGlobalFilter from "@pages/area-matrix/components/device-global-filter.tsx"
import DevicePartMonitor from "@pages/device-part-monitor"
import DeviceRunDetail from "@pages/device-run-detail"
import { ConfigProvider, Drawer, DrawerProps, ThemeConfig } from "antd"
import { useContext, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

import DvsDetailContext from "@/contexts/dvs-detail-context.ts"

const ANT_THEME: ThemeConfig = {
  components: { Drawer: { paddingLG: 0, colorBgElevated: "transparent", zIndexPopupBase: 3 } },
}

const COMMON_PROPS: DrawerProps = {
  placement: "right",
  width: "100%",
  closable: false,
  destroyOnClose: true,
  rootStyle: { position: "absolute", left: 0, padding: 0, height: "100%", width: "100%" },
  styles: { wrapper: { left: 0, height: "100%", width: "100%", maxWidth: "unset" } },
}
interface IProps {
  containerDom: HTMLDivElement
}
export default function DeviceDetailDrawer(props: IProps) {
  const { containerDom } = props
  const { setDevice, drawerOpenMap, setDrawerOpenMap } = useContext(DvsDetailContext)
  const drawerOpenMapRef = useRef({ setDevice, setDrawerOpenMap })
  const { pathname } = useLocation()

  drawerOpenMapRef.current = { setDevice, setDrawerOpenMap }
  const closeDwRef = useRef(() => {
    drawerOpenMapRef.current?.setDrawerOpenMap({})
    drawerOpenMapRef.current?.setDevice(null)
  })
  useEffect(() => {
    const closeDrawer = closeDwRef.current
    window.addEventListener("resize", closeDrawer)
    return () => {
      window.removeEventListener("resize", closeDrawer)
    }
  }, [])

  useEffect(() => {
    closeDwRef.current()
  }, [pathname])

  return (
    <ConfigProvider theme={ANT_THEME}>
      <Drawer
        {...COMMON_PROPS}
        styles={{ wrapper: { height: "100%" } }}
        width="20em"
        mask={false}
        open={drawerOpenMap["glbFilter"]}
        getContainer={containerDom}
        children={<DeviceGlobalFilter />}
      />
      <Drawer
        {...COMMON_PROPS}
        open={drawerOpenMap["detail"]}
        getContainer={containerDom}
        children={<DeviceRunDetail />}
      />
      <Drawer
        {...COMMON_PROPS}
        placement="top"
        open={drawerOpenMap["dvsPart"]}
        getContainer={containerDom}
        children={<DevicePartMonitor />}
      />
    </ConfigProvider>
  )
}
