
/*
* @Description: server模块
*/
import { useEffect, useMemo } from "react";
import "./server.less"
interface ServerModuleProps {
  detail: {
    ip?: string;
    color?: string;
    warnColor?: string,
    warnServers?: Array<string>,
    cpu?: string | number;
    [key: string]: any;
    type?: string;
  };
  onAction?: (detail: any) => void;
}
export default function serverMoudule(props: ServerModuleProps) {
  const { detail, onAction  } = props
  useEffect(() => {

  },[])
  let stationName = useMemo(() => {
    let stations = JSON.parse(localStorage.getItem('stationData')).stationList
    console.log(detail.servers,'detail')
    let target = {
        shortName: '',
    }
    if(detail.servers && detail.servers.length > 0) {
       target = stations.find(item => item.id == detail.servers[0].originId)
    }
    return target.shortName
  }, [detail])
  return (
    <>
        {
            detail.type !== 'station' ?
            (<div 
                className={`server-module ${detail.warnServers.includes(detail.ip+':'+detail.port) ? 'warn-state' : ''}`}
                style={{background: `linear-gradient(180deg,${detail.warnServers.includes(detail.ip+':'+detail.port)?'#FE524D80':detail.color}, transparent)`}} 
                onClick={() => onAction?.(detail)}
                >
                <div className="top-line" style={{backgroundColor: 'rgba(255,255,255,.3)'}}></div>
                <div className="server-content">
                    <div className="server-item" style={{}}>
                    {detail.originName || ''}
                    </div>
                </div>
                <div className="server-title">{detail.ip || 'ip'}</div>
            </div>)
            :
            (<div className="servers-module"
                >
                <div className="server-station">{stationName || 'ip'}</div>
                <div className="servers-block">
                    {detail.servers.map((item, index) => (
                        <div 
                            className={`server-module ${detail.warnServers.includes(item.ip+':'+item.port) ? 'warn-state' : ''}`} 
                            style={{background: `linear-gradient(180deg,${detail.warnServers.includes(item.ip+':'+item.port)?'#FE524D80':detail.color}, transparent)`}} 
                            onClick={() => onAction?.(item)}
                            >
                            <div className="top-line" style={{backgroundColor: 'rgba(255,255,255,.3)'}}></div>
                            <div className="server-content">
                                <div className="server-item" style={{}}>
                                    {item.originName }{item.deviceRole == '1' ? '(主)' : '(备)'}
                                </div>
                            </div>
                            <div className="server-title">{item.ip}</div>
                        </div>
                    ))}
                </div>
                
            </div>)
        }
    </>
  )
}