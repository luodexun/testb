/*
 * @Author: chenmeifeng
 * @Date: 2024-03-25 13:54:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-25 14:08:41
 * @Description:
 */
import "./company-quota-form.less"

import { Input } from "antd"
import { forwardRef, useImperativeHandle, useState } from "react"

import { testjson } from "../configs/configs"

const ComQtForm = forwardRef((props, ref) => {
  const [companyQuota, setCompanyQuota] = useState(testjson.companyQuota || [])
  const onChange = (e, key, id) => {
    const value = e.target.value
    setCompanyQuota((prev) => {
      const info = prev.find((item) => item.id === id)
      info[key] = value
      return [...prev]
    })
  }

  useImperativeHandle(ref, () => ({
    formData: companyQuota,
  }))
  return (
    <div className="cpn-qtform">
      <div className="cpn-qtform-title">
        <span>名称</span>
        <span>值</span>
      </div>
      {companyQuota.map((i) => {
        return (
          <div key={i.id} className="cpn-qtform-item">
            <Input
              defaultValue={i.name}
              value={i.name}
              style={{ width: "50%" }}
              onChange={(e) => {
                onChange(e, "name", i.id)
              }}
            />
            <Input
              defaultValue={i.value}
              value={i.value}
              style={{ width: "50%" }}
              onChange={(e) => {
                onChange(e, "value", i.id)
              }}
            />
          </div>
        )
      })}
    </div>
  )
})
export default ComQtForm
