/*
 *@Author: chenmeifeng
 *@Date: 2023-11-03 11:18:13
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-11-03 11:18:13
 *@Description: 模块描述
 */
import { useState } from "react"
interface IProps {
  onClick?: (value: string) => void
}
export default function TabContent(props: IProps) {
  const { onClick } = props

  const [active, setActive] = useState<string>("lineName")
  const tabList = [
    {
      label: "线路",
      value: "lineName",
    },
    {
      label: "期次",
      value: "periodName",
    },
    {
      label: "型号",
      value: "model",
    },
    // {
    //   label: "标杆",
    //   value: "model",
    // },
    // {
    //   label: "状态",
    //   value: "model",
    // },
  ]

  function onHandleClick(value: string) {
    setActive(value)
    onClick?.(value)
  }
  return (
    <div className="tab-wrap">
      {tabList.map(({ label, value }) => (
        <span className={`item ${active === value ? "active" : ""}`} key={value} onClick={() => onHandleClick(value)}>
          {label}
        </span>
      ))}
    </div>
  )
}
