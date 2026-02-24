import "./day-trend-form.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
const keyAndName = {
  windSpeed: "平均风速",
  irradiate: "平均辐照度",
}
const RealtimeForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState([])
  const [isUse, setIsUse] = useState(false)
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
      const newItem = [{ id: Date.now(), forecastTime: "", shortPredPower: 0, ultraShortPredPower: 0, agvcPower: 0 }]
      return prev.concat(newItem)
    })
  }

  const choose = (e) => {
    setIsUse(e?.target.value)
  }

  useEffect(() => {
    if (quotaInfo) {
      setQuotaList(quotaInfo.dayTrendInfo?.data)
      setIsUse(!quotaInfo.dayTrendInfo?.useInterfaceData)
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    formData: quotaList,
    useInterfaceData: !isUse,
  }))
  return (
    <div className="sx-rt-form">
      <div className="sq-form-title">
        <span>时间</span>
        <span>短期预测功率(kW)</span>
        <span>超短期预测功率(kW)</span>
        <span>全场实际功率(MW)</span>
      </div>
      {quotaList?.map((i) => {
        return (
          <div key={i.id} className="reset-item">
            <Input
              defaultValue={i.forecastTime}
              value={i.forecastTime}
              style={{ width: "20%" }}
              onChange={(e) => onChange(e, "forecastTime", i.id, true)}
            />
            <InputNumber
              defaultValue={i.shortPredPower}
              value={i.shortPredPower}
              style={{ width: "20%" }}
              onChange={(e) => onChange(e, "shortPredPower", i.id)}
            />
            <InputNumber
              defaultValue={i.ultraShortPredPower}
              value={i.ultraShortPredPower}
              style={{ width: "20%" }}
              onChange={(e) => onChange(e, "ultraShortPredPower", i.id)}
            />
            <InputNumber
              defaultValue={i.agvcPower}
              value={i.agvcPower}
              style={{ width: "20%" }}
              onChange={(e) => onChange(e, "agvcPower", i.id)}
            />
            <MinusCircleOutlined onClick={() => reCurmove(i)} style={{ fontSize: "2em", marginLeft: "1em" }} />
          </div>
        )
      })}
      {quotaList?.length < 10 ? (
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
export default RealtimeForm
