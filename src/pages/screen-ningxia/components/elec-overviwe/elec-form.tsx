/*
 * @Author: chenmeifeng
 * @Date: 2025-01-02 15:36:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-02 17:11:26
 * @Description:
 */
import "./elec-form.less"
import { CloseOutlined, MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
import { screenVirtualData } from "../../configs/form-json"
import { saveScreenVirtualData } from "../../methods"
const keyAndName = {
  dailyProduction: "日实际(万kWh)",
  dailyProductionPlan: "日计划(万kWh)",
  monthlyProduction: "月实际(万kWh)",
  monthlyProductionPlan: "月计划(万kWh)",
  yearlyProduction: "年实际(万kWh)",
  yearlyProductionPlan: "年计划(万kWh)",
}
export default function ElecForm(props) {
  const { setshowModal } = props
  const { quotaInfo, setQuotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState(screenVirtualData.electricity.data)
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
  const closeModal = () => {
    setshowModal(false)
  }
  const saveForm = async () => {
    const json = {
      electricity: { data: quotaList, useInterfaceData: false },
    }
    const res = await saveScreenVirtualData(json)
    closeModal()
    setQuotaInfo((prev) => {
      return {
        ...prev,
        ...json,
      }
    })
  }
  useEffect(() => {
    if (quotaInfo) {
      setQuotaList({ ...quotaInfo.electricity?.data })
      setIsUse(!quotaInfo.electricity?.useInterfaceData)
    }
  }, [quotaInfo])

  // useImperativeHandle(ref, () => ({
  //   data: quotaList,
  //   useInterfaceData: !isUse,
  // }))
  return (
    <div className="nx-elec-form">
      <div className="nx-form-close">
        <span>编辑信息</span>
        <CloseOutlined onClick={closeModal} />
      </div>
      <div className="nx-form-content">
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
        {/* <div>
        <span>是否使用该数据：</span>
        <Radio.Group onChange={choose} value={isUse}>
          <Radio value={false}>否</Radio>
          <Radio value={true}>是</Radio>
        </Radio.Group>
      </div> */}
        <Button size="small" onClick={saveForm}>
          保存
        </Button>
      </div>
    </div>
  )
}
