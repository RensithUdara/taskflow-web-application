
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AppHeader } from "@/components/layout/app-header";
import { TaskList } from "@/components/task/task-list";
import { TaskForm, type TaskFormValues } from "@/components/task/task-form";
import { TaskFilters } from "@/components/task/task-filters";
import { AIResourceDialog } from "@/components/task/ai-resource-dialog";
import type { Task, Priority, Status, Assignee } from "@/types";
import { INITIAL_TASKS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

const UNASSIGNED_FORM_VALUE = "__UNASSIGNED__";

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForAI, setTaskForAI] = useState<Task | null>(null);
  const [isAIResourceDialogOpen, setIsAIResourceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  const [filters, setFilters] = useState<{
    status: Status | 'all';
    priority: Priority | 'all';
    assignee: Assignee | 'all';
    searchTerm: string;
  }>({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    searchTerm: '',
  });

  const { toast } = useToast();

  const applyFilters = useCallback(() => {
    let tempTasks = tasks;

    if (filters.status !== 'all') {
      tempTasks = tempTasks.filter(task => task.status === filters.status);
    }
    if (filters.priority !== 'all') {
      tempTasks = tempTasks.filter(task => task.priority === filters.priority);
    }
    if (filters.assignee !== 'all') {
      tempTasks = tempTasks.filter(task => task.assignee === filters.assignee);
    }
    if (filters.searchTerm) {
      tempTasks = tempTasks.filter(task =>
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    setFilteredTasks(tempTasks);
  }, [tasks, filters]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters, applyFilters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenTaskForm = (task?: Task) => {
    setEditingTask(task || null);
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSubmit = (values: TaskFormValues) => {
    const finalAssignee = values.assignee === UNASSIGNED_FORM_VALUE ? undefined : values.assignee;

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...values, assignee: finalAssignee, dueDate: values.dueDate ? format(values.dueDate, "yyyy-MM-dd") : undefined } : t));
      toast({ title: "Task Updated", description: `Task "${values.title}" has been updated.` });
    } else {
      const newTask: Task = {
        id: String(Date.now()),
        ...values,
        assignee: finalAssignee,
        dueDate: values.dueDate ? format(values.dueDate, "yyyy-MM-dd") : undefined,
      };
      setTasks([newTask, ...tasks]);
      toast({ title: "Task Created", description: `Task "${values.title}" has been created.`, variant: "default" });
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleDeleteRequest = (taskId: string) => {
    setTaskToDeleteId(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDeleteId) {
      const task = tasks.find(t => t.id === taskToDeleteId);
      setTasks(tasks.filter(t => t.id !== taskToDeleteId));
      toast({ title: "Task Deleted", description: `Task "${task?.title}" has been deleted.`, variant: "destructive" });
      setIsDeleteDialogOpen(false);
      setTaskToDeleteId(null);
    }
  };

  const handleSuggestResources = (task: Task) => {
    setTaskForAI(task);
    setIsAIResourceDialogOpen(true);
  };

  const handleToggleComplete = (taskId: string) => {
    let taskTitle = "";
    let newStatus: Status = "To Do";

    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          taskTitle = task.title;
          newStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
          return { ...task, status: newStatus };
        }
        return task;
      })
    );

    if (taskTitle) {
      toast({
        title: `Task ${newStatus === 'Completed' ? 'Completed' : 'Reopened'}`,
        description: `Task "${taskTitle}" marked as ${newStatus}.`,
      });
    }
  };


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="font-headline text-3xl font-bold text-foreground">My Tasks</h1>
            <Button onClick={() => handleOpenTaskForm()} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Task
            </Button>
          </div>

          <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

          <TaskList
            tasks={filteredTasks}
            onEditTask={handleOpenTaskForm}
            onDeleteTask={handleDeleteRequest}
            onSuggestResources={handleSuggestResources}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </main>

      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask ? "Update the details of your task." : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>
          <TaskForm onSubmit={handleTaskFormSubmit} initialData={editingTask || undefined} />
        </DialogContent>
      </Dialog>

      <AIResourceDialog
        task={taskForAI}
        isOpen={isAIResourceDialogOpen}
        onOpenChange={setIsAIResourceDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the task "{tasks.find(t => t.id === taskToDeleteId)?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
