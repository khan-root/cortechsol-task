import { Input } from '../../components/ui/input'
import { useFormik } from 'formik'
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Check, Loader2, Loader2Icon } from 'lucide-react';
import { fetcher } from '../../lib/fetcher';
import { showToast } from '../../components/Toaster';
import useStore from '../../store/store';
import type { Task, User } from '../../utils/types';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { useDebounce } from '../../hooks/debounce';
import { cn } from '../../lib/utils';
import { SearchableSelect } from '../../components/ui/searchable';

type Props = {
  handleOpenDialog: () => void;
}

const AddTask = ({ handleOpenDialog }: Props) => {
  const addTask = useStore((state) => state.addTask); 
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      priority: "",
      due_date: "",
      status: "todo",
      assignee_id: "",
    },
    validate: (values) => {
      const errors: { title?: string; description?: string; priority?: string; due_date?: string; assignee_id?: string; status?: string } = {};
      if (!values.title.trim()) {
        errors.title = "Title is required";
      } else if (values.title.trim().length < 3) {
        errors.title = "Title must be at least 3 characters";
      }

      if (!values.assignee_id) {
        errors.assignee_id = "Assignee is required";
      }

      if (!values.priority) {
        errors.priority = "Priority is required";
      }

      if (!values.due_date) {
        errors.due_date = "Due date is required";
      } else if (new Date(values.due_date) < new Date(new Date().toDateString())) {
        errors.due_date = "Due date cannot be in the past";
      }

      if (!values.status) {
        errors.status = "Status is required";
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const newTask = {
        ...values,
        due_date: Math.floor(new Date(values.due_date).getTime() / 1000),
      };

      try {
        const response: { data: Task } = await fetcher("/tasks", {
          method: "POST",
          body: JSON.stringify(newTask),
        });
        showToast("Task added successfully", "success");
        addTask(response.data);
        handleOpenDialog()
      } catch (error) {
        if(error instanceof Error) {
          showToast(error.message, "error");
        } else {
          showToast("An unknown error occurred", "error");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });


  const debouncedSearch = useDebounce(async (query: string): Promise<User[]> => {
    try {
      const response: { data: User[] } = await fetcher(`/users/search?q=${query}`);
      // setData(response.data);
      return response.data;
    } catch (error) {
      // setData([]);
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('An unknown error occurred', 'error');
      }
    }
  }, 300);



  const fieldProps = formik.getFieldProps('assignee_id');


  



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
          <label>Assignee</label>
            <SearchableSelect
              value={formik.values.assignee_id}
              onChange={(value) => formik.setFieldValue("assignee_id", value)}
              selectedLabel={formik.values.assignee_id}
            />


          {formik.errors.assignee_id && <p className="text-red-500">{formik.errors.assignee_id}</p>}
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <Select
            name="status" 
            value={formik.values.status}
            onValueChange={(value) => formik.setFieldValue("status", value)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className='w-full'>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          {formik.errors.status && <p className="text-red-500">{formik.errors.status}</p>}
        </div>
        <div>
          <label htmlFor="priority">Priority</label>
          <Select
            name="priority"
            value={formik.values.priority}
            onValueChange={(value) => formik.setFieldValue("priority", value)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent className='w-full'>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          {formik.errors.priority && <p className="text-red-500">{formik.errors.priority}</p>}
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
            "Add Task"
          )}
        </Button>
      </form>
    </div>
  )
}

export default AddTask