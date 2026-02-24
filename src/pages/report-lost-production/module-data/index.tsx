import './index.less';
import AreaStateList from "../../area-state-overview-v2/components/state-list/index.tsx"
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { TDeviceType } from "@/types/i-config"
import useRun4deviceData from "@/hooks/use-run-4device-data-test"
import { TDvsTypeRunData4MQ } from "@/types/i-device.ts"
import { useAtom, useAtomValue } from "jotai"
import { AtomConfigMap } from "@store/atom-config.ts"
import AtomRun4DvsData from "@store/atom-run-device.ts"
import useMqttData from "@hooks/use-mqtt-data.ts"
import { DEVICE_POINT_DATA_WS_TOPIC } from "@configs/mqtt-info.ts"
import { parseNum } from "@/utils/util-funs"

import useChartRender from "@hooks/use-chart-render.ts"
import ChartRender from "@/components/chart-render"
import { IBaseChartProps } from "@/types/i-page.ts"

import { doBaseServer } from "@/api/serve-funs"

import { setDvsRunDataStateInfo } from "@hooks/use-matrix-device-list.ts"
import { color, use } from 'echarts';

interface IParams {
  isStart: boolean
  deviceType: TDeviceType
  deviceTypeList?: TDeviceType[]
  treeData: any
  pagination: any
  getFormData?: () => any;
}
function getDvsWsTopicMap(deviceTypeList: IParams["deviceTypeList"]) {
  if (!deviceTypeList?.length) return DEVICE_POINT_DATA_WS_TOPIC
  return deviceTypeList.reduce(
    (prev, next) => {
      prev[next] = DEVICE_POINT_DATA_WS_TOPIC[next]
      return prev
    },
    {} as typeof DEVICE_POINT_DATA_WS_TOPIC,
  )
}
const getDeviceStates = async () => {
      const res = await doBaseServer("deviceStdNewState")
      return res
}
export default function moduleData(params: IParams) {
    const [activeKey, setActiveKey] = useState<TDeviceType>("WT")
    const [chooseAll, setChooseAll] = useState(false)
    const [activeStateKey, setActiveStateKey] = useState([])
    const [deviceState, setDeviceState] = useState([])
      const [run4Device, setRun4Device] = useAtom(AtomRun4DvsData)
    const { isStart, getFormData, deviceType, deviceTypeList, pagination, treeData } = params
//   const [selectGroupByPath, setSelectGroupByPath] = useState<TRpXDataItem>("STATION_CODE")
    // setActiveKey(deviceType)
    const [zoomStart, setZoomStart] = useState(0);
    const [zoomStartX, setZoomStartX] = useState(0);
    const [zoomEnd, setZoomEnd] = useState(100);
    const [zoomEndX, setZoomEndX] = useState(100);
    const [hours, setHours] = useState(24)

    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (getFormData) {
            const data = getFormData();
            console.log('获取到的表单数据:', data);
            setFormData(data);
        }
    }, [getFormData]);
    useEffect(() => {
        const data = getFormData();
        setActiveKey(data.deviceType)
        
    }, [getFormData])


    const { deviceStdNewStateMap } = useAtomValue(AtomConfigMap).map
      const dvsStdNewStateMapRef = useRef(deviceStdNewStateMap)
      dvsStdNewStateMapRef.current = deviceStdNewStateMap
    const mqttCallbackRef = useRef((type: TDeviceType, data: unknown) => {
        Object.values((data || {}) as TDvsTypeRunData4MQ).forEach((item) => {
          setDvsRunDataStateInfo(dvsStdNewStateMapRef.current, type, item, "new")
        })
    
        setRun4Device({ type, data: (data || {}) as TDvsTypeRunData4MQ })
        
    })
      const topicMapRef = useMemo(() => getDvsWsTopicMap(deviceTypeList), [deviceTypeList])
    
      const { setStartMqtt } = useMqttData({ topicMap: topicMapRef, callbackRef: mqttCallbackRef })
    

    const runParams = useMemo(() => {
        return { isStart: true, deviceTypeList: [activeKey] }
    }, [activeKey])
    // const { run4Device } = useRun4deviceData(runParams)
    const [deviceData, setDeviceData] = useState({})

    // const actualUnEmptyDevStation = useMemo(() => {
    //     return currntStationList.filter((i) => deviceData[i.id]?.length)
    // }, [currntStationList, deviceData])

    const combine = useMemo(() => {
        if (!deviceData && !Object.keys(deviceData).length) return []
        let allDeviceList = []
        Object.keys(deviceData).forEach((i) => (allDeviceList = allDeviceList.concat(deviceData[i])))
    
        const run = run4Device[activeKey]
        allDeviceList = allDeviceList.map((i) => {
          return {
            ...i,
            runData: run?.[i.deviceCode] || {},
          }
        })
        return allDeviceList
      }, [run4Device, deviceData])
    useEffect(() => {
        getDeviceStates().then(res => {
            let mainItems  = []
            res.length && res.forEach(item => {
                if(item.stateType == 'MAIN') {
                    mainItems .push({...item, children: []})
                }
            })
            res.length && res.forEach(item => {
                if(item.stateType == 'SUB') {
                    let target = mainItems .find(j => j.id == item.parentId)
                    if(target) {
                        target.children.push(item)
                    }
                }
            })
            setDeviceState(mainItems );
        }).catch(error => {
            console.error("获取设备状态失败:", error);
        });
    }, []);
    useEffect(() => {
        console.log('deviceState updated&&formData:', deviceState, formData);
    }, [deviceState]);
    

