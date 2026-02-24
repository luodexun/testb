/*
 * @Author: xiongman
 * @Date: 2023-10-17 10:35:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-17 17:40:28
 * @Description:
 */

import { Form } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import OffAutoCompleteInput from "@/components/custom-input/off-auto-complete-input.tsx"
import {
  IDualPsdSafeLoginForm,
  IOperateInfo,
  IStepContentInst,
  TAuthFormData,
} from "@/components/device-control/types.ts"
import MetricTag from "@/components/metric-tag"
import { showMsg } from "@/utils/util-funs"
interface IProps {
  data?: IOperateInfo
  step?: any
  needContent?: boolean
}
const Authentication = forwardRef<IStepContentInst<TAuthFormData>, IProps>((props, ref) => {
  const { data, step, needContent } = props
  const [isDisable, setIsDisable] = useState(true)
  const [form] = Form.useForm<IDualPsdSafeLoginForm>()
  const timeout = useRef(null)
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    getData: () => form.validateFields().catch((errInfo) => errInfo),
    setData: (data?: TAuthFormData) => {
      setIsDisable(true)
      window.setTimeout(() => {
        if (!data) form?.resetFields()
        if (data) form?.setFieldsValue(data as IDualPsdSafeLoginForm)
        // 避免表单被浏览器自动填充用户名密码
        setIsDisable(false)
      }, 200)
    },
  }))

  const changeInput = useRef(() => {
    timeFun.current()
  })
  const timeFun = useRef(() => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      showMsg("长时间未操作页面，请重新验证")
      form?.resetFields()
    }, 60000 * 3)
  })
  useEffect(() => {
    if (step === 1) {
      timeFun.current()
    } else {
      clearTimeout(timeout.current)
    }
  }, [step])
  useEffect(() => {
    return () => {
      clearTimeout(timeout.current)
    }
  }, [])
  return (
    <Form form={form} disabled={isDisable} labelAlign="left" autoComplete="off">
      {needContent ? (
        <div>
          <MetricTag
            key={"operateName"}
            title={`操作内容：`}
            value={data?.["operateName"] ?? "-"}
            style={{ padding: "0 0 25px 12px", fontSize: "18px" }}
            valueStyle={{ color: "var(--warning-color)" }}
          />
          <MetricTag
            key={"operateName"}
            title="控制点："
            value={data?.["pointDesc"] || data?.["deviceName"]}
            style={{ padding: "0 0 25px 12px", fontSize: "18px" }}
            valueStyle={{ color: "var(--warning-color)" }}
          />
        </div>
      ) : (
        ""
      )}
      <Form.Item
        label="账号:"
        name="name"
        rules={[{ required: true, message: "请输入账号！", validateTrigger: "submit" }]}
        children={
          <OffAutoCompleteInput
            placeholder="请输入账号"
            onChange={changeInput.current}
            style={{ borderColor: "var(--bg-hover)" }}
          />
        }
      />
      <Form.Item
        label="密码:"
        name="pwd"
        rules={[{ required: true, message: "请输入密码！", validateTrigger: "submit" }]}
        children={
          <OffAutoCompleteInput
            type="password"
            onChange={changeInput.current}
            placeholder="请输入密码"
            style={{ borderColor: "var(--bg-hover)" }}
          />
        }
      />
    </Form>
  )
})
Authentication.displayName = "操作验证"
export default Authentication
