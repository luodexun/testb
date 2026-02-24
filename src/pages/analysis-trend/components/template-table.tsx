/*
 * @Author: chenmeifeng
 * @Date: 2025-04-15 16:36:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-16 14:39:57
 * @Description: 模版列表
 */
import "./template.less"
import { forwardRef, useEffect, useRef, useState } from "react"
import { TEMPLATE_COLUMNS } from "../configs/template"
import { ITemplateData } from "../types/template"
import { dltTplt, getTplt } from "../methods/template"
import CustomTable from "@/components/custom-table"
import { Button } from "antd"
import CustomModal from "@/components/custom-modal"

const TemplateTable = forwardRef((props: { btnClick: (info) => void }, ref) => {
  const { btnClick } = props
  const [dataSource, setDataSource] = useState<ITemplateData[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modeRef = useRef(null)

  const initData = async () => {
    setLoading(true)
    const res = await getTplt()
    if (!res) return
    setDataSource(res)
    setLoading(false)
  }
  const clickRow = useRef(async (record, { key }) => {
    console.log(key, "sdf", record)
    if (key === "choose") {
      btnClick?.(record.data)
    } else if (key === "delete") {
      const res = await dltTplt(record.id)
      if (res) initData()
    }
  })
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="template-wrap l-full">
      <CustomTable
        rowKey="id"
        limitHeight
        loading={loading}
        columns={TEMPLATE_COLUMNS({ onClick: clickRow.current })}
        dataSource={dataSource}
        pagination={false}
      />
      <CustomModal
        ref={modeRef}
        width="50%"
        title="编辑模板"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={TemplateTable}
      />
    </div>
  )
})

export default TemplateTable
