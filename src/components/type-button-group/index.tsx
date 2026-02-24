/*
 * @Author: xiongman
 * @Date: 2023-11-06 10:15:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-18 16:28:26
 * @Description: 切换按钮组
 */

import "./index.less"

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { Button, ButtonProps } from "antd"
import classnames from "classnames"
import React, { useEffect, useRef, useState } from "react"

interface IProps<TF extends string> {
  buttons: IDvsRunStateInfo<TF>[]
  needFirstSearch?: boolean
  onChange?: (checked?: TF) => void
  btnProps?: Omit<ButtonProps, "className" | "onClick">
}

export default function TypeButtonGroup<TF extends string>(props: IProps<TF>) {
  const { buttons, needFirstSearch = true, onChange, btnProps } = props
  //实时状态和执行日志切换
  const [checkedBtn, setCheckedBtn] = useState<TF>(buttons?.[0]?.field)

  useEffect(() => {
    if (!buttons?.length) return
    setCheckedBtn((prevState) => {
      if (prevState && buttons.find(({ field }) => field === prevState)) return prevState
      return buttons[0].field
    })
  }, [buttons])

  const onChgRef = useRef(onChange)
  onChgRef.current = onChange

  const changeBtn = (val) => {
    setCheckedBtn(val)
    onChgRef.current?.(val)
  }
  useEffect(() => {
    if (!needFirstSearch) return
    onChgRef.current?.(checkedBtn)
  }, [])

  return (
    <div className="type-button-group-wrap">
      {buttons?.map(({ title, field }) => (
        <Button
          key={field}
          className={classnames("type-btn", { "checked-btn": checkedBtn === field })}
          onClick={() => changeBtn(field)}
          title={title}
          children={title}
          {...btnProps}
        />
      ))}
    </div>
  )
}
