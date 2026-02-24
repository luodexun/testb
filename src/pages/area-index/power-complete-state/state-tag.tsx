/*
 * @Author: xiongman
 * @Date: 2023-08-24 11:52:33
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-24 11:52:33
 * @Description: 区域中心-指标总览-发电量完成情况-标签组件
 */

import "./state-tag.less"

import { UNIT } from "@configs/text-constant.ts"
import { evoLargeNum4Unit, parseNum } from "@utils/util-funs.tsx"
import { Progress } from "antd"
import { CSSProperties, useMemo, useRef } from "react"

import MetricTag from "@/components/metric-tag"

interface IProps {
  tags: { title: string; value: string | number }[]
  strokeColor: { from: string; to: string }
  valueColor?: string
}

export default function StateTag(props: IProps) {
  const { tags, strokeColor, valueColor } = props

  const styleRef = useRef((title?: string): CSSProperties => {
    if (title) return { "--info-title-width": `${title.length + 1}em` } as CSSProperties
    return {
      "--info-value-color": valueColor,
      "--progress-text-color": valueColor,
    } as CSSProperties
  })

  const formatRef = useRef((num: number) => {
    return <span className="progress-text" children={num} />
  })

  const percent = useMemo(() => {
    const [actualInfo, planInfo] = tags || []
    if (!planInfo?.value) return 0
    return parseNum((parseNum(actualInfo?.value ?? 0) * 100) / (parseNum(planInfo?.value ?? 1, -1, 1) || 1))
  }, [tags])
  return (
    <div className="state-tag" style={styleRef.current()}>
      <div className="tags-box">
        {tags.map((tag) => (
          <MetricTag
            key={tag.title}
            title={tag.title}
            {...evoLargeNum4Unit({ value: tag.value, unit: UNIT.ELEC })}
            className="metric-tag"
            style={styleRef.current(tag.title)}
          />
        ))}
      </div>
      <div style={{ padding: "0.5em 1em" }}>
        <Progress
          percent={percent}
          status="active"
          strokeColor={strokeColor}
          trailColor={strokeColor.from}
          format={formatRef.current}
        />
      </div>
    </div>
  )
}
