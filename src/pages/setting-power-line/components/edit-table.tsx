import "./edit-table.less"

import { Form, InputNumber, Table } from "antd"
import type { FormInstance } from "antd/es/form"
import { ColumnsType } from "antd/es/table"
import React, { useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import { onTransDataPaste } from "@/utils/util-funs"

import { POWER_MODER_LINE_COLUMNS, POWER_MODER_PV_LINE_COLUMNS } from "../configs"
import { ICurvePiontList } from "../types"
import { TDeviceType } from "@/types/i-config"

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  showEditStatusButnoEdit: boolean
  children: React.ReactNode
  dataIndex: keyof ICurvePiontList
  record: ICurvePiontList
  handleSave: (record: ICurvePiontList) => void
  handleSaveAllRow: (curIdx: number, dataIndex: string, data) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  showEditStatusButnoEdit,
  children,
  dataIndex,
  record,
  handleSave,
  handleSaveAllRow,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const handlePaste = async (event) => {
    // 处理粘贴事件的逻辑
    const transData = onTransDataPaste(event)
    setTimeout(async () => {
      inputRef.current.value = "" // 清空输入框
      event.target.value = ""
      form.setFieldsValue({ [dataIndex]: transData[0] })
      handleSaveAllRow(record.id, dataIndex, transData)
    }, 0)
  }
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <InputNumber
          className="editable-cell-value-wrap"
          precision={2}
          ref={inputRef}
          onPaste={handlePaste}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    )
    return <td {...restProps}>{childNode}</td>
  }
  // if (showEditStatusButnoEdit) {
  //   childNode = (
  //     <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
  //       {children}
  //     </div>
  //   )
  // }
  return <td {...restProps}>{childNode}</td>
}

interface PropParams {
  options?: ICurvePiontList[]
  ref?: any
  disabled?: boolean
  deviceType?: TDeviceType
}

const EditTable = React.forwardRef((prop: PropParams, ref) => {
  const { options, deviceType, disabled } = prop
  const [dataSource, setDataSource] = useState<ICurvePiontList[]>(prop.options)

  useEffect(() => {
    setDataSource(options)
  }, [options])

  const handleSave = (row: ICurvePiontList) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const handleSaveAllRow = (curIdx, dataIndex, pastedData) => {
    const data = [...dataSource]
    let cur = curIdx
    pastedData.forEach((item) => {
      const index = data.findIndex((item) => cur === item.id)
      if (index === -1) return
      const oneItem = data[index]
      data.splice(index, 1, {
        ...oneItem,
        [dataIndex]: item,
      })
      cur++
    })
    setDataSource(data)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = useMemo(() => {
    const list = deviceType === "WT" ? POWER_MODER_LINE_COLUMNS : POWER_MODER_PV_LINE_COLUMNS
    return list.map((col) => {
      if (!col.editable || disabled) {
        return col
      }
      return {
        ...col,
        onCell: (record: ICurvePiontList) => ({
          record,
          editable: col.editable,
          showEditStatusButnoEdit: col.showEditStatusButnoEdit,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
          handleSaveAllRow,
        }),
      }
    })
  }, [deviceType, dataSource])

  useImperativeHandle(ref, () => ({
    dataSource, // 表单数据
  }))

  return (
    <Table
      rowKey="id"
      components={components}
      className="editable-table"
      rowClassName={() => "editable-row"}
      bordered
      dataSource={dataSource}
      columns={columns as ColumnsType}
      scroll={{ y: 400 }}
      pagination={false}
    />
  )
})

export default EditTable
