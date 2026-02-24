import "./index.less"
import { ReactNode } from "react"
interface IProps {
  title?: string
  rightBox?: ReactNode
}
export default function CommonBoxHeader(props: IProps) {
  const { title, rightBox } = props
  return (
    <div className="hn-cbox-header">
      <span className="cbox-header-left">{title}</span>
      <div className="hn-cbox-header-right">{rightBox}</div>
    </div>
  )
}
