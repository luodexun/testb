
import "./sign.less"

import { useContext, useRef, useState } from "react"
import DeviceSignalModal from "@/pages/site-matrix/components/device-signal-modal"
import DvsDetailContext from "@/contexts/dvs-detail-context"

interface IProps {
  device?: any
  hiddenBox: () => void
  onShowLogModal: () => void
}
const LIST = [{ name: "设备挂牌", key: "1" },{ name: "工单日志", key: "2" }]
export default function SignContextmenuBox(props: IProps) {
  const { device, hiddenBox, onShowLogModal } = props
  const [openModal, setOpenModal] = useState(false)
  const { setDrawerOpenMap } = useContext(DvsDetailContext)
  const modalRef = useRef()

  const changeClk = useRef((e, item) => {
    e.stopPropagation()
    e.preventDefault()
    setOpenModal(true)
    if(item.key === "1") {
      setDrawerOpenMap({ signalModal: true })
    } else if(item.key === "2") {
      //通知logModal弹窗显示
      onShowLogModal()
    }
    // hiddenBox?.()
  })
  const mouseMove = useRef((e) => {
    e.preventDefault()
  })
  const refleshData = useRef(() => {
    hiddenBox?.()
  })
  return (
    <div
      className="sign-cxmenu"
      ref={modalRef}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <div className="sign-cxmenu-list">
        {LIST.map((i) => {
          return (
            <div
              key={i.key}
              className="sign-cxmenu-item"
              onMouseEnter={mouseMove.current}
              onClick={(e) => changeClk.current(e, i)}
            >
              {i.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
