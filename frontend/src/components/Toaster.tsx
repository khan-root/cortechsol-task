import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Toaster = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={1500}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{ zIndex: 99999 }}
    />
  );
};

const showToast = (message: string, type: 'success' | 'error' | 'warnning' | 'info' = 'info') => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warnning':
      toast.warn(message);
      break;
    default:
      toast.info(message);
  }
};

export { Toaster, showToast };
