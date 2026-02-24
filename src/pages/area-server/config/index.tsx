/*
 * @Description: 服务器监控表格
*/
import { ColumnsType } from "antd/es/table"

export const CPU_COLUMNS: ColumnsType<any> = [
  { dataIndex: "name", title: "名称", align: "center" },
  { dataIndex: "cpuUsage", title: "系统使用率(%)", align: "center" },
]
export const MEM_COLUMNS: ColumnsType<any> = [
  { dataIndex: "name", title: "名称", align: "center" },
  { dataIndex: "memTotal", title: "总内存(G)", align: "center" },
  { dataIndex: "memUsage", title: "已使用(%)", align: "center" },
  { dataIndex: "memUsed", title: "已使用(G)", align: "center" },
  { dataIndex: "memAvailable", title: "剩余可用(G)", align: "center" },
]
export const DISK_COLUMNS: ColumnsType<any> = [
  { dataIndex: "name", title: "名称", align: "center" },
  { dataIndex: "total", title: "总量(G)", align: "center" },
  { dataIndex: "used", title: "已使用(G)", align: "center" },
  { dataIndex: "usage", title: "已用百分比(%)", align: "center" },
  { dataIndex: "free", title: "剩余可用(G)", align: "center" },
]