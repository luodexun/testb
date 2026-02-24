/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 13:49:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-22 10:12:30
 * @Description:
 */
import "./cp-ovw.less"
import { InputNumber, Radio } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
import { testScreenData } from "../../configs/form-json"
const allQuota = {
  总: {
    totalInstalledCapacity: "装机容量",
    activePower: "实时有功",
    dailyProduction: "日发电量",
    windSpeed: "实时风速",
    totalIrradiance: "辐照强度",
  },
  风: {
    wtInstalledCapacity: "装机容量",
    wtDailyProduction: "日发电量",
    wtNum: "风机台数",
    wtInstalledCapacityTRate: "容量占比(%)",
    stationWNum: "场站数量（个）",
  },
  光: {
    pvinvInstalledCapacity: "装机容量",
    pvinvDailyProduction: "日发电量",
    pvinvNum: "逆变器台数",
    pvinvInstalledCapacityTRate: "容量占比(%)",
    stationSNum: "场站数量（个）",
  },
}
const CpCvwForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState(testScreenData.capacityOverview.data)
  const [isUse, setIsUse] = useState(false)
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
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    formData: quotaList,
    useInterfaceData: !isUse,
  }))
  return (
    <div className="hb-cp-form">
      <div className="hb-cp-list">
        {Object.keys(allQuota)?.map((i) => {
          return (
            <div className="hb-cp-item" key={i}>
              <div className="hb-cp-item-type">{i}</div>
              <div className="hb-cp-item-title">
                <span>名称</span>
                <span>值</span>
              </div>
              {Object.keys(allQuota[i])?.map((j) => {
                return (
                  <div key={j} className="reset-item">
                    <span>{allQuota[i][j]}：</span>
                    <InputNumber
                      defaultValue={quotaList?.[j]}
                      value={quotaList?.[j]}
                      style={{ width: "38%" }}
                      onChange={(e) => onChange(e, j)}
                    />
                  </div>
                )
              })}
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
export default CpCvwForm
