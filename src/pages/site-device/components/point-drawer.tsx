/*
 * @Author: chenmeifeng
 * @Date: 2024-07-16 10:18:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-20 11:32:33
 * @Description:
 */
import "./point-drawer.less"
import { IDeviceData } from "@/types/i-device"
import { Button, ConfigProvider, Drawer, DrawerProps, Select, ThemeConfig } from "antd"
import PointTabs from "./point-table"
import { useEffect, useState } from "react"

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
  clickDevice?: IDeviceData
  setShowDrawn?: any
  deviceList: IDeviceData[]
}
export default function PointDrawer(props: IProps) {
  const { containerDom, showDrawn, clickDevice, setShowDrawn, deviceList } = props
  const [selectValue, setSelectValue] = useState(null)
  const [curDeviceInfo, setCurDeviceInfo] = useState<IDeviceData>(null)
  const onBackBtn = (e) => {
    setShowDrawn(false)
  }
  const handleChange = (e) => {
    setSelectValue(e)
    const device = deviceList?.find((i) => i.deviceCode === e)
    setCurDeviceInfo(device)
  }
  useEffect(() => {
    if (clickDevice) {
      setSelectValue(clickDevice.deviceCode)
      setCurDeviceInfo(clickDevice)
    }
  }, [clickDevice])
  return (
    <ConfigProvider theme={ANT_THEME}>
      <Drawer {...COMMON_PROPS} open={showDrawn} getContainer={containerDom}>
        <div className="point-drawer">
          <div className="point-drawer-top">
            <Button size="small" shape="circle" title="返回" onClick={onBackBtn} />
            <Select
              value={selectValue}
              style={{ width: 150 }}
              fieldNames={{ label: "deviceName", value: "deviceCode" }}
              onChange={handleChange}
              options={deviceList}
            />
          </div>
          <div className="point-drawer-con">
            <PointTabs clickDevice={curDeviceInfo} />
          </div>
        </div>
      </Drawer>
    </ConfigProvider>
  )
}
