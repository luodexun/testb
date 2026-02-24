
import { CaretRightOutlined } from "@ant-design/icons"
import { Select, TreeSelect } from "antd"
import { useEffect, useState, useMemo } from "react"
import { doBaseServer } from "../../api/serve-funs"

const findNodesById = (treeData, targetIds) => {
  let result = [];
  let target = []
  const findTarget = (treeData, targetIds) => {
    let result = [];
    treeData.length && treeData.forEach(node => { 
      if (targetIds.includes(node.id)) {
        result.push(node);
      } else if (node.children && node.children.length > 0) {
        const foundNodes = findTarget(node.children, targetIds);
        result = [...result, ...foundNodes];
      }
    });
    return result
  }
  result = findTarget(treeData, targetIds)
  
  //第二步
  let obj = {}
  for(let i of result) {
    if(i.parentId) {
      if(!obj[i.parentId]) {
        obj[i.parentId] = [];
      }
      obj[i.parentId].push(i);
    }
  }
  let mainKeys = Object.keys(obj)
  console.log('mainKeys',mainKeys)
  //第三步
  for(let j of treeData) {
    if(mainKeys.includes(j.id.toString())) {
      let isHave = target.some(item => item.id == j.id)
      console.log(isHave,'ishave')
      if(!isHave) {
        if(j.children.length == obj[j.id].length) {
        //相同返回父级
          target = [...target, j]
        } else {
          target = [...target, obj[j.id]]
        }
      }
    }
  }

  console.log("result======~~~~", treeData,result, obj,target)

  return target;
};

// 从节点中提取state值
const extractStatesFromNodes = (nodes) => {
  let handleNodes = []
  let isHaveSub = false
  nodes.length && nodes.forEach(item => { 
    if(item.stateType == 'SUB') {
      isHaveSub = true
    }
    if(item.length) {
      item.forEach(subItem => {
        if(subItem.stateType == 'SUB') {
          isHaveSub = true
        }
      })
    }
  })
  if(isHaveSub) {
    nodes.length && nodes.forEach(item => {
      if(item.stateType == 'MAIN') {
        handleNodes.push(...item.children)
      } else {
        item.length && item.forEach(subItem => {
            handleNodes.push(subItem)
        })
      }
    })
  } else {
    handleNodes = nodes
  }
  console.log('handleNodes', handleNodes)
  return {
    type: handleNodes[0]?.stateType,
    states:handleNodes.map(node => node.state).filter(Boolean)
  }
}
const getDeviceStates = async () => {
      const res = await doBaseServer("deviceStdNewState")
      return res
}
export default function SelectDeviceState(props) {
  const { value, setValue, allowClear = true, mode, onChange, options, labelInValue, style, needFirst, deviceType, ...selectProps } = props || {}
  
  const [deviceState, setDeviceState] = useState([])
  useEffect(() => {
    const fetchDeviceStates = async () => {
      getDeviceStates().then(res => {
          let mainItems  = []
          res.length && res.forEach(item => {
              if(item.stateType == 'MAIN') {
                  mainItems.push({...item, children: []})
              }
          })
          res.length && res.forEach(item => {
              if(item.stateType == 'SUB') {
                  let target = mainItems.find(j => j.id == item.parentId)
                  if(target) {
                      target.children.push(item)
                  }
              }
          })

          const processNode = (node: any) => {
            const processedNode = {
              ...node,
              title: node.stateDesc,
              value: node.id,
              key: node.id,
            };
            
            // 如果有 children，递归处理每个子节点
            if (node.children && node.children.length > 0) {
              processedNode.children = node.children.map(processNode);
            }
            
            return processedNode;
          };
          

          setDeviceState(mainItems.map(processNode).filter(item => item.deviceType == deviceType) );

      }).catch(error => {
          console.error("获取设备状态失败:", error);
      });
    };

    fetchDeviceStates();
  }, [deviceType]);

    // 处理选择变化
  const handleChange = (selectedValues, selectedOptions, extra) => {
    // 直接返回选中的值，不包含父节点
    if (selectedValues) {
      // 如果selectedValues是数组（多选情况）
      const targetIds = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
      console.log('find target===',deviceState, targetIds)
      // 查找所有匹配的节点
      const matchedNodes = findNodesById(deviceState, targetIds);
      
      // 提取state值
      const {type, states} = extractStatesFromNodes(matchedNodes);
      
      console.log('Matched nodes:', matchedNodes);
      console.log('Extracted states:', states);
      localStorage.setItem('selectedStates', JSON.stringify({type, states}));
      
      // 将states添加到extra对象中传递给父组件
      const extendedExtra = {
        ...extra,
        states: states,
        nodes: matchedNodes
      };
      
      // 调用父组件传入的onChange，并传递扩展的extra信息
      onChange?.(selectedValues, selectedOptions, extendedExtra);
    } else {
      onChange?.(selectedValues, selectedOptions, extra);
    }
  }

  const handleSelect = (chooseValue) => {
    console.log(chooseValue, "chooseValue",options)
    onChange(chooseValue)
    if(!chooseValue) {
      localStorage.removeItem('selectedStates');
    }
  }
  useEffect(() => {
    handleSelect(value)
  }, [value])
  return (
    <TreeSelect
      style={{ width: '13em' }}
      value={value}
      treeData={deviceState}
      placeholder=""
      treeDefaultExpandAll
      onChange={handleChange}
      treeCheckable={false} // 支持多选
      showCheckedStrategy={TreeSelect.SHOW_CHILD} // 只显示选中的子节点
      treeIcon={<CaretRightOutlined />} // 自定义展开图标
      allowClear={allowClear}
      {...selectProps}
    />
  );
}
