
import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Shield, Zap, Info, Sparkles } from 'lucide-react';

const PaymentPortal: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        alert("Payment simulated successfully! Thank you for supporting the MORE program.");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Simple Pricing</h2>
        <p className="text-slate-500 text-lg">Invest in the future of skills and innovation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Standard Plan */}
        <div 
            onClick={() => setSelectedPlan('standard')}
            className={`cursor-pointer group relative bg-white p-8 rounded-3xl border-2 transition-all duration-300 ${
                selectedPlan === 'standard' ? 'border-blue-600 shadow-2xl shadow-blue-100 scale-105' : 'border-slate-200 hover:border-slate-300'
            }`}
        >
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl ${selectedPlan === 'standard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Shield className="w-6 h-6" />
                    </div>
                    {selectedPlan === 'standard' && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Standard Access</h3>
                    <p className="text-slate-500 text-sm">Everything needed for a single track.</p>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">$49</span>
                    <span className="text-slate-400 font-medium">/month</span>
                </div>
                <ul className="space-y-3 pt-6">
                    {['Access to 1 Learning Track', 'AI Mentor Chat', 'Skills Passport', 'Basic Portfolio'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> {f}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Premium Plan */}
        <div 
            onClick={() => setSelectedPlan('premium')}
            className={`cursor-pointer group relative overflow-hidden bg-slate-900 p-8 rounded-3xl border-2 transition-all duration-300 ${
                selectedPlan === 'premium' ? 'border-indigo-500 shadow-2xl shadow-indigo-200 scale-105' : 'border-slate-800 hover:border-slate-700'
            }`}
        >
            <div className="absolute top-0 right-0 p-4">
                <div className="bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg animate-pulse">
                    Popular
                </div>
            </div>
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/50">
                        <Zap className="w-6 h-6" />
                    </div>
                    {selectedPlan === 'premium' && <CheckCircle2 className="w-6 h-6 text-indigo-400" />}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Full Program</h3>
                    <p className="text-slate-400 text-sm">Unrestricted access for power learners.</p>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$89</span>
                    <span className="text-slate-500 font-medium">/month</span>
                </div>
                <ul className="space-y-3 pt-6">
                    {['Access to ALL Tracks', 'Priority AI Support', 'Advanced Video Showcase', 'Certification Path', 'Career Coaching'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" /> {f}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

      {/* Checkout Area */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mt-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-bold text-slate-900">Payment Method</h4>
                </div>
                <div className="p-4 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400 italic">VISA</div>
                        <div>
                            <p className="font-bold text-slate-800">•••• 4242</p>
                            <p className="text-xs text-slate-400">Exp: 12/26</p>
                        </div>
                    </div>
                    <button className="text-blue-600 text-xs font-bold hover:underline">Change</button>
                </div>
            </div>
            <div className="w-full md:w-80 space-y-4">
                <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">${selectedPlan === 'standard' ? '49.00' : '89.00'}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                    <span>Tax (0%)</span>
                    <span className="font-bold text-slate-800">$0.00</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-blue-600">${selectedPlan === 'standard' ? '49.00' : '89.00'}</span>
                </div>
                <button 
                    disabled={isProcessing}
                    onClick={handlePay}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isProcessing ? (
                        <>Processing...</>
                    ) : (
                        <><Sparkles className="w-4 h-4" /> Secure Checkout</>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal;
