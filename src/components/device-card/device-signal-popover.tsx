/*
 * @Author: xiongman
 * @Date: 2023-11-16 11:54:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-02-18 14:36:55
 * @Description:
 */

import "./device-signal.less"

import { MoreOutlined } from "@ant-design/icons"
import { Button, Popover } from "antd"
import { useRef, useState } from "react"

import { SignalIcon } from "@/components/device-card/device-signal.tsx"
import { IDvsSignalRecordInfo } from "@/types/i-monitor-info.ts"

interface IProps {
  list?: IDvsSignalRecordInfo[]
}

export default function DeviceSignalPopover(props: IProps) {
  const { list } = props
  const [, setShowSignal] = useState(false)
  const onBtnClkRef = useRef(() => {
    setShowSignal((prevState) => !prevState)
  })
  return (
    <Popover
      // open={showSignal}
      trigger="click"
      arrow={false}
      destroyTooltipOnHide
      placement="bottomRight"
      content={<SignalIcon signalList={list} />}
      overlayClassName="device-signal-wrap"
      overlayInnerStyle={{ fontSize: "1.2em", backgroundColor: "black" }}
    >
      <Button
        size="small"
        type="text"
        icon={<MoreOutlined color="var(--primary-color)" />}
        onClick={onBtnClkRef.current}
      />
    </Popover>
  )
}
