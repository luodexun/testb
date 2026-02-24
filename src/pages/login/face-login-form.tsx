/*
 * @Author: xiongman
 * @Date: 2023-12-05 14:01:11
 * @LastEditors: xiongman
 * @LastEditTime: 2023-12-05 14:01:11
 * @Description:
 */

import { MS_SCEND_4 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { loginAsyncAtom } from "@store/atom-auth.ts"
import CanvasDrawer from "@utils/canvas-drawer.ts"
import { useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"

import { IFaceLoginParam } from "@/types/i-auth.ts"

const isElectronENV = process.env["VITE_CS"]
const isMqttProxyHttp = process.env["MQTT_PROXY_HTTP"]

const noVideoErrMsg = (function () {
  const hasVideo = !!navigator.mediaDevices?.getUserMedia
  return hasVideo ? null : "您的浏览器不支持该功能！"
})()

const constraints = {
  video: { width: 0, height: 0 },
  audio: false,
}
async function runUserMedia(): Promise<MediaStream | string | null> {
  if (noVideoErrMsg) return null
  return navigator.mediaDevices.getUserMedia(constraints).catch((error) => error.message)
}
export default function FaceLoginForm() {
  const [errMsg, setErrMsg] = useState<string>(noVideoErrMsg)
  const [reset, setReset] = useState(false)
  const videoRef = useRef<HTMLVideoElement>()
  const canvasRef = useRef<HTMLCanvasElement>()
  const cvsDrawRef = useRef<CanvasDrawer>()
  const [reload, setReload] = useRefresh(MS_SCEND_4)
  const loginAsync = useSetAtom(loginAsyncAtom)

  useEffect(() => {
    const video = videoRef.current
    return () => {
      if (!video || !video.srcObject) return
      video.autoplay = false
      if ("getTracks" in video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop())
      }
      video.srcObject = null
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    ;(async function () {
      const mediaStream = await runUserMedia()
      if (!mediaStream || !video) return
      if (typeof mediaStream === "string") return setErrMsg(mediaStream)
      video.srcObject = mediaStream
      video.autoplay = true
    })()
  }, [])

  useEffect(() => {
    if (reset) return
    const canvas = canvasRef.current
    if (!canvas) return
    let cvsDraw = cvsDrawRef.current
    if (!cvsDraw) cvsDraw = cvsDrawRef.current = new CanvasDrawer(canvas).size()
    if (!cvsDraw.canvasW) return
    cvsDraw.drawVideo(videoRef.current)
  }, [reset])

  const timerFlagRef = useRef(false)
  const loginRef = useRef(async (params: IFaceLoginParam) => {
    if (timerFlagRef.current) return
    timerFlagRef.current = true
    await loginAsync({
      loginForm: params,
      urlKey: "userFaceLogin",
      call: (isErr: boolean) => {
        timerFlagRef.current = false
        if (!isErr) return
        setReload(false)
      },
    })
  })

  useEffect(() => {
    if (!reload || !cvsDrawRef.current) return
    let imgFile
    if (isMqttProxyHttp || isElectronENV) {
      imgFile = cvsDrawRef.current.getBase64uRL("png")
    } else {
      imgFile = cvsDrawRef.current.imageBase64ToFile("png")
    }
    if (!imgFile) setReload(false)
    loginRef.current({ image: imgFile })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  const onResetRef = useRef(() => {
    setReset((p) => !p)
    window.setTimeout(() => setReset((p) => !p), 100)
  })
  return (
    <div className="l-full face-login-form">
      <video ref={videoRef} autoPlay className="face-login-video" />
      <div className="face-box pointer" title="重新验证" onClick={onResetRef.current}>
        <canvas ref={canvasRef} className="face-login-canvas l-full" />
      </div>
      <div className="err-msg" children={errMsg} />
    </div>
  )
}
