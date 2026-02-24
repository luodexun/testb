import "./index.less"

import { ReactNode } from "react"
import SXBoxHeader from "../box-header"

interface IPrps {
  title: string
  children?: ReactNode
  headerClk?: () => void
}
// : ReactElement | any
export default function CommonCtBox(props: IPrps) {
  const { title, children, headerClk } = props
  return (
    <div className="sx-box">
      <SXBoxHeader title={title} changeClk={headerClk} />
      <div className="sx-box-content">{children}</div>
    </div>
  )
}
