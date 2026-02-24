/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 13:49:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 17:28:57
 * @Description:
 */
import "./elec-form.less"
import { InputNumber, Radio } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"

const keyAndName = {
  totalInstalledCapacity: "运营总装机容量",
  totalInstalledCapacity1: "并网总装机容量",
  wtInstalledCapacity: "风电运营总装机容量",
  wtOperationDeviceCount: "风机运营总台数",
  pvinvInstalledCapacity: "光伏运营总装机容量",
  pvinvOperationDeviceCount: "逆变器运营总台数",
}
const CpCvwForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState({})
  const [isUse, setIsUse] = useState(true)
  const onChange = (e, key) => {
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
      setQuotaList(quotaInfo.capacityOverview?.data)
      setIsUse(!quotaInfo.capacityOverview?.useInterfaceData)
      console.log(quotaInfo.capacityOverview?.useInterfaceData, "quotaInfo.capacityOverview?.useInterfaceData")
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    formData: quotaList,
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
              onChange={(e) => onChange(e, i)}
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
export default CpCvwForm
