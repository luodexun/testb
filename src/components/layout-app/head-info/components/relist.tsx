/*
 
 * @Description: 二次挂牌
 */
import React, { forwardRef } from "react"
import CustomModal from "@/components/custom-modal"
import RelistCom from "./relistCom"


const RelistComRef = forwardRef<React.ElementRef<typeof RelistCom>, React.ComponentProps<typeof RelistCom>>(
    (props,ref) => <RelistCom {...props} />
  )

export default function Relist(props) {
  const { onClickbtn, isModalOpen, datasource, closeFun } = props  
  const close = () => {
    closeFun()
  }
  return (
    <CustomModal
          width="80%"
          destroyOnClose
          open={isModalOpen}
          title={`检修计划结束管理`}
          okButtonProps={{ size: "small" }}
          cancelButtonProps={{ size: "small" }}
          onCancel={close}
          Component={RelistComRef}
          componentProps={{ dataSource: datasource, onClose: close }}
          className="device-signal-modal"
          footer={null}
        />
  )
}
