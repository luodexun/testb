/*
 * @Author: xiongman
 * @Date: 2023-02-15 10:18:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 17:19:38
 * @Description: 按钮图标
 */
import "./svgIcon.less"

import Icon from "@ant-design/icons"
import { IconComponentProps } from "@ant-design/icons/lib/components/Icon"
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"

import { ReactComponent as IconESPCS } from "@/assets/device/icon_ESPCS.svg"
import { ReactComponent as IconPVINV } from "@/assets/device/icon_PVINV.svg"
import { ReactComponent as IconWT } from "@/assets/device/icon_WT.svg"
import { ReactComponent as IconWTZhu } from "@/assets/device/icon_WT_zhu.svg"
import { ReactComponent as IconREPAIR } from "@/assets/device/wt_repair.svg"
import { TDeviceType } from "@/types/i-config.ts"

const IconMap = {
  WT: IconWT,
  PVINV: IconPVINV,
  ESPCS: IconESPCS,
  REPAIR: IconREPAIR,
}

type TBtnIconsProps = {
  name?: TDeviceType
  svg?: IconComponentProps["component"]
  className?: string
  style?: CSSProperties
  state?: any
  subState?: any
}

export default function SvgIcon(props: TBtnIconsProps) {
  const iconComp = useMemo(() => {
    if (props.name && IconMap[props.name]) return IconMap[props.name]
    if (props.svg) return props.svg
    return null
  }, [props.name, props.svg])
  const [rotate, setRotate] = useState(0)
  const currentRotate = useRef(0)
  const timeRef = useRef(null)
  const isRepair = useMemo(() => {
    return props.name === "WT" && props.subState === 11 // 旧状态
    // return props.name === "WT" && (props.subState === 12 || props.subState === 13 || props.subState === 14 || props.subState === 15 || props.subState === 16 || props.subState === 17) // 新状态
  }, [props])
  useEffect(() => {
    if (props.state != 1 && props.state != 2) {
      clearInterval(timeRef.current)
      setRotate(0)
      return
    }
    clearInterval(timeRef.current)
    timeRef.current = setInterval(() => {
      if (currentRotate.current > 360) setRotate(0)
      currentRotate.current = currentRotate.current + 50
      setRotate(currentRotate.current)
    }, 200)
    return () => clearInterval(timeRef.current)
  }, [props.state])
  return (
    <div className="svgcom">
      {isRepair ? (
        <Icon component={IconMap["REPAIR"]} className={props.className} style={props.style} />
      ) : props.name === "WT" ? (
        <div className={props.className}>
          <Icon component={iconComp} style={props.style} rotate={rotate} className="feng-ye" />
          <Icon component={IconWTZhu} style={props.style} className="feng-zhu" />
        </div>
      ) : (
        <Icon component={iconComp} className={props.className} style={props.style} />
      )}
    </div>
  )
}
