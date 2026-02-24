import "./index.less"
import { Button, Checkbox, Space } from "antd"
import { useEffect, useState, useRef } from "react"
import Draggable from "react-draggable"
interface IProps {
  options: any
  property?: any
  btnClick?: (type, checkInfo?: any) => void
}
export default function PropertyBox(props: IProps) {
  const { options, property, btnClick } = props
  const [value, setValue] = useState([])
  const nodeRef = useRef(null)

  const onChange = (check) => {
    setValue(check)
  }
  const comfirm = () => {
    const checkProperty = options.reduce((prev, cur) => {
      if (value.includes(cur.value)) {
        prev[cur.value] = false
      } else {
        prev[cur.value] = true
      }
      return prev
    }, {})
    btnClick?.("comfirm", checkProperty)
  }
  useEffect(() => {
    const vals = options.map((i) => i.value)
    if (!property) {
      setValue(vals)
    } else {
      const chooseKeys = Object.keys(property)?.filter((i) => !property[i]) || []
      setValue(chooseKeys)
    }
  }, [property])
  return (
    <Draggable nodeRef={nodeRef}>
      <div className="property-box" ref={nodeRef}>
        <Checkbox.Group options={options} value={value} onChange={onChange} />
        <div className="btn-list">
          <Space>
            <Button onClick={comfirm}>确认</Button>
            <Button onClick={btnClick?.bind(null, "cancel")}>取消</Button>
          </Space>
        </div>
      </div>
    </Draggable>
  )
}
