"use client";

import type { ChangeEvent } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRIORITIES, STATUSES, ASSIGNEES } from "@/lib/constants";
import type { Priority, Status, Assignee } from "@/types";

interface TaskFiltersProps {
  filters: {
    status: Status | 'all';
    priority: Priority | 'all';
    assignee: Assignee | 'all';
    searchTerm: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

export function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilterChange(event.target.name, event.target.value);
  };

  const handleSelectChange = (name: string) => (value: string) => {
    onFilterChange(name, value);
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 shadow sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Label htmlFor="searchTerm" className="mb-1 block text-sm font-medium">Search Tasks</Label>
        <Input
          id="searchTerm"
          name="searchTerm"
          placeholder="Enter task title..."
          value={filters.searchTerm}
          onChange={handleInputChange}
          className="bg-background"
        />
      </div>
      <div>
        <Label htmlFor="statusFilter" className="mb-1 block text-sm font-medium">Status</Label>
        <Select name="status" value={filters.status} onValueChange={handleSelectChange('status')}>
          <SelectTrigger id="statusFilter" className="bg-background">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priorityFilter" className="mb-1 block text-sm font-medium">Priority</Label>
        <Select name="priority" value={filters.priority} onValueChange={handleSelectChange('priority')}>
          <SelectTrigger id="priorityFilter" className="bg-background">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>{priority}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assigneeFilter" className="mb-1 block text-sm font-medium">Assignee</Label>
        <Select name="assignee" value={filters.assignee} onValueChange={handleSelectChange('assignee')}>
          <SelectTrigger id="assigneeFilter" className="bg-background">
            <SelectValue placeholder="Filter by assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {ASSIGNEES.map((assignee) => (
              <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
