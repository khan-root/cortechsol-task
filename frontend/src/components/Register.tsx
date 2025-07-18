import { useFormik } from 'formik';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { showToast } from './Toaster';
import { fetcher } from '../lib/fetcher';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: { full_name?: string; email?: string; password?: string } = {};

      if (!values.full_name) {
        errors.full_name = 'Full name is required';
      }

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res:{message:string} = await fetcher('/auth/register', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        showToast(res.message, 'success');
        navigate('/sign');
      } catch (err) {
          if (err instanceof Error) {
            showToast(err.message, 'error');
          } else {
            showToast('An unexpected error occurred', 'error');
          }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className='h-full w-full flex flex-col items-center justify-center'>
      <div className='h-full w-[70%] md:h-[50%] md:w-[40%] flex flex-col items-center justify-center'>
        <div className="flex items-center justify-center">
          <h2 className="text-white text-2xl font-bold">Register</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 w-full px-10 md:p-10">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold">Full Name</label>
            <Input
              name="full_name"
              type="text"
              placeholder="Enter your full name"
              className="text-white focus:border-white focus:ring-white placeholder:text-white"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.full_name && formik.errors.full_name && (
              <span className="text-red-400 text-sm">{formik.errors.full_name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="text-white focus:border-white focus:ring-white placeholder:text-white"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-400 text-sm">{formik.errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold">Password</label>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="text-white focus:border-white focus:ring-white placeholder:text-white"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-400 text-sm">{formik.errors.password}</span>
            )}
          </div>

          <div className="flex justify-end">
            <Link to="/sign" className="text-white text-sm cursor-pointer hover:text-white/80">
              Already have an account? Login
            </Link>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-white text-black cursor-pointer hover:bg-white/80 hover:text-black"
            >
              {formik.isSubmitting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
