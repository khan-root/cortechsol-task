import { useCallback, useState, useMemo, memo, useRef } from "react";
import { MdModeEdit } from "react-icons/md";
import { FaAngleDown, FaPaperclip, FaTrash } from "react-icons/fa6";
import type { Task } from "../../utils/types";
import { showToast } from "../../components/Toaster";
import { fetcher } from "../../lib/fetcher";
import useStore from "../../store/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import EditTask from "./EditTask";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

type Props = {
  task: Task;
};

function TaskList({ task }: Props) {
  const deleteTask = useStore((state) => state.deleteTask);
  const updateTask = useStore((state) => state.updateTask);
  const uploadFile = useStore((state) => state.uploadFile);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = useCallback(async (taskId: string) => {
    try {
      await fetcher(`/tasks/${taskId}`, {
        method: "DELETE",
      });
      showToast("Task deleted successfully", "success");
      deleteTask(taskId);
    } catch (error) {
      if(error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("An unknown error occurred", "error");
      }
    }
  }, [deleteTask]);

  const handlePriority = useCallback(async (priority: string, taskId: string) => {
    try {
      const response: { data: Task } = await fetcher(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ priority }),
      });
      updateTask(taskId, response.data);
      showToast("Priority updated successfully", "success");
    } catch (error) {
      if(error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("An unknown error occurred", "error");
      }
    }
  }, [updateTask]);

  const handleEdit = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const priorityColor = useMemo(() => {
    switch (task.priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, [task.priority]);

  const [taskId, setTaskId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = (id: string) => {
    setTaskId(id);
    fileInputRef.current?.click(); 
  };

  const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("attachment_url", file);
      try {
        const response: { data: Task } = await fetcher(`/tasks/${taskId}/upload`, {
        method: "POST",
        body: formData,
      });
        uploadFile(taskId, response.data);
        showToast("File uploaded successfully", "success");
      } catch (error) {
        if(error instanceof Error) {
          showToast(error.message, "error");
        } else {
          showToast("An unknown error occurred", "error");
        }
      }
    }
  };

  return (
    <>
      <div className="w-full py-3 px-4 rounded-lg bg-white border shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-2">
            <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2">
            <div >
              <button
                type="button"
                onClick={()=>handleIconClick(task.id)}
                className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
                title="Attach a file"
              >
                <FaPaperclip className="text-gray-700 text-lg" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            
            {task.attachment_url && (
              <div className="flex items-center gap-2">
                <img src={`${import.meta.env.VITE_API_URL}${task.attachment_url}`} alt="attachment" className="w-16 h-16 rounded-md" />
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Edit task"
            >
              <MdModeEdit className="text-blue-500 text-lg" />
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Delete task"
            >
              <FaTrash className="text-red-500 text-lg" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium border transition-colors ${priorityColor}`}
            >
              <span className="capitalize">{task.priority}</span>
              <FaAngleDown className="text-xs" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["low", "medium", "high"].map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handlePriority(priority, task.id)}
                >
                  <span className="capitalize">{priority}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-xs text-gray-500 capitalize">
            {task.status === "in_progress" ? "In Progress" : task.status}
          </span>
        </div>
      </div>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <EditTask task={task} handleEdit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}


export default memo(TaskList, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.task) === JSON.stringify(nextProps.task);
});