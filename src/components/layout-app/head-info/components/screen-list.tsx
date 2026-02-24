/*
 * @Author: chenmeifeng
 * @Date: 2024-12-11 13:55:39
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-11 14:24:16
 * @Description:
 */
import "./screen-list.less"
import { Link } from "react-router-dom"

export default function ScreenModalLs({ list }: { list: Array<{ key: string; name: string }> }) {
  return (
    <div className="scn-ls">
      {list?.map((i) => {
        return (
          <span key={i.key} className="scn-ls-item">
            <Link to={i.key}>{i.name}</Link>
          </span>
        )
      })}
    </div>
  )
}
