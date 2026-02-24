/*
 * @Author: xiongman
 * @Date: 2022-11-09 09:43:50
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-27 17:21:27
 * @Description: 字封装表单组件
 */

import "./index.less"

import { Button, ButtonProps, Dropdown, Form, Popconfirm } from "antd"
import React, { createElement, forwardRef, useImperativeHandle } from "react"

import { ISearchFormProps } from "./types.ts"

export function MapFormItem(items: ISearchFormProps["itemOptions"], config?: ISearchFormProps["itemOptionConfig"]) {
  if (!items?.length) return null
  return items.map(({ name, label, type, formItemProps, props }) => {
    if (props && config && config[name]) {
      Object.assign(props, config[name])
    }
    if (props?.mode === "multiple") {
      props.placeholder = props?.placeholder || "全选"
    }
    return (
      <Form.Item key={name} name={name} label={label} {...formItemProps}>
        {createElement(type, props)}
      </Form.Item>
    )
  })
}

function MapButtonItem(items: ISearchFormProps["buttons"], onAction?: (type?: any, help?: any) => void) {
  if (!items?.length) return null
  return items.map(({ name, label, props, btnType = "button", dropdownProps, popProps }) => {
    if (!props) props = {} as ButtonProps
    if (!(props as ButtonProps)?.htmlType && btnType === "button")
      Object.assign(props, { onClick: onAction?.bind(null, name) })
    if (btnType === "dropdown") {
      Object.assign(dropdownProps, {
        menu: { items: dropdownProps.menu.items, onClick: onAction?.bind(null, name) },
        overlayClassName: "exportDropdown",
      })
      return (
        <Form.Item key={name}>{createElement(Dropdown, dropdownProps, createElement(Button, props, label))}</Form.Item>
      )
    } else if (btnType === "popconfirm") {
      Object.assign(popProps, {
        ...popProps,
        onConfirm: onAction?.bind(null, name, "ok"),
        onCancel: onAction?.bind(null, name, "cancel"),
      })
      return (
        <Form.Item key={name}>{createElement(Popconfirm, popProps, createElement(Button, props, label))}</Form.Item>
      )
    }
    return <Form.Item key={name}>{createElement(Button, props, label)}</Form.Item>
  })
}

const CustomForm = forwardRef((props: ISearchFormProps, ref) => {
  const { onSearch, onAction, loading, formOptions, itemOptions, buttons, itemOptionConfig } = props
  const [form] = Form.useForm()
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
    getInst: () => form,
    getFormValues: () => form.getFieldsValue(),
  }))
  return (
    <Form
      form={form}
      layout="inline"
      disabled={loading}
      {...formOptions}
      onFinish={onSearch}
      className="search-form none-select"
    >
      {MapFormItem(itemOptions, itemOptionConfig)}
      {MapButtonItem(buttons, onAction)}
    </Form>
  )
})
CustomForm.displayName = "CustomForm"
export default CustomForm
