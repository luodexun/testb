/*
 * @Author: chenmeifeng
 * @Date: 2024-07-05 10:23:54
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-05 10:32:43
 * @Description:
 */
import { ConfigProvider, Drawer, DrawerProps, ThemeConfig } from "antd"

import StationPlanDetail from "./station-plan-detail"
import { IRpPowerData } from "../types"

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
  clickStation?: IRpPowerData
  setShowDrawn?: any
}
export default function PlanCorrectDrawer(props: IProps) {
  const { containerDom, showDrawn, clickStation, setShowDrawn } = props

  const onBackBtn = (e) => {
    setShowDrawn(false)
  }
  return (
    <ConfigProvider theme={ANT_THEME}>
      <Drawer
        {...COMMON_PROPS}
        open={showDrawn}
        getContainer={containerDom}
        children={<StationPlanDetail clickStation={clickStation} onBackBtn={onBackBtn} />}
      />
    </ConfigProvider>
  )
}
