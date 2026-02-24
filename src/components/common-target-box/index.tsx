/*
 * @Author: chenmeifeng
 * @Date: 2025-07-07 15:42:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-08 10:24:23
 * @Description:
 */
import { Button, Flex, Tabs } from "antd"
import "./index.less"
import { useContext, useRef, useState } from "react"
import DvsTargetBox from "./device"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import { updateMngStaticInfo } from "./methods"
import SiteTargetBox from "./site"

export default function CommonTargetBox(props) {
  const { closeModal } = props
  const [active, setActive] = useState("site")
  const deviceRef = useRef(null)
  const siteRef = useRef(null)
  const typeTabs = useRef([
    { key: "site", label: "场站", closable: false, forceRender: true, children: <SiteTargetBox ref={siteRef} /> },
    {
      key: "device",
      label: "设备",
      closable: false,
      forceRender: true,
      children: <DvsTargetBox ref={deviceRef} />,
    },
  ])

  const { setChooseColumnKey, setSiteChooseColumnKey } = useContext(DvsDetailContext)

  const onChange = (key: string) => {
    setActive(key)
  }
  const save = async () => {
    setChooseColumnKey(deviceRef.current?.checkedList)
    setSiteChooseColumnKey(siteRef.current?.checkedList)
    const info = {
      devcieChecks: deviceRef.current?.checkedList,
      siteChecks: siteRef.current?.checkedList,
    }
    const res = await updateMngStaticInfo(info)
    closeModal(false)
  }
  return (
    <div className="site-target-box">
      <Tabs type="editable-card" activeKey={active} hideAdd items={typeTabs.current} onChange={onChange} />
      <div className="target-box-btn">
        <Flex wrap="wrap" gap="small" justify="flex-end">
          <Button type="primary" size="small" onClick={save}>
            保存
          </Button>
          <Button size="small" onClick={() => closeModal(false)}>
            取消
          </Button>
        </Flex>
      </div>
    </div>
  )
}
