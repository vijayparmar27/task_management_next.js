"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { ProjectStatus, Roles } from "@/@types/globle.interface";
import { MultiSelect } from "@/components/ui/multi-select";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getProjectsApi,
  projectsApi,
  selectProjectsData,
  setIdelStatus,
} from "@/store/projects/project.store";
import { useEffect } from "react";
import { selectUserData } from "@/store/user/user.store";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  dueDate: z.string(),
  members: z
    .array(
      z.object({
        id: z.string(),
        role: z.nativeEnum(Roles),
      })
    )
    .optional(),
});

export function CreateProjectForm({
  onSuccess,
  project,
}: {
  onSuccess: () => void;
  project?: z.infer<typeof formSchema>;
}) {
  const { status } = useSelector(selectProjectsData);
  const { userData } = useSelector(selectUserData);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: ProjectStatus.CREATED,
      dueDate: new Date().toISOString().split("T")[0],
      members: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    dispatch(
      projectsApi({
        title: values.title,
        description: values?.description ?? "",
        status: values.status,
        dueDate: values?.dueDate,
        members: values.members ?? [],
      })
    );
  }

  useEffect(() => {
    if (status === "succeeded") {
      setTimeout(() => {
        dispatch(setIdelStatus());
        dispatch(getProjectsApi());
        onSuccess();
      }, 1500);
    }
  }, [status]);

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
                <Input placeholder="Project title" {...field} />
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
                <Textarea placeholder="Describe the project..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ProjectStatus).map((status) => (
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
        {/* MultiSelect Wrapped in Controller for react-hook-form */}
        {userData?.data.members && userData.data.members.length > 0 && (
          <FormField
            control={form.control}
            name="members"
            render={() => (
              <FormItem>
                <FormLabel>Members</FormLabel>
                <Controller
                  control={form.control}
                  name="members"
                  render={({ field }) => (
                    <MultiSelect
                      options={
                        userData?.data.members.map((user) => ({
                          label: user.name,
                          value: user.id.toString(),
                        })) ?? []
                      }
                      selected={
                        field.value?.map((member) => ({
                          label:
                            userData?.data.members.find(
                              (user) => user.id.toString() === member.id
                            )?.name || "",
                          value: member.id,
                        })) || []
                      }
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions.map((option) => ({
                            id: option.value,
                            role: Roles.Admin,
                          }))
                        )
                      }
                      placeholder="Select members"
                    />
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
        <Button type="submit">Create Project</Button>
      </form>
    </Form>
  );
}
