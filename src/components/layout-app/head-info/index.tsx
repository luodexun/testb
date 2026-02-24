/*
 * @Author: xiongman
 * @Date: 2023-06-27 17:19:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-13 15:03:20
 * @Description: 页面头部组件-右侧信息 告警逻辑更新：实时告警15秒调用一次，优先读mqtt的告警数据，
 *  读完mqtt的告警，就读实时告警里面的告警，有mqtt告警来，等待前面告警读完，就读最新的mqtt告警，以此类推
 */

import "./index.less"

// import mps from "@/assets/vioce/voice.mp3"
import { MS_MINU } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { AtomCheckToken, loginOutAtom, userInfoAtom } from "@store/atom-auth.ts"
import { AtomPageCarousel } from "@store/atom-menu.ts"
import classnames from "classnames"
import { use } from "echarts"
import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { doBaseServer } from "@/api/serve-funs.ts"
import { SCREEN_PART } from "@/configs/screen.ts"
// import StationSelect from "@/components/station-select/index.tsx"
// import StationTreeSelect from "@/components/station-tree-select/index.tsx"
import { StorageAlarmVoice } from "@/configs/storage-cfg.ts"
import { IQueryAlarmParams } from "@/pages/alarm-realtimeV2/config/types.ts"
import { getsiteUrl } from "@/router/menu-site.ts"
import {
  alarmAudioAtom,
  alarmCountInfo,
  alarmCountInfoSetAtom,
  alarmInfoAtom,
  alarmInfoSetAtom,
} from "@/store/atom-alarm.ts"
import { getMngStaticInfo } from "@/utils/device-funs.ts"
import { getStorage, setStorage, showMsg } from "@/utils/util-funs.tsx"

