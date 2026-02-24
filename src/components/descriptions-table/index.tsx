/*
 * @Author: xiongman
 * @Date: 2023-04-12 13:25:24
 * @LastEditors: xiongman
 * @LastEditTime: 2023-04-12 13:25:24
 * @Description: 信息详情展示表组件
 */

import { Descriptions } from "antd"
import { ReactNode } from "react"

export interface IDesItem {
  label: string
  text: ReactNode
  span?: number
}
interface IDesProps {
  data: IDesItem[]
}
export default function DescriptionsTable(props: IDesProps) {
  const { data } = props
  return (
    <Descriptions column={2} size="middle" bordered>
      {data.map(({ text, label, span }) => (
        <Descriptions.Item key={label} label={label} children={text} span={span} labelStyle={{ minWidth: "8em" }} />
      ))}
    </Descriptions>
  )
}
