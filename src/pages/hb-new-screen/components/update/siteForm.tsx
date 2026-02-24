import "./siteForm.less"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Input, InputNumber, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"

// import { testjson } from "../configs/configs"
import LargeScreenContext from "@/contexts/screen-context"
import { tooltipKey } from "../../configs"
interface ISite {
  id: number
  value: string
  name: string
  type: string
  tooltipContent: {
    [key: string]: any
  }
}
const initCt = {
  windSpeed: 0,
  activePower: 0,
  totalDeviceCount: 0,
  totalInstalledCapacity: 0,
}
const SXSiteForm = forwardRef((props, ref) => {
  // const [tooltipContent, setToolCon] = useState(null)
  const [siteList, setSiteList] = useState<Array<ISite>>([])
  const [isUse, setIsUse] = useState(false)

  const { quotaInfo } = useContext(LargeScreenContext)

  const reCurmove = (info) => {
    setSiteList((prev) => {
      return prev.filter((item) => item.id !== info.id)
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
    // const toolObj = tooltipContent
    //   ?.map((i) => i.key)
    //   .reduce((prev, cur) => {
    //     prev[cur] = 0
    //     return prev
    //   }, {})
    setSiteList((prev) => {
      const newItem = { id: Date.now(), name: "", value: "", type: "", tooltipContent: initCt }
      prev.push(newItem)
      return [...prev]
    })
  }
  const onChangeTool = (e, key, index) => {
    setSiteList((prev) => {
      prev[index].tooltipContent[key] = e
      return [...prev]
    })
  }
  const choose = (e) => {
    setIsUse(e?.target.value)
  }
  useEffect(() => {
    if (quotaInfo) {
      setSiteList(quotaInfo.siteInfo?.list)
      setIsUse(quotaInfo.siteInfo?.useInterfaceData)
    }
  }, [quotaInfo])
  useImperativeHandle(ref, () => ({
    formData: siteList,
    useInterfaceData: isUse,
  }))
  return (
    <div className="sx-site-form">
      <div className="ss-form">
        <div className="ss-form-title">
          <span style={{ width: "100px" }}>场站名称</span>
          <span style={{ width: "100px" }}>场站类型</span>
          <span style={{ width: "130px" }}>场站经纬度</span>
          <span style={{ width: "300px" }}>弹框数值</span>
        </div>
        {siteList?.map((i, index) => {
          return (
            <div key={i.id} className="reset-item">
              <Input
                defaultValue={i.name}
                value={i.name}
                style={{ width: "100px" }}
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
                style={{ width: "100px" }}
                allowClear
                options={[
                  { value: "WT", label: "风机" },
                  { value: "PVINV", label: "光伏" },
                ]}
                onChange={(e) => onChangeSite(e, "type", index)}
              />
              <Input
                defaultValue={i.value}
                value={i.value}
                style={{ width: "130px" }}
                onChange={(e) => onChangeSite(e, "value", index)}
              />
              <div className="ss-form-tooltip">
                {tooltipKey.map((item) => {
                  return (
                    <div key={item.key} className="ss-tooltip-item">
                      <span className="t-name">{item.name}：</span>
                      <InputNumber
                        value={i.tooltipContent?.[item.key] || ""}
                        style={{ width: "38%" }}
                        onChange={(e) => onChangeTool(e, item.key, index)}
                      />
                      {/* <Input
                        value={i.tooltipContent?.[item.key] || ""}
                        onChange={(e) => onChangeTool(e, item.key, index)}
                      ></Input> */}
                    </div>
                  )
                })}
              </div>
              <MinusCircleOutlined onClick={() => reCurmove(i)} style={{ fontSize: "2em", marginLeft: "1em" }} />
            </div>
          )
        })}
        <Button type="dashed" onClick={addSite} block>
          + 增加场站
        </Button>
      </div>
      <div>
        <span>是否使用该数据：</span>
        <Radio.Group onChange={choose} value={isUse}>
          <Radio value={true}>否</Radio>
          <Radio value={false}>是</Radio>
        </Radio.Group>
      </div>
    </div>
  )
})

export default SXSiteForm
