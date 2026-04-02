import React from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../store';

export default function Header() {
  const { clearHistory, setGeneratedCode, setLoadingStep } = useStore();

  const resetSession = () => {
    clearHistory();
    setGeneratedCode('');
    setLoadingStep('idle');
  };

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-[#1F1F22] bg-[#0E0E0E] flex-shrink-0">
        <div className="flex items-center gap-2 cursor-pointer group">
            <div className="grid grid-cols-3 gap-[2px] w-5 h-5">
                <div className="bg-white rounded-[1px]"></div>
                <div className="bg-white rounded-[1px]"></div>
                <div className="bg-white/30 rounded-[1px]"></div>
                <div className="bg-white rounded-[1px]"></div>
                <div className="bg-brand-pink rounded-[1px] shadow-[0_0_8px_#FF0055]"></div>
                <div className="bg-white rounded-[1px]"></div>
                <div className="bg-white/30 rounded-[1px]"></div>
                <div className="bg-white rounded-[1px]"></div>
                <div className="bg-white rounded-[1px]"></div>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">Alock UI</span>
        </div>
        <button onClick={resetSession} className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md transition">
            <Plus className="w-3.5 h-3.5" /> New Chat
        </button>
    </div>
  );
}