// 在组件顶部添加场站数据处理函数
const chartRef = useRef()
const chartData = useMemo(() => { 
    const stationNames = treeData.map((item: any) => (item.stationName +  (item.deviceName ? item.deviceName : '')));
    return [...new Set(stationNames)];
}, [treeData]);


function fillMissingTimeSlots(data, dayStartStr, dayEndStr) {
  const dayStart = new Date(dayStartStr).getTime();
  const dayEnd = new Date(dayEndStr).getTime();
  //遍历data，过滤出在时间段以内的数据
  const filteredData = data.filter(item => {
    const itemStart = new Date(item.startTime).getTime();
    const itemEnd = new Date(item.endTime).getTime();
    return itemStart >= dayStart && itemEnd <= dayEnd;
  });
  if (filteredData.length === 0) {
    return [createMissingSlot(dayStart, dayEnd)];
  }
  
  // 按开始时间排序
  const sortedData = filteredData.sort((a, b) => a.startTimeLong - b.startTimeLong);
  const result = [];
  
  let currentTime = dayStart;
  let currentObj = {}
  
  // 处理每个数据段
  sortedData.forEach(slot => {
    const slotStart = slot.startTimeLong;
    const slotEnd = slot.endTimeLong;
    
    // 添加缺失时段（如果有）
    if (currentTime < slotStart) {
      result.push(createMissingSlot(currentTime, slotStart));
    }
    
    // 添加数据段
    result.push({ ...slot, isMissing: false });
    
    // 更新当前时间到数据段结束时间
    currentTime = Math.max(currentTime, slotEnd);
    currentObj = slot
  });

  // 添加最后的缺失时段
  if (currentTime < dayEnd) {
    result.push(createMissingSlot(currentTime, dayEnd));
  }
  return result;
}

// 创建缺失时间段的模板对象
function createMissingSlot(startTimeLong, endTimeLong) {
  const duration = (endTimeLong - startTimeLong) / (1000 * 60 * 60); // 转换为小时
  return {
    stationName: "缺失时段",
    deviceName: "N/A",
    mainStateName: "无数据",
    subStateName: "数据缺失",
    startTime: formatTime(new Date(startTimeLong)),
    endTime: formatTime(new Date(endTimeLong)),
    duration: duration,
    durationLen: parseNum((duration / hours)* 100, 3),
    color: "#2b2b2b8e",
    totalLossProduction: 0,
    windSpeedAvg: 0,
    deviceCode: "MISSING",
    stationCode: "MISSING",
    startTimeLong: startTimeLong,
    endTimeLong: endTimeLong,
    mainState: 2,
    subState: 6,
    activePower: 0,
    isMissing: true
  };
}

