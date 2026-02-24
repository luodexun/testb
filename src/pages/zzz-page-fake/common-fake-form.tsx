/*
 * @Author: xiongman
 * @Date: 2024-01-18 17:20:07
 * @LastEditors: xiongman
 * @LastEditTime: 2024-01-18 17:20:07
 * @Description:
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { getStorage, setStorage } from "@utils/util-funs.tsx"
import { Button, Form, InputNumber, Switch } from "antd"
import classnames from "classnames"
import { useEffect, useRef, useState } from "react"

import { TStorageInfo } from "@/types/i-api.ts"

interface IProps {
  title: string
  storageInfo: TStorageInfo
  itemList: IDvsRunStateInfo<string, string>[]
}
export default function CommonFakeForm<TD extends Record<string, any>>(props: IProps) {
  const { storageInfo, itemList, title } = props
  const [hasSeting, setHasSeting] = useState(false)
  type TFormVal = Partial<TD> & { fk: boolean }

  const [form] = Form.useForm<TFormVal>()
  const onFormChgRef = useRef(() => {
    setHasSeting(false)
  })

  const storageInfoRef = useRef(storageInfo)
  storageInfoRef.current = storageInfo
  useEffect(() => {
    form.setFieldsValue(getStorage<TFormVal>(storageInfoRef.current) || {})
  }, [form])

  function onFormFinish(val: TFormVal) {
    setStorage(val, storageInfoRef.current)
    setHasSeting(true)
  }
  return (
    <div className="fake-form">
      <div className="form-title" children={title} />
      <Form form={form} size="small" labelCol={{ span: 8 }} onChange={onFormChgRef.current} onFinish={onFormFinish}>
        {itemList.map((info) => {
          return (
            <Form.Item
              key={info.field}
              label={info.title}
              name={info.field}
              children={<InputNumber controls={false} />}
            />
          )
        })}
        <Form.Item
          label="使用样例数据"
          name="fk"
          valuePropName="checked"
          labelCol={{ span: 10 }}
          children={<Switch checkedChildren="开启" unCheckedChildren="关闭" />}
        />
        <Form.Item style={{ textAlign: "right" }}>
          <span className={classnames({ tips: true, show: hasSeting })}>数据已存入本地</span>
          <Button type="primary" htmlType="submit" size="small" children="确定" />
        </Form.Item>
      </Form>
    </div>
  )
}
