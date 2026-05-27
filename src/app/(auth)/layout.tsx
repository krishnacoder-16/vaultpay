import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fafbfc] px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Soft Ambient Light Glow */}
      <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[800px] h-[800px] bg-slate-500/5 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Pristine Modern Dot Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {children}
      </div>
    </div>
  );
}
