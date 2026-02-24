/*
 * @Author: chenmeifeng
 * @Date: 2023-10-30 15:16:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-25 14:26:19
 * @Description:
 */

import "./add-user.less"

import { UploadProps } from "antd"
import { forwardRef } from "react"

import CustomUpload from "@/components/custom-upload"
import { convertToBase64 } from "@/utils/mqtt-util-funcs"

import { ulImgMethods } from "../methods"
import { IUserList, TModelFrAndTbInfo } from "../types"

const isElectronENV = process.env["VITE_CS"]
const isMqttProxyHttp = process.env["MQTT_PROXY_HTTP"]

export interface IImgOperateProps {
  buttonClick?: (type: "ok" | "close", data?: TModelFrAndTbInfo) => void
  loading?: boolean
  selectRowInfo?: IUserList
}

const UploadImg = forwardRef<undefined, IImgOperateProps>((props) => {
  const { buttonClick, selectRowInfo } = props

  const uploadImage: UploadProps["customRequest"] = async (options) => {
    const formData = new FormData()
    if (isMqttProxyHttp || isElectronENV) {
      const fileurl = await convertToBase64(options.file as any)
      formData.append("image", fileurl)
    } else {
      formData.append("image", options.file)
    }
    formData.append("id", selectRowInfo.id.toString())
    const res = await ulImgMethods(formData)
    if (!res) return
    buttonClick?.("ok")
  }

  return (
    <div className="user-model">
      <CustomUpload
        title="本地上传"
        name="file"
        action="#"
        listType="picture"
        showUploadList={false}
        customRequest={uploadImage}
        maxCount={1}
      />
    </div>
  )
})

export default UploadImg
