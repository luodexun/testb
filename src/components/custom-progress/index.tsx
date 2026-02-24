import "./index.less"

import { useEffect, useMemo, useRef } from "react"

interface IProps {
  percent?: string | number
  strokeColor?: string[]
  trailColor?: string
  vertical?: boolean
  width?: string
  unit?: string
  bordered?: boolean
}

function linearGradient(colors: string[], vertical?: boolean) {
  if (!colors) return "var(--split-color)"
  if (colors?.length > 1) {
    return `linear-gradient(${vertical ? 0 : 90}deg, ${colors.join(",")})`
  }
  return colors.join(",")
}
export default function CustomProgress(props: IProps) {
  const { percent, strokeColor, trailColor, vertical, width, unit, bordered } = props
  const wrapRef = useRef<HTMLDivElement>()
  useEffect(() => {
    if (!wrapRef.current) return
    const wrapStyle = wrapRef.current.style

    wrapStyle.setProperty("flex-direction", vertical ? "column" : "row")
    wrapStyle.setProperty("--progress-width", vertical ? width : "100%")
    wrapStyle.setProperty("--progress-height", vertical ? "100%" : width)
    wrapStyle.setProperty("--progress-radius", `calc(${width} / 2)`)
    if (trailColor) {
      wrapStyle.setProperty("--progress-trail", linearGradient([trailColor], vertical))
    }
    if (strokeColor) {
      wrapStyle.setProperty("--progress-stroke", linearGradient(strokeColor, vertical))
    }
  }, [strokeColor, trailColor, vertical, width])

  const valueTag = useMemo(() => `${percent || 0}${unit ? ` ${unit}` : ""}`, [percent, unit])
  const valueBrStyle = useMemo(
    () => ({
      [vertical ? "height" : "width"]: `${percent || 0}%`,
      [vertical ? "right" : "top"]: 0,
    }),
    [percent, vertical],
  )
  return (
    <div ref={wrapRef} className={bordered ? "custom-progress" : "custom-progress-bar"}>
      {vertical ? <span className="value-tag" children={valueTag} /> : null}
      <div className="progress-trail">
        <div className="value-bar" style={valueBrStyle} />
      </div>
      {vertical ? null : <span className="value-tag" children={valueTag} />}
    </div>
  )
}
