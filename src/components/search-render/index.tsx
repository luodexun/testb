/*
 * @Author: xiongman
 * @Date: 2023-04-20 15:47:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-18 11:34:00
 * @Description: 搜索组件
 */
import "./index.less"

import { Button, Form, Input } from "antd"
import { ButtonType } from "antd/es/button"
import { useCallback, useEffect } from "react"

import { FormSchema } from "@/types/i-form"

import { useRenderItem } from "./components/useRenderItem"

export interface SearchFormAction {
  name: string
  type?: ButtonType
  onClick?: (index: number) => void
}

interface SearchFormProps {
  formList: FormSchema[]
  onSearch?: (values: any) => void
  actions?: SearchFormAction[]
  onClick?: (index: number) => void
  onChange?: (item: any, values: any) => void
  onReset?: (values: any) => void
  showLabel?: boolean
  width?: any
  onGetForm?: (values: any) => void
}

//判断组件类型
export default function SearchForm(props: SearchFormProps) {
  const { onSearch, onChange, onGetForm } = props
  const [form] = Form.useForm()
  const { renderSelect, renderDatePick } = useRenderItem()
  const renderOptions = (item: FormSchema) => {
    switch (item.component) {
      case "Select":
        return renderSelect(item)
      case "DatePicker":
        return renderDatePick(item)
      case "Radio":
      case "RadioButton":
        // const { renderRadioOptions } = useRenderRadio()
        // return renderRadioOptions(item)
        return ""
      case "Checkbox":
      case "CheckboxButton":
        // const { renderCheckboxOptions } = useRenderCheckbox()
        // return renderCheckboxOptions(item)
        return ""
      default:
        break
    }
  }

  const reset = () => {
    form.resetFields()
  }

  useEffect(() => {
    if (onGetForm) {
      onGetForm(form)
    }
  }, [onGetForm, form])

  const onHandleSearch = useCallback(
    (params: any) => {
      onSearch(params)
    },
    [onSearch],
  )

  const onHandleChange = useCallback(
    (item, params: any) => {
      console.log("改变")

      onChange(item, params)
    },
    [onChange],
  )

  return (
    <div className="search-warp">
      <Form
        className="layout__search"
        form={form}
        layout="inline"
        onFinish={onHandleSearch}
        onValuesChange={onHandleChange}
      >
        {props.formList.map((item: FormSchema) => (
          <Form.Item
            label={props.showLabel !== false && item.label ? item.label : ""}
            key={item.name}
            name={item.name}
            style={{ width: `${item.width}px` }}
            initialValue={item.defaultValue}
          >
            {item.component === "Input" ? <Input placeholder={item.placeholder} /> : renderOptions(item)}
          </Form.Item>
        ))}
        <Form.Item>
          <Button htmlType="submit" type="primary">
            查询
          </Button>
        </Form.Item>

        <Form.Item>
          <Button htmlType="reset" type="primary" onClick={reset}>
            重置
          </Button>
        </Form.Item>
        {props.actions?.length &&
          props.actions.map((action: SearchFormAction, index: number) => (
            <Form.Item key={action.name}>
              <Button type={action.type} onClick={() => action.onClick(index)}>
                {action.name}
              </Button>
            </Form.Item>
          ))}
      </Form>
    </div>
  )
}
