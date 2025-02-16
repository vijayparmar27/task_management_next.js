"use client"
import { DragDropContext } from "react-beautiful-dnd"

export function DragDropContextWrapper({ children, onDragEnd }) {
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
}

