/*
 * @Author: chenmeifeng
 * @Date: 2023-10-30 10:16:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-25 17:28:29
 * @Description:
 */

import { ISearchFormProps } from "@/components/custom-form/types"
import CustonInput from "@/components/custom-input"
import OffAutoCompleteInput from "@/components/custom-input/off-auto-complete-input.tsx"
import SelectWithAll from "@/components/select-with-all"
import { checkIfRepeatPassword, validPword } from "@/utils/form-funs"

// 新增用户弹框
export const ST_USER_MODEL_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "roleId",
    label: "角色",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请选择角色" }] },
    props: {
      options: [],
    },
  },
  {
    type: CustonInput,
    name: "loginName",
    label: "登录名",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请输入登录名" }] },
    props: {},
  },
  {
    type: CustonInput,
    name: "realName",
    label: "真实姓名",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请输入真实姓名" }] },
    props: {},
  },
  {
    type: CustonInput,
    name: "password",
    label: "登陆密码",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, validator: validPword }] },
    props: {},
  },
]

// 编辑用户弹框
export const ST_USER_EDIT_MODEL_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "roleId",
    label: "角色",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请选择角色" }] },
    props: {
      options: [{ value: 1, label: "集控管理员" }],
    },
  },
  {
    type: CustonInput,
    name: "loginName",
    label: "登录名",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请输入登录名" }] },
    props: {
      disabled: true,
    },
  },
  {
    type: CustonInput,
    name: "realName",
    label: "真实姓名",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请输入真实姓名" }] },
    props: {},
  },
]

// 修改密码弹框
export const ST_USER_PS_WD_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: OffAutoCompleteInput,
    name: "password",
    label: "旧密码",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请输入旧密码" }] },
    props: { type: "password" },
  },
  {
    type: OffAutoCompleteInput,
    name: "newPassword",
    label: "新密码",

    formItemProps: {
      labelCol: { span: 6 },
      dependencies: ["password"],
      rules: [
        ({ getFieldValue }) => ({
          required: true,
          validator(_, value) {
            const strongRegex = new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&-+=_}{|:<>\\[\\],.?*])(?=.{8,})",
            )
            if (!value || getFieldValue("password") === value) {
              return Promise.reject(new Error("请输入密码，并不能和旧密码相同!"))
            }
            if (value && !strongRegex.test(value)) {
              return Promise.reject(new Error("密码太简单了，至少包含大小写字母、数字、特殊符号的8位及以上密码"))
            }
            return Promise.resolve()
          },
        }),
      ],
    },
    props: { type: "password" },
  },
]
