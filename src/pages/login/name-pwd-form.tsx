/*
 * @Author: xiongman
 * @Date: 2023-12-05 13:53:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-12 14:44:45
 * @Description:
 */

import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { loginAsyncAtom, loginLoadingAtom } from "@store/atom-auth.ts"
import { Button, Form, FormItemProps } from "antd"
import { useAtomValue, useSetAtom } from "jotai"
import { useRef, useState } from "react"
import { sm3 } from "sm-crypto"

import OffAutoCompleteInput from "@/components/custom-input/off-auto-complete-input.tsx"
import VerifyCodeInput, {
  codeInputValidator,
  IVerifyCodeInputRef,
} from "@/components/custom-input/verify-code-input.tsx"
import CustomModal from "@/components/custom-modal"
import UdPassword, { IPOperateProps, IPPerateRef } from "../setting-user/components/ud-password"

interface ILoginFormVal {
  name: string
  pwd: string
  code: { code: string; uuid: string | null }
}
function formRules(message: string, field?: string): FormItemProps["rules"] {
  if (field === "code") {
    return [{ required: true, message, validateTrigger: ["submit"], validator: codeInputValidator }]
  }
  return [{ required: true, message, validateTrigger: ["submit"] }]
}

export default function NamePwdForm(props) {
  const { container } = props
  const pwRef = useRef()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const userInfo = useRef(null)
  const [form] = Form.useForm<ILoginFormVal>()
  const validIptRef = useRef<IVerifyCodeInputRef>()
  const loginAsync = useSetAtom(loginAsyncAtom)
  const loginLoading = useAtomValue(loginLoadingAtom)

  const loginRef = useRef(async (formVal: ILoginFormVal) => {
    const { code, ...other } = formVal
    const params = {
      name: formVal.name,
      pwd: sm3(formVal.pwd),
    }
    await loginAsync({
      loginForm: { ...params, ...code },
      call: (isErr: boolean, pwTimeoutInfo) => {
        if (pwTimeoutInfo?.pwTimeout) {
          console.log("登录过期")
          setIsModalOpen(true)
          userInfo.current = { id: pwTimeoutInfo.id }
        }
        if (!isErr) return
        validIptRef.current?.refresh()
      },
    })
  })
  // 修改密码
  const pwBtnClkRef = async (type: "ok" | "close") => {
    setIsModalOpen(false)
  }

  return (
    <Form form={form} className="login-form" onFinish={loginRef.current} initialValues={{ pwd: "", name: "" }}>
      <Form.Item name="name" rules={formRules("请输入用户名!")} className="input-box">
        <OffAutoCompleteInput placeholder="请输入用户名" prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item name="pwd" rules={formRules("请输入密码!")} className="input-box">
        <OffAutoCompleteInput
          type="password"
          placeholder="请输入密码"
          prefix={<LockOutlined className="site-form-item-icon" />}
        />
      </Form.Item>
      <Form.Item
        name="code"
        rules={formRules("请输入验证码!", "code")}
        className="input-box"
        children={<VerifyCodeInput ref={validIptRef} />}
      />
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          htmlType="submit"
          loading={loginLoading}
          disabled={loginLoading}
          className="login-submit"
          children="登录"
        />
      </Form.Item>
      <CustomModal<IPOperateProps, IPPerateRef>
        getContainer={container}
        ref={pwRef}
        title="修改密码"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false)
        }}
        Component={UdPassword}
        componentProps={{ buttonClick: pwBtnClkRef, selectRowInfo: userInfo.current }}
      />
    </Form>
  )
}
