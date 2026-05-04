import React, { useState } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom'; // <-- Added useNavigate
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../features/auth/stores/useAuthStore';

export const AppLayout = () => {
  const { isAuthenticated, fullName, email, logout, avatarUrl } = useAuthStore();
  
  // Lift the sidebar state up so the layout can react to it!
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- NEW: Search State & Navigation ---
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#D97706]/30">
      
      {/* Pass the state down to the Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />

      {/* DYNAMIC MARGIN: Adjusts instantly when the sidebar toggles */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        
        {/* --- PREMIUM HEADER --- */}
        <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-8 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-20">
          
          {/* --- FUNCTIONAL SEARCH FORM --- */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex w-96 relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-11 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D97706]/50 focus:bg-white/[0.05] transition-all shadow-inner"
            />
            <button type="submit" className="absolute left-3.5 top-2.5">
              <svg className="w-5 h-5 text-gray-500 group-focus-within:text-[#D97706] transition-colors hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {/* Keyboard shortcut hint */}
            <div className="absolute right-3 top-2.5 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-500 bg-white/5 border border-white/10 rounded">↵</kbd>
            </div>
          </form>

          {/* Spacer for mobile */}
          <div className="md:hidden flex-1"></div>

          {/* Dynamic User Profile Area */}
          <div className="flex items-center gap-4 pl-4">
              
              <div className="w-px h-6 bg-white/10"></div>

              {/* Profile & Logout */}
              <div className="flex items-center gap-3 group cursor-pointer">
                
               <Link 
                to="/profile" 
                className="flex items-center gap-3 group cursor-pointer"
              >
                {/* Avatar Support (Falls back to initials if no image) */}
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName || ''} className="w-9 h-9 rounded-full object-cover border border-white/10 shadow-lg" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-sm font-bold text-white uppercase shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                    {fullName?.substring(0, 2) || 'CP'}
                  </div>
                )}
                
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-white group-hover:text-[#D97706] transition-colors">{fullName}</div>
                  <div className="text-[11px] font-medium text-gray-500">{email}</div>
                </div>
              </Link>

              {/* Logout Button */}
              <button 
                onClick={(e) => {
                  e.preventDefault(); 
                  logout();
                }}
                className="ml-2 text-gray-500 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-500/10"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
              </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 relative z-0">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};