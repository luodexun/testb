/*
 * @Author: xiongman
 * @Date: 2023-10-24 11:52:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 10:28:00
 * @Description:
 */

import { ConfigProvider, Drawer, DrawerProps, ThemeConfig } from "antd"

import DeviceRunDetail from "./devicemng-detail"

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
  showDrawn: boolean
  clickDevice?: any
  deviceList?: any
  setShowDrawn?: any
}
export default function DeviceDetailDrawer(props: IProps) {
  const { containerDom, showDrawn, clickDevice, deviceList, setShowDrawn } = props

  const onBackBtn = (e) => {
    setShowDrawn(false)
  }
  return (
    <ConfigProvider theme={ANT_THEME}>
      <Drawer
        {...COMMON_PROPS}
        open={showDrawn}
        getContainer={containerDom}
        children={
          <DeviceRunDetail
            clickDevice={clickDevice}
            deviceList={deviceList}
            onBackBtn={onBackBtn}
            showDrawn={showDrawn}
          />
        }
      />
    </ConfigProvider>
  )
}
