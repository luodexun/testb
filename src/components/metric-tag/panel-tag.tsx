/*
 * @Author: xiongman
 * @Date: 2023-11-08 16:11:06
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-08 16:11:06
 * @Description: 指标信息展示卡片
 */

import "./panel-tag.less"

import { evoLargeNum4Unit } from "@utils/util-funs.tsx"
import classnames from "classnames"
import { ReactNode } from "react"

interface IProps {
  value: ReactNode
  title?: ReactNode
  unit?: string
  digits?: number
  className?: string
  unitInTitle?: boolean
}

export default function PanelTag(props: IProps) {
  const { value, title, digits, unit, className, unitInTitle } = props
  const { value: evoVal, unit: evoUnit } = evoLargeNum4Unit({ value: value as string | number, unit, digits })
  return (
    <div className={classnames("panel-tag-wrap", className)}>
      <div className="value-unit">
        <span className="tag-value" title={`${value ?? "-"}${unit}`} children={evoVal} />
        {unitInTitle ? null : <span className="tag-unit" children={evoUnit} />}
      </div>
      <div className="title-unit">
        <span className="tag-title" children={title} />
        {unitInTitle ? <span className="tag-unit" children={`(${evoUnit})`} /> : null}
      </div>
    </div>
  )
}
