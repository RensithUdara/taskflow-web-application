"use client";

import type { Task } from "@/types";
import { TaskCard } from "./task-card";
import { FileText } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onSuggestResources: (task: Task) => void;
}

export function TaskList({ tasks, onEditTask, onDeleteTask, onSuggestResources }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center shadow-sm">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-foreground">No tasks found</h3>
        <p className="text-muted-foreground">Create a new task or adjust your filters.</p>
      </div>
    );
  }

  // TODO: Implement Kanban view toggle
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onSuggestResources={onSuggestResources}
        />
      ))}
    </div>
  );
}
