/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-12 14:48:59
 * @Description:
 */
import "./index.less"

import FaceLoginForm from "@pages/login/face-login-form.tsx"
import NamePwdForm from "@pages/login/name-pwd-form.tsx"
import { Button, ConfigProvider, ThemeConfig } from "antd"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { loginLoadingAtom, userInfoAtom } from "@/store/atom-auth"

const ANT_THEME: ThemeConfig = {
  components: {
    Button: { defaultBg: "transparent" },
    Input: {
      colorText: "var(--fontcolor)",
      colorTextQuaternary: "#0b468d",
      colorTextTertiary: "#1857a1",
      colorBgContainer: "transparent",
      colorPrimaryHover: "transparent",
    },
  },
}

export default function LoginPage() {
  const container = useRef()
  const [isFaceLogin, setIsFaceLogin] = useState(false)
  const userInfo = useAtomValue(userInfoAtom)
  const setLoginLoading = useSetAtom(loginLoadingAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo?.token) navigate("/")
  }, [navigate, userInfo])

  useEffect(() => {
    // 切换登录方式时重置loading标记
    setLoginLoading(false)
  }, [isFaceLogin, setLoginLoading])

  return (
    <div className="l-full longin-page none-select" ref={container.current}>
      <ConfigProvider theme={ANT_THEME}>
        <div className="form-panel">
          <Button className="face-valid-btn" onClick={() => setIsFaceLogin((p) => !p)} />
          <div className="form-wrap">
            {isFaceLogin ? <FaceLoginForm /> : <NamePwdForm container={container.current} />}
          </div>
          <div className="brower-tips">* 建议使用谷歌、奇安信浏览器</div>
        </div>
      </ConfigProvider>
    </div>
  )
}
