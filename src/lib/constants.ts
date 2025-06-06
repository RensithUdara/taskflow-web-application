import type { Priority, Status, Task, Assignee } from '@/types';

export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
export const STATUSES: Status[] = ["To Do", "In Progress", "Completed"];
export const ASSIGNEES: Assignee[] = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

export const INITIAL_TASKS: Task[] = [
  { 
    id: '1', 
    title: 'Design landing page', 
    description: 'Create mockups for the new landing page using Figma. Focus on a clean and modern aesthetic. Include sections for features, pricing, and testimonials.', 
    priority: 'High', 
    status: 'In Progress', 
    assignee: 'Alice', 
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
  },
  { 
    id: '2', 
    title: 'Develop API endpoints', 
    description: 'Implement user authentication (signup, login, logout) and task management (CRUD) endpoints for the backend. Use JWT for authentication.', 
    priority: 'High', 
    status: 'To Do', 
    assignee: 'Bob', 
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
  },
  { 
    id: '3', 
    title: 'Write User Documentation', 
    description: 'Document the API usage with examples for each endpoint. Also, create a user guide for the frontend application, covering all major features.', 
    priority: 'Medium', 
    status: 'To Do', 
    assignee: 'Charlie' 
  },
  { 
    id: '4', 
    title: 'Frontend Testing', 
    description: 'Perform end-to-end testing for all user flows. Write unit tests for critical components. Ensure responsiveness across major devices.', 
    priority: 'Medium', 
    status: 'To Do', 
    assignee: 'Diana', 
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
  },
  {
    id: '5',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure a continuous integration and continuous deployment pipeline using GitHub Actions. Automate testing and deployment to staging environment.',
    priority: 'Low',
    status: 'Completed',
    assignee: 'Eve',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];
