/*
 * @Author: chenmeifeng
 * @Date: 2023-11-20 10:59:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-12 14:58:16
 * @Description:
 */
import "./add-user.less"
import { sm3 } from "sm-crypto"
import { Button } from "antd"
import { forwardRef, useImperativeHandle, useRef } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"

import { ST_USER_PS_WD_FORM_ITEMS } from "../configs/model"
import { IUserList, TModelFrAndTbInfo } from "../types"
import { udPwMethods } from "../methods"
import { showMsg } from "@/utils/util-funs"

export interface IPPerateRef {
  formData?: any
}
export interface IPOperateProps {
  data?: any
  buttonClick?: (type: "ok" | "close", data?: TModelFrAndTbInfo) => void
  editType?: string
  loading?: boolean
  selectRowInfo?: IUserList
}

const UdPassword = forwardRef<IPPerateRef, IPOperateProps>((props, ref) => {
  const { buttonClick, selectRowInfo } = props
  const formRef = useRef<IFormInst | null>(null)

  const onFinish = async (e) => {
    const params = {
      password: sm3(e.password),
      newPassword: sm3(e.newPassword),
      id: selectRowInfo.id,
    }
    const res = await udPwMethods(params)
    if (!res) return
    showMsg("修改密码成功")
    buttonClick?.("ok", params)
  }
  const btnClkRef = useRef((type: "ok" | "close") => {
    if (type === "ok") {
      formRef.current?.submit()
      return
    }
    buttonClick?.("close")
  })

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    formData: formRef.current.getFieldValue,
  }))

  return (
    <div className="user-model">
      <CustomForm
        ref={formRef}
        formOptions={{ layout: "horizontal" }}
        itemOptions={ST_USER_PS_WD_FORM_ITEMS}
        onSearch={onFinish}
      />
      <div className="confirm-btn">
        <Button onClick={btnClkRef.current.bind(null, "ok")}>保存</Button>
        <Button onClick={btnClkRef.current.bind(null, "close")}>取消</Button>
      </div>
    </div>
  )
})

export default UdPassword
