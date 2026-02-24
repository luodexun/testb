/*
 * @Author: chenmeifeng
 * @Date: 2024-07-15 10:04:02
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-11 10:49:37
 * @Description:
 */
import "./index.less"

import { Tabs } from "antd"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SCREEN_LISTS } from "../../configs"
import LargeScreenContext from "@/contexts/screen-context"
export default function JSHeader(props) {
  const { openUpdateForm } = props
  const [showBtn, setShowBtn] = useState(false)
  const [activeKey, setActiveKey] = useState("sxScreen")
  const contextMenu = useRef(null)
  const [openModal, setOpenModal] = useState(false)
  // const [securityDay, setSecurityDay] = useState("0")
  const { openupdateMenu, setOpenupdateMenu } = useContext(LargeScreenContext)
  const navigate = useNavigate()
  const changeShow = () => {
    contextMenu.current.style.display = "none"
    navigate(`/`)
    // setShowBtn((prev) => !prev)
  }

  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
    navigate(`/${key}`)
  })

  const openContext = (e) => {
    e.preventDefault()
    contextMenu.current.style.display = "block"
    setOpenupdateMenu(true)
  }
  const clickMenu = (e) => {
    e.stopPropagation()
    openUpdateForm(true)
    setOpenupdateMenu(true)
  }
  useEffect(() => {
    if (!openupdateMenu) contextMenu.current.style.display = "none"
  }, [openupdateMenu])

  return (
    <div className="sx-header">
      <div className="sx-header-center">
        <span className="center" onClick={changeShow} onContextMenu={openContext}>
          山西新能源集控中心
        </span>
      </div>
      <div ref={contextMenu} className="screen-contextmenu">
        <div onClick={clickMenu}>修改大屏各指标</div>
      </div>
      {showBtn ? (
        <div className="screenList page-tabs-wrap">
          <Tabs
            type="editable-card"
            hideAdd
            tabBarGutter={4}
            items={SCREEN_LISTS}
            activeKey={activeKey}
            onChange={onTabsChgRef.current}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
