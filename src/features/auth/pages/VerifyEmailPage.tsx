import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, Link } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useAuth';

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(1, "Code is required"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export const VerifyEmailPage = () => {
  const location = useLocation();
  const { mutate: verify, isPending } = useVerifyEmail();
  const { register, handleSubmit } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: location.state?.email || '', code: '' }
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex items-center justify-center p-4 md:p-8 font-roboto">
<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#DC5F00]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-6xl min-h-[750px] bg-[#161616] rounded-[40px] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full md:w-[45%] flex flex-col justify-center p-10 lg:p-16 bg-[#161616]">
          <div className="mb-10 text-left">
            <div className="w-12 h-12 bg-[#DC5F00]/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#DC5F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Verify Your Email</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              We sent a code to <span className="text-white font-semibold">{location.state?.email || 'your inbox'}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit(data => verify(data))} className="space-y-6">
            <input 
              {...register('code')} 
              className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl px-6 py-5 text-center text-3xl font-black tracking-[0.5em] text-white focus:border-[#DC5F00] transition-all outline-none" 
              placeholder="0000" 
            />
            <button type="submit" disabled={isPending} className="w-full bg-[#DC5F00] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#DC5F00]/20">
              {isPending ? "Verifying..." : "Confirm Code"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Didn't receive it? <button className="text-[#D97706] hover:text-[#DC5F00] font-bold">Resend Code</button>
          </p>
        </div>

        {/* RIGHT COLUMN: VISUAL (Fixed Background) */}
        <div className="hidden md:block flex-1 relative bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070" 
            alt="Connect" 
            className="absolute inset-0 w-full h-full object-cover brightness-[60%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161616] via-transparent to-transparent w-32" />
        </div>
      </div>
    </div>
  );
};