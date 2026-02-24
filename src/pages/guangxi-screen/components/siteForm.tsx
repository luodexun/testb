import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, Select } from "antd"
import { forwardRef, useImperativeHandle, useState } from "react"

import { testjson } from "../configs/configs"
interface ISite {
  id: number
  value: string
  name: string
  type: string
  tooltipContent: {
    [key: string]: any
  }
}
const SiteForm = forwardRef((props, ref) => {
  const [tooltipContent, setToolCon] = useState(testjson.siteInfo.tooltipContent)
  const [siteList, setSiteList] = useState<Array<ISite>>(testjson.siteInfo.siteList)
  const onChange = (e, key, index) => {
    const value = e.target.value
    setToolCon((prev) => {
      prev[index][key] = value
      return [...prev]
    })
  }
  const reCurmove = (info) => {
    setToolCon((prev) => {
      return prev.filter((item) => item.id !== info.id)
    })
  }
  const addCur = () => {
    setToolCon((prev) => {
      const newItem = [{ id: Date.now(), name: "", unit: "", key: "" }]
      return prev.concat(newItem)
    })
  }
  const onChangeSite = (e, key, index) => {
    const value = typeof e === "object" ? e.target.value : e
    setSiteList((prev) => {
      prev[index][key] = value
      return [...prev]
    })
  }
  const addSite = () => {
    const toolObj = tooltipContent
      ?.map((i) => i.key)
      .reduce((prev, cur) => {
        prev[cur] = 0
        return prev
      }, {})
    setSiteList((prev) => {
      const newItem = { id: Date.now(), name: "", value: "", type: "", tooltipContent: toolObj }
      prev.push(newItem)
      return prev
    })
  }
  const onChangeTool = (e, key, index) => {
    setSiteList((prev) => {
      prev[index].tooltipContent[key] = e.target.value
      return [...prev]
    })
  }
  useImperativeHandle(ref, () => ({
    formData: {
      tooltipContent,
      siteList,
    },
  }))
  return (
    <div className="s-site">
      <div className="ss-form">
        <span>弹框指标：</span>
        <div className="ss-tooltip-title">
          <span>名称</span>
          <span>key</span>
          <span>单位</span>
        </div>
        {tooltipContent?.map((i, index) => {
          return (
            <div key={i.id} className="reset-item">
              <Input
                defaultValue={i.name}
                value={i.name}
                style={{ width: "30%" }}
                onChange={(e) => onChange(e, "name", index)}
              />
              <Input
                defaultValue={i.key}
                value={i.key}
                style={{ width: "30%" }}
                onChange={(e) => onChange(e, "key", index)}
              />
              <Input
                // defaultValue={i.unit}
                // value={i.unit}
                style={{ width: "30%" }}
                onChange={(e) => onChange(e, "unit", index)}
              />
              <MinusCircleOutlined onClick={() => reCurmove(i)} style={{ fontSize: "2em", marginLeft: "1em" }} />
            </div>
          )
        })}
        <Button type="dashed" onClick={addCur} block>
          + Add Sub Item
        </Button>
      </div>
      <div className="ss-form">
        <span>场站列表：</span>
        <div className="ss-form-title">
          <span>场站名称</span>
          <span style={{ width: "15%" }}>场站类型</span>
          <span>场站经纬度</span>
          <span>弹框数值</span>
        </div>
        {siteList.map((i, index) => {
          return (
            <div key={i.id} className="reset-item">
              <Input
                defaultValue={i.name}
                value={i.name}
                style={{ width: "22%" }}
                onChange={(e) => onChangeSite(e, "name", index)}
              />
              {/* <Input
                defaultValue={i.type}
                value={i.type}
                style={{ width: "10%" }}
                onChange={(e) => onChangeSite(e, "type", index)}
              /> */}
              <Select
                defaultValue={i.type}
                value={i.type}
                style={{ width: "15%" }}
                allowClear
                options={[
                  { value: "WT", label: "风机" },
                  { value: "PVINV", label: "光伏" },
                  { value: "ESPCS", label: "储能" },
                  { value: "FIRE", label: "火电" },
                ]}
                onChange={(e) => onChangeSite(e, "type", index)}
              />
              <Input
                defaultValue={i.value}
                value={i.value}
                style={{ width: "22%" }}
                onChange={(e) => onChangeSite(e, "value", index)}
              />
              <div className="ss-form-tooltip">
                {tooltipContent.map((item) => {
                  return (
                    <div key={item.key} className="ss-tooltip-item">
                      <span>{item.key}：</span>
                      <Input
                        value={i.tooltipContent?.[item.key] || ""}
                        onChange={(e) => onChangeTool(e, item.key, index)}
                      ></Input>
                    </div>
                  )
                })}
              </div>
              <MinusCircleOutlined onClick={() => reCurmove(i)} style={{ fontSize: "2em", marginLeft: "1em" }} />
            </div>
          )
        })}
        <Button type="dashed" onClick={addSite} block>
          + Add Sub Item
        </Button>
      </div>
    </div>
  )
})

export default SiteForm
