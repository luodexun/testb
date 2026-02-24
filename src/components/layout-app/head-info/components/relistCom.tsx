/*
 
 * @Description: 二次挂牌
 */
import "./comloss.less"

import { IFormInst } from "@/components/custom-form/types.ts"
import { useEffect, useRef, useState } from "react"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import { ColumnsType } from "antd/es/table"
import { message } from 'antd'

import CustomForm from "@/components/custom-form"
import CustomTable from "@/components/custom-table"

import { doBaseServer } from "@/api/serve-funs"

export default function RelistCom(props) {
  const { onClickbtn, dataSource, onClose } = props
  
  const formRef = useRef<IFormInst | null>(null)
  
  const LOG_FORM_BTNS: ISearchFormProps["buttons"] = [{ name: "sign", label: "挂牌" }, { name: "cancleSign", label: "无需挂牌" }]
  
  const [isAllSelected, setIsAllSelected] = useState(false)
  const toggleSelectAll = () => {
    if(selectedRows.length === dataSource.length && dataSource.length > 0) {
      setSelectedRows([])
      setIsAllSelected(false)
    } else {
      setSelectedRows([...dataSource])
      setIsAllSelected(true)
    }
  }
  const toggleRowSelection = (record) => { 
    const isSelected = selectedRows.some(item => item.id === record.id)
    let newSelectedRows = []
    if (isSelected) {
      newSelectedRows = selectedRows.filter(item => item.id !== record.id)
    } else {
      newSelectedRows = [...selectedRows, record]
    }
    setSelectedRows(newSelectedRows)
      setIsAllSelected(newSelectedRows.length === dataSource.length && dataSource.length > 0)
 
    onClickbtn && onClickbtn(record, newSelectedRows)
  }
  const [selectedRows, setSelectedRows] = useState([])
  const isRowSelected = (record) => { 
    return selectedRows.some(item => item.id === record.id)
  }
  const LOG_COLUMS:ColumnsType<any>  = [
      {
        title: () => (
          <div>
            <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
          </div>
        ),
        align: "center",
        width: 60,
        render: (text, record, index) => (
          <input
            type="checkbox"
            checked={isRowSelected(record)}
            onChange={(e) => toggleRowSelection(record)}
          />
        ),
      },
      { title: "序号", align: "center", width: 60, render: (text, record, index) => index + 1 },
      { dataIndex: "stationName", title: "场站", align: "center" },
      { dataIndex: "deviceName", title: "设备", align: "center" },
      { dataIndex: "modalName", title: "型号", align: "center" },
      { dataIndex: "wonum", title: "工单号", align: "center" },
      { dataIndex: "haschildwo", title: "是否子工单", align: "center" },
      { dataIndex: "status", title: "工单状态", align: "center"},
      { dataIndex: "description", title: "工单描述", align: "center"},
      { dataIndex: "signState", title: "挂牌类型", align: "center"},
  ]
  
  const onFormAction = async(action, formData) => { 
      console.log(selectedRows,props,'selectedRows')
    if(action === "sign") {
      let target = selectedRows.map(item => {
        let obj = {
          deviceId: item.deviceId,
          deviceCode: item.deviceCode,
          stationId: item.stationId,
          modelId: item.modelId,
          wonum: item.wonum,
          remark: item.remark,
          signState: item.signState,
          parent: item.parent,
        }
        return obj
      })
      await doBaseServer("secondSignRecord", target)
      message.success("挂牌成功！", 3)
      handleClose()
    } else if(action === "cancleSign") { 
      let obj = {
        idList: selectedRows.map(item => item.id)
      }
        await doBaseServer("secondCancelRecord", obj)
        message.success("无需挂牌成功！", 3)
        handleClose()
    }
  }
  const handleClose = () => {
    onClose && onClose()
  }
  const onSchValueChgRef = (changedValue, formData) => { 
  }

  
  return (
    <div className="logo-module">
      <div className="log-conditions">
        <CustomForm
            ref={formRef}
            buttons={LOG_FORM_BTNS}
            formOptions={{
                onValuesChange: onSchValueChgRef,
            }}
            onAction={onFormAction}
        />
      </div>
      <div className="log-list">
        <CustomTable
            rowKey="id"
            columns={LOG_COLUMS}
            dataSource={dataSource}
            pagination={{
              position: ['bottomCenter'], 
              showSizeChanger: true,
              showQuickJumper: true, 
              pageSizeOptions: ['50', '100'],
              showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>
    </div>
  )
}
