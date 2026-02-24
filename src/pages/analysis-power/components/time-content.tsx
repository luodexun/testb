/*
 *@Author: chenmeifeng
 *@Date: 2023-11-03 14:33:30
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-11-03 14:33:30
 *@Description: 模块描述
 */
import { CloseCircleOutlined } from "@ant-design/icons"

import { ITime } from "../types"
interface Iprops {
  data?: ITime[]
  onDelete?: (value: ITime) => void
}
export default function TimeContent(props: Iprops) {
  const { data, onDelete } = props
  return (
    <div className="time-wrap">
      {data?.map((e: ITime, index: number) => (
        <span className="item" key={index}>
          {e.startTime}~{e.endTime}
          <CloseCircleOutlined className="item-close" onClick={() => onDelete(e)} />
        </span>
      ))}
    </div>
  )
}
