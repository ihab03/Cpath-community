import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../hooks/useAuth';

// Validation to ensure passwords match
const resetSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});

type ResetFormValues = z.infer<typeof resetSchema>;

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = (data: ResetFormValues) => {
    if (email && token) {
      resetPassword({ email, token, newPassword: data.newPassword }, {
        onSuccess: () => setIsSuccess(true)
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex items-center justify-center p-4 md:p-8 overflow-hidden font-roboto">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#DC5F00]/15 rounded-full blur-[120px]" />

      <div className="w-full max-w-6xl min-h-[600px] bg-[#161616] rounded-[40px] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* LEFT COLUMN: FORM AREA */}
        <div className="w-full md:w-[45%] flex flex-col justify-center p-10 lg:p-16 bg-[#161616]">
          
          {/* STATE 1: Handle Invalid Link */}
          {!email || !token ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Invalid Link</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                The password reset link is missing or malformed. Please request a new one.
              </p>
              <Link to="/forgot-password" className="w-full inline-block bg-[#DC5F00] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#DC5F00]/20 hover:bg-[#b04c00]">
                Request New Link
              </Link>
            </div>
          ) : isSuccess ? (
            
            /* STATE 2: Handle Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Password Updated</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Your password has been successfully reset. You can now log in with your new credentials.
              </p>
              <Link to="/login" className="w-full inline-block bg-[#DC5F00] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#DC5F00]/20 hover:bg-[#b04c00]">
                Go to Login
              </Link>
            </div>
          ) : (
            
            /* STATE 3: Normal Form State */
            <>
              <div className="mb-8">
                <h1 className="text-[#DC5F00] text-xl font-bold tracking-widest uppercase mb-2">Cpath.</h1>
                <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">Create New Password</h2>
                <p className="text-gray-500 font-medium text-sm">
                  For <span className="text-gray-300">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  The link has expired or is invalid.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
                  <input 
                    type="password" 
                    {...register('newPassword')} 
                    className={`w-full bg-[#0F0F0F] border ${errors.newPassword ? 'border-red-500' : 'border-white/5'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all`} 
                    placeholder="••••••••" 
                  />
                  {errors.newPassword && <p className="mt-2 text-xs text-red-400 ml-1">{errors.newPassword.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                  <input 
                    type="password" 
                    {...register('confirmPassword')} 
                    className={`w-full bg-[#0F0F0F] border ${errors.confirmPassword ? 'border-red-500' : 'border-white/5'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all`} 
                    placeholder="••••••••" 
                  />
                  {errors.confirmPassword && <p className="mt-2 text-xs text-red-400 ml-1">{errors.confirmPassword.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isPending} 
                  className="w-full bg-[#DC5F00] hover:bg-[#b04c00] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#DC5F00]/20 mt-4 flex justify-center items-center"
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: VISUAL (Matches the other pages) */}
        <div className="hidden md:block flex-1 relative bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=2070" 
            alt="Security Concept" 
            className="absolute inset-0 w-full h-full object-cover brightness-[40%] grayscale-[20%]" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161616] via-transparent to-transparent w-32" />
          <div className="absolute bottom-12 left-12 right-12 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10">
            <h4 className="text-white font-bold text-xl mb-2">Secure your account.</h4>
            <p className="text-gray-300 text-sm leading-relaxed">Ensure your password is strong and unique to protect your Cpath profile and career data.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};