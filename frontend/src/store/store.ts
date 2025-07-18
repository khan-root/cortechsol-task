import { create } from "zustand";
import { devtools } from "zustand/middleware";
import taskServices from "../services/taskService";

const useStore = create(devtools((set, get)=>({
  ...taskServices(set, get),
})))

export default useStore;