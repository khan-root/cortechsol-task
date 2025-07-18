import { create } from "zustand";
import { devtools } from "zustand/middleware";
import taskServices from "../services/taskService";
import type { AppState } from "../utils/store-type";

const useStore = create<AppState>()(
  devtools(
    (set, get, store) => ({
      ...taskServices(set, get, store),
    }),
    { name: "app-store" }
  )
);

export default useStore;
