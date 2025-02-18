"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ITasks, Priority } from "@/@types/store.interface";
import { Status } from "@/@types/globle.interface";
import { useSelector } from "react-redux";
import { selectUserData, setLoading } from "@/store/user/user.store";
import { useDispatch } from "react-redux";
import {
  selectTasksData,
  setIdelStatus,
  taksApi,
  taksUpdateApi,
} from "@/store/tasks/task.store";
import { useEffect, useState } from "react";
import { IProjectsRes } from "@/@types/apiResponce.interface";
import { getTaskLogsApi, logsData } from "@/store/logs/logs.store";

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
  assignee: z.string(),
  dueDate: z.string(),
});

export function CreateTaskForm({
  onSuccess,
  project,
  task,
}: {
  onSuccess: () => void;
  project: IProjectsRes;
  task?: ITasks;
}) {
  const [isShowLogs, SetShowLogs] = useState(false);

  const { userData } = useSelector(selectUserData);
  const { status } = useSelector(selectTasksData);
  const { logs } = useSelector(logsData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "succeeded") {
      dispatch(setIdelStatus());
      dispatch(setLoading(false));
    }
  }, [status, dispatch]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.title ?? "",
      status: task?.status ?? Status.To_Do,
      priority: task?.priority ?? Priority.LOW,
      assignee: task?.assignee ?? "",
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (task) {
      dispatch(
        taksUpdateApi({
          _id: task._id,
          status: values.status as Status,
          title: values.title,
          description: values.description as string,
          priority: values.priority as Priority,
          dueDate: new Date(values.dueDate).toISOString().split("T")[0],
          ...(project?._id && { projectId: project._id }),
          ...(values.assignee && { assignee: values.assignee }),
        })
      );
      onSuccess();

      return;
    }

    dispatch(
      taksApi({
        status: values.status as Status,
        title: values.title,
        description: values.description as string,
        priority: values.priority as Priority,
        dueDate: new Date(values.dueDate).toISOString().split("T")[0],
        ...(project?._id && { projectId: project._id }),
        ...(values.assignee && { assignee: values.assignee }),
      })
    );
    dispatch(setLoading(true));

    onSuccess();
  }

  const handleShowLogs = () => {
    if (task?._id) {
      dispatch(
        getTaskLogsApi({
          taskId: task?._id,
        })
      );
      SetShowLogs(true);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the task..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Priority).map((priority: string) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userData?.data.members &&
                      userData.data.members.length > 0 &&
                      userData.data.members.map((user) => (
                        <SelectItem key={user._id} value={user._id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">{!task ? "Create Task" : "Save Task"}</Button>

        {task && (
          <Button
            type="button"
            variant="outline"
            className="ml-4"
            onClick={handleShowLogs}
          >
            Show Logs
          </Button>
        )}

        {isShowLogs && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Activity Logs</h3>
            {logs?.activity && logs.activity.length > 0 ? (
              <ul>
                {logs?.activity.map((log, index) => (
                  <li key={index} className="text-sm">
                    <strong>{log.fromDetails.name}</strong> changed status from{" "}
                    <strong>{log.previousStatus}</strong> to{" "}
                    <strong>{log.status}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No logs available</p>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
