/*
 * @Author: chenmeifeng
 * @Date: 2024-07-05 15:43:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-05 17:11:38
 * @Description:
 */
import { convertToBase64 } from "@/utils/mqtt-util-funcs"
import "./import-file.less"
import CustomUpload from "@/components/custom-upload"
import { UploadOutlined } from "@ant-design/icons"
import { Button, Space, Upload, UploadFile, UploadProps } from "antd"
import { forwardRef, useRef, useState } from "react"
import { importCorretList } from "../methods/correct"

const isElectronENV = process.env["VITE_CS"]
const isMqttProxyHttp = process.env["MQTT_PROXY_HTTP"]
interface IDataRefs {}
export interface IDataProps {
  stationCode: string
  btnClick?: (type: string) => void
}
const FileImport = forwardRef<IDataRefs, IDataProps>((props) => {
  const { stationCode, btnClick } = props
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const fileProps: UploadProps = {
    onRemove: (file) => {
      setUploading(false)
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      console.log(file, "file")

      setUploading(true)
      setFileList([file])
      return false
    },
    fileList,
  }

  const submitTo = (type) => {
    if (type === "ok") {
      uploadFile()
    } else {
      btnClick?.(type)
    }
  }
  const uploadFile = async () => {
    const formData = new FormData()
    if (isMqttProxyHttp || isElectronENV) {
      const fileurl = await convertToBase64(fileList[0] as any)
      formData.append("file", fileurl)
    } else {
      formData.append("file", fileList[0] as any)
    }
    formData.append("stationCode", stationCode)
    const res = await importCorretList(formData)
    if (!res) return
    btnClick?.("ok")
  }

  return (
    <div className="import-correct">
      <div className="import-box">
        <span className="span">导入文件</span>
        <CustomUpload
          disabled={uploading}
          title="本地上传"
          name="file"
          action="#"
          accept=".xml,.xlsx"
          showUploadList={true}
          maxCount={1}
          {...fileProps}
        />
      </div>
      <Space style={{ width: "100%", justifyContent: "end", marginTop: "1em" }}>
        <Button onClick={submitTo.bind(null, "close")}>取消</Button>
        <Button onClick={submitTo.bind(null, "ok")} disabled={!uploading}>
          确认
        </Button>
      </Space>
    </div>
  )
})
export default FileImport
