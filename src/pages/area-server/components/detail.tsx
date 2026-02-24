/**
 * 详情页面
 */
import "./detail.less"
import { useState, useEffect, useMemo } from "react"
import { Progress, Table } from "antd"
import {
  DatabaseOutlined,
} from '@ant-design/icons';
import { green, orange, red } from '@ant-design/colors';
import ChartRender from "@/components/chart-render"
import CustomTable from "@/components/custom-table"
import { use } from "echarts";
import { calc } from "antd/es/theme/internal";
import { doBaseServer } from "@/api/serve-funs";
import cpu from "@/assets/server/cpu.png"
import cpu_inner from "@/assets/server/cpu_inner.png"
import disk_inner from "@/assets/server/disk_inner.png"
import mem_inner from "@/assets/server/mem_inner.png"
import mem from "@/assets/server/mem.png"
import chartImg from "@/assets/server/chart.png"
import tableImg from "@/assets/server/table.png"
import type { ProgressProps } from 'antd';

import {
  CPU_COLUMNS,
  MEM_COLUMNS,
  DISK_COLUMNS,
} from "../config"
import { truncate } from "fs";
export default function serverDetail(prop) { 
    // const [options, setOptions] = useState([])
    const [baseInfo, setBaseInfo] = useState({
        basic: {
        }, 
        latest: {
            cpuCores: 0,
            sysTime: '',
            memTotal: 0,
            uptime: '',
            iowait: '',
            cpuUsage: 0,
            memUsage: 0,
            diskRootUsage: 0,
            diskAppsUsage: 0,
            diskDataUsage: 0,
        }})
    const [times, setTimes] = useState([])
    const [cpuUsage, setCpuUsage] = useState([])
    const [cpuUsageData, setCpuUsageData] = useState([])
    const [memUsage, setMemUsage] = useState([])
    const [memUsageData, setMemUsageData] = useState([])
    const [diskRootUsage, setDiskRootUsage] = useState([])
    const [diskAppsUsage, setDiskAppsUsage] = useState([])
    const [diskDataUsage, setDiskDataUsage] = useState([])
    const [diskRootUsageData, setDiskRootUsageData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isShowTableCpu, setIsShowTableCpu] = useState(true)
    const [isShowTableMem, setIsShowTableMem] = useState(true)
    const [isShowTableDisk, setIsShowTableDisk] = useState(true)

    const stepsColor = [green[6], green[6], green[6], green[6], green[6], green[6], green[6], orange[5], red[5], red[7]]

    const conicColors: ProgressProps['strokeColor'] = {
    '0%': '#1df8ed',
    '50%': '#74c904',
    '100%': '#fc1803',
    };
    const { detail } = prop
    const serverDetail = async() => {
        if (isLoading) return
        setIsLoading(true)
        try {
            const res = await doBaseServer('detail', { monitorId: detail.id })
            const res1 = await doBaseServer('trend', { monitorId: detail.id })
            if(res.data) {
                setBaseInfo(res.data)
                setCpuUsageData([{
                    name: 'CPU使用率',
                    cpuUsage: res.data.latest.cpuUsage,
                    key: 'cpuUsage',
                }])
                setMemUsageData([{
                    name: '内存',
                    memTotal: res.data.latest.memTotal,
                    memUsage: res.data.latest.memUsage,
                    memAvailable: res.data.latest.memAvailable,
                    memUsed: res.data.latest.memUsed,
                    Key: 'memUsage',
                }])
                setDiskRootUsageData([{
                    name: '/',
                    total: res.data.latest.diskRootTotal,
                    used: res.data.latest.diskRootUsed,
                    free: res.data.latest.diskRootFree,
                    usage: res.data.latest.diskRootUsage,
                    Key: 'diskRootUsage',
                }, {
                    name: '/apps',
                    total: res.data.latest.diskAppsTotal,
                    used: res.data.latest.diskAppsUsed,
                    free: res.data.latest.diskAppsFree,
                    usage: res.data.latest.diskAppsUsage,
                    Key: 'diskAppsUsage',
                }, {
                    name: '/data',
                    total: res.data.latest.diskDataTotal,
                    used: res.data.latest.diskDataUsed,
                    free: res.data.latest.diskDataFree,
                    usage: res.data.latest.diskDataUsage,
                    Key: 'diskDataUsage',
                }
                ])
            }
            if(res1.data) {
                setTimes(res1.data&&res1.data.times || [])
                setCpuUsage(res1.data.cpuUsage)
                setMemUsage(res1.data.memUsage)
                setDiskRootUsage(res1.data.diskRootUsage)//根目录磁盘使用率
                setDiskAppsUsage(res1.data.diskAppsUsage)//应用目录磁盘使用率
                setDiskDataUsage(res1.data.diskDataUsage)//数据目录磁盘使用率
            }
        } finally {
            setIsLoading(false)
        }
    }

    const getBaseOption = (timesData: any[]) => ({
        grid: {
            top: '10%',
            right: '3%',
            bottom: '10%',
            left: '3%',
            containLabel: true
        },
        dataZoom: [
            {
                type: 'inside',
                show: true,
                xAxisIndex: 0,
                start: 0,
                end: 100,
                zoomOnMouseWheel: true,
                moveOnMouseMove: true,
                zoomLock: false
            },
        ],
    })
const cpuOption = useMemo(() => {
    const baseOption = getBaseOption(times);
    return {
        ...baseOption,
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                if (!params || params.length === 0) return '';
                const dataIndex = params[0].dataIndex;
                const time = times[dataIndex];
                if (!time) return '';
                const date = new Date(time);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}:${seconds}`;
                let result = `时间：${formattedTime}<br/>`;
                params.forEach(param => {
                    result += `使用率：${param.value}%<br/>`;
                });
                return result;
            }
        },
        xAxis: {
            type: 'category',
            interval: 5,
            axisLabel:{
                formatter: (value,index) => {
                    const date = new Date(times[index]);
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    const seconds = date.getSeconds().toString().padStart(2, '0');
                    return `${hours}:${minutes}:${seconds}`
                },
                color: '#fff',
            },
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                formatter: (value,index) => {
                    return `${value}%`
                },
                color: '#fff',
            }
        },
        series: [
            {
                data: cpuUsage,
                type: 'line'
            }
        ],
    };
}, [times,diskRootUsage, diskAppsUsage, diskDataUsage]);

// 内存图表配置
const memoryOption = useMemo(() => {
  const baseOption = getBaseOption(times);
  return {
    ...baseOption,
    tooltip: {
        trigger: 'axis',
        formatter: (params) => {
            if (!params || params.length === 0) return '';
                const dataIndex = params[0].dataIndex;
                const time = times[dataIndex];
                if (!time) return '';
                const date = new Date(time);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}:${seconds}`;
                let result = `时间：${formattedTime}<br/>`;
                params.forEach(param => {
                    result += `使用内存：${param.value}%<br/>`;
                });
                return result;
        }
    },
    xAxis: {
        type: 'category',
        interval: 5,
        axisLabel:{
            formatter: (value,index) => {
                const date = new Date(times[index]);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`
            },
            color: '#fff',
        },
    },
    yAxis: {
        type: 'value',
        axisLabel:{
            formatter: (value,index) => {
                return `${value}%`
            },
            color: '#fff',
        }
    },
    series: [
        {
            data: memUsage,
            type: 'line'
        }
    ],
  };
}, [times,diskRootUsage, diskAppsUsage, diskDataUsage]);

// 磁盘图表配置
const diskOption = useMemo(() => {
  const baseOption = getBaseOption(times);
  return {
    ...baseOption,
    tooltip: {
        trigger: 'axis',
        formatter: (params) => {
            if (!params || params.length === 0) return '';
                const dataIndex = params[0].dataIndex;
                const time = times[dataIndex];
                if (!time) return '';
                const date = new Date(time);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}:${seconds}`;
                let result = `时间：${formattedTime}<br/>`;
                params.forEach((param,index) => {
                    result += `${index==0?'根目录':index==1?'应用目录':'数据目录'}使用率：${param.value}%<br/>`;
                });
                return result;
        }
    },
    xAxis: {
        type: 'category',
        interval: 5,
        axisLabel:{
            formatter: (value,index) => {
                const date = new Date(times[index]);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`
            },
            color: '#fff',
        },
    },
    yAxis: {
        type: 'value',
        axisLabel:{
            formatter: (value,index) => {
                return `${value}%`
            },
            color: '#fff',
        }
    },
    series: [
        {
            data: diskRootUsage,
            type: 'line'
        },
        {
            data: diskAppsUsage,
            type: 'line'
        },
        {
            data: diskDataUsage,
            type: 'line'
        },
    ],
  };
}, [times,diskRootUsage, diskAppsUsage, diskDataUsage]);

    useEffect(() => {

    },[detail,times])

    useEffect(() => {
        serverDetail()
        const intervalId = setInterval(() => {
            serverDetail()
        }, 10000)
        return () => {
            clearInterval(intervalId);
        }
    }, [detail])
    let time = useMemo(() => {
        let timeUnits = {
            days: 0,
            hours: 0,
            minutes: 0,
            years: 0,
            months: 0
        }
        const regex = /(\d+)\s*(day|hour|minute|month|year)s?/g
        let match
        while ((match = regex.exec(baseInfo.latest.uptime)) !== null) {
            const value = parseInt(match[1]);
            const unit = match[2]
            switch (unit) {
            case 'year':
                timeUnits.years = value;
                break;
            case 'month':
                timeUnits.months = value;
                break;
            case 'day':
                timeUnits.days = value;
                break;
            case 'hour':
                timeUnits.hours = value;
                break;
            case 'minute':
                timeUnits.minutes = value;
                break;
            }
        }
        console.log(timeUnits,'==timeUnits==')
        return timeUnits
    },[baseInfo.latest.uptime])
    return (
        <>
        <div className="top-info">
            运行时间
            <span className="time">
                {time.years.toString().split('').map(item=><span className="time-slice">{item}</span>)}
            </span>year 
            <span className="time">
                {time.days.toString().split('').map(item=><span className="time-slice">{item}</span>)}
            </span>days 
            <span className="time">
                {time.hours.toString().split('').map(item=><span className="time-slice">{item}</span>)}
            </span>hours 
            <span className="time">
                {time.minutes.toString().split('').map(item=><span className="time-slice">{item}</span>)}
            </span>minutes
            
             <span className="time-line"> | </span>
             系统时间：{new Date(baseInfo.latest.sysTime).toLocaleString('zh-CN').replace(/[/]/g, '-')}
        </div>
        <div className="base-info module-info">
            <div className="left">
                <div className="info-item">
                    <div className="item-info-l">
                        <div className="item-title">总内存</div>
                        <div className="item-data">{baseInfo.latest.memTotal}G</div>
                    </div>
                    <div className="item-info-r">
                        <img src={mem} alt="" />
                    </div>
                </div>
                <div className="info-item">
                    <div className="item-info-l">
                        <div className="item-title">CPU核数</div>
                        <div className="item-data">{baseInfo.latest.cpuCores}个</div>
                    </div>
                    <div className="item-info-r">
                        <img src={cpu} alt="" />
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="info-item">
                    <div className="item-info-l">
                        <div className="item-title">总CPU使用率</div>
                        <div className="item-data">{baseInfo.latest.cpuUsage}%</div>
                    </div>
                    <div className="item-info-r">
                        <div className="progress-center-icon">
                            <img src={cpu_inner} alt="cpu" />
                        </div>
                        <Progress type="circle" steps={10} percent={baseInfo.latest.cpuUsage} size={[50, 250]} strokeWidth={14} strokeColor={conicColors} trailColor="#fdfdfd2a"/>
                        
                    </div>
                </div>
                <div className="info-item">
                    <div className="item-info-l">
                        <div className="item-title">内存使用率</div>
                        <div className="item-data">{baseInfo.latest.memUsage}%</div>
                    </div>
                    <div className="item-info-r">
                        <Progress type="circle" steps={10} percent={baseInfo.latest.memUsage} size={[50, 150]} strokeWidth={14} strokeColor={conicColors} trailColor="#fdfdfd2a"/>
                        <div className="progress-center-icon">
                            <img src={mem_inner} alt="disk" />
                        </div>
                    </div>
                </div>
                <div className="info-item">
                    <div className="item-info-l">
                        <div className="item-title">根目录磁盘使用率</div>
                        <div className="item-data">{baseInfo.latest.diskRootUsage}%</div>
                    </div>
                    <div className="item-info-r">
                        <Progress type="circle" steps={10} percent={baseInfo.latest.diskRootUsage} size={[50, 150]} strokeWidth={14} strokeColor={conicColors} trailColor="#fdfdfd2a"/>
                        <div className="progress-center-icon">
                            <img src={disk_inner} alt="disk" />
                        </div>
                    </div>
                </div>
                <div className="info-item">
                    <div className="item-info-l">
                        <div className="item-title">应用目录磁盘使用率</div>
                        <div className="item-data">{baseInfo.latest.diskAppsUsage}%</div>
                    </div>
                    <div className="item-info-r">
                        <Progress type="circle" steps={10} percent={baseInfo.latest.diskAppsUsage} size={[50, 150]} strokeWidth={14} strokeColor={conicColors} trailColor="#fdfdfd2a"/>
                        <div className="progress-center-icon">
                            <img src={disk_inner} alt="disk" />
                        </div>
                    </div>
                </div>
                <div className="info-item">
                    <div className="item-info-l">
                        <div className="item-title">数据目录磁盘使用率</div>
                        <div className="item-data">{baseInfo.latest.diskDataUsage}%</div>
                    </div>
                    <div className="item-info-r">
                        <Progress type="circle" steps={10} percent={baseInfo.latest.diskDataUsage} size={[50, 150]} strokeWidth={14} strokeColor={conicColors} trailColor="#fdfdfd2a"/>
                        <div className="progress-center-icon">
                            <img src={disk_inner} alt="disk" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="server-detail-module">
            <div className="cpu module-info">
                <div className="module-title">
                    <span className="title">
                        <DatabaseOutlined  style={{fontSize: '18px'}} />
                        <span className="title-text">  CPU使用率</span>
                    </span>
                    <span className="toggle-btn-box">
                        <span className={`toggle-btn ${isShowTableCpu ? 'toggle-btn-visible' : ''}`} onClick={() => setIsShowTableCpu(true)}>
                            <img src={chartImg} alt="" />
                        </span>
                        <span className={`toggle-btn ${!isShowTableCpu ? 'toggle-btn-visible' : ''}`} onClick={() => setIsShowTableCpu(false)}>
                            <img src={tableImg} alt="" />
                        </span>
                    </span>
                </div>
                {isShowTableCpu && (
                    <div className="chart-box" style={{width: '100%',}}>
                        <ChartRender loading={false} option={cpuOption} style={{ height: '200px' }}/>
                    </div>
                )}
                {!isShowTableCpu && (
                    <div style={{width: '100%',height: ''}}>
                        <Table 
                            columns={CPU_COLUMNS}
                            dataSource={cpuUsageData}
                            pagination={false}
                        />
                    </div>
                )}
            </div>
            <div className="memory module-info">
                <div className="module-title">
                    <span className="title">
                        <DatabaseOutlined  style={{fontSize: '18px'}} />
                        <span className="title-text">  内存信息</span>
                    </span>
                    <span className="toggle-btn-box">
                        <span className={`toggle-btn ${isShowTableMem ? 'toggle-btn-visible' : ''}`} onClick={() => setIsShowTableMem(true)}>
                            <img src={chartImg} alt="" />
                        </span>
                        <span className={`toggle-btn ${!isShowTableMem ? 'toggle-btn-visible' : ''}`} onClick={() => setIsShowTableMem(false)}>
                            <img src={tableImg} alt="" />
                        </span>
                    </span>
                </div>
                {isShowTableMem && (
                    <div className="chart-box" style={{width: '100%',height: ''}}>
                        <ChartRender loading={false} option={memoryOption} style={{ height: '200px' }}/>
                    </div>
                )}
                {!isShowTableMem && (
                    <div style={{width: '100%',height: ''}}>
                        <Table columns={MEM_COLUMNS}
                            dataSource={memUsageData}
                            pagination={false}/>
                    </div>
                )}
            </div>
            <div className="disk module-info">
                <div className="module-title">
                    <span className="title">
                        <DatabaseOutlined  style={{fontSize: '18px'}} />
                        <span className="title-text">  磁盘使用率</span>
                    </span>
                    <span className="toggle-btn-box">
                        <span className={`toggle-btn ${isShowTableDisk ? 'toggle-btn-visible' : ''}`} onClick={() => setIsShowTableDisk(true)}>
                            <img src={chartImg} alt="" />
                        </span>
                        <span className={`toggle-btn ${!isShowTableDisk ? 'toggle-btn-visible' : ''}`} onClick={() => setIsShowTableDisk(false)}>
                            <img src={tableImg} alt="" />
                        </span>
                    </span>
                </div>
                {isShowTableDisk && (
                    <div className="chart-box" style={{width: '100%',height: ''}}>
                        <ChartRender loading={false} option={diskOption} style={{ height: '200px' }}/>
                    </div>
                )}
                {!isShowTableDisk && (
                    <div style={{width: '100%',height: ''}}>
                        <Table columns={DISK_COLUMNS}
                            dataSource={diskRootUsageData}
                            pagination={false}/>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}