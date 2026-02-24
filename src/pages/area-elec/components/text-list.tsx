/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 11:01:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-02-28 09:49:47
 * @Description:
 */

import "./text-list.less"

import { parseNum } from "@/utils/util-funs"

export default function TextList(props) {
  const { lineData } = props
  return (
    <div className="text-list">
      {lineData?.map((i) => {
        return (
          <div key={i.pointDesc} className="text-list-item">
            <div>{parseNum(i.value)}</div>
            <div>{i.pointDesc}</div>
          </div>
        )
      })}
      <div></div>
    </div>
  )
}
