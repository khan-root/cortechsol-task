import { useFormik } from "formik";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import type { Task, User } from "../../utils/types";
import { Button } from "../../components/ui/button";
import { Loader2Icon } from "lucide-react";
import { fetcher } from "../../lib/fetcher";
import useStore from "../../store/store";
import { showToast } from "../../components/Toaster";
import { SearchableSelect } from "../../components/ui/searchable";
import { useDebounce } from "../../hooks/debounce";
import { useState } from "react";

type Props = {
  task: Task; 
  handleEdit: () => void;
};

const EditTask = ({ task, handleEdit }: Props) => {
  const [data, setData] = useState<User[]>([]);
  const updateTask = useStore((state) => state.updateTask);
  const formik = useFormik({
    initialValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority || "",
      due_date: task.due_date?.split("T")[0] || "",
      assignee_id: task.assignee_id || "",
      status: task.status || "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.title.trim()) {
        errors.title = "Title is required";
      } else if (values.title.trim().length < 3) {
        errors.title = "Title must be at least 3 characters";
      }

      if (!values.status) {
        errors.status = "Status is required";
      }

      if (!values.due_date) {
        errors.due_date = "Due date is required";
      } else if (new Date(values.due_date) < new Date(new Date().toDateString())) {
        errors.due_date = "Due date cannot be in the past";
      }

      return errors;
    },
    onSubmit: async (values) => {
      const updatedValues = {
        ...values,
        due_date: Math.floor(new Date(values.due_date).getTime() / 1000), 
      };
      try {
        const response: { data: Task } = await fetcher(`/tasks/${task.id}`, {
          method: "PUT",
          body: JSON.stringify(updatedValues),
        });
        updateTask(task.id, response.data);
        showToast("Task updated successfully", "success");
        handleEdit();
      } catch (error) {
        if(error instanceof Error) {
          showToast(error.message, "error");
        } else {
          showToast("An unknown error occurred", "error");
        }
      }
    },
  });

   const debouncedSearch = useDebounce(async (query: string): Promise<User[]> => {
    try {
      const response: { data: User[] } = await fetcher(`/users/search?q=${query}`);
      setData(response.data);
    } catch (error) {
      setData([]);
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('An unknown error occurred', 'error');
      }
    }
  }, 300);



  // const fieldProps = formik.getFieldProps('assignee_id');

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <Input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          {formik.errors.title && <p className="text-red-500">{formik.errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <Textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
        </div>

        <div>
          <label htmlFor="priority">Status</label>
          <Select
            name="status"
            value={formik.values.status}
            onValueChange={(value) => formik.setFieldValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          {formik.errors.status && <p className="text-red-500">{formik.errors.status}</p>}
        </div>

        <div>
          <label htmlFor="assignee_id">Assignee</label>
            <SearchableSelect
              value={formik.values.assignee_id}
              onChange={(value) => formik.setFieldValue("assignee_id", value)}
              placeholder="Search for assignee"
              className="w-full"
              initialLabel={task.assignee?.full_name || ""}
              selectedLabel={formik.values.assignee_id}

            />
        </div>

        <div>
          <label htmlFor="due_date">Due Date</label>
          <Input
            type="date"
            name="due_date"
            value={formik.values.due_date}
            onChange={formik.handleChange}
          />
          {formik.errors.due_date && <p className="text-red-500">{formik.errors.due_date}</p>}
        </div>

        <Button
         type="submit"
         disabled={formik.isSubmitting}
         className="bg-black text-white cursor-pointer hover:bg-black/80 hover:text-white"
        >
          {formik.isSubmitting ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Update Task"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditTask;
