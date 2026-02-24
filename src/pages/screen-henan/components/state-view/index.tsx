/*
 * @Author: chenmeifeng
 * @Date: 2024-09-25 14:24:32
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-14 17:16:04
 * @Description:
 */
import { MAIN_DVS_TYPE } from "@/configs/option-const"
import ComRadioClk from "../common-radio"
import { useState } from "react"
import HnCommonBox from "../common-box"
import AreaStateOvw from "@/pages/area-state-overview"

const options = MAIN_DVS_TYPE.map((i) => {
  return {
    name: i.label,
    value: i.value,
  }
})
export default function HnStateView() {
  const [deviceType, setDeviceType] = useState("WT")
  return (
    <HnCommonBox
      title="状态总览"
      className="hn-state-view"
      titleBox={
        <ComRadioClk
          options={options}
          onChange={(e) => {
            setDeviceType(e)
          }}
        />
      }
    >
      <AreaStateOvw showName={false} showTabs={false} currentDvsType={deviceType} />
    </HnCommonBox>
  )
}
