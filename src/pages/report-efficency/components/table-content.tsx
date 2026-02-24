/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 16:58:44
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-10-16 16:58:44
 *@Description: 报表管理-功率预测报表-表格
 */
import { Pagination } from "antd"
import React, { useState } from "react"

// import { doBaseServer, doNoParamServer } from "@/api/serve-funs"
import CustomTable from "@/components/custom-table"

import { COLUMNS } from "../configs"

interface TableParams {
  current: number
  pageSize: number
  total: number
}
export default function TableContent() {
  const [data, setData] = useState([])
  //表格分页数据
  const [pagination, setPagination] = useState<TableParams>({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const onChange = (data) => {}
  return (
    <div className="table-content">
      <div className="table">
        <CustomTable
          columns={COLUMNS}
          dataSource={data}
          rowKey="id"
          limitHeight
          initHeight={"100%"}
          pagination={false}
        />
      </div>
      <Pagination
        total={pagination.total}
        current={pagination.current}
        pageSize={pagination.pageSize}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `总数 ${total} 条`}
        onChange={onChange}
      />
    </div>
  )
}
