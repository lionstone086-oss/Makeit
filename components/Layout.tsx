
import React from 'react';
import { UserRole, ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Wallet, 
  Settings, 
  LogOut, 
  Mic,
  MessageSquare,
  UserCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  onOpenAI: (mode: 'chat' | 'voice') => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  role, 
  activeTab, 
  onTabChange, 
  onRoleChange, 
  onLogout, 
  onOpenAI 
}) => {
  const navItems = [
    { id: ActiveTab.DASHBOARD, label: 'Home', icon: LayoutDashboard },
    { id: ActiveTab.CURRICULUM, label: 'Learn', icon: BookOpen },
    { id: ActiveTab.PORTFOLIO, label: 'Work', icon: Briefcase },
    { id: ActiveTab.PAYMENTS, label: 'Pay', icon: Wallet },
    { id: ActiveTab.SETTINGS, label: 'Set', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 md:pb-0 md:pl-20">
      {/* Desktop Sidebar (Mini) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-20 bg-white border-r border-slate-200 flex-col items-center py-8 z-40">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-12 shadow-lg shadow-blue-200">
          M
        </div>
        <nav className="flex-1 space-y-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title={item.label}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </aside>

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="md:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <h1 className="text-xl font-bold text-slate-900">
            {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
          </h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => onOpenAI('chat')}
            className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-transform active:scale-95"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <select 
            value={role} 
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="text-xs font-bold uppercase tracking-wider bg-slate-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            <option value={UserRole.STUDENT}>Alex (Student)</option>
            <option value={UserRole.INSTRUCTOR}>Instructor</option>
            <option value={UserRole.PARENT}>Parent</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl flex items-center justify-around py-4 px-2 z-40">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${
              activeTab === item.id ? 'bg-blue-600 text-white scale-110 -translate-y-1 shadow-lg shadow-blue-200' : 'text-slate-400'
            }`}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-bold ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </button>
        ))}
        <button 
          onClick={() => onOpenAI('voice')}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg shadow-indigo-200 -translate-y-4"
        >
          <Mic className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
};

export default Layout;
