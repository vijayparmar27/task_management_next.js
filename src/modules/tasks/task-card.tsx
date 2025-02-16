import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, User, GripHorizontal } from "lucide-react";
import { users } from "@/lib/mock-data";
import { ITasks } from "@/@types/store.interface";

export function TaskCard({
  task,
  onClick,
}: {
  task: ITasks;
  onClick: () => void;
}) {
  // const assignee = users.find((user) => user._id === (task.assignee as string));

  const priorityColors = {
    High: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    Medium:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20",
    Low: "bg-green-500/10 text-green-600 dark:text-green-500 hover:bg-green-500/20",
  };

  return (
    <Card className="group hover:shadow-md transition-shadow bg-card">
      <CardContent className="p-3" onClick={onClick}>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div className="font-medium mb-2 text-sm">{task.title}</div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge
                variant="outline"
                className={priorityColors[task.priority]}
              >
                {task.priority}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {task.dueDate}
              </div>
              {/* <div className="flex items-center text-muted-foreground">
                <User className="w-3 h-3 mr-1" />
                {assignee?.name}
              </div> */}
            </div>
          </div>
          <GripHorizontal className="w-5 h-5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
        </div>
      </CardContent>
    </Card>
  );
}
