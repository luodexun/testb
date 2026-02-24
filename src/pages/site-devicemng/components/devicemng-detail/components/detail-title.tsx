/*
 * @Author: chenmeifeng
 * @Date: 2024-04-07 17:00:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-29 11:16:52
 * @Description:
 */

import "./detail-title.less"

import { Button, Select } from "antd"
import { useEffect, useState } from "react"

interface IProps {
  showPart?: boolean
  deviceList?: any
  clickDevice?: any
  onDevicemngChange?: any
  onBackBtn?: any
}
export default function DetailTitle(props: IProps) {
  const { deviceList, clickDevice, onDevicemngChange, onBackBtn } = props
  const [selectValue, setSelectValue] = useState(clickDevice?.deviceCode)
  useEffect(() => {
    setSelectValue(clickDevice?.deviceCode)
  }, [clickDevice])

  const handleChange = (e) => {
    setSelectValue(e)
    onDevicemngChange(e)
  }

  return (
    <div title="箱变详情" className="devicemng-detail-title-wrap">
      <Button size="small" shape="circle" title="返回" onClick={onBackBtn} />
      <div>箱变名称：</div>
      <div style={{ width: "300px" }}>
        <Select
          value={selectValue}
          style={{ width: 240 }}
          fieldNames={{ label: "deviceName", value: "deviceCode" }}
          onChange={handleChange}
          options={deviceList}
        />
      </div>
    </div>
  )
}
