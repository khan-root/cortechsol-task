export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee_id: string;
  due_date: Date;
  attachment_url?: string;
}


export interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  getTasks: () => Promise<Task[]>;
  deleteTask: (id: string) => void;
  updateTask: (id: string, task: Task) => void;
  uploadFile: (id: string, file: string) => void;
}



export interface User {
  id: string;
  full_name: string;
}