/*
 * @Author: xiongman
 * @Date: 2022-12-20 16:24:07
 * @LastEditors: xiongman
 * @LastEditTime: 2022-12-20 16:24:07
 * @Description: 可编辑表格组件
 */

import { Form, Input, TableProps } from "antd"
import React, { forwardRef, useImperativeHandle, useMemo } from "react"

import CustomTable from "./index"
import { EditableCellProps, IEditTbProps } from "./interfaces"

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  inputNode,
  formItemProps,
  children,
  dependencies,
  record,
  ...restProps
}: EditableCellProps) => {
  const { className, style, title } = restProps
  const tdProps = { className, style, title }
  if (!editing) return <td {...tdProps}>{children}</td>
  return (
    <td {...tdProps}>
      {dependencies?.fields.length ? (
        <Form.Item noStyle dependencies={dependencies.fields}>
          {(form) => (
            <Form.Item
              name={dataIndex}
              style={{ margin: 0 }}
              {...formItemProps}
              children={dependencies?.render(form, record)}
            />
          )}
        </Form.Item>
      ) : (
        <Form.Item name={dataIndex} style={{ margin: 0 }} {...formItemProps} children={inputNode} />
      )}
    </td>
  )
}

const EditTable = forwardRef((props: IEditTbProps, ref) => {
  const { formProps, editingKey, columns, ...tableProps } = props
  const [form] = Form.useForm()

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
    getInst: () => form,
    getFormValues: () => form.getFieldsValue(),
  }))

  function validEditing(record: any) {
    return record[(tableProps.rowKey || "id") as string] === editingKey
  }

  const editColumns = useMemo(() => {
    return (columns || []).map((col) => {
      if (!col.editable) return col
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputNode: col.inputNode || <Input />,
          dataIndex: col.dataIndex,
          formItemProps: col.formItemProps,
          dependencies: col.dependencies,
          title: col.title,
          editing: validEditing(record),
        }),
      }
    }) as TableProps<any>["columns"]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  return (
    <Form {...formProps} form={form} component={false}>
      <CustomTable {...tableProps} columns={editColumns} components={{ body: { cell: EditableCell } }} />
    </Form>
  )
})
EditTable.displayName = "EditTable"
export default EditTable
