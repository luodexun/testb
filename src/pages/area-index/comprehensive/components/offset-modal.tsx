/*
 * @Author: chenmeifeng
 * @Date: 2023-08-23 17:50:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-12 14:52:52
 * @Description: 区域中心-指标偏移量
 */

import { Button, Form, InputNumber, Space } from "antd"
import { useEffect, useRef } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { validOperate } from "@/utils/util-funs"
const formInitData = {
  activePower: 0,
  count: 0,
  rate: 0,
  dailyProduction: 0,
  monthlyProduction: 0,
  yearlyProduction: 0,
}
export default function QuotaOffset(props) {
  const { list, formData, changeModal } = props
  const [form] = Form.useForm()
  const initForm = useRef(async () => {
    if (formData) {
      const { activePower, count, rate, dailyProduction, monthlyProduction, yearlyProduction } = formData
      const params = {
        activePower: activePower || 0,
        count: count || 0,
        rate: rate || 0,
        dailyProduction: dailyProduction || 0,
        monthlyProduction: monthlyProduction || 0,
        yearlyProduction: yearlyProduction || 0,
      }
      form.setFieldsValue(params)
    }
  })
  async function onFormFinish(val) {
    console.log(val, "sdfdf")
    const params = {
      id: 5,
      key: "energy_quota",
      data: JSON.stringify(val),
    }
    const res = await doBaseServer("updateMngStatic", params)
    const operate = await validOperate(res)
    if (operate) changeModal("ok")
  }
  const onReset = () => {
    changeModal("cancel")
  }
  useEffect(() => {
    initForm.current()
  }, [formData])
  return (
    <div className="quota-offset">
      <Form form={form} size="small" labelCol={{ span: 13 }} onFinish={onFormFinish} initialValues={formInitData}>
        {list.map((info) => {
          return (
            <Form.Item
              key={info.field}
              label={`${info.title}(${info.unit})`}
              name={info.field}
              children={<InputNumber controls={false} />}
            />
          )
        })}
        <Form.Item style={{ textAlign: "right" }}>
          <Space>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
            <Button htmlType="button" onClick={onReset}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}
