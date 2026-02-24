/*
 * @Author: chenmeifeng
 * @Date: 2023-10-27 18:08:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-25 14:28:24
 * @Description:
 */

import "./add-user.less"
import { sm3 } from 'sm-crypto';
import { Button } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"

import { ST_USER_EDIT_MODEL_FORM_ITEMS, ST_USER_MODEL_FORM_ITEMS } from "../configs/model"
import { getRoleList } from "../methods"
import { IUserList, TModelFrAndTbInfo } from "../types"

export interface IPerateRef {}
export interface IOperateProps {
  data?: any
  buttonClick?: (type: "ok" | "close", data?: TModelFrAndTbInfo) => void
  editType?: string
  loading?: boolean
  selectRowInfo?: IUserList
}

const AddUser = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { buttonClick, editType, selectRowInfo } = props
  const formRef = useRef<IFormInst | null>(null)
  //组件数据集合
  const [formList, setFormItemConfig] = useState({})
  const currentId = useRef(null)
  const roleList = useRef([])

  useImperativeHandle(ref, () => ({}))

  useEffect(() => {
    if (editType !== "add") {
      const formInsts = formRef.current?.getInst()
      const { id, loginName, realName, roleId } = selectRowInfo
      currentId.current = id
      formInsts?.setFieldsValue({
        loginName,
        realName,
        roleId,
      })
    }
    allAsyncPromise().then((r) => r)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const allAsyncPromise = async () => {
    const res = await getRoleList()
    roleList.current = res
    setFormItemConfig((prevState) => ({ ...prevState, roleId: { options: res || [] } }))
  }

  const onFinish = (formValue: TModelFrAndTbInfo) => {
    const params = !currentId.current ? {
      ...formValue,
      password: sm3(formValue.password)
    } : formValue
    buttonClick?.("ok", {  ...params, id: currentId.current })
  }
  const btnClkRef = useRef((type: "ok" | "close") => {
    if (type === "ok") {
      formRef.current?.submit()
      return
    }
    buttonClick?.("close")
  })

  return (
    <div className="user-model">
      <CustomForm
        ref={formRef}
        formOptions={{ layout: "horizontal" }}
        itemOptionConfig={formList}
        itemOptions={editType === "add" ? ST_USER_MODEL_FORM_ITEMS : ST_USER_EDIT_MODEL_FORM_ITEMS}
        onSearch={onFinish}
      />
      <div className="confirm-btn">
        <Button onClick={btnClkRef.current.bind(null, "ok")}>保存</Button>
        <Button onClick={btnClkRef.current.bind(null, "close")}>取消</Button>
      </div>
    </div>
  )
})

export default AddUser
