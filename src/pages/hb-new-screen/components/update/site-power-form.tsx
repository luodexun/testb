/*
 * @Author: chenmeifeng
 * @Date: 2024-07-31 15:04:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-22 17:15:36
 * @Description: 气象信息编辑
 */
import "./site-power-form.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select, Tabs } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"

import LargeScreenContext from "@/contexts/screen-context"
import { testScreenData } from "../../configs/form-json"
const tabsList = [
  { key: "WT", label: "风", closable: false },
  { key: "PVINV", label: "光", closable: false },
]
const SiteWeatherForm = forwardRef((props, ref) => {
  const { quotaInfo } = useContext(LargeScreenContext)
  const [quotaList, setQuotaList] = useState(testScreenData.weatherData.data)
  const [activeKey, setActiveKey] = useState("WT")
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
        stationShortName: "",
        stationCode: "",
        windSpeed: 0,
        activePower: 0,
        dailyProduction: 0,
        typeRate: 0,
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
      setQuotaList(quotaInfo.weatherData?.data || testScreenData.weatherData.data)

      setIsUse(!quotaInfo.weatherData?.useInterfaceData)
    }
  }, [quotaInfo])

  useImperativeHandle(ref, () => ({
    formData: quotaList,
    useInterfaceData: !isUse,
  }))
  return (
    <div className="hb-sw-form">
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
            <span>场站名称</span>
            <span>场站编码</span>
            <span>平均风速</span>
            <span>有功功率</span>
            <span>日发量</span>
            <span>出力率</span>
          </div>
          {quotaList?.[activeKey]?.map((i) => {
            return (
              <div key={i.id} className="reset-item">
                <Input
                  defaultValue={i.stationShortName}
                  value={i.stationShortName}
                  width={"16%"}
                  style={{ width: "16%" }}
                  onChange={(e) => onChange(e, "stationShortName", i.id, activeKey, true)}
                />
                <Input
                  defaultValue={i.stationCode}
                  value={i.stationCode}
                  width={"16%"}
                  style={{ width: "16%" }}
                  onChange={(e) => onChange(e, "stationCode", i.id, activeKey, true)}
                />
                <InputNumber
                  defaultValue={i.windSpeed}
                  value={i.windSpeed}
                  style={{ width: "16%" }}
                  onChange={(e) => onChange(e, "windSpeed", i.id, activeKey)}
                />
                <InputNumber
                  defaultValue={i.activePower}
                  value={i.activePower}
                  style={{ width: "16%" }}
                  onChange={(e) => onChange(e, "activePower", i.id, activeKey)}
                />
                <InputNumber
                  defaultValue={i.dailyProduction}
                  value={i.dailyProduction}
                  style={{ width: "16%" }}
                  onChange={(e) => onChange(e, "dailyProduction", i.id, activeKey)}
                />
                <InputNumber
                  defaultValue={i.typeRate}
                  value={i.typeRate}
                  style={{ width: "16%" }}
                  onChange={(e) => onChange(e, "typeRate", i.id, activeKey)}
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
export default SiteWeatherForm
