"use client"

import { memo } from "react"
import { Draggable } from "react-beautiful-dnd"
import { TaskCard } from "./task-card"

const DraggableTaskItem = memo(({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          <TaskCard task={task} onClick={onClick} />
        </div>
      )}
    </Draggable>
  )
})

DraggableTaskItem.displayName = "DraggableTaskItem"

export { DraggableTaskItem }

