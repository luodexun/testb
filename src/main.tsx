import "antd/dist/reset.css"
import "./index.less"
import "dayjs/locale/zh-cn" // 导入本地化语言

import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import dayjs from "dayjs"
import React from "react"
import ReactDOM from "react-dom/client"

import { AntdThemeData } from "@/styles/antd-theme-data.ts"

import App from "./App"

dayjs.locale("zh-cn") // 使用本地化语言

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={AntdThemeData}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
