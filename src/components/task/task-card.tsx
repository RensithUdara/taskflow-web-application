
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Task, Priority } from "@/types";
import { Edit2, Trash2, Lightbulb, CalendarDays, UserCircle, CheckCircle2, Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onSuggestResources: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

const getPriorityBadgeStyle = (priority: Priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-500 hover:bg-red-500/90 text-white'; // Changed to use direct colors for high impact
    case 'Medium':
      return 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900';
    case 'Low':
      return 'bg-green-500 hover:bg-green-500/90 text-white'; // Changed to use direct colors
    default:
      return 'bg-muted hover:bg-muted/90 text-muted-foreground';
  }
};

const getStatusBadgeStyle = (status: Task['status']) => {
  switch (status) {
    case 'To Do':
      return 'border-blue-500 text-blue-500';
    case 'In Progress':
      return 'border-amber-500 text-amber-500';
    case 'Completed':
      return 'border-green-500 text-green-500';
    default:
      return 'border-gray-500 text-gray-500';
  }
}

export function TaskCard({ task, onEdit, onDelete, onSuggestResources, onToggleComplete }: TaskCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-xl mr-2">{task.title}</CardTitle>
          <div className="flex flex-shrink-0 items-center gap-1">
            <Badge className={cn(getPriorityBadgeStyle(task.priority), "shrink-0")}>{task.priority}</Badge>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Task</span>
            </Button>
          </div>
        </div>
        <CardDescription className="mt-1 line-clamp-3 h-[3.75rem] text-sm">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <Badge variant="outline" className={cn(getStatusBadgeStyle(task.status), "mr-2")}>{task.status}</Badge>
        </div>
        {task.assignee && (
          <div className="flex items-center text-sm text-muted-foreground">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>{task.assignee}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Due: {format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="grid grid-cols-3 gap-1 p-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="flex items-center justify-center gap-1 text-primary hover:text-primary/90 hover:bg-primary/10">
          <Edit2 className="h-4 w-4" /> Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleComplete(task.id)}
          className={cn(
            "flex items-center justify-center gap-1",
            task.status === "Completed" ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-500/10" : "text-green-600 hover:text-green-700 hover:bg-green-500/10"
          )}
        >
          {task.status === "Completed" ? <Undo2 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {task.status === "Completed" ? "Reopen" : "Complete"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onSuggestResources(task)} className="flex items-center justify-center gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-500/10">
          <Lightbulb className="h-4 w-4" /> AI Suggest
        </Button>
      </CardFooter>
    </Card>
  );
}
