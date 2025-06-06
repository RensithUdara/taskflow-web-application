export type Priority = "High" | "Medium" | "Low";
export type Status = "To Do" | "In Progress" | "Completed";
export type Assignee = string;

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee?: Assignee;
  dueDate?: string; // YYYY-MM-DD format
}
