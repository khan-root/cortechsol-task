import { fetcher } from "../lib/fetcher";

const taskServices = (set, get) => ({
  
  getTasks: async ()=>{
    return fetcher("/tasks")
  }

});

export default taskServices;