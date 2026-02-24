/**
 * @description: 工单日志
*/

import React, { useEffect, useState } from "react";
import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import LogForm from "./logForm.tsx";
import { doBaseServer } from "@/api/serve-funs.ts";

const LogFormWithRef = React.forwardRef<React.ElementRef<typeof LogForm>, React.ComponentProps<typeof LogForm>>(
  (props, ref) => <LogForm  {...props} />
)
interface LogData {
  // 根据实际接口返回数据定义类型
  [key: string]: any;
}

export default function LogModal(props) {
    const { open, onCancel, device } = props
    const [datasource, setDatasource] = useState<LogData[]>([]);
   
  return (
    
    <CustomModal
      width="80%"
      destroyOnClose
      open={open}
      title={`工单日志`}
      okButtonProps={{ size: "small" }}
      cancelButtonProps={{ size: "small" }}
      onCancel={onCancel}
      Component={LogFormWithRef}
      componentProps={{ dataSource: datasource, device: device }}
      className="device-signal-modal"
      footer={null}
    />
  )
}