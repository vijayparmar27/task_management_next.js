"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { users, activityLog } from "@/lib/mock-data";
import * as z from "zod";
import { Status } from "@/@types/globle.interface";
import { ITasks, Priority } from "@/@types/store.interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const statusEnum = Object.values(Status).filter(String) as [
  string,
  ...string[]
];
const priorityEnum = Object.values(Priority).filter(String) as [
  string,
  ...string[]
];

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  status: z.enum(statusEnum),
  priority: z.enum(priorityEnum),
  assigneeId: z.string(),
  dueDate: z.string(),
});

export function TaskModal({ task, onClose, onUpdate }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: Status.To_Do,
      priority: Priority.LOW,
      assigneeId: "",
      dueDate: new Date().toISOString().split("T")[0],
    },
  });

  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedTask);
  };

  const taskActivities = activityLog.filter(
    (activity) => activity.taskId === task.id
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("status", value)}
                defaultValue={editedTask.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("priority", value)}
                defaultValue={editedTask.priority}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={editedTask.dueDate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">
                Assignee
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("assigneeId", Number.parseInt(value))
                }
                defaultValue={editedTask.assigneeId.toString()}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Activity Log</h4>
          <div className="space-y-2">
            {taskActivities.map((activity) => (
              <div key={activity.id} className="text-sm">
                <span className="font-medium">
                  {users.find((u) => u.id === activity.userId)?.name}
                </span>{" "}
                {activity.action} -{" "}
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
