/*
 * @Author: chenmeifeng
 * @Date: 2024-07-31 15:04:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-22 09:51:45
 * @Description: 年利用小时数表单编辑
 */
import "./year-use-hour-form.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select, Tabs } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
import { testScreenData } from "../../configs/form-json"
import { SELECTOPTION } from "../../configs"

const tabsList = SELECTOPTION.map((i) => {
  return {
    key: i.value,
    label: i.label,
    closable: false,
  }
})
const YeatHourForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState(testScreenData.yearHourData.data)
  const [activeKey, setActiveKey] = useState("REGION_COM_ID")
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
    const newItem = [
      {
        id: Date.now(),
        name: "",
        yearlyUtilizationHour: 0,
      },
    ]
    setQuotaList((prev) => {
      return { ...prev, [type]: prev[type].concat(newItem) }
    })
  }

  const choose = (e) => {
    setIsUse(e?.target.value)
  }
  const onTabsChgRef = useRef((e) => {
    setActiveKey(e)
  })

  useEffect(() => {
    if (quotaInfo) {
      setQuotaList(quotaInfo.yearHourData?.data || testScreenData.yearHourData.data)

      setIsUse(!quotaInfo.yearHourData?.useInterfaceData)
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    formData: quotaList,
    useInterfaceData: !isUse,
  }))
  return (
    <div className="hb-yh-form">
      <div className="tabList page-tabs-wrap">
        <Tabs
          type="editable-card"
          hideAdd
          tabBarGutter={4}
          items={tabsList}
          activeKey={activeKey}
          onChange={onTabsChgRef.current}
        />
      </div>

      <div className="hb-md-item">
        <div className="hb-md-item">
          <div className="sq-form-title">
            <span>名称</span>
            <span>值(h)</span>
          </div>
          {quotaList?.[activeKey]?.map((i) => {
            return (
              <div key={i.id} className="reset-item">
                <Input
                  defaultValue={i.name}
                  value={i.name}
                  width={"30%"}
                  style={{ width: "30%" }}
                  onChange={(e) => onChange(e, "name", i.id, activeKey, true)}
                />
                <InputNumber
                  defaultValue={i.yearlyUtilizationHour}
                  value={i.yearlyUtilizationHour}
                  style={{ width: "30%" }}
                  onChange={(e) => onChange(e, "yearlyUtilizationHour", i.id, activeKey)}
                />
                <MinusCircleOutlined
                  onClick={() => reCurmove(i, activeKey)}
                  style={{ fontSize: "2em", marginLeft: "1em" }}
                />
              </div>
            )
          })}
          <Button type="dashed" onClick={() => addCur(activeKey)} block className="btn">
            + 增加一条
          </Button>
        </div>
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
export default YeatHourForm
