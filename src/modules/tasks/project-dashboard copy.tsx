"use client";

import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TaskModal } from "./task-modal";
import { projects, tasks as initialTasks, users } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskCard } from "./task-card";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTaskForm } from "./create-task-form";

// TypeScript interfaces for better type safety
interface Task {
  id: number;
  title: string;
  status: string;
  priority: "Low" | "Medium" | "High";
  assigneeId?: number;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

export function ProjectDashboard({ projectId }: { projectId: number }) {
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks.filter((task) => task.projectId === projectId)
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: "",
  });
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const project = projects.find((p) => p.id === projectId);

  const onDragStart = useCallback((start) => {
    setActiveDragId(start.draggableId);
  }, []);

  const onDragEnd = useCallback(
    (result) => {
      setActiveDragId(null);

      if (!result.destination) return;

      const { source, destination } = result;

      // Don't do anything if dropped in the same place
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      // Create a new array of tasks
      const newTasks = Array.from(tasks);

      // Find the index for the source task
      const sourceIndex = tasks.findIndex(
        (t) => t.id.toString() === result.draggableId
      );
      if (sourceIndex === -1) return;

      // Remove the task from its source
      const [movedTask] = newTasks.splice(sourceIndex, 1);

      // Update the task's status
      movedTask.status = destination.droppableId;

      // Insert the task at its new position
      newTasks.splice(destination.index, 0, movedTask);

      setTasks(newTasks);
    },
    [tasks]
  );

  const filteredTasks = tasks.filter(
    (task) =>
      (!filters.status || task.status === filters.status) &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.assignee ||
        task.assigneeId === Number.parseInt(filters.assignee))
  );

  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div className="h-full">
      <div className="flex gap-4 mb-6 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <Input
          placeholder="Search tasks..."
          className="max-w-sm"
          onChange={(e) => {
            /* Implement search functionality */
          }}
        />
        <Select
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {columns.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setFilters({ ...filters, priority: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setFilters({ ...filters, assignee: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {users.map((user: User) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
              <DialogDescription>
                Add a new task to your project
              </DialogDescription>
            </DialogHeader>
            <CreateTaskForm onSuccess={() => setIsCreateTaskOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 h-full">
          {columns.map((column) => (
            <div key={column} className="flex-1 min-w-[320px] max-w-[400px]">
              <div className="mb-3 font-medium text-sm text-muted-foreground">
                {column} (
                {filteredTasks.filter((t) => t.status === column).length})
              </div>
              <Droppable
                droppableId={column}
                isDropDisabled={false} // explicitly set to false
                isCombineEnabled={false} // if you're not using combine features
                ignoreContainerClipping={false}
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`rounded-lg transition-colors duration-200 min-h-[150px] ${
                      snapshot.isDraggingOver
                        ? "bg-muted/80 dark:bg-muted/30"
                        : "bg-muted/50 dark:bg-muted/20"
                    }`}
                  >
                    <div className="p-2">
                      {filteredTasks
                        .filter((task) => task.status === column)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={`${task.id.toString()}-${index}`}
                            index={index}
                            isDragDisabled={false}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  transform: snapshot.isDragging
                                    ? provided.draggableProps.style?.transform
                                    : "none",
                                }}
                                className={`mb-2 transition-shadow ${
                                  snapshot.isDragging
                                    ? "shadow-lg ring-2 ring-primary/20"
                                    : ""
                                } ${
                                  activeDragId === task.id.toString()
                                    ? "opacity-50"
                                    : "opacity-100"
                                }`}
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => setSelectedTask(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setTasks(
              tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
