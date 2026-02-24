import "./elec-form.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"

const keyAndName = {
  yearlyProduction: "年发电量",
  monthlyProduction: "月发电量",
  dailyProduction: "日发电量",
}
const rateKeys = {
  yearRate: "年完成率",
  monthRate: "月完成率",
}
const ElecForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState({})
  const [rateList, setRateList] = useState({})
  const [isUse, setIsUse] = useState(true)
  const onChange = (e, key, type) => {
    const setData = type === "1" ? setQuotaList : setRateList
    setData((prev) => {
      prev[key] = e
      return { ...prev }
    })
  }

  const choose = (e) => {
    setIsUse(e?.target.value)
  }

  useEffect(() => {
    console.log(quotaInfo, "可怜见立刻就地方")

    if (quotaInfo) {
      setQuotaList(quotaInfo.electricity?.data)
      setRateList(quotaInfo.electricity?.rate)
      setIsUse(!quotaInfo.electricity?.useInterfaceData)
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    data: quotaList,
    rate: rateList,
    useInterfaceData: !isUse,
  }))
  return (
    <div className="sx-elec-form">
      <div className="sq-elec-form-title">
        <span>名称</span>
        <span>值</span>
      </div>
      {Object.keys(keyAndName)?.map((i) => {
        return (
          <div key={i} className="reset-item">
            <span>{keyAndName[i]}：</span>
            <InputNumber
              defaultValue={quotaList?.[i]}
              value={quotaList?.[i]}
              style={{ width: "38%" }}
              onChange={(e) => onChange(e, i, "1")}
            />
          </div>
        )
      })}
      {Object.keys(rateKeys)?.map((i) => {
        return (
          <div key={i} className="reset-item">
            <span>{rateKeys[i]}：</span>
            <InputNumber
              defaultValue={rateList?.[i]}
              value={rateList?.[i]}
              style={{ width: "38%" }}
              onChange={(e) => onChange(e, i, "2")}
            />
          </div>
        )
      })}
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
export default ElecForm
