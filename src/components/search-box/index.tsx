import "./index.less"

import { CloseOutlined } from "@ant-design/icons"
import { Input } from "antd"

export default function SearchBox(props) {
  const { placeholder, setShowSearch, onSearch } = props
  return (
    <div className="comfloat-search">
      <div className="float-search-title">
        <span>查找</span>
        <CloseOutlined onClick={() => setShowSearch()} />
      </div>
      <Input.Search enterButton={false} onSearch={onSearch} placeholder={placeholder} />
    </div>
  )
}
