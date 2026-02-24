/*
 * @Author: chenmeifeng
 * @Date: 2024-09-13 10:45:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-13 14:49:28
 * @Description:
 */
import "./index.less"
import { IDeviceData } from "@/types/i-device"
import { Button, ConfigProvider, Drawer, DrawerProps, ThemeConfig } from "antd"
import AreaQualityContext from "../../configs/use-data-context"
import { useContext, useMemo } from "react"
import DvsQuality from "./device-chart"

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
  clickDevice?: IDeviceData
}
export default function DvsQualityDrawer(props: IProps) {
  const { containerDom } = props
  const { areaQualityCt, setAreaQualityCt } = useContext(AreaQualityContext)
  const showDrawn = useMemo(() => {
    return areaQualityCt.openDraw
  }, [areaQualityCt])
  const onBackBtn = (e) => {
    setAreaQualityCt((prev) => {
      prev.openDraw = false
      return { ...prev }
    })
  }
  return (
    <ConfigProvider theme={ANT_THEME}>
      <Drawer {...COMMON_PROPS} open={showDrawn} getContainer={containerDom}>
        <div className="dvs-drawer">
          <div className="dvs-drawer-top">
            <Button size="small" shape="circle" title="返回" onClick={onBackBtn} />
          </div>
          <div className="dvs-drawer-con">
            <DvsQuality />
          </div>
        </div>
      </Drawer>
    </ConfigProvider>
  )
}
