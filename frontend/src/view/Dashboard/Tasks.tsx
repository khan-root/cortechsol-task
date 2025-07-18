import useStore from "../../store/store";
import { useQuery } from "@tanstack/react-query"; 
import { useMemo } from "react";
import type { Task } from "../../utils/types";
import TaskList from "./TaskList";

const Tasks =() => {
  const getTasks = useStore((state) => state.getTasks);
  const tasks = useStore((state) => state.tasks);

  const { isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  
  const tasksByStatus = useMemo(() => {
    const grouped: Record<"todo" | "in_progress" | "done", Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    
    tasks.forEach((task) => {
      const status = (task.status || "todo") as "todo" | "in_progress" | "done";
      grouped[status].push(task);
    });
    
    return grouped;
  }, [tasks]);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };
  
  return(
    <div className="overflow-x-auto min-h-[600px] p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(tasksByStatus).map(([status, taskList]) => (
        <div
          key={status}
          className="flex-1 min-w-[280px] md:min-w-[320px] p-3 md:p-4 rounded-lg bg-gray-50 border-2 border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
             {statusLabels[status as keyof typeof statusLabels]}
            </h2>
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
              {taskList.length}
            </span>
          </div>

          <div className="space-y-3">
            {taskList.map((ele) => (
              <TaskList key={ele.id} task={ele} />
            ))}
          </div>

          {taskList.length === 0 && (
            <div className="text-center text-gray-400 mt-8 py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm font-medium">No tasks</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
};

export default Tasks;
