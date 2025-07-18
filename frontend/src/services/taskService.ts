import type { StateCreator } from "zustand";
import type { Task, TaskState } from "../utils/types";
import { fetcher } from "../lib/fetcher";
import type { AppState } from "../utils/store-type";

const taskServices: StateCreator<AppState, [], [], TaskState> = (set, get) => ({
  tasks: [],

  getTasks: async () => {
  try {
    const res: { data: Task[] } = await fetcher("/tasks");
    const tasks: Task[] = res.data; 
    set({ tasks });
    return tasks;
  } catch (error) {
    console.error(error);
    return []; 
  }
},


  addTask: (task) => {
    set({
      tasks: [...get().tasks, task],
    });
  },

  deleteTask: (id) => {
    set({
      tasks: get().tasks.filter((task) => task.id !== id),
    });
  },  

  updateTask: (id, task) => {
    set({
      tasks: get().tasks.map((t) => t.id === id ? task : t),
    });
  },

  uploadFile: (id, file) => {
    set({
      tasks: get().tasks.map((t) => t.id === id ? { ...t, attachment_url: file } : t),
    });
  },
});

export default taskServices;