function formatTime(date) {
  return date.toLocaleString('zh-CN', { 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-');
}
const handleSeriesData = useMemo(() => {
    //重新整合数据，把stationName，deviceName相同的数据放到一个数组中，
    const seriesData = treeData.reduce((acc, cur) => {
        const key = `${cur.stationName}${cur.deviceName}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        // acc[key].push(cur);
        acc[key].push({
            ...cur,
            durationLen: parseNum((parseNum(cur.duration, 3) / parseNum(hours,2)) * 100, 3),
        });
        return acc;
    }, {});
    const getColorByIndex = (subState: string) => {
        if (!subState || !deviceState || deviceState.length === 0) {
            return '#ccc'; // 默认颜色
        }
        let colors = []
        deviceState.forEach((i) => {
            if(i.stateType == 'MAIN') {
                colors.push({
                    state: i.state,
                    deviceType: i.deviceType,
                    color: i.color
                })
            }
        })
        let target = colors.find(i => i.deviceType == activeKey && i.state == subState)
        return target ? target.color : '#ccc'
    };
    let groupedData = Object.values(seriesData) as any[];
    groupedData.forEach(item => {
        item.forEach((i:any) => {
            i.color= getColorByIndex(i.mainState)
        })
    })

    //todo:进一步处理并插入缺失时间片段数据
        // console.log('getFormData===', getFormData)

    const dayStart = formData?.dateRange[0]?.format('YYYY-MM-DD HH:mm:ss');
    const dayEnd = formData?.dateRange[1]?.format('YYYY-MM-DD HH:mm:ss');
    
    console.log('date===',dayStart, dayEnd,formData?.dateRange)

    // 使用方法一填充缺失时段
    let formatData = []
    groupedData.forEach(item => {
        formatData.push([...fillMissingTimeSlots(item, dayStart, dayEnd)])
    })

    if (formatData.length === 0) return []

    const resultArrays = groupedData[0].map((_, colIndex) => 
        groupedData.map(row => row[colIndex])
    );
    const resultArraysEx = formatData[0].map((_, colIndex) => 
        formatData.map(row => row[colIndex])
    );
        // console.log('formatData===',formatData,resultArraysEx);

    const series = resultArraysEx.map((items, index) => {
        // 过滤掉空值并提取有效数据
        const validItems = items.filter(item => item !== undefined);

        // 获取该时间片的状态名称（假设同个时间片内所有设备的状态相同）
        const firstValidItem = validItems[0];
        const isMissing = firstValidItem?.isMissing;
        return {
            name: validItems[0]?.subState || `记录${index + 1}`,
            type: 'bar',
            stack: 'total',
            data: validItems.map(item => ({
                value: parseFloat(item?.durationLen) || 0, // 用 duration 控制长度
                ...item
            })),
            itemStyle: {  
                color: (params) => {
                    return params.data.color;
                }
            },
            emphasis: {
                // focus: 'series'
            },
            label: {
                show: true,
                formatter: (params) => {
                    if (params.data.isMissing) {
                        return '';
                    }
                    return params.data.subState || '';
                }
            }
        };
    });
    console.log('======resultArrays', series)

  return series;
}, [treeData, deviceState, formData])

const handleXAxisData = useMemo(() => {
    const dayStart = formData?.dateRange[0]?.format('YYYY-MM-DD HH:mm:ss');
    const dayEnd = formData?.dateRange[1]?.format('YYYY-MM-DD HH:mm:ss');
    
    const dayStartLong = new Date(dayStart).getTime();
    const dayEndLong = new Date(dayEnd).getTime();
    const xAxisData = [];
    let diffHours = (dayEndLong - dayStartLong) / (1000 * 60 * 60);

    if(['1','2'].includes(formData?.isGroupByStationOrDeviceCode)) {
        const seriesData = treeData.reduce((acc, cur) => {
            const key = `${cur.stationName}${cur.deviceName}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push({
                ...cur,
                durationLen: parseNum((parseNum(Number(cur.duration), 3) / hours) * 100, 3),
            });
            return acc;
        }, {});
        //遍历每个场站数据，把同一个场站下的不同数据的时间相加，找出最长的时间
        const seriesDataEx = Object.values(seriesData) as any[];
        let maxDuration = seriesDataEx.reduce((max, item) => {
            const totalDuration = item.reduce((sum, subItem) => sum + parseFloat(subItem.duration), 0);
            return Math.max(max, totalDuration);
        }, 0);
        diffHours = parseNum(maxDuration, 2);
        setHours(diffHours)
        return {
            hours: diffHours,
            xAxisData: []
        }
    }

    const interval = 4; // 4小时间隔
    const totalIntervals = Math.floor(diffHours / interval);
    //如果时间跨度大于1天，则按照1天为间隔显示时间轴，从开始时间开始到结束时间结束
    if (diffHours > 24) {
        // const totalDays = Math.round(diffHours / 24);
        // for (let i = 0; i <= totalDays; i++) {
        //     const date = new Date(dayStartLong + i * 24 * 60 * 60 * 1000);
        //     xAxisData.push(date.toLocaleDateString('zh-CN'));
        // }
        //优化为4小时为间隔显示时间轴
        for (let i = 0; i <= totalIntervals; i++) {
            const time = new Date(dayStartLong + i * interval * 60 * 60 * 1000);
            // 格式化时间显示
            const timeString = time.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(/\//g, '-');
            xAxisData.push(timeString);
        }
        
        // 确保结束时间被包含
        const lastTime = new Date(dayEndLong);
        const lastTimeString = lastTime.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-');
        
        // 避免重复添加相同时间点
        if (xAxisData[xAxisData.length - 1] !== lastTimeString) {
            xAxisData.push(lastTimeString);
        }
    } else {
        for (let i = 0; i <= totalIntervals; i++) {
            const time = new Date(dayStartLong + i * interval * 60 * 60 * 1000);
            xAxisData.push(time.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            }));
        }
        // 确保最后一个时间点也被包含
        const lastTime = new Date(dayEndLong);
        const lastTimeString = lastTime.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        // 避免重复添加相同时间点
        if (xAxisData[xAxisData.length - 1] !== lastTimeString) {
            xAxisData.push(lastTimeString);
        }
    }
    console.log('xAxisData===',xAxisData,diffHours);
    setHours(diffHours)
    return {
        hours: diffHours,
        xAxisData: xAxisData,
    }
},[treeData, formData, hours])

