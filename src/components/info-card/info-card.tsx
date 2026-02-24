/*
 * @Author: xiongman
 * @Date: 2022-11-03 10:42:28
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-03 10:42:28
 * @Description: 页面信息展示卡片容器
 */

import "./info-card.less"

import { Card } from "antd"
import classNames from "classnames"
import { ReactNode } from "react"

import CardTitle from "./card-title"

interface ICardProps {
  children: ReactNode
  title?: string
  icon?: ReactNode
  extra?: ReactNode
  className?: string
  loading?: boolean
  titleClick?: () => void
}

export default function InfoCard(props: ICardProps) {
  const { title, extra, children, className, loading, titleClick } = props

  return (
    <Card
      key={title}
      loading={loading}
      bordered={false}
      title={<CardTitle key={title} className="img-bg-title" children={title} onClick={titleClick} />}
      extra={extra}
      className={classNames("info-card", className)}
      children={children}
    />
  )
}