import Comloss from "./components/comloss.tsx"
import HelpContext from "./components/help.tsx"
import AlarmInfoModel from "./components/new-alarm-info.tsx"
import Relist from "./components/relist.tsx"
import ScreenModalLs from "./components/screen-list.tsx"
import SearchStation from "./components/station-search.tsx"
import { ICON_BTN_LIST, IS_ELEC_ENV } from "./configs.tsx"
import HeadClock from "./head-clock.tsx"
import { getAlarmAudio, getFinalAlarm, transVioceText } from "./methods.ts"
import PageCarouselDropdown from "./page-carousel-dropdown.tsx"
import { THeadInfoActIconKey, THeadInfoIconStateMap, TUserActKey } from "./types.ts"
import useConnectStatus from "./use-connect-status.ts"
import UserActiveDropdown from "./user-active-dropdown.tsx"
// const sysTitle = process.env["REACT_APP_SYSTEM_TITLE"] || "华润新能源区域集控系统"
const audioLs = ["440514W02", "WT", "G001"]
const AUDIO_SRC = `${process.env.VITE_API_HOST}`
const AUDIO_SRC_PORT = `${process.env.VITE_API_PORT}`
const audioKdxf = `${process.env.VITE_AUDIO_USE_KDXF}` === "1"
export default function HeadInfo() {
  const userInfo = useAtomValue(userInfoAtom)
  const [sysTitle, setTitle] = useState("")
  const [jumpScreenUrl, setJumpScreenUrl] = useState("")
  const logout = useSetAtom(loginOutAtom)
  const pageCarousel = useAtomValue(AtomPageCarousel)
  const setCheckToken = useSetAtom(AtomCheckToken)
  const [btnRefsh, setBtnRefsh] = useState(false)
  const navigate = useNavigate()
  const { notyfyHolder } = useConnectStatus()
  const [, setRefresh] = useState(0)
  const [reload, setReload] = useRefresh(MS_MINU)
  const alarmVoiceStatus = getStorage(StorageAlarmVoice)
  // 判断是否是第一次点击告警播放按钮
  const isFirstClV = useRef(alarmVoiceStatus ? 0 : 1)
  const currentUtterance = useRef(null)
  const allSpeaks = useRef([]) // 语音列表
  const lastEnd = useRef(false) // 记录当前语音是否读完
  const curLength = useRef(0) //  记录当前在读语音此时语音列表的长度
  const [reloadCount, setReloadCount] = useRefresh(15 * 1000)
  const setGlobalValue = useSetAtom(alarmCountInfoSetAtom)
  // const value = useAtomValue(alarmInfoAtom)
  const audioPlayInfo = useAtomValue(alarmAudioAtom)
  const alarmCtInfo = useAtomValue(alarmCountInfo)
  const audioRef = useRef(null)
  const audioRef1 = useRef(null) // 滴滴告警声
  const audioRef2 = useRef(null)
  const audioRef3 = useRef(null)
  const audioRef4 = useRef(null) // 实时告警声
  const [currentAudio, setCurrentAudio] = useState(0) // 记录当前播放第几条语音
  const audioList = useRef([]) // 当前语音的语音列表，包含三条语音
  const currenPlayAlarm = useRef(null) // 当前播放的告警信息
  const lastestAlarm = useRef(null) // 最新的告警信息
  const screenLsObj = useRef(SCREEN_PART)
  const [showScreenLs, setShowScreenLs] = useState(false)
  const alarmText = useRef("") // 某一条的告警文案
  const alarmOneInfo = useRef(null) // 某一条的告警信息
  const needDiDiAlarmlevel = useRef([14]) //滴滴告警前缀
  const finishSpeakCurrentAudio = useRef(true) // 记录当前语音是否读完
  const [isMqttAudioPlay, setIsMqttAudioPlay] = useState(false)
  const isMqttAudioPlayRef = useRef(false)
  const [realtimeAlarm, setRealtimeAlarm] = useState([]) // 实时告警数据
  const realtimeAlarmPlayIndex = useRef(0)
  // const alarmDiDiAudioMp3 =
  useEffect(() => {
    // 一进来页面，当订阅到新的告警信息时，需要语音播报该条告警信息，若关闭，不播放当前告警信息
    if (audioPlayInfo && getStorage(StorageAlarmVoice)) {
      setIsMqttAudioPlay(true)
      // const curAlarmInfo = value.alarmMessages?.[value.alarmMessages.length - 1]
      const curAlarmInfo = audioPlayInfo
      allSpeaks.current.push(curAlarmInfo)
      lastestAlarm.current = JSON.stringify(curAlarmInfo)
      if (audioKdxf) {
        finishSpeakCurrentAudio.current ? getAudioUrl(curAlarmInfo) : ""
        return
      }
      // 告警播放逻辑：播放每条语音时，在播放期间，如果来了100条语音，播放结束后，立即播放第100条语音，当当前音频是变位级别，加播警笛声音
      const text = transVioceText(curAlarmInfo)
      if (currentUtterance.current && lastEnd.current) {
        IS_ELEC_ENV ? speakAlarmFromSrc2(curAlarmInfo) : speakOne(text, curAlarmInfo)
        return
      }
      if (currentUtterance.current && !lastEnd.current) return
      if (IS_ELEC_ENV) currentUtterance.current = true
      IS_ELEC_ENV ? speakAlarmFromSrc2(curAlarmInfo) : speakOne(text, curAlarmInfo)
    }
  }, [audioPlayInfo])
  useEffect(() => {
    return () => {
      currentUtterance.current = null
    }
  }, [])
  useEffect(() => {
    if (!userInfo?.token) navigate("/login")
  }, [navigate, userInfo?.token])

  const isFirst = useRef(false)
  useEffect(() => {
    if (!isFirst.current) {
      isFirst.current = true

      const alarmVoiceStatus = getStorage(StorageAlarmVoice)
      btnStateRef.current["voice"] = alarmVoiceStatus === true
      setBtnRefsh(!btnRefsh)
      getSysName.current()
    }
  }, [])
  useEffect(() => {
    if (!reload) return
    // 跳过登录就注释
    setCheckToken().then(() => setReload(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, setCheckToken])

  const actualJumpUrl = useMemo(() => {
    return jumpScreenUrl || process.env.REACT_APP_LARGE_SCREEN_ROOT
  }, [jumpScreenUrl])
  const btnStateRef = useRef<THeadInfoIconStateMap>({})
  const toScreenPage = () => {
    if (!screenLsObj.current?.[actualJumpUrl]) return navigate(`/${actualJumpUrl}`)
    setShowScreenLs((prev) => !prev)
  }

  const pageCrslRef = useRef(pageCarousel)
  pageCrslRef.current = pageCarousel
  const iconClickRef = useRef((key: THeadInfoActIconKey, bRefsh: boolean, userAct?: any): void => {
    if (key === "virtualAlarm") {
      // 不要删掉
      btnStateRef.current["alarm"] = bRefsh
      setBtnRefsh(bRefsh)
      return
    }
    if (key === "alarm") {
      navigate("/alarm/realtime-two")
      return
    }
    if (key === "last") {
      window.history.back()
      return
    } else if (key === "next") {
      window.history.forward()
      return
    }
    btnStateRef.current[key] = !btnStateRef.current[key]
    setBtnRefsh(!bRefsh)

    if (key === "carousel") {
      btnStateRef.current["carousel"] = pageCrslRef.current.isCarousel
    } else if (key === "voice") {
      isFirstClV.current = isFirstClV.current + 1
      setStorage(JSON.stringify(isFirstClV.current % 2 === 0), StorageAlarmVoice)
    } else if (key === "user") {
      const userActKey: TUserActKey = userAct.key
      if (userActKey === "loginout") return logout()
    }
  })
  const toStationPage = useRef((stationCode, info) => {
    btnStateRef.current["searchSt"] = true
    navigate(`/site/${info?.maintenanceComId}/${stationCode}/${getsiteUrl(info?.type)}`)
  })
  const getSysName = useRef(async () => {
    const res = await doBaseServer("queryMngStatic", { key: "title" })
    const jump = await doBaseServer("queryMngStatic", { key: "screen" })
    setJumpScreenUrl(jump?.data)
    setTitle(res?.data)
  })
  // 浏览器文字转语音
  const speakOne = (text, crtAlarm) => {
    setTimeout(async () => {
      alarmText.current = text
      // alarmOneInfo.current = curAlarmInfo
      curLength.current = allSpeaks.current.length
      currentUtterance.current = new SpeechSynthesisUtterance(text)
      getDiDiAudio(crtAlarm.deviceType)
      if (crtAlarm.siren) {
        try {
          await audioRef1.current?.play()
        } catch (e) {
          // showMsg("浏览器安全策略提醒：请点击系统任意地方，接收告警声音播放", "error")
          lastEnd.current = true
        }
      } else {
        browserSpeak(text)
      }
      lastEnd.current = false
    }, 700)
  }
  // 浏览器播放声音
  const browserSpeak = (text) => {
    window.speechSynthesis.speak(currentUtterance.current)
    currentUtterance.current.onend = () => {
      callback.current()
    }
  }
  // elec利用ekho文字转语音
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
      const curtext = transVioceText(allSpeaks.current[allSpeaks.current.length - 1])
      IS_ELEC_ENV ? testSpeak(curtext) : speakOne(curtext, allSpeaks.current[allSpeaks.current.length - 1])
    }
  })

  // C端读取服务器下某路径下的文件
  const speakAlarmFromSrc = (info) => {
    console.log(11111, info)
    lastEnd.current = true
    const { deviceId, alarmId, startTime } = info
    audioRef.current.src = `${AUDIO_SRC}:${AUDIO_SRC_PORT}/static/alarmAudio/${deviceId}_${alarmId}_${startTime}.mp3`
    // audioRef.current.src = `http://10.63.9.233/static/alarmAudio/754_21070_2090266137486.mp3`
    console.log(audioRef.current.src, " audioRef.current.src")
    setTimeout(() => {
      audioRef.current?.play()
    }, 700)
  }
  const speakAlarmFromSrc2 = async (info) => {
    lastEnd.current = false
    alarmOneInfo.current = info
    currenPlayAlarm.current = JSON.stringify(info)
    getDiDiAudio(info.deviceType)
    if (info.siren) {
      lastEnd.current = false
      try {
        await audioRef1.current?.play()
      } catch (e) {
        lastEnd.current = true
        // showMsg("浏览器安全策略提醒：请点击系统任意地方，接收告警声音播放", "error")
      }
    } else {
      browserSpeakDesignAudio(info)
    }
  }
  // 浏览器播放指定目录下的音频
  const browserSpeakDesignAudio = (info) => {
    setCurrentAudio(0)
    const { deviceId, stationCode, deviceType } = info
    audioList.current = [stationCode, deviceType, deviceId]
    // audioRef.current.src = `${AUDIO_SRC}:${AUDIO_SRC_PORT}/static/alarmAudio/${stationCode}.mp3`
    audioRef.current.src = `${AUDIO_SRC}/static/alarmAudio/${stationCode}.mp3`
    audioRef.current?.play()
  }
  // 开始audioRef播放触发
  const playAudio1 = useRef(() => {
    lastEnd.current = false
    setCurrentAudio((prev) => {
      return prev + 1
    })
  })
  // 播放audioRef结束触发
  const playNextAudio1 = () => {
    if (currentAudio === 2) {
      lastEnd.current = true
      console.log("播放结束")
      // 如果最新一条告警信息不等于当前播放的告警信息，证明有最新告警存在，播放最新的告警信息
      if (lastestAlarm.current !== currenPlayAlarm.current) {
        console.log("还有一条")
        speakAlarmFromSrc2(JSON.parse(lastestAlarm.current))
      } else {
        setIsMqttAudioPlay(false) // 设置当前mqtt告警列表读完了
      }
      return
    }
    audioRef.current.src = `${AUDIO_SRC}/static/alarmAudio/${audioList.current[currentAudio]}.mp3`
    // audioRef.current.src = `${AUDIO_SRC}:${AUDIO_SRC_PORT}/static/alarmAudio/${audioList.current[currentAudio]}.mp3`
    audioRef.current?.play()
  }

  const playAudio3 = useRef(async () => {
    audioRef3.current.src = `${AUDIO_SRC}/static/alarmAudio/break-alarm.mp3`
    try {
      await audioRef3.current?.play()
    } catch (e) {
      // showMsg("浏览器安全策略提醒：请点击系统任意地方，接收告警声音播放", "error")
    }
  })

  const playNextplayDiAudio = () => {
    lastEnd.current = true
    if (audioKdxf) {
      audioRef2.current?.play()
      return
    }
    IS_ELEC_ENV ? browserSpeakDesignAudio(alarmOneInfo.current) : browserSpeak(alarmText.current)
  }
  const getDiDiAudio = (type) => {
    audioRef1.current.src =
      type === "SYZZZ" ? `${AUDIO_SRC}/static/alarmAudio/sy-alarm.mp3` : `${AUDIO_SRC}/static/alarmAudio/alarm.mp3`
    // ? `${AUDIO_SRC}:${AUDIO_SRC_PORT}/static/alarmAudio/sy-alarm.mp3`
    // : `${AUDIO_SRC}:${AUDIO_SRC_PORT}/static/alarmAudio/alarm.mp3`
  }
  const getAudioUrl = async (info) => {
    finishSpeakCurrentAudio.current = false
    currenPlayAlarm.current = JSON.stringify(info)
    const res = await getAlarmAudio(info)
    if (!res) {
      finishSpeakCurrentAudio.current = true
      return
    }
    audioRef2.current.src = `${AUDIO_SRC}/static/audio/${res}`
    getDiDiAudio(info.deviceType)
    try {
      // 是否滴滴
      if (info.siren) {
        await audioRef1.current?.play()
      } else {
        await audioRef2.current?.play()
      }
    } catch (e) {
      // showMsg("浏览器安全策略提醒：请点击系统任意地方，接收告警声音播放", "error")
      finishSpeakCurrentAudio.current = true
    }
  }
  const actionSpeak = useRef(() => {
    finishSpeakCurrentAudio.current = false
  })
  const finishSpeak = useRef(() => {
    // 如果最新一条告警信息不等于当前播放的告警信息，证明有最新告警存在，播放最新的告警信息
    if (lastestAlarm.current !== currenPlayAlarm.current) {
      finishSpeakCurrentAudio.current = false
      getAudioUrl(JSON.parse(lastestAlarm.current))
      return
    }
    finishSpeakCurrentAudio.current = true
  })
  useEffect(() => {
    if (!reloadCount) return
    setGlobalValue({
      // alarmInfo: {},
      call: (isErr: boolean) => {
        setReloadCount(false)
      },
      // showMqttCount: false,
    })
  }, [reloadCount])
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!audioRef.current) return
  //     audioRef.current.src = `${AUDIO_SRC}:${AUDIO_SRC_PORT}/static/alarmAudio/1139_YX724_1690266137488.mp3`
  //     audioRef.current?.play()
  //   }, 1000)
  // }, [])
  const timer = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orders, setOrders] = useState([])

  const handleGetSecondEamOrder = async () => {
    //不断循环请求，有数据就打开
    const res = await doBaseServer("getSecondEamOrder")
    // console.log("res", res)
    if (res.length) {
      if (!isModalOpen) {
        res.length && setOrders(res)
        setIsModalOpen(true)
      }
    }
  }
  const handleQueryMngStatic = async () => {
    const res = await doBaseServer("queryMngStatic", { key: "isSecondEamOrder" })
    if (res.data == 1) {
      if (timer.current) {
        clearInterval(timer.current)
      }
      timer.current = setInterval(() => {
        handleGetSecondEamOrder()
      }, 5000)
    }
  }
  const handleClose = async () => {
    setIsModalOpen(false)
  }

  const realtimeAlarmTimer = useRef(null)
  const getRealTimeAlarm = async (level) => {
    const res = await doBaseServer<IQueryAlarmParams>("queryFoldMsg", {
      data: {
        alarmLevelIdList: level,
      },
      params: { pageNum: 1, pageSize: 10 },
    })
    console.log(isMqttAudioPlayRef.current, "isMqttAudioPlay")

    if (!isMqttAudioPlayRef.current && res.list.length && getStorage(StorageAlarmVoice)) {
      // const test = [
      //   { deviceId: 1, stationCode: "410527W01", deviceType: "WT" },
      //   { deviceId: 1, stationCode: "410527W01", deviceType: "SYZZZ" },
      //   { deviceId: 1, stationCode: "410527W01", deviceType: "WT" },
      //   { deviceId: 1, stationCode: "410527W01", deviceType: "PVINV" },
      //   { deviceId: 1, stationCode: "410527W01", deviceType: "SYZZZ" },
      // ]
      // 停止播放实时告警接口的音频
      audioRef4.current?.pause()
      realtimeAlarmPlayIndex.current = 0
      setRealtimeAlarm(res.list)
      browserSpeakRtAlarmDesignAudio(res.list[0])
    }
  }
  const getRealTimeAlarmStaticInfo = async () => {
    const res = await getMngStaticInfo("audio_play_type")
    if (res && res.length) {
      getRealTimeAlarm(res)
      realtimeAlarmTimer.current = setInterval(() => {
        getRealTimeAlarm(res)
      }, 15000)
    }
  }
  // 浏览器播放指定目录下的音频
  const browserSpeakRtAlarmDesignAudio = (info) => {
    if (isMqttAudioPlayRef.current || !getStorage(StorageAlarmVoice)) return
    realtimeAlarmPlayIndex.current = realtimeAlarmPlayIndex.current + 1
    setCurrentAudio(0)
    const { deviceId, stationCode, deviceType } = info
    audioList.current = [stationCode, deviceType, deviceId]
    audioRef4.current.src = `${AUDIO_SRC}/static/alarmAudio/${stationCode}.mp3`
    audioRef4.current?.play()
  }
  // 开始audioRef4播放触发
  const playAudio4 = useRef(() => {
    setCurrentAudio((prev) => {
      return prev + 1
    })
  })
  // 播放audioRef4结束触发
  const playNextAudio4 = () => {
    if (isMqttAudioPlayRef.current) return
    if (currentAudio === 2) {
      // 判断当前播放序号是否等于总长度，当小于总长度时，则继续播放下一个
      if (
        !isMqttAudioPlayRef.current &&
        realtimeAlarm.length &&
        realtimeAlarmPlayIndex.current !== realtimeAlarm.length
      ) {
        browserSpeakRtAlarmDesignAudio(realtimeAlarm[realtimeAlarmPlayIndex.current])
      }
      // 如果还没来新的告警，则继续播放第一条告警，防止实时告警列表只返回2条以下的情况
      else if (
        !isMqttAudioPlayRef.current &&
        realtimeAlarm.length &&
        realtimeAlarmPlayIndex.current === realtimeAlarm.length
      ) {
        realtimeAlarmPlayIndex.current = 0
        browserSpeakRtAlarmDesignAudio(realtimeAlarm[0])
      }
      return
    }
    audioRef4.current.src = `${AUDIO_SRC}/static/alarmAudio/${audioList.current[currentAudio]}.mp3`
    audioRef4.current?.play()
  }
  useEffect(() => {
    isMqttAudioPlayRef.current = isMqttAudioPlay
    if (isMqttAudioPlay) {
      // 停止播放实时告警接口的音频
      audioRef4.current?.pause()
    } else if (realtimeAlarm?.length) {
      // 播放实时告警接口的音频
      realtimeAlarmPlayIndex.current = 0
      browserSpeakRtAlarmDesignAudio(realtimeAlarm[0])
    }
  }, [isMqttAudioPlay])
  useEffect(() => {
    getRealTimeAlarmStaticInfo()
    handleGetSecondEamOrder()
    timer.current = setInterval(() => {
      handleGetSecondEamOrder()
    }, 5000)
    handleQueryMngStatic()
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
        clearInterval(realtimeAlarmTimer.current)
      }
    }
  }, [])

  return (
    <div className="head-info-wrap">
      <div className="head-company" onClick={toScreenPage}>
        {/* <Link to={actualJumpUrl}></Link> */}
      </div>
      <HeadClock />
      <div className="center-name">{sysTitle}</div>
      {showScreenLs ? <ScreenModalLs list={screenLsObj.current[actualJumpUrl]} /> : ""}
      {ICON_BTN_LIST.map(({ field, title, icon }) => {
        const isCheck = !!btnStateRef.current[field]
        const theIcon = typeof icon === "function" ? icon(isCheck) : icon || field
        const cls = classnames(`i-${theIcon}`, { selected: isCheck })
        const t = typeof title === "string" ? title : title(isCheck)
        const onClick = iconClickRef.current.bind(null, field, btnRefsh)
        // if (field === "last") {
        //   return <ArrowLeftOutlined onClick={onClick} style={{ fontSize: "1.4rem" }} />
        // }
        if (field === "user") {
          return (
            <UserActiveDropdown key={field} onClick={onClick} children={<i key={field} title={t} className={cls} />} />
          )
        }
        if (field === "alarm") {
          return (
            <AlarmInfoModel
              key={field}
              setRefresh={setRefresh}
              isShowModel={btnStateRef.current["alarm"]}
              onClickbtn={iconClickRef}
            >
              <div className="alarm-box">
                <i key={field} title={t} className={cls} onClick={onClick} />
                {alarmCtInfo ? <span className="alarm-total">{alarmCtInfo.total}</span> : ""}
              </div>
            </AlarmInfoModel>
          )
        }
        if (field === "comloss") {
          return (
            <Comloss
              key={field}
              isShowModel={btnStateRef.current["comloss"]}
              onClickbtn={onClick}
              playFun={playAudio3.current}
            >
              <i key={field} title={t} className={cls} onClick={onClick} />
            </Comloss>
          )
        }
        if (field === "carousel") {
          return (
            <PageCarouselDropdown key={field} onClick={onClick}>
              <i key={field} title={t} className={cls} />
            </PageCarouselDropdown>
          )
        }
        if (field === "help") {
          return (
            <HelpContext key={field} isShowModel={btnStateRef.current["help"]} onClickbtn={onClick}>
              <i key={field} title={t} className={cls} onClick={onClick} />
            </HelpContext>
          )
        }
        if (field === "searchSt") {
          // return <StationTreeSelect key={field} allowClear={false} onChange={toStationPage.current} />
          return (
            <SearchStation
              key={field}
              isShow={btnStateRef.current["searchSt"]}
              toStationPage={toStationPage.current}
              onClickbtn={onClick}
            >
              <i key={field} title={t} className={cls} onClick={onClick} />
            </SearchStation>
          )
        }
        return <i key={field} title={t} className={cls} onClick={onClick} />
      })}
      {/* <audio
        ref={audioRef}
        src=""
        onPlay={playAudio.current}
        onEnded={playNextAudio}
      /> */}
      <Relist isModalOpen={isModalOpen} datasource={orders} closeFun={handleClose} />
      <audio ref={audioRef} src="" onPlay={playAudio1.current} onEnded={playNextAudio1} />
      <audio ref={audioRef1} src="" onEnded={playNextplayDiAudio} />
      <audio ref={audioRef2} src="" onPlay={actionSpeak.current} onEnded={finishSpeak.current} />
      <audio ref={audioRef3} src="" />
      <audio ref={audioRef4} src="" onPlay={playAudio4.current} onEnded={playNextAudio4} />
      <span className="user-name" children={userInfo?.realName || userInfo?.loginName || "访客"} />
      {notyfyHolder}
    </div>
  )
}
