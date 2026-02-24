/*
 * @Author: xiongman
 * @Date: 2024-01-18 14:43:05
 * @LastEditors: xiongman
 * @LastEditTime: 2024-01-18 14:43:05
 * @Description:
 */

import { StorageGenerateSet } from "@configs/storage-cfg.ts"
import { UNIT } from "@configs/text-constant.ts"
import { SET_LIST } from "@pages/area-index/generating-set/configs.ts"
import CommonFakeForm from "@pages/zzz-page-fake/common-fake-form.tsx"
import { getStorage, setStorage } from "@utils/util-funs.tsx"
import { Button, Form, Input, Switch } from "antd"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { ICenterInfoData } from "@/types/i-monitor-info.ts"

type TFormVal = Partial<ICenterInfoData> & { fk: boolean }

const ITEM_LIST = [...SET_LIST, { title: "总容量", unit: UNIT.POWER_K, field: "totalInstalledCapacity" }]
export default function GenerateSetFakeForm() {
  return <CommonFakeForm<ICenterInfoData> title="机组指标" storageInfo={StorageGenerateSet} itemList={ITEM_LIST} />
  // const [form] = Form.useForm<TFormVal>()
  // const navigate = useNavigate()
  //
  // useEffect(() => {
  //   form.setFieldsValue(getStorage<TFormVal>(StorageGenerateSet) || {})
  // }, [form])
  //
  // function onFormFinish(val: TFormVal) {
  //   setStorage(val, StorageGenerateSet)
  //   window.setTimeout(() => navigate(-1), 100)
  // }
  // return (
  //   <div className="fake-form-box">
  //     <div className="form-title">机组指标</div>
  //     <Form form={form} size="small" labelCol={{ span: 8 }} onFinish={onFormFinish}>
  //       {SET_LIST.map((info) => {
  //         return <Form.Item key={info.field} label={info.title} name={info.field} children={<Input />} />
  //       })}
  //       <Form.Item
  //         label="使用样例数据"
  //         name="fk"
  //         valuePropName="checked"
  //         labelCol={{ span: 10 }}
  //         children={<Switch checkedChildren="开启" unCheckedChildren="关闭" />}
  //       />
  //       <Form.Item style={{ textAlign: "right" }}>
  //         <Button type="primary" htmlType="submit" size="small" children="确定" />
  //       </Form.Item>
  //     </Form>
  //   </div>
  // )
}
