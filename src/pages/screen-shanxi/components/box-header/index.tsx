/*
 * @Author: chenmeifeng
 * @Date: 2024-07-12 16:18:25
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-30 15:28:21
 * @Description:
 */
import "./index.less"

interface IProps {
  title: string
  changeClk?: () => void
}
export default function SXBoxHeader(props: IProps) {
  const { title, changeClk } = props

  return (
    <div className="sx-box-header" onClick={changeClk}>
      <span className="sx-box-name">{title}</span>
    </div>
  )
}
