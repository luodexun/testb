/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 09:49:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-11 12:15:28
 * @Description:
 */
// import { exec } from "child_process"
import React, { useEffect, useRef, useState } from "react"
const isElectronENV = process.env["VITE_IS_LINUX"] === "1"
import { useNavigate } from "react-router-dom"
const TextToSpeech = () => {
  const [text, setText] = useState("")
  const navigate = useNavigate()
  const currentUtterance = useRef(null)
  const allSpeaks = useRef([]) // 语音列表
  const lastEnd = useRef(false) // 记录当前语音是否读完
  const curLength = useRef(0) //  记录当前在读语音此时语音列表的长度
  const speak = (text) => {
    console.log(process.env["VITE_IS_LINUX"], "process.env", isElectronENV)
    // 判断是否是linux环境，不知道能不能行
    // const isLnx = isLinux(navigate.userAgent)
    // console.log(process?.platform, isLnx, "process.platform")
    if (isElectronENV) {
      window.main2Api.textToSpeak(text)
    } else {
      if (currentUtterance.current && lastEnd.current) {
        speakOne(text)
        return
      }
      if (currentUtterance.current && !lastEnd.current) return
      speakOne(text)
    }
  }

  const speakOne = (text) => {
    curLength.current = allSpeaks.current.length
    currentUtterance.current = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(currentUtterance.current)
    currentUtterance.current.onend = () => {
      lastEnd.current = true
      if (curLength.current !== allSpeaks.current.length) {
        speakOne(allSpeaks.current[allSpeaks.current.length - 1])
      }
    }
    lastEnd.current = false
  }

  const handleChange = (e) => {
    setText(e.target.value)
  }
  const handleSpeakEkho = () => {
    if (isElectronENV) {
      allSpeaks.current.push(text)
      if (currentUtterance.current && lastEnd.current) {
        testSpeak(text)
        return
      }
      if (currentUtterance.current && !lastEnd.current) return
      currentUtterance.current = true
      testSpeak(text)
    }
  }

  const testSpeak = (text) => {
    curLength.current = allSpeaks.current.length
    window.main2Api.addCallback("alarmVioce", callback.current)
    setTimeout(() => {
      window.main2Api.toSpeakTest(text)
    }, 500)
    lastEnd.current = false
  }
  const callback = useRef(() => {
    lastEnd.current = true
    if (curLength.current !== allSpeaks.current.length) {
      testSpeak(allSpeaks.current[allSpeaks.current.length - 1])
    }
  })
  const handleSpeak = () => {
    speak(text)
  }
  // const first = useRef(true)
  // useEffect(() => {
  //   if (first.current) {
  //     console.log(3333)

  //     first.current = false
  //     const arr = [
  //       "就看来就是对方了可及时的反馈冷静的思考",
  //       "空间可怜见受到了可就是离开东京上空拦截",
  //       "jdkdkfkfksljdlkdj绝对是快点结婚",
  //       "j觉得海枯石烂滴哦",
  //     ]
  //     for (let i = 0; i < arr.length; i++) {
  //       setTimeout(
  //         () => {
  //           allSpeaks.current.push(arr[i])
  //           speak(arr[i])
  //         },
  //         1000 * (i + 1),
  //       )
  //     }
  //     setTimeout(() => {
  //       allSpeaks.current.push("4444444")
  //       speak("4444444")
  //     }, 15000)
  //     setTimeout(() => {
  //       allSpeaks.current.push("67956767")
  //       speak("67956767")
  //     }, 21000)
  //   }
  // }, [])
  useEffect(() => {
    return () => {
      console.log("卸载")
      currentUtterance.current = null
      lastEnd.current = false
    }
  }, [])
  return (
    <div>
      {/* <div>
        <input type="text" value={text} onChange={handleChange} />
        <button onClick={handleSpeak}>说话</button>
      </div> */}
      <div>
        <input type="text" value={text} onChange={handleChange} />
        <button onClick={handleSpeakEkho}>测试2</button>
      </div>
    </div>
  )
}

export default TextToSpeech
