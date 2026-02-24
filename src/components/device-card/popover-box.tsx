/*
 * @Author: xiongman
 * @Date: 2023-08-31 13:49:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-18 10:39:54
 * @Description:
 */

import { ConfigProvider, Popover, PopoverProps, ThemeConfig } from "antd"
import { ReactNode } from "react"

import CardTitle from "@/components/info-card/card-title.tsx"

const POPOVER_THEME: ThemeConfig = {
  components: {
    Popover: {
      padding: 0,
      paddingSM: 0,
      colorText: "var(--fontcolor)",
      colorBgElevated: "var(--bg-popover)",
      colorTextHeading: "var(--fontcolor)",
      zIndexPopup: 1,
    },
  },
}

interface IProps extends Omit<PopoverProps, "title"> {
  children?: ReactNode
  title?: ReactNode
}

export default function PopoverBox(props: IProps) {
  const { title, children, ...others } = props
  return (
    <ConfigProvider
      theme={POPOVER_THEME}
      children={
        <Popover
          arrow={false}
          mouseEnterDelay={1}
          destroyTooltipOnHide
          placement="bottomLeft"
          {...others}
          title={<CardTitle children={title} />}
          children={children}
        />
      }
    />
  )
}
