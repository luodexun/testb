import "./elec-form.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
import { testScreenData } from "../../configs/form-json"
const keyAndName = {
  yearlyProduction: "年实际(kWh)",
  monthlyProduction: "月实际(kWh)",
  monthlyProductionPlan: "月计划(kWh)",
  yearlyProductionPlan: "年计划(kWh)",
}
const ElecForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState(testScreenData.electricity.data)
  // const [rateList, setRateList] = useState(null)
  const [isUse, setIsUse] = useState(false)
  const onChange = (e, key, type) => {
    setQuotaList((prev) => {
      prev[key] = e
      return { ...prev }
    })
  }

  const choose = (e) => {
    setIsUse(e?.target.value)
  }

  useEffect(() => {
    if (quotaInfo) {
      setQuotaList(quotaInfo.electricity?.data)
      setIsUse(!quotaInfo.electricity?.useInterfaceData)
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    data: quotaList,
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
