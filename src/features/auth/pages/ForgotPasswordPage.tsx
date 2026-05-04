import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useAuth';

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: requestReset, isPending } = useForgotPassword();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = (data: ForgotFormValues) => {
    requestReset(data, {
      // Regardless of success/failure, we show the same screen to prevent enumeration
      onSettled: () => setIsSubmitted(true) 
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex items-center justify-center p-4 md:p-8 font-roboto">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#DC5F00]/15 rounded-full blur-[120px]" />

      <div className="w-full max-w-6xl min-h-[600px] bg-[#161616] rounded-[40px] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full md:w-[45%] flex flex-col justify-center p-10 lg:p-16 bg-[#161616]">
          <Link to="/login" className="text-gray-500 hover:text-white transition-colors mb-8 inline-flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Login
          </Link>

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">Reset Password</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Enter your email address and we'll send you a link to securely reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <input {...register('email')} className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#DC5F00] transition-all" placeholder="name@example.com" />
                  {errors.email && <p className="mt-2 text-xs text-red-400 ml-1">{errors.email.message}</p>}
                </div>

                <button type="submit" disabled={isPending} className="w-full bg-[#DC5F00] hover:bg-[#b04c00] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#DC5F00]/20 mt-2">
                  {isPending ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            // ENUMERATION PROTECTION: The Generic Success Screen
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#DC5F00]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#DC5F00]/30">
                <svg className="w-8 h-8 text-[#DC5F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Check your inbox</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                If an account exists with that email, we have sent a secure link to reset your password.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: VISUAL */}
        <div className="hidden md:block flex-1 relative bg-gray-900">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" alt="Security" className="absolute inset-0 w-full h-full object-cover brightness-[40%] grayscale-[30%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161616] via-transparent to-transparent w-32" />
        </div>
      </div>
    </div>
  );
};