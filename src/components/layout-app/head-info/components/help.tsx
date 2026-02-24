import { ForwardRefExoticComponent, useEffect, useRef, useState } from "react"

import CustomModal, { ICustomModalRef } from "@/components/custom-modal"

import HelpContent from "./help-content"

/*
 * @Author: chenmeifeng
 * @Date: 2023-11-20 16:01:38
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-19 13:57:04
 * @Description:
 */
export default function HelpContext(props) {
  const { children, isShowModel, onClickbtn, tabCurrentKey = "version" } = props
  const modeRef = useRef<ICustomModalRef<any>>(null)
  const [helpModel, setHelpModel] = useState(false)
  useEffect(() => {
    setHelpModel(isShowModel)
  }, [isShowModel])
  return (
    <div>
      {children}
      <CustomModal
        ref={modeRef}
        width="60%"
        title="帮助"
        destroyOnClose
        open={helpModel}
        footer={null}
        onCancel={() => {
          setHelpModel(false)
          onClickbtn?.()
        }}
        Component={HelpContent}
        componentProps={{ tabCurrentKey }}
      />
    </div>
  )
}
