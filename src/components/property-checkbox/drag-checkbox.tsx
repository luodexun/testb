/*
 * @Author: chenmeifeng
 * @Date: 2025-05-13 17:23:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-15 10:05:36
 * @Description:
 */
import "./drag-checkbox.less"
import React, { useEffect, useRef, useState } from "react"
import { Button, Checkbox, Space } from "antd"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { IOption } from "@/pages/report-power/types"

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
const grid = 3

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "var(--bg-active)",

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "var(--bg-active)",
  padding: grid,
  // width: 250,
})
interface IKeyMap {
  [key: string]: boolean
}

interface IProps {
  options: any[]
  property?: IKeyMap
  btnClick?: (type, checkInfo?: IKeyMap, checkList?: IOption[]) => void
}
const CheckboxList = (props: IProps) => {
  const { options, property, btnClick } = props
  const [chooseKeys, setChooseKeys] = useState({})

  const nodeRef = useRef(null)
  const [items, setItems] = useState(options)
  const onChange = (e, key) => {
    setChooseKeys((prev) => {
      return {
        ...prev,
        [key]: e.target.checked,
      }
    })
  }
  const comfirm = () => {
    const checkList = items.map((i) => {
      const col = options?.find((j) => i.value === j.dataIndex)
      return col
    })
    btnClick?.("comfirm", chooseKeys, checkList)
  }
  useEffect(() => {
    const vals = options
      .map((i) => i.dataIndex)
      ?.reduce((prev, cur) => {
        prev[cur] = true
        return { ...prev }
      }, {})
    if (!property || !Object.keys(property)?.length) {
      setChooseKeys(vals)
      console.log(vals)
    } else {
      setChooseKeys(property)
    }
  }, [property, options])

  useEffect(() => {
    const actualOpts = options?.map((i) => {
      return {
        label: i.title,
        value: i.dataIndex,
      }
    })
    setItems(actualOpts || [])
  }, [options])
  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }
    const itemss = reorder(items, result.source.index, result.destination.index)
    setItems(itemss)
  }

  return (
    <div className="property-box">
      <div className="property-box-content">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
                {items.map((item, index) => (
                  <Draggable key={item.value} draggableId={item.value} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <Checkbox onChange={(e) => onChange(e, item.value)} checked={chooseKeys[item.value]}>
                          {item.label}
                        </Checkbox>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="btn-list">
          <Space>
            <Button onClick={comfirm}>确认</Button>
            <Button onClick={btnClick?.bind(null, "cancel", null, [])}>取消</Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default CheckboxList
