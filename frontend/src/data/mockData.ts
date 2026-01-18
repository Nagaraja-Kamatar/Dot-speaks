// Mock data for FlowDash WorkWise

export interface Task {
  id: string;
  title: string;
  project?: string;
  status: "TODO" | "WORKING" | "STUCK" | "DONE";
  hoursAllocated?: number;
  hoursUsed?: number;
  dueDate?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  assignee?: string;
}

export interface Stats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  stuckTasks: number;
  completionRate: number;
  completionTrend: { week: string; rate: number }[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  tasksCompleted: number;
  tasksInProgress: number;
  performance: number;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  team: string[];
  deadline: string;
  tasksCount: number;
  completedTasks: number;
}

// Operator Tasks
export const operatorTasks: Task[] = [
  {
    id: "1",
    title: "Complete API Integration",
    project: "E-Commerce Platform",
    status: "WORKING",
    hoursAllocated: 8,
    hoursUsed: 5,
    dueDate: "2026-01-15",
    priority: "HIGH",
  },
  {
    id: "2",
    title: "Design Review Meeting",
    project: "Mobile App",
    status: "TODO",
    hoursAllocated: 2,
    hoursUsed: 0,
    dueDate: "2026-01-14",
    priority: "MEDIUM",
  },
  {
    id: "3",
    title: "Bug Fix - Login Issue",
    project: "Customer Portal",
    status: "DONE",
    hoursAllocated: 4,
    hoursUsed: 3.5,
    dueDate: "2026-01-12",
    priority: "HIGH",
  },
  {
    id: "4",
    title: "Database Optimization",
    project: "Analytics Dashboard",
    status: "STUCK",
    hoursAllocated: 6,
    hoursUsed: 4,
    dueDate: "2026-01-18",
    priority: "LOW",
  },
  {
    id: "5",
    title: "Unit Tests for Payment Module",
    project: "E-Commerce Platform",
    status: "TODO",
    hoursAllocated: 5,
    hoursUsed: 0,
    dueDate: "2026-01-20",
    priority: "MEDIUM",
  },
];

export const operatorStats: Stats = {
  totalTasks: 12,
  completedTasks: 8,
  inProgressTasks: 2,
  pendingTasks: 1,
  stuckTasks: 1,
  completionRate: 67,
  completionTrend: [
    { week: "Week 1", rate: 45 },
    { week: "Week 2", rate: 52 },
    { week: "Week 3", rate: 58 },
    { week: "Week 4", rate: 67 },
  ],
};

// Manager Data
export const teamEmployees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@company.com",
    role: "Senior Developer",
    department: "Engineering",
    tasksCompleted: 24,
    tasksInProgress: 3,
    performance: 92,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@company.com",
    role: "Frontend Developer",
    department: "Engineering",
    tasksCompleted: 18,
    tasksInProgress: 5,
    performance: 78,
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@company.com",
    role: "UX Designer",
    department: "Design",
    tasksCompleted: 20,
    tasksInProgress: 2,
    performance: 88,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@company.com",
    role: "Backend Developer",
    department: "Engineering",
    tasksCompleted: 16,
    tasksInProgress: 4,
    performance: 75,
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva@company.com",
    role: "QA Engineer",
    department: "Quality",
    tasksCompleted: 22,
    tasksInProgress: 1,
    performance: 95,
  },
];

export const managerStats = {
  totalEmployees: 8,
  activeProjects: 5,
  tasksCompleted: 142,
  avgPerformance: 85,
  monthlyProgress: [
    { month: "Sep", tasks: 28 },
    { month: "Oct", tasks: 35 },
    { month: "Nov", tasks: 42 },
    { month: "Dec", tasks: 37 },
  ],
};

export const projects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    status: "active",
    progress: 72,
    team: ["Alice", "Bob", "David"],
    deadline: "2026-02-28",
    tasksCount: 45,
    completedTasks: 32,
  },
  {
    id: "2",
    name: "Mobile App Redesign",
    status: "active",
    progress: 45,
    team: ["Carol", "Eva"],
    deadline: "2026-03-15",
    tasksCount: 28,
    completedTasks: 12,
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    status: "on-hold",
    progress: 30,
    team: ["David"],
    deadline: "2026-04-01",
    tasksCount: 20,
    completedTasks: 6,
  },
  {
    id: "4",
    name: "Customer Portal v2",
    status: "completed",
    progress: 100,
    team: ["Alice", "Bob", "Carol"],
    deadline: "2026-01-10",
    tasksCount: 35,
    completedTasks: 35,
  },
];

// Project Manager Data
export const pmStats = {
  totalManagers: 4,
  totalProjects: 12,
  totalEmployees: 32,
  overallProgress: 68,
  departmentStats: [
    { name: "Engineering", employees: 18, performance: 82 },
    { name: "Design", employees: 6, performance: 88 },
    { name: "Quality", employees: 5, performance: 91 },
    { name: "Product", employees: 3, performance: 85 },
  ],
};

export const managers = [
  { id: "1", name: "Sarah Manager", projects: 3, employees: 8, performance: 87 },
  { id: "2", name: "Tom Lead", projects: 4, employees: 10, performance: 82 },
  { id: "3", name: "Lisa Director", projects: 3, employees: 7, performance: 90 },
  { id: "4", name: "James Head", projects: 2, employees: 7, performance: 85 },
];
