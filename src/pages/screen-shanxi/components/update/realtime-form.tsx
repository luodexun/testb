import "./realtime-form.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
const keyAndName = {
  windSpeed: "平均风速",
  totalIrradiance: "平均辐照度",
}
const RealtimeForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState([])
  const [rltimeInfo, setRltimeInfo] = useState(null)
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
      const newItem = [{ id: Date.now(), Time: "", agvcPower: 0, shortPredPower: 0, ultraShortPredPower: 0 }]
      return prev.concat(newItem)
    })
  }

  const onChangeRtInfo = (e, key) => {
    setRltimeInfo((prev) => {
      prev[key] = e
      return { ...prev }
    })
  }

  const choose = (e) => {
    setIsUse(e?.target.value)
  }

  useEffect(() => {
    if (quotaInfo) {
      setQuotaList(quotaInfo.realtimeInfo?.list)
      setRltimeInfo(quotaInfo.realtimeInfo?.data)
      setIsUse(!quotaInfo.realtimeInfo?.useInterfaceData)
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    formData: quotaList,
    rltimeInfo: rltimeInfo,
    useInterfaceData: !isUse,
  }))
  return (
    <div className="sx-rt-form">
      <div className="rlt-info">
        {rltimeInfo &&
          Object.keys(rltimeInfo)?.map((i) => {
            return (
              <div key={i} className="reset-item">
                <span>{keyAndName[i]}：</span>
                <InputNumber
                  defaultValue={rltimeInfo[i]}
                  value={rltimeInfo[i]}
                  style={{ width: "55%" }}
                  onChange={(e) => onChangeRtInfo(e, i)}
                />
              </div>
            )
          })}
      </div>
      <div className="sq-form-title">
        <span>月份</span>
        <span>实时功率</span>
        <span>短期预测功率</span>
        <span>超短期预测功率</span>
      </div>
      {quotaList?.map((i) => {
        return (
          <div key={i.id} className="reset-item">
            <Input
              defaultValue={i.Time}
              value={i.Time}
              style={{ width: "20%" }}
              onChange={(e) => onChange(e, "Time", i.id, true)}
            />
            <InputNumber
              defaultValue={i.agvcPower}
              value={i.agvcPower}
              style={{ width: "20%" }}
              onChange={(e) => onChange(e, "agvcPower", i.id)}
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
export default RealtimeForm
