/*
 * @Author: chenmeifeng
 * @Date: 2024-01-25 16:23:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-07 17:02:57
 * @Description:
 */
import "./index.less"

import { Button, Checkbox, Flex, Radio } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import { DEVICE_RUN_CARD_FIELD_4TYPE } from "@/configs/dvs-state-info"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import { ICheckList } from "@/types/i-device"
import { getMngStaticInfo } from "./methods"
const CheckboxGroup = Checkbox.Group

// const radioGroup = [
//   { value: "WT", name: "风机" },
//   { value: "PVINV", name: "逆变器" },
//   { value: "ESPCS", name: "变流器" },
// ]
export interface IProps {
  closeModal?: (flag: boolean) => void
}
export interface IRefs {
  checkedList: ICheckList
}
const DvsTargetBox = forwardRef<IRefs, IProps>((props, ref) => {
  const [chooseVal, setChooseVal] = useState("WT")
  const [checkedList, setCheckedList] = useState<ICheckList>({})
  const { chooseColumnKey } = useContext(DvsDetailContext)

  const isFirst = useRef(true)

  const plainOptions = useMemo(() => {
    return DEVICE_RUN_CARD_FIELD_4TYPE[chooseVal]?.map((i) => {
      return {
        label: i.title,
        value: i.field + "-" + chooseVal,
      }
    })
  }, [chooseVal])

  const onChange = (e) => {
    setChooseVal(e.target.value)
  }
  const onTargetChange = (e) => {
    const obj = {}
    obj[chooseVal] = e
    const allKey = Object.assign({}, checkedList, obj)
    setCheckedList(allKey)
  }
  const initData = async () => {
    const res = await getMngStaticInfo()
    if (!res) return
    setCheckedList(res.devcieChecks || {})
    console.log(res, "sdfsdf")
  }
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      initData()
    }
  }, [chooseColumnKey])
  useImperativeHandle(ref, () => ({
    checkedList: checkedList,
  }))
  return (
    <div className="target-box">
      <Radio.Group onChange={onChange} value={chooseVal}>
        <Radio value="WT">风机</Radio>
        <Radio value="PVINV">逆变器</Radio>
        <Radio value="ESPCS">变流器</Radio>
      </Radio.Group>
      <div className="target-box-checkbox">
        <CheckboxGroup options={plainOptions} value={checkedList[chooseVal]} onChange={onTargetChange} />
      </div>
    </div>
  )
})
export default DvsTargetBox
