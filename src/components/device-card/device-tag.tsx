/*
 * @Author: xiongman
 * @Date: 2023-08-30 15:01:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-17 17:49:32
 * @Description: 区域中心设备矩阵标签组件
 */

import "./device-tag.less"

import { IDeviceData, IDeviceRunData4MQ } from "@/types/i-device.ts"

import useDeviceTag from "./methods/use-device-tag.ts"
import PopoverBox from "./popover-box.tsx"
import PopoverContent from "./popover-content.tsx"

interface IProps {
  info: Omit<IDeviceData, "runData">
  state: IDeviceRunData4MQ
  onClick?: (info: IProps["info"]) => void
  onContextMenu?: (info: any) => void
}

export default function DeviceTag(props: IProps) {
  const { info, state, onClick } = props

  const { contentList, tagStyle } = useDeviceTag(info, state)

  return (
    <PopoverBox
      title={info.deviceNumber}
      content={<PopoverContent list={contentList} />}
      children={
        <div
          className="fan-tag pointer"
          style={{ color: "#0e0d0d", backgroundColor: tagStyle?.color || "#ffffff" }}
          onClick={() => onClick?.(info)}
          children={<span children={info.deviceNumber} />}
        />
      }
    />
  )
}
