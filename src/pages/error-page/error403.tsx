import { Result } from "antd"

export default function Error403() {
  return <Result status="403" title="403" subTitle="抱歉，您没有访问该页面的权限！" />
}
