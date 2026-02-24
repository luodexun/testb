/*
 * @Description: 区域中心-系统监控
 */

import "./index.less"
import {
  DatabaseOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from "react"
import Server from "./components/server"
import Detail from "./components/detail"
import { Select, Button } from "antd"
import { doBaseServer } from "@/api/serve-funs"

export default function AreaServer(props) {
  const [isShowDetail, setIsShowDetail] = useState(false)
  const [serverList, setServerList] = useState([])
  const [currentServerData, setCurrentServerData] = useState<{id: string, label: string, value: string}>()
  const [regionServers, setRegionServers] = useState([])
  const [dataServers, setDataServers] = useState([])
  const [interfaceServers, setInterfaceServers] = useState([])
  const [stationServers, setStationServers] = useState([])
  const [warnServers, setWarnServers] = useState([])

  const handleServerAction = (detail) => {
    setIsShowDetail(true)
    setCurrentServerData(detail)
  }
  const handleChange = (value) => {
    let deviceData = serverList.find(item => item.id == value)
        console.log(`selected ${value}`,deviceData)
    setCurrentServerData(deviceData)
  }
  const getServerList = async () => {
    let res =  await doBaseServer('overview')
    let warnServer = [
      ...(res.data?.cpuWarnList || []).map(item => item.ip + ':' + item.port),
      ...(res.data?.diskWarnList || []).map(item => item.ip + ':' + item.port),
      ...(res.data?.memWarnList || []).map(item => item.ip + ':' + item.port),
      ...(res.data?.offlineList || []).map(item => item.ip + ':' + item.port),
    ]
    setWarnServers(warnServer)

  }
  const getQueryOrgInfo = async () => {
    let res = await doBaseServer('queryOrgInfo')
    if(res.data && Array.isArray(res.data)) {
      setRegionServers(res.data.filter(item => item.deviceType === 'region' && item.originName.includes('业务')))
      setDataServers(res.data.filter(item => item.deviceType === 'region' && item.originName.includes('数据')))
      setInterfaceServers(res.data.filter(item => item.deviceType === 'region' && item.originName.includes('接口')))
      let stationLis = res.data.filter(item => item.deviceType === 'station')
      let targetList = []
      const groupedItems: Record<string, any[]> = {};
      stationLis.forEach(item => {
        const key = item.originId;
        if (!groupedItems[key]) {
          groupedItems[key] = [];
        }
        groupedItems[key].push(item);
      })
      Object.values(groupedItems).forEach(group => {
        targetList.push(group);
      });
      setStationServers(targetList)

      setServerList(res.data.length && res.data.map(item => {
        return {
          ...item,
          label: item.originName+item.ip,
          value: item.id
        }
      }))
    } else {
      setRegionServers([])
      setDataServers([])
      setInterfaceServers([])
      setStationServers([])
    }
  }
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    if (loading) return // 避免重复请求
    setLoading(true)
    try {
      await Promise.all([
        getQueryOrgInfo(),
        getServerList()
      ])
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect( () => {
    fetchData()
    const intervalId = setInterval(() => {
      getQueryOrgInfo()
      getServerList()
    }, 10000)
    return () => {
      clearInterval(intervalId)
    }
  },[])

  return (
    <div className="l-full area-net-wrap">
      <div className="content-box">
        {!isShowDetail ? 
          <div className="server-box">  
            <div className="server-block-l">
              <div className="server-block">
                <div className="server-type">
                  <DatabaseOutlined  style={{fontSize: '18px'}} />
                  <span className="title-text">  业务服务器</span>
                </div>
                <div className="server-list">
                  {regionServers.map((server, index) => (
                    <Server 
                      key={server.id || index} 
                      detail={{
                        warnServers: warnServers,
                        ...server
                      }} 
                      onAction={handleServerAction} 
                    />
                  ))}
                </div>
              </div>
              <div className="server-block">
                <div className="server-type">
                  <DatabaseOutlined  style={{fontSize: '18px'}} />
                  <span className="title-text">  数据库服务器</span>
                </div>
                <div className="server-list">
                  {dataServers.map((server, index) => (
                    <Server 
                      key={server.id || index} 
                      detail={{
                        warnServers: warnServers,
                        ...server
                      }} 
                      onAction={handleServerAction} 
                    />
                  ))}
                </div>
              </div>
              <div className="server-block">
                <div className="server-type">
                  <DatabaseOutlined  style={{fontSize: '18px'}} />
                  <span className="title-text">  接口机服务器</span>
                </div>
                <div className="server-list">
                  {interfaceServers.map((server, index) => (
                    <Server 
                      key={server.id || index} 
                      detail={{
                        warnServers: warnServers,
                        ...server
                      }} 
                      onAction={handleServerAction} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="server-block-r">
              <div className="server-block">
                <div className="server-type">
                  <DatabaseOutlined  style={{fontSize: '18px'}} />
                  <span className="title-text">  场站服务器</span>
                </div>
                <div className="server-list">
                  {stationServers.map((server, index) => (
                    <Server 
                      key={server.id || index} 
                      detail={{
                        warnServers: warnServers,
                        type: 'station',
                        servers: server,
                      }} 
                      onAction={handleServerAction} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div> : 
          <div className="server-detail">
            <div className="top-btn">
              <Button type="primary" onClick={() => setIsShowDetail(false)}>返回</Button>
              <span className="server-type">服务器</span>
              <Select
                value={currentServerData.id}
                style={{ width: 240 }}
                onChange={handleChange}
                options={serverList}
              />
            </div>
            <div className="content">
              <Detail detail={currentServerData}/>
            </div>
          </div>
        }
        
      </div>
    </div>
  )
}
