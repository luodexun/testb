/*
 * @Author: chenmeifeng
 * @Date: 2024-06-05 15:38:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-05 16:03:51
 * @Description: 控制步长
 */
import { Button, Flex, InputNumber, Space } from "antd"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
export interface IIntervalRefs {}
export interface IIntervalProps {
  addonAfter?: boolean
  buttonClick?: (value: number) => void
}
const IntervalBox = forwardRef<IIntervalRefs, IIntervalProps>((props, ref) => {
  const { buttonClick, addonAfter } = props
  const [value, setValue] = useState(1000)
  const changeVal = useRef((e) => {
    setValue(e)
  })

  const operateBtn = () => {
    buttonClick?.(value)
  }
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="interval-box">
      <InputNumber addonAfter={addonAfter ? false : "毫秒"} value={value} onChange={(e) => changeVal.current(e)} />
      <Flex justify="flex-end">
        <Space size={"large"}>
          <Button size={"small"} onClick={operateBtn}>
            确认
          </Button>
        </Space>
      </Flex>
    </div>
  )
})
export default IntervalBox
