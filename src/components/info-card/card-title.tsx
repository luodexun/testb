/*
 * @Author: xiongman
 * @Date: 2022-11-03 10:56:11
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-03 10:56:11
 * @Description: 页面信息展示卡片容器-卡片标题
 */

import "./card-title.less"

import classnames from "classnames"
import { memo, ReactNode } from "react"

interface ITitleProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

const CardTitle = memo((props: ITitleProps) => {
  const { children, className, onClick } = props
  if (!children) return null
  return (
    <div
      className={classnames(className ?? "card-title", { pointer: !!onClick })}
      onClick={onClick}
      children={children}
    />
  )
})
export default CardTitle
