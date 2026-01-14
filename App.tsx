
import React, { useState, useEffect } from 'react';
import { UserRole, ActiveTab, User } from './types';
import Layout from './components/Layout';
import StudentDashboard from './components/StudentDashboard';
import ParentPortal from './components/ParentPortal';
import PaymentPortal from './components/PaymentPortal';
import AIOverlay from './components/AIOverlay';
import LiveMentor from './components/LiveMentor';
import { StorageService } from './services/storageService';
// Fix: Import ArrowRight for the API key documentation link
import { ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DASHBOARD);
  const [aiOverlayMode, setAiOverlayMode] = useState<'chat' | 'voice' | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showLiveMentor, setShowLiveMentor] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
        if (typeof window.aistudio !== 'undefined') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setHasApiKey(hasKey);
        }
    };
    checkApiKey();
    
    // Auto-login for demo session persistence
    const savedUser = StorageService.getCurrentUser();
    if (savedUser) setUser(savedUser);
    else setUser(StorageService.login('demo@more.org', UserRole.STUDENT));
  }, []);

  const handleOpenAiKeySelector = async () => {
     if (typeof window.aistudio !== 'undefined') {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
     }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setActiveTab(ActiveTab.DASHBOARD);
    StorageService.login('demo@more.org', newRole);
  };

  const renderContent = () => {
    if (role === UserRole.PARENT) {
      if (activeTab === ActiveTab.PAYMENTS) return <PaymentPortal />;
      return <ParentPortal />;
    }

    switch (activeTab) {
      case ActiveTab.DASHBOARD:
        if (role === UserRole.STUDENT) return <StudentDashboard />;
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{role} Dashboard</h2>
            <p className="text-slate-500 max-w-sm">Manage educational resources, review performance, and oversee program health.</p>
          </div>
        );
      case ActiveTab.CURRICULUM:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 font-black text-xl">0{i}</div>
                <h3 className="font-bold text-slate-800 text-xl mb-3">Modular Logic {i}</h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">Master the fundamentals of circuit design and system architecture for large scale IoT projects.</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-600 tracking-widest">Core Skill</span>
                  <button className="text-sm font-black bg-slate-900 text-white px-6 py-2.5 rounded-xl">Start Unit</button>
                </div>
              </div>
            ))}
          </div>
        );
      case ActiveTab.PORTFOLIO:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black tracking-tight">Professional Portfolio</h2>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-200">Export PDF</button>
            </div>
            <div className="bg-white p-24 rounded-[3rem] border border-slate-200 text-center flex flex-col items-center shadow-inner">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">📁</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Build Your Masterpiece</h3>
                <p className="text-slate-500 max-w-md">Your portfolio is empty. Add projects from your dashboard to showcase your technical and creative mastery to the world.</p>
            </div>
          </div>
        );
      case ActiveTab.PAYMENTS:
        return <PaymentPortal />;
      case ActiveTab.SETTINGS:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-8">System Configuration</h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group">
                        <span className="font-bold text-slate-700">Push Notifications</span>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                        <span className="font-bold text-slate-700">Cloud Data Sync</span>
                        <span className="text-blue-600 text-sm font-black uppercase">Active</span>
                    </div>
                </div>
            </div>
            <button onClick={() => StorageService.logout()} className="w-full py-4 text-red-600 font-black bg-red-50 rounded-3xl border border-red-100 hover:bg-red-100 transition-colors">
                Secure Logout
            </button>
          </div>
        );
      default:
        return <StudentDashboard />;
    }
  };

  if (!hasApiKey) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl">🔐</div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Platform Access</h2>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                    To power cinematic video reveals and advanced project retouches, please connect your AI Studio billing account.
                </p>
                <button 
                    onClick={handleOpenAiKeySelector}
                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200"
                >
                    Connect API Key
                </button>
                <div className="mt-8 pt-8 border-t border-slate-100">
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-slate-400 font-bold hover:text-blue-500 flex items-center justify-center gap-2 uppercase tracking-widest">
                        Documentation <ArrowRight className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
  }

  return (
    <Layout 
        role={role} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRoleChange={handleRoleChange} 
        onLogout={() => StorageService.logout()}
        onOpenAI={(mode) => mode === 'voice' ? setShowLiveMentor(true) : setAiOverlayMode(mode)}
    >
      {renderContent()}
      <AIOverlay mode={aiOverlayMode} onClose={() => setAiOverlayMode(null)} />
      {showLiveMentor && <LiveMentor onClose={() => setShowLiveMentor(false)} />}
    </Layout>
  );
};

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Fix: Make aistudio optional to match other potential declarations and prevent modifier mismatch errors
    aistudio?: AIStudio;
    webkitAudioContext: typeof AudioContext;
  }
}

export default App;
