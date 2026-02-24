/*
 * @Author: chenmeifeng
 * @Date: 2024-02-22 17:13:52
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-25 13:46:45
 * @Description:
 */
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Select } from "antd"
import { forwardRef, useImperativeHandle, useState } from "react"

import { testjson } from "../configs/configs"
const quotaTypeList = [
  { value: "1", label: "减排量" },
  { value: "2", label: "时长" },
  { value: "3", label: "电量" },
  { value: "4", label: "台数" },
  { value: "5", label: "数量" },
]
const QuotaForm = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    formData: quotaList,
  }))
  const [quotaList, setQuotaList] = useState(testjson.quotaList || [])
  const onChange = (e, key, id, flag?) => {
    const value = flag ? e.target.value : e
    setQuotaList((prev) => {
      const info = prev.find((item) => item.id === id)
      info[key] = value
      return [...prev]
    })
  }
  const reCurmove = (info) => {
    setQuotaList((prev) => {
      return prev.filter((item) => item.id !== info.id)
    })
  }

  const addCur = () => {
    setQuotaList((prev) => {
      const newItem = [{ id: Date.now(), quotaType: "1", name: "", value: 0, unit: "", type: "1" }]
      return prev.concat(newItem)
    })
  }
  return (
    <div className="sq-form">
      <div className="sq-form-title">
        <span>名称</span>
        <span>单位</span>
        <span>值</span>
        <span>类型</span>
      </div>
      {quotaList?.map((i) => {
        return (
          <div key={i.id} className="reset-item">
            <Input
              defaultValue={i.name}
              value={i.name}
              width={"20%"}
              style={{ width: "20%" }}
              onChange={(e) => onChange(e, "name", i.id, true)}
            />
            <Input
              defaultValue={i.unit}
              value={i.unit}
              style={{ width: "20%" }}
              onChange={(e) => onChange(e, "unit", i.id, true)}
            />
            <InputNumber
              defaultValue={i.value}
              value={i.value}
              style={{ width: "18%" }}
              onChange={(e) => onChange(e, "value", i.id)}
            />
            <Select
              defaultValue={i.type}
              value={i.type}
              style={{ width: "25%" }}
              allowClear
              onChange={(e) => onChange(e, "type", i.id)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
              {quotaTypeList.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  <i className={"i-" + option.value}></i>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
            <MinusCircleOutlined onClick={() => reCurmove(i)} style={{ fontSize: "2em", marginLeft: "1em" }} />
          </div>
        )
      })}
      {quotaList.length < 12 ? (
        <Button type="dashed" onClick={addCur} block>
          + Add Sub Item
        </Button>
      ) : (
        ""
      )}
    </div>
  )
})
export default QuotaForm
