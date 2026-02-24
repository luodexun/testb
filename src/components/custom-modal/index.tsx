/*
 * @Author: xiongman
 * @Date: 2023-10-17 09:58:45
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-17 09:58:45
 * @Description: 弹窗组件
 */

import "./index.less"

import { Modal, ModalProps } from "antd"
import { ForwardedRef, forwardRef, ForwardRefExoticComponent, RefAttributes, useImperativeHandle, useRef } from "react"

export interface ICustomModalRef<TC> {
  getChildrenRef: () => TC
}

interface IProps<TP> extends Omit<ModalProps, "children"> {
  Component?: ForwardRefExoticComponent<any & RefAttributes<any>>
  componentProps?: TP
}

// eslint-disable-next-line react-refresh/only-export-components
function CustomModal<TP, TC>(props: IProps<TP>, ref: ForwardedRef<ICustomModalRef<TC>>) {
  const { Component, title, componentProps, ...mdlProps } = props

  const compRef = useRef<TC>()

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    getChildrenRef: () => compRef.current,
  }))

  return (
    <Modal maskClosable={false} centered {...mdlProps}>
      <div className="modal_wrap">
        <div className="header">
          <span className="title">{title}</span>
        </div>
        {Component ? <Component ref={compRef} {...(componentProps || {})} /> : null}
      </div>
    </Modal>
  )
}

export default forwardRef(CustomModal) as <TP, TC = undefined>(
  props: IProps<TP> & { ref?: ForwardedRef<ICustomModalRef<TC>> },
) => ReturnType<typeof CustomModal>
