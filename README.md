# 华润新能源区域集控系统

## 介绍

项目全称：华润新能源控股有限公司-新能源区域集控系统-桌面端

## 开发指引

### 环境

1. windows11 or kylinos v10sp1
1. node (>= 18，https://nodejs.org/en)
1. pnpm (latest，https://pnpm.io/installation)
1. tauri (^1.0.0，https://tauri.app/zh-cn/v1/guides/getting-started/prerequisites)
1. rust (^1.8.0，https://www.rust-lang.org/learn/get-started)
dpkg安装deb包报错问题https://blog.csdn.net/iteye_10865/article/details/82405396

### 开发

1. 安装依赖包

```bash
pnpm i
```

2. 开发启动

```bash
pnpm tauri dev
```

### 打包

Tauri 严重依赖原生库和工具链，因此目前无法进行有意义的交叉编译，请在相应平台准备开发环境，并进行打包编译。

- Windows生成exe文件，
- Kylin系统生成`.deb`、`.rpm`、`.appimage`文件。

```bash
# for production(.exe、.deb、.rpm、appimage)
pnpm tauri build

# for debug
pnpm tauri build -d
```

---
src-tauri\Cargo.toml
- 控制台
tauri = { version = "1.8.0", features = ["shell-open"，"devtools"] }

---

## 其他

#### 相关技术

- `react 18+，hooks` 函数组件，官网：_<https://react.docschina.org/docs/getting-started.html>_
- 全局状态管理库 `jotai`，官网：_<https://jotai.org/>_
- 接口请求工具 `axios`，官网：_<https://www.axios-http.cn/docs/intro>_
- 样式预处理库 `less`， 官网：_<https://lesscss.com.cn/>_
- 图标库 `react-icons` 官网：_<https://react-icons.github.io/react-icons/>_
- 组件库 `antd` 官网：_<https://ant.design/components/overview-cn/>_
- 图表库 `echarts` 官网 _<https://echarts.apache.org/examples/zh/index.html>_

#### 系统词条名称

- 组件名称及样式类名应见名知意，中文相同则英文也应一致，
- _为避免命名过长，英文可使用统一的缩写代替_

| 中文 | 英文   | 缩写 |
| ---- | ------ | ---- |
| 配置 | config | cfg  |
| 管理 | manage | mng  |

#### 浏览器存储

- _如项目接口侧修改浏览器存储数据信息，应删除本地存储数据，刷新页面以更新_

##### localStorage 可以长期存储的数据

1. 登录数据: userInfo;

[//]: # "2. 报警弹窗最小化: alarm-modal-minimize;"
[//]: # "3. 报警弹窗显示: show-live-alarm-modal;"
[//]: # "4. 报警弹窗只展示未确认条目: only-unconfirm;"

##### sessionStorage 非长期存储数据

[//]: # "1. 温度曲线图图例数据: temp-curve-legend;"
[//]: # "2. 风机部件数据: temp-curve-fan-parts;"
[//]: # "3. 风机部件监控部件名称: device-parts;"

#### nginx 接口代理说明

- _项目接口会在原接口 URI 基础上添加前缀 (如：/api) 用于前端代理，设置文件为 `/src/api/index.js;`_

1. 本地开发启动代理，需修改 `setupProxy.js` 文件的代理配置项;
2. 生产环境 nginx 接口代理，nginx 配置文件中 `location /ness/` 位置用于代理数据接口;

#### <span class="warn">命名规则</span>

- 文件夹及文件名称：单词全部小写，用连字符连接单词，不可出现空格
- 类、组件、变量、方法等采用驼峰命名
- 类、组件名称首字母大写
- 常量字母全部大写，用下划线连接单词

#### <span class="warn">目录结构</span>

- .npmrc 包管理工具的配置文件，可配置依赖包的仓库地址
- .env _公共系统变量配置文件_
- .env.dev _开发环境系统变量配置文件，启动命令(`pnpm start`)中读取_
- .env.prod _生产环境系统变量配置文件，打包命令(`pnpm build`)中读取_
- .env.ele.dev _electron编译环境变量配置文件，启动命令(`pnpm start:ele`)中读取, 其中包含用于判断编译目标的标记字段 `VITE_CS`_
- .env.ele.prod _electron编译环境变量配置文件，打包命令(`pnpm build:ele`)中读取, 其中包含用于判断编译目标的标记字段 `VITE_CS`_
- electron _electron进程程序_
- mqtt-client _mqtt客户端工具类文件_
- plugin _vite自定义插件，用于清理没用的 public 内静态文件_
- resource _electron所需的静态资源文件，如图标文件_
- public 静态资源目录
  - 需通过网络请求的静态文件们，按用途、模块、类型等分组及命名
  - index.html 主页模板
- src-tauri rust源代码目录
- src 源代码目录
  - api 请求接口目录
    - 按服务将接口分组到不同 ts 文件中，文件名为服务名
    - dvs-detail-context.ts axios 实例，请求配置文件与拦截器
  - assets 静态资源文件目录
    - 直接引入的静态文件们，按用途、模块、类型等分组及命名
  - components 公用组件们
    - 最小功能组件或由最小功能组件组成的组件，按功能命名，文件夹名称为组件名称
  - pages 页面目录
    - error-page 错误页面，403 404
    - login 登陆页面
    - 功能模块页面，文件夹名称 page-模块名称
      - 模块子页面，文件夹名称 模块名(或缩写)-功能名称(或缩写)
      - components 本模块公共组件
      - config 本模块公共配置
      - methods 本模块公共方法
  - router 路由目录
    - config.tsx 路由配置文件
    - index.tsx 路由主文件
    - interface 路由数据类型
    - menu-\* 各个模块的菜单数据
    - tree-menu-data 菜单数据，各个模块汇总数据
    - variables 菜单字符串常量
    - README.md 路由说明文件
  - store 状态管理目录
    - 文件按模块分组命名
    - auth 用户登录权限相关状态
  - types 公共的数据类型定义文件，按模块拆分
  - configs 公共的常量数据配置文件，按模块拆分
    - chart-fragments.ts echarts 各个配置信息常量或配置处理方法
    - mqtt.ts MQ topic 配置信息常量
    - storage-cfg.ts 本地存储的配置信息常量
    - text-constant.ts 公共的文字常量和单位字符串常量对象
    - time-constant.ts 时间格式化字符串常量和时间毫秒数值常量
    - 其他各个模块的公共配置信息常量
  - hooks 公共的 hooks 文件，按模块拆分
  - contexts 公共的 useContext 文件，按模块拆分
  - utils 工具、公共方法目录
    - util-funs.tsx `公共的数据处理方法，含数值、日期处理方法等`
    - file-funs.tsx `文件相关的处理方法，含导出方法`
    - custom-mqtt.ts `封装的mqtt工具类`
    - storage-funs.ts `本地存储的信息配置数据，用于对本地存储统一管理`
    - 其他方法应按用途进行文件拆分
  - styles 样式目录
    - font 字体文件目录
    - variables.less，`less 的公共变量文件`
    - root.less `css 变量`
    - antd-styles.less `设置antd组件的全局样式，对Message等弹出组件有效`
    - antd-theme-data.ts `antd的主题数据`
    - device-stated.less `设备状态的颜色预处理方法`
    - style-funs.less `less 方法们`
    - 公共样式文件
  - App.tsx 应用 react 根组件
  - App.less, 根样式文件，<span class="warn">包含了 css 变量信息</span>
  - main.tsx 项目入口文件，其中含antd的组件主题设置
  - electron\* _electron打包所需的配置文件_

<style>
code{
color: blur;
}
.warn{
  color: #FF6347;
}
</style>

#增加rejectUnauthorized: true
\mqtt-client\mqtt-client-tauri.ts
\mqtt-client\mqtt-client-base.ts

#调试工具devtools
\src-tauri\Cargo.toml
tauri = { version = "1.8.0", features = ["shell-open", "devtools"] }

#打包类型TLS
#\src-tauri\tauri.conf.json
"productName"
"targets": ["nsis", "deb", "appimage", "rpm"],

#mqtt调用TLS，区分windows和要证书的麒麟信创电脑
\src-tauri\src\services\mqtt_service.rs


#个性化不使用代理仅限域名区域
#使用代理时无论是否域名区域这些都不用改
#因为Tauri 只允许前端代码请求HTTPS 协议的 API
1）\src\api\index.ts
baseURL: "https://ness.crnewenergy.com.cn/ness",
2）\.env.tauri.prod
MQTT_PROXY_HTTP=""
VITE_API_HOST=https://ness.crnewenergy.com.cn
VITE_API_PORT=80
VITE_ELE_SVG_DIR=/static/stationSvg
REACT_APP_LARGE_SCREEN_ROOT=/hnscreen
VITE_MQTT_HOST=ness.crnewenergy.com.cn
VITE_MQTT_PORT=21883
VITE_MQTT_PATH=/mqtt
VITE_MQTT_PROTOCOL=mqtt
或
MQTT_PROXY_HTTP=""
VITE_API_HOST=https://ness.crnewenergy.com.cn
VITE_API_PORT=80
VITE_ELE_SVG_DIR=/static/stationSvg
REACT_APP_LARGE_SCREEN_ROOT=/hnscreen
VITE_MQTT_HOST=ness.crnewenergy.com.cn
VITE_MQTT_PORT=
VITE_MQTT_PATH=/mqtt
VITE_MQTT_PROTOCOL=wss
3）\src-tauri\tauri.conf.json增加http：
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
       "http": {
        "scope": ["https://ness.crnewenergy.com.cn"]
      }
    },
4）\src\api\api-boost.ts
baseURL: isElectronENV || isMqttProxyHttp ? `` : `https://ness.crnewenergy.com.cn`,
5）devicemng后端免鉴权

#非SSL区域电气图访问方式
\src\pages\site-boost\methods\index.tsx
//const svgXml = await doBaseServer<IBoostSvgPath>("getStationSvg", { stationCode, svgName })
const svgXml = await doBaseServer<IBoostSvgPath>("getElecDiagramImg", { stationCode, svgName })

#打包去掉console
/vite-options.ts
      drop_console: configEnv.NODE_ENV !== "development",
      drop_debugger: true,

   <!-- "security": {
      "csp": null,
      "dangerousRemoteDomainIpcAccess": [
    {
      "domain": "ness.crnewenergy.com.cn",
      "windows": ["main"],
      "enableTauriAPI": false
    }
  ]
    }, -->