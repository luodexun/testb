/*
 * @Author: chenmeifeng
 * @Date: 2024-07-31 15:04:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-31 15:09:27
 * @Description:
 */
import "./power-predict-form.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
const ModelForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState([])
  const [isUse, setIsUse] = useState(true)
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
      const newItem = [{ id: Date.now(), name: "", value: 0 }]
      return prev.concat(newItem)
    })
  }

  const choose = (e) => {
    setIsUse(e?.target.value)
  }

  useEffect(() => {
    if (quotaInfo) {
      setQuotaList(quotaInfo.modelData?.data)

      setIsUse(!quotaInfo.modelData?.useInterfaceData)
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    formData: quotaList,
    useInterfaceData: !isUse,
  }))
  return (
    <div className="sx-sq-form">
      <div className="sq-form-title">
        <span>机型</span>
        <span>数量</span>
      </div>
      {quotaList?.map((i) => {
        return (
          <div key={i.id} className="reset-item">
            <Input
              defaultValue={i.name}
              value={i.forecastTime}
              width={"30%"}
              style={{ width: "30%" }}
              onChange={(e) => onChange(e, "name", i.id, true)}
            />

            <InputNumber
              defaultValue={i.value}
              value={i.value}
              style={{ width: "38%" }}
              onChange={(e) => onChange(e, "value", i.id)}
            />
            <MinusCircleOutlined onClick={() => reCurmove(i)} style={{ fontSize: "2em", marginLeft: "1em" }} />
          </div>
        )
      })}
      {quotaList.length < 10 ? (
        <Button type="dashed" onClick={addCur} block className="btn">
          + 增加一条
        </Button>
      ) : (
        ""
      )}
      <div>
        <span>是否使用该数据：</span>
        <Radio.Group onChange={choose} value={isUse}>
          <Radio value={false}>否</Radio>
          <Radio value={true}>是</Radio>
        </Radio.Group>
      </div>
    </div>
  )
})
export default ModelForm
