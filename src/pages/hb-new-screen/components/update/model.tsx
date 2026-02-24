/*
 * @Author: chenmeifeng
 * @Date: 2024-07-31 15:04:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-23 09:35:55
 * @Description: 品牌信息编辑
 */
import "./model.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
import { MAIN_DVS_TYPE_LOWERCASE } from "@/configs/option-const"
import { testScreenData } from "../../configs/form-json"

const ModelForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState(testScreenData.modelData.data)
  const [isUse, setIsUse] = useState(false)
  const onChange = (e, key, id, type, flag?) => {
    const value = flag ? e.target.value : e
    setQuotaList((prev) => {
      const info = prev?.[type].find((item) => item.id === id)
      info[key] = value
      return { ...prev }
    })
  }
  const reCurmove = (info, type) => {
    setQuotaList((prev) => {
      return {
        ...prev,
        [type]: prev?.[type].filter((item) => item.id !== info.id),
      }
    })
  }

  const addCur = (type) => {
    const newItem = [{ id: Date.now(), manufacturer: "", deviceQuantity: 0 }]
    setQuotaList((prev) => {
      return { ...prev, [type]: prev[type].concat(newItem) }
    })
  }

  const choose = (e) => {
    setIsUse(e?.target.value)
  }

  useEffect(() => {
    if (quotaInfo) {
      setQuotaList(quotaInfo.modelData?.data || testScreenData.modelData.data)

      setIsUse(!quotaInfo.modelData?.useInterfaceData)
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    formData: quotaList,
    useInterfaceData: !isUse,
  }))
  return (
    <div className="hb-sq-form">
      <div className="hb-md-list">
        {MAIN_DVS_TYPE_LOWERCASE?.map((j) => {
          return (
            <div key={j.value} className="hb-md-item">
              <span>{j.label}</span>
              <div className="sq-form-title">
                <span>机型</span>
                <span>数量</span>
                <span>装机容量(kW)</span>
                <span>装机容量占比（小于1）</span>
              </div>
              {quotaList?.[j.value]?.map((i) => {
                return (
                  <div key={i.id} className="reset-item">
                    <Input
                      defaultValue={i.manufacturer}
                      value={i.manufacturer}
                      width={"30%"}
                      style={{ width: "20%" }}
                      onChange={(e) => onChange(e, "manufacturer", i.id, j.value, true)}
                    />

                    <InputNumber
                      defaultValue={i.deviceQuantity}
                      value={i.deviceQuantity}
                      style={{ width: "20%" }}
                      onChange={(e) => onChange(e, "deviceQuantity", i.id, j.value)}
                    />
                    <InputNumber
                      defaultValue={i.deviceCapacity}
                      value={i.deviceCapacity}
                      style={{ width: "20%" }}
                      onChange={(e) => onChange(e, "deviceCapacity", i.id, j.value)}
                    />
                    <InputNumber
                      defaultValue={i.capacityCent}
                      value={i.capacityCent}
                      style={{ width: "20%" }}
                      onChange={(e) => onChange(e, "capacityCent", i.id, j.value)}
                    />
                    <MinusCircleOutlined
                      onClick={() => reCurmove(i, j.value)}
                      style={{ fontSize: "2em", marginLeft: "1em" }}
                    />
                  </div>
                )
              })}
              <Button type="dashed" onClick={() => addCur(j.value)} block className="btn">
                + 增加一条
              </Button>
            </div>
          )
        })}
      </div>

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