let options = useMemo(() => ({
    tooltip: {
        trigger: 'item',
        axisPointer: { type: 'shadow' },
        alwaysShowContent: false,
        enterable: true ,
        formatter: (params, index) => {
            if (!params || params.length === 0) return '';
            try {
                const currentData = params.data;
                
                let tipHtml = `<strong>${currentData.stationName + (currentData.deviceName?currentData.deviceName:'')}</strong><br/>`;
                
                if (currentData && typeof currentData === 'object' && currentData !== null) {
                    if (currentData.startTime) {
                        tipHtml += `开始时间: ${currentData.startTime}<br/>`;
                    }
                    if (currentData.endTime) {
                        tipHtml += `结束时间: ${currentData.endTime}<br/>`;
                    }
                    if (currentData.mainStateName) {
                        tipHtml += `大状态: ${currentData.mainStateName}<br/>`;
                    }
                    if (currentData.subStateName) {
                        tipHtml += `小状态: ${currentData.subStateName}<br/>`;
                    }
                    if (currentData.duration !== undefined) {
                        tipHtml += `持续时长: ${parseNum(currentData.duration, 3)}h<br/>`;
                    }
                    if (currentData.totalLossProduction !== undefined) {
                        tipHtml += `损失电量: ${parseNum(currentData.totalLossProduction, 2)}kWh<br/>`;
                    }
                    if (currentData.activePower !== undefined) {
                        tipHtml += `平均功率: ${parseNum(currentData.activePower, 2)}kW<br/>`;
                    }
                    if (currentData.windSpeedAvg !== undefined) {
                        tipHtml += `平均风速: ${parseNum(currentData.windSpeedAvg, 2)}m/s<br/>`;
                    }
                }

            return tipHtml;
            } catch (error) {
                console.error('Tooltip formatter error:', error);
            return '数据加载中...';
            }
        }
    },
    legend: {
        data: []
    },
    grid: {
        top: '5%',
        right: '5%',
        bottom: '10%',
        left: '5%',
        containLabel: true
    },
    xAxis: [{
        position: 'top',
        type: 'value',
        show: ['1','2'].includes(formData?.isGroupByStationOrDeviceCode)?false:true,
        min: 0,
        max: 100,
        interval: ['1','2'].includes(formData?.isGroupByStationOrDeviceCode)?100/(handleXAxisData.hours/4):handleXAxisData.hours>0?100/(handleXAxisData.hours/4):16.67,
        // interval: 16.67, // 100% ÷ 6段 = 16.67%，对应4小时间隔
        axisLabel: 
                    //todo：根据查询的时间参数长度确定显示的时间间隔，大于24小时则显示整日日期，小于24小时则显示小时间隔
        {
            // formatter: function(value) {
            //     // 将 0-100% 映射到 0-24小时
            //     const hour = Math.round(value * 24 / 100);
            //     // 只显示4的倍数小时
            //     if (hour % 4 === 0) {
            //         return hour + ':00';
            //     }
            //     return '';
            // },
            
            formatter: (value,index) => {
                const labels = handleXAxisData.xAxisData;
                const hours = handleXAxisData.hours;
                            

                if (hours > 0) {
                    let days = Math.floor(hours / 24);
                    return labels[index] || value;
                } else {
                    // return labels[index] || value;
                const hour = Math.round(value * 24 / 100);
                // 只显示4的倍数小时
                if (hour % 4 === 0) {
                    return hour + ':00';
                }
                return '';

                }
            },
            color: '#fff',
            fontSize: 11,
            margin: 8
        },
        axisLine: {
            show: true,
            lineStyle: { 
                color: '#666',
                width: 1
            }
        },
        axisTick: {
            show: true,
            length: 6,
            alignWithLabel: true
        },
        splitLine: {
            show: true,
            lineStyle: { 
                color: '#e8e8e8',
                type: 'dashed'
            }
        }
    }],
    yAxis: {
        type: 'category',
        inverse: true,
        data: chartData,
        axisLabel: {
            fontSize: 12,
            color: '#fff',
            margin: 10,
            width: 150,
            overflow: 'truncate'
        },
        axisLine: { 
            show: false 
        },
        axisTick: { 
            show: false 
        }
    },
    //todo:相同场站相同设备的数据个数动态变化，需要所有数据分割处理后取最大长度(series的长度)，每一个模块的宽度为时间的长度(百分比)
    series: handleSeriesData,
    dataZoom: [
        {
            type: 'slider',
            show: true,
            yAxisIndex: 0,
            start: zoomStart,
            end: zoomEnd,
            realtime: true,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
        },
        {
            type: 'slider',
            show: true,
            xAxisIndex: 0,
            start: 0,
            end: 100,
            realtime: true,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
        },
    ],
}),[chartData, handleSeriesData, zoomStart, zoomEnd, zoomStartX, zoomEndX]);
const stateListRef = useRef(null)
const getStateListData = () => {
  return stateListRef.current
}

    const getActiveStateList = useCallback(
        (val) => {
            console.log('val===',val)
          setActiveStateKey(val)
        },
        [activeStateKey],
      )

    

    useEffect(() => {
        // 获取设备列表前不做处理
        setStartMqtt(isStart)
        console.log("run4Device===",run4Device,activeKey,activeStateKey)

        return () => {
        setStartMqtt(false)
        }
    }, [setStartMqtt, isStart])
    return (
        <div className={'module-data'}>
            <div className={"module-left"}>
                <AreaStateList 
                    deviceType={activeKey}
                    setState={getActiveStateList}
                    chooseAll={chooseAll}
                    combineData={combine}
                    dataRef={stateListRef}
                    showCount={false}
                />

            </div>
            <div className={"module-right"}>
                {['1', '2'].includes(formData?.isGroupByStationOrDeviceCode) ? 
                 (<div className={"top-tip"}>*图表所示为表格第{pagination.current}页{pagination.total}条数据聚合</div>) 
                : (<div></div>)}
                <ChartRender ref={chartRef} loading={false} option={options} style={{ width: '100%', height: '100%' }}/>

            </div>
        </div>
    )
}