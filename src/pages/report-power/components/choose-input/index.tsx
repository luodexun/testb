/*
 * @Author: chenmeifeng
 * @Date: 2023-12-21 13:47:22
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-22 14:58:34
 * @Description:
 */
import { Input } from "antd"
import { useEffect, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal"
import { StorageChartChoose } from "@/configs/storage-cfg"
import { setStorage } from "@/utils/util-funs"

import ChooseTable, { TTableInfo } from "../choose-table/choose-table"

export default function ChooseInput(props) {
  const { onChange, options, ...otherProps } = props

  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const [chooseValue, setChooseValue] = useState<Array<TTableInfo>>([])

  useEffect(() => {
    const result = options?.map((i) => {
      return {
        name: i.title,
        key: i.dataIndex,
        chartType: chooseValue?.find((j) => j.key === i.dataIndex)?.chartType || "line",
        choose: chooseValue?.find((j) => j.key === i.dataIndex)?.choose || false,
      }
    })
    setChooseValue(result)
  }, [options])
  const openDialog = () => {
    setOpen(true)
    inputRef.current.blur()
  }
  const handleOk = (data) => {
    const choose = data
      .filter((i) => i.choose)
      .map((i) => i.name)
      .join(",")
    setChooseValue(data)
    setStorage(
      data.filter((i) => i.choose),
      StorageChartChoose,
    )
    onChange(choose)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }
  return (
    <div className="w-100">
      <Input ref={inputRef} {...otherProps} onFocus={openDialog} />
      <CustomModal
        transitionName=""
        maskTransitionName=""
        title="选择指标"
        open={open}
        footer={null}
        onCancel={handleCancel}
        Component={ChooseTable}
        componentProps={{ buttonClick: handleOk, chooseValue }}
      ></CustomModal>
    </div>
  )
}
