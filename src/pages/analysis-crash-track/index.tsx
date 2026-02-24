/*
 * @Author: xiongman
 * @Date: 2023-11-09 14:10:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-14 15:20:08
 * @Description: 页面入口-事故追忆
 */

import "@/pages/site-boost/index.less"
import "./index.less"

import usePagination from "@hooks/use-pagination.ts"
import { refreshDiagramValue, setBoostSvgDiagram } from "@pages/site-boost/methods"
import { DragAndScale } from "@utils/drag-and-scale.ts"
import { Pagination } from "antd"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import { CardTitle } from "@/components/info-card"
import PlayButton from "@/components/radio-button/play-button.tsx"
import { IBoostMQData, IBoostSvgPath, INodeIdField2DomInfo } from "@/types/i-boost.ts"

import { CRASH_TRACK_FORM_BTNS, CRASH_TRACK_FORM_ITEMS } from "./configs.ts"
import { crashTrackSearch, dealCrashTrackFormChange, exportCrashTrackData, getExitOnOffCbPoint } from "./methods.ts"
import { ICrashTrackSchForm, TCrashTrackFormAct, TCrashTrackSchFormName } from "./types.ts"

const PAGE_PARAMS = {
  showSizeChanger: false,
  showQuickJumper: false,
  pageSize: 60,
}
export default function AnalysisCrashTrack() {
  const [crashTime, setCrashTime] = useState<string>()
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TCrashTrackSchFormName>>({})
  const [svgPathInfo, setSvgPathInfo] = useState<IBoostSvgPath>({ stationCode: "", svgName: "" })
  const [loading, setLoading] = useState(false)
  const [playState, setPlayState] = useState(false)
  const nodeField2DomMapRef = useRef<Record<string, INodeIdField2DomInfo[]>>(null)
  const containerRef = useRef<HTMLDivElement>()
  const dragAndScaleRef = useRef<DragAndScale>()
  const formRef = useRef<IFormInst<ICrashTrackSchForm> | null>(null)
  const formDataRef = useRef<ICrashTrackSchForm>()
  const runIndexRef = useRef(0)
  const runTimerRef = useRef(0)
  const playStateRef = useRef(false)
  const crashLenRef = useRef(0)
  const pageCountRef = useRef(0)
  const crashTrackDataRef = useRef<IBoostMQData[]>([])

  const [pointOFCBArr, setPointOFCBArr] = useState([]) // 该电气图包含ON/OFF/CB/TP/ARM所有的点

  const [pageInfo, setTotal, pagination, setPageInfo] = usePagination(PAGE_PARAMS)
  const total = useMemo(() => pagination.total, [pagination])
  useEffect(() => {
    return () => window.clearTimeout(runTimerRef.current)
  }, [])
  useEffect(() => {
    if (!containerRef.current || !svgPathInfo.stationCode || !svgPathInfo.svgName) {
      return () => dragAndScaleRef.current?.destory()
    }
    const containerDom = containerRef.current

    setBoostSvgDiagram(containerDom, svgPathInfo).then((infoMap) => {
      nodeField2DomMapRef.current = infoMap
      // console.log(containerDom, "containerDom", nodeField2DomMapRef.current)
      if (nodeField2DomMapRef.current) {
        dragAndScaleRef.current = new DragAndScale({ el: containerRef.current })
        const allPoint = getExitOnOffCbPoint(nodeField2DomMapRef.current || {}) || []
        setPointOFCBArr(allPoint)
      }
    })

    return () => dragAndScaleRef.current?.destory()
  }, [svgPathInfo])

  async function onSearch(formValue: ICrashTrackSchForm) {
    formDataRef.current = formValue
    formDataRef.current.devicePoint = pointOFCBArr
    runIndexRef.current = 0
    setTotal(0)
    setPageInfo((prevState) => ({ ...prevState, current: 1 }))
  }

  useEffect(() => {
    if (!formDataRef.current) return
    ;(async function () {
      setLoading(true)

      const { records, total } = await crashTrackSearch(pageInfo, formDataRef.current)
      setTotal(total)
      const prevLen = crashTrackDataRef.current.length
      crashTrackDataRef.current = records
      if (pageInfo.current > 1) {
        // 后续页数在原基础上添加
        crashTrackDataRef.current.splice(0, prevLen, ...records)
      }
      crashLenRef.current = crashTrackDataRef.current.length
      playTraceRef.current()
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo])

  pageCountRef.current = useMemo(() => Math.ceil(total / pageInfo.pageSize), [pageInfo.pageSize, total])

  const dealTraceRef = useRef(async () => {
    // 执行数据追忆
    if (!crashTrackDataRef.current?.length) refreshDiagramValue(nodeField2DomMapRef.current, null)
    if (!nodeField2DomMapRef.current || !crashTrackDataRef.current?.length) return
    const theData = crashTrackDataRef.current[runIndexRef.current] || null

    // if (!theData) return
    setCrashTime(theData.TimeStr)
    refreshDiagramValue(nodeField2DomMapRef.current, theData)
  })

  const validRunIndexRef = useRef(() => {
    // 验证追忆索引是否越界
    const isOverRight = runIndexRef.current > crashLenRef.current - 1
    // 已经是第一页，而且不是连播状态（手动向前）
    const isOverLeft = runIndexRef.current < 0 && !playStateRef.current
    return { isOver: isOverLeft || isOverRight, isOverLeft, isOverRight }
  })

  const jumpPageRef = useRef(() => {
    // 执行跳页
    const { isOver, isOverLeft } = validRunIndexRef.current()
    if (!isOver) return
    window.clearTimeout(runTimerRef.current)
    runIndexRef.current = 0
    setPageInfo((prevState) => {
      const addPage = isOverLeft ? -1 : 1
      const nextPage = prevState.current + addPage
      // 已经达到第一页或最后一页
      if (nextPage < 1 || nextPage > pageCountRef.current) {
        setPlayState(false)
        return prevState
      }
      return { ...prevState, current: nextPage }
    })
  })

  const doTraceRef = useRef(async () => {
    // 执行展示数据
    await dealTraceRef.current()
    // 要不要更新数据列表
    jumpPageRef.current()
  })

  playStateRef.current = playState
  const playTraceRef = useRef(() => {
    window.clearTimeout(runTimerRef.current)
    // 执行连续播放
    if (playStateRef.current) {
      runTimerRef.current = window.setTimeout(() => {
        runIndexRef.current += 1
        playTraceRef.current()
      }, 1200)
    }
    doTraceRef.current()
  })

  const playClickRef = useRef((type: "prev" | "play" | "next") => {
    if (type === "play") {
      window.clearTimeout(runTimerRef.current)
      return setPlayState((prevState) => {
        const isPlayState = (playStateRef.current = !prevState)
        if (isPlayState) playTraceRef.current()
        return isPlayState
      })
    }
    setPlayState(false)
    runIndexRef.current += type === "prev" ? -1 : 1
    doTraceRef.current()
  })

  function onFormAction(type: TCrashTrackFormAct) {
    if (type === "export") {
      setLoading(true)
      const formData = formRef.current?.getFormValues()
      formData.devicePoint = pointOFCBArr
      exportCrashTrackData(pageInfo, formData).then(() => setLoading(false))
    }
  }

  const onSchValueChgRef = useCallback(
    async (changedValue: Partial<ICrashTrackSchForm>) => {
      // setLoading(true)
      const cfgMap = await dealCrashTrackFormChange(changedValue, formRef, setSvgPathInfo, formItemConfig)
      setFormItemConfig((prevState) => ({ ...prevState, ...cfgMap }))
      // setLoading(false)
    },
    [formItemConfig],
  )

  return (
    <div className="page-wrap aly-crash">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        formOptions={{ onValuesChange: onSchValueChgRef }}
        itemOptions={CRASH_TRACK_FORM_ITEMS}
        buttons={CRASH_TRACK_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <div className="page-wrap site-boost-wrap">
        <div className="site-info-box">
          <CardTitle children={svgPathInfo.stationName} />
          {svgPathInfo.svgName === "main" ? <span className="img-name" children="主接线图" /> : null}
          {total ? <Pagination simple size="small" {...pagination} /> : null}
          {crashTime ? <span children={`时间点：${crashTime}`} /> : null}
          <PlayButton status={playState} disabled={loading} onClick={playClickRef.current} />
        </div>
        <div className="l-full container-wrap">
          <div ref={containerRef} className="container" />
        </div>
      </div>
    </div>
  )
}
