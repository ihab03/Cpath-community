import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

// 1. Zod Schema updated with the non-alphanumeric rule!
const registerSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string()
    .min(6, "Must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one non-alphanumeric character (e.g. !@#$%)"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegister();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // 2. Handle form submission & Backend Errors
  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data, {
      onSuccess: () => {
        // Navigate to verify page, passing the email along
        navigate('/verify-email', { state: { email: data.email } });
      },
      onError: (err) => {
        const error = err as AxiosError<any>;
        
        // Map C# validation errors to React Hook Form
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;

          Object.keys(backendErrors).forEach((key) => {
            const cleanKey = key.split('.').pop()?.toLowerCase(); 
            
            // Map the cleaned C# key back to the React Hook Form keys
            let formKey: keyof RegisterFormValues | undefined;
            if (cleanKey === 'firstname') formKey = 'firstName';
            else if (cleanKey === 'lastname') formKey = 'lastName';
            else if (cleanKey === 'email') formKey = 'email';
            else if (cleanKey === 'password') formKey = 'password';

            if (formKey) {
              setError(formKey, {
                type: 'server',
                message: backendErrors[key][0]
              });
            }
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex items-center justify-center p-4 md:p-8 overflow-hidden font-roboto">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#DC5F00]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-6xl min-h-[750px] bg-[#161616] rounded-[40px] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full md:w-[45%] flex flex-col justify-center p-10 lg:p-16 bg-[#161616]">
          <div className="mb-8 text-left">
            <h1 className="text-[#DC5F00] text-xl font-bold tracking-widest uppercase mb-2">Cpath.</h1>
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">Create Account</h2>
            <p className="text-gray-500 font-medium">Join thousands of students mapping their future.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input {...register('firstName')} className={`w-full bg-[#0F0F0F] border ${errors.firstName ? 'border-red-500' : 'border-white/5'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all`} placeholder="First Name" />
                {errors.firstName && <p className="mt-1 text-xs text-red-400 ml-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <input {...register('lastName')} className={`w-full bg-[#0F0F0F] border ${errors.lastName ? 'border-red-500' : 'border-white/5'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all`} placeholder="Last Name" />
                {errors.lastName && <p className="mt-1 text-xs text-red-400 ml-1">{errors.lastName.message}</p>}
              </div>
            </div>
            
            <div>
              <input {...register('email')} className={`w-full bg-[#0F0F0F] border ${errors.email ? 'border-red-500' : 'border-white/5'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all`} placeholder="Email Address" />
              {errors.email && <p className="mt-1 text-xs text-red-400 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <input type="password" {...register('password')} className={`w-full bg-[#0F0F0F] border ${errors.password ? 'border-red-500' : 'border-white/5'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all`} placeholder="Password (6+ characters)" />
              {errors.password && <p className="mt-1 text-xs text-red-400 ml-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isPending} className="w-full bg-[#DC5F00] hover:bg-[#b04c00] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#DC5F00]/20 mt-4 flex justify-center items-center">
              {isPending ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Get Started"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500">
              Already have an account? <Link to="/login" className="text-white font-bold hover:text-[#DC5F00] underline underline-offset-4">Log in</Link>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUAL */}
        <div className="hidden md:block flex-1 relative bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3R1ZGVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
            alt="Students collaborating" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161616] via-transparent to-transparent w-32" />
          <div className="absolute bottom-12 left-12 right-12 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10">
            <h4 className="text-white font-bold text-xl mb-2">Build your path.</h4>
            <p className="text-gray-300 text-sm leading-relaxed">Access exclusive data and peer mentorship designed for your success.</p>
          </div>
        </div>
      </div>
    </div>
  );
};