"use client";

import { useState, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskModal } from "./task-modal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CreateTaskForm } from "./create-task-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectsApi,
  selectProjectsData,
} from "@/store/projects/project.store";
import { IProjects, ITasks } from "@/@types/store.interface";
import {
  getTasksApi,
  selectTasksData,
  updateTaskStatusApi,
} from "@/store/tasks/task.store";
import { Status } from "@/@types/globle.interface";
import { setLoading } from "@/store/user/user.store";

export function ProjectDashboard({ projectId }: { projectId: number }) {
  const dispatch = useDispatch();
  const { projects } = useSelector(selectProjectsData);
  const { tasks: initialTasks } = useSelector(selectTasksData);
  const [selectedProject, setSelectedProject] = useState<IProjects>();
  const [tasks, setTasks] = useState<ITasks[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: "",
  });
  const [selectedTask, setSelectedTask] = useState<ITasks | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Load projects on mount
  useEffect(() => {
    dispatch(getProjectsApi());
  }, [dispatch]);

  // Set initial project and load its tasks
  useEffect(() => {
    if (projects?.length > 0) {
      const initialProject = projects[0];
      setSelectedProject(initialProject);

      if (initialProject?._id) {
        dispatch(
          getTasksApi({
            projectId: initialProject._id,
          })
        );
      }
    }
  }, [projects, dispatch]);

  // Update tasks when project changes or new tasks are loaded
  useEffect(() => {
    if (initialTasks && selectedProject?._id) {
      const filteredTasks = initialTasks.filter(
        (task) => task?.projectId === selectedProject._id
      );
      setTasks(filteredTasks);
    }
  }, [initialTasks, selectedProject]);

  const onDragStart = useCallback((start: any) => {
    setActiveDragId(start.draggableId);
  }, []);

  const onDragEnd = useCallback(
    (result: any) => {
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

      const taskId = result.draggableId;
      const newStatus = destination.droppableId;

      // Create a new array of tasks
      const updatedTasks = tasks.map((task) => {
        if (task._id.toString() === taskId) {
          // Create a new task object with updated status
          return {
            ...task,
            status: newStatus,
          };
        }
        return task;
      });

      // Reorder the tasks
      const reorderedTasks = Array.from(updatedTasks);
      const taskToMove = reorderedTasks.find(
        (t) => t._id.toString() === taskId
      );

      if (!taskToMove) return;

      // Remove the task from its current position
      const filteredTasks = reorderedTasks.filter(
        (t) => t._id.toString() !== taskId
      );

      // Find the correct position to insert the task
      const tasksInDestination = filteredTasks.filter(
        (t) => t.status === newStatus
      );
      const insertIndex =
        filteredTasks.findIndex((t) => t.status === newStatus) +
        destination.index;

      // Insert the task at the new position
      filteredTasks.splice(insertIndex, 0, taskToMove);

      console.log(`------ taskToMove : `, taskToMove);

      dispatch(
        updateTaskStatusApi({
          taskId: taskToMove._id as string,
          status: taskToMove.status,
        })
      );

      // call API

      setTasks(filteredTasks);

      // Here you would typically also make an API call to update the task status
      // updateTaskStatus(taskId, newStatus);
    },
    [tasks]
  );

  const filteredTasks = tasks.filter(
    (task) =>
      (!filters.status || task.status === filters.status) &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.assignee || task.assignee?.toString() === filters.assignee)
  );

  const handleProjectChange = (projectTitle: string) => {
    const project = projects?.find((p) => p.title === projectTitle);
    if (project) {
      setSelectedProject(project);
      dispatch(getTasksApi({ projectId: project._id }));
    }
  };

  return (
    <div className="h-full">
      <div className="flex gap-4 mb-6 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <Select
          value={selectedProject?.title}
          onValueChange={handleProjectChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((project) => (
              <SelectItem key={project._id} value={project.title}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedProject && (
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
              <CreateTaskForm
                project={selectedProject}
                onSuccess={() => setIsCreateTaskOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 h-full">
          {Object.values(Status).map((status) => (
            <div key={status} className="flex-1 min-w-[320px] max-w-[400px]">
              <div className="mb-3 font-medium text-sm text-muted-foreground">
                {status} (
                {filteredTasks.filter((t) => t.status === status).length})
              </div>
              <Droppable droppableId={status}>
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
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-2 transition-shadow ${
                                  snapshot.isDragging
                                    ? "shadow-lg ring-2 ring-primary/20"
                                    : ""
                                } ${
                                  activeDragId === task._id.toString()
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
                      {provided.placeholder}
                    </div>
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
              tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
            );
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
