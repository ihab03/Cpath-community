import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Adjust these imports based on where your Sidebar file lives!
import { useMyProfile } from '../../features/profile/hooks/useProfile';
import { useJoinedCommunities, useAllCommunities } from '../../features/communities/hooks/useCommunity';

// 1. Add this interface
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const location = useLocation();
  const { data: currentUser } = useMyProfile();
  
  // Bring in BOTH hooks to ensure we can look up the community names safely
  const { data: joinedCommunities, isLoading } = useJoinedCommunities(currentUser?.userId);
  const { data: allCommunities } = useAllCommunities();

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON (Visible only on small screens) */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-[#0A0A0A]/95 backdrop-blur-xl border-r border-white/5 flex flex-col font-sans transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* 1. Logo & Collapse Toggle */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <span className="text-white font-extrabold text-xl tracking-tight">Cpath</span>
          </div>

          {/* Desktop Collapse Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. Main Navigation */}
        <nav className="p-4 space-y-1.5 shrink-0">
          <NavItem to="/home" icon="home" label="Home" active={location.pathname === '/home'} isCollapsed={isCollapsed} />
          <NavItem to="/explore" icon="grid" label="Explore" active={location.pathname.includes('/explore')} isCollapsed={isCollapsed} />
          <NavItem to="/assessment" icon="clipboard" label="Career Test" active={location.pathname.includes('/assessment')} isCollapsed={isCollapsed} />
        </nav>

        {/* 3. Dynamic Communities Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar mt-4 px-4 pb-6">
          <div className={`flex items-center justify-between mb-4 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">My Communities</span>
            <Link to="/explore" className="text-gray-500 hover:text-[#D97706] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </Link>
          </div>

          {/* Show loading spinner, empty state, or dynamic list */}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-[#D97706]/30 border-t-[#D97706] rounded-full animate-spin"></div>
            </div>
          ) : joinedCommunities && joinedCommunities.length > 0 ? (
            <ul className="space-y-1">
              {joinedCommunities.map((c: any) => {
                // Safely grab the ID (handles if 'c' is just a string or an object)
                const communityId = typeof c === 'string' ? c : c.id;
                
                // Cross-reference allCommunities to get the real name, or fallback to 'Community'
                const communityName = allCommunities?.find((ac: any) => ac.id === communityId)?.name 
                                      || (typeof c !== 'string' ? c.name : null) 
                                      || 'Community';

                return (
                  <CommunityItem 
                    key={communityId} 
                    to={`/community/${communityId}`}
                    color="bg-green-500" // <-- Hardcoded to green!
                    label={communityName} 
                    isCollapsed={isCollapsed}
                    active={location.pathname === `/community/${communityId}`}
                  />
                );
              })}
            </ul>
          ) : (
            <div className={`text-center py-4 px-2 bg-white/5 rounded-xl border border-white/5 ${isCollapsed ? 'hidden' : 'block'}`}>
              <p className="text-xs text-gray-400 mb-2">No communities yet.</p>
              <Link to="/explore" className="text-xs font-medium text-[#D97706] hover:underline">Find one!</Link>
            </div>
          )}
        </div>

        {/* 4. Bottom Settings Area */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <NavItem to="/profile/edit" icon="settings" label="Settings" active={location.pathname.includes('/profile/edit')} isCollapsed={isCollapsed} />
        </div>
        
      </aside>
    </>
  );
};

// --- HELPER COMPONENTS ---

const NavItem = ({ to, icon, label, active = false, isCollapsed }: { to: string, icon: string, label: string, active?: boolean, isCollapsed: boolean }) => {
  const icons: any = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    grid: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    message: <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
    clipboard: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  };

  return (
    <Link 
      to={to} 
      className={`flex items-center px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden ${
        active ? 'bg-gradient-to-r from-[#D97706]/20 to-transparent text-white border border-[#D97706]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : undefined}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D97706] rounded-r-full" />}
      <svg className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-[#D97706]' : 'text-gray-500 group-hover:text-white'} ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {icons[icon]}
      </svg>
      <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
        {label}
      </span>
    </Link>
  );
}

const CommunityItem = ({ to, color, label, isCollapsed, active }: { to: string, color: string, label: string, isCollapsed: boolean, active: boolean }) => (
  <li>
    <Link 
      to={to} 
      className={`flex items-center px-3 py-2 rounded-xl transition-colors group relative ${
        active ? 'bg-white/10 text-white' : 'hover:bg-white/5'
      } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
      title={isCollapsed ? label : undefined}
    >
      {active && <div className="absolute left-0 top-1 bottom-1 w-1 bg-white/50 rounded-r-full" />}
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ${color}`}></span>
      <span className={`text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 ${
        active ? 'text-white' : 'text-gray-400 group-hover:text-white'
      } ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
        {label}
      </span>
    </Link>
  </li>
);