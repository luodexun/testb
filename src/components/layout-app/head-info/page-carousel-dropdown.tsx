/*
 * @Author: xiongman
 * @Date: 2023-11-15 17:08:40
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-15 17:08:40
 * @Description:
 */

import "./page-carousel-dropdown.less"

import { SCEND_20 } from "@configs/time-constant.ts"
import { AtomPageCarousel } from "@store/atom-menu.ts"
import { Button, Popover } from "antd"
import { useAtom } from "jotai"
import { ReactNode, useRef } from "react"

import CustomInputNumber, { ICustomIptNumRef } from "@/components/custom-input-number"

interface IProps {
  children: ReactNode
  onClick?: () => void
}

function CarouseForm(props: Pick<IProps, "onClick">) {
  const [pageCarousel, setPageCarousel] = useAtom(AtomPageCarousel)
  const iptRef = useRef<ICustomIptNumRef>()
  const setPageCarouselRef = useRef(setPageCarousel)
  setPageCarouselRef.current = setPageCarousel
  const clkRef = useRef(() => {
    setPageCarouselRef.current((prev) => {
      prev.isCarousel = !prev.isCarousel
      prev.waitTime = (iptRef.current.getValue() as number) ?? SCEND_20
      if (prev.waitTime < SCEND_20) prev.waitTime = SCEND_20
      return { ...prev }
    })
    props?.onClick?.()
  })
  return (
    <div className="page-carousel-form">
      <CustomInputNumber
        ref={iptRef}
        size="small"
        step={1}
        min={SCEND_20}
        defaultValue={pageCarousel.waitTime}
        controls={false}
        addonAfter="秒"
      />
      <Button size="small" onClick={clkRef.current} children={pageCarousel.isCarousel ? "停止" : "确定"} />
    </div>
  )
}

export default function PageCarouselDropdown(props: IProps) {
  const { onClick, children } = props
  return (
    <Popover trigger="click" placement="bottomRight" content={<CarouseForm onClick={onClick} />} children={children} />
  )
}
