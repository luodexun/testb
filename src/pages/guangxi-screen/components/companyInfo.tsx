import { Input } from "antd"
import TextArea from "antd/es/input/TextArea"
import { forwardRef, useImperativeHandle, useState } from "react"

import { testjson } from "../configs/configs"

const CompanyInfo = forwardRef((props, ref) => {
  const [comInfo, setComInfo] = useState(testjson.companyInfo)
  const changeVal = (key, event) => {
    setComInfo((prev) => {
      prev[key] = event.target.value
      return { ...prev }
    })
  }
  useImperativeHandle(ref, () => ({
    formData: comInfo,
  }))
  return (
    <div>
      <div>
        <span>标题</span>
        <Input
          defaultValue={comInfo.title}
          value={comInfo.title}
          onChange={(e) => {
            changeVal("title", e)
          }}
        />
      </div>
      <div>
        <span>内容</span>
        <TextArea
          autoSize
          value={comInfo.content}
          onChange={(e) => {
            changeVal("content", e)
          }}
        />
      </div>
    </div>
  )
})

export default CompanyInfo
