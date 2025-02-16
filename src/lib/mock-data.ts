export const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "member" },
]

export const projects = [
  { id: 1, name: "Project Alpha", users: [1, 2] },
  { id: 2, name: "Project Beta", users: [2] },
]

export const tasks = [
  { id: 1, projectId: 1, title: "Task 1", status: "To Do", priority: "High", dueDate: "2023-12-31", assigneeId: 1 },
  {
    id: 2,
    projectId: 1,
    title: "Task 2",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2023-12-25",
    assigneeId: 2,
  },
  { id: 3, projectId: 1, title: "Task 3", status: "Done", priority: "Low", dueDate: "2023-12-20", assigneeId: 1 },
  { id: 4, projectId: 2, title: "Task 4", status: "To Do", priority: "High", dueDate: "2024-01-15", assigneeId: 2 },
]

export const activityLog = [
  { id: 1, taskId: 1, userId: 1, action: "created", timestamp: "2023-12-01T10:00:00Z" },
  { id: 2, taskId: 2, userId: 2, action: "updated status to In Progress", timestamp: "2023-12-02T14:30:00Z" },
  { id: 3, taskId: 3, userId: 1, action: "completed", timestamp: "2023-12-03T16:45:00Z" },
]

