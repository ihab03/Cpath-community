import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';

// 1. Zod Schema (Simpler than register, just ensuring they aren't empty)
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { mutate: loginUser, isPending } = useLogin();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Handle Submission & 401 Errors
  const onSubmit = (data: LoginFormValues) => {
    loginUser(data, {
      // Note: onSuccess navigation is already handled inside the useLogin hook!
      onError: (err) => {
        const error = err as AxiosError<any>;
        
        // Catch the 401 Unauthorized from the C# backend
        if (error.response?.status === 401) {
          setError('root', {
            type: 'server',
            message: 'Invalid email or password.'
          });
        } else {
          // Fallback for network crashes or 500 server errors
          setError('root', {
            type: 'server',
            message: 'An unexpected error occurred. Please try again later.'
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex items-center justify-center p-4 md:p-8 overflow-hidden font-inter">
      {/* Background Glow */}
      <div className="absolute top-[50%] right-[-10%] w-[50%] h-[50%] bg-[#DC5F00]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-6xl min-h-[700px] bg-[#161616] rounded-[40px] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* LEFT COLUMN: VISUAL */}
        <div className="hidden md:block flex-1 relative bg-gray-900 order-2 md:order-1">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="Cyber Security / Login" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6] grayscale-[20%]"
          />
          <div className="absolute bottom-12 left-12 right-12 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10">
            <h4 className="text-white font-bold text-xl mb-2">Welcome back.</h4>
            <p className="text-gray-300 text-sm leading-relaxed">Pick up right where you left off. The Cpath community is waiting for you.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="w-full md:w-[45%] flex flex-col justify-center p-10 lg:p-16 bg-[#161616] order-1 md:order-2">
          <div className="mb-8 text-left">
            <h1 className="text-[#DC5F00] text-xl font-bold tracking-widest uppercase mb-2">Cpath.</h1>
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">Sign In</h2>
            <p className="text-gray-500 font-medium">Access your dashboard and career insights.</p>
          </div>

          {/* THE 401 ERROR BANNER */}
          {errors.root && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                {...register('email')} 
                className={`w-full bg-[#0F0F0F] border ${errors.email ? 'border-red-500' : 'border-white/5'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all`} 
                placeholder="name@example.com" 
              />
              {errors.email && <p className="mt-1 text-xs text-red-400 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1 mr-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                {/* FORGOT PASSWORD LINK */}
                <Link to="/forgot-password" className="text-xs font-bold text-[#DC5F00] hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <input 
                type="password" 
                {...register('password')} 
                className={`w-full bg-[#0F0F0F] border ${errors.password ? 'border-red-500' : 'border-white/5'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all`} 
                placeholder="••••••••" 
              />
              {errors.password && <p className="mt-1 text-xs text-red-400 ml-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isPending} 
              className="w-full bg-[#DC5F00] hover:bg-[#b04c00] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#DC5F00]/20 mt-4 flex justify-center items-center"
            >
              {isPending ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500">
              Don't have an account? <Link to="/register" className="text-white font-bold hover:text-[#DC5F00] underline underline-offset-4">Create one</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};