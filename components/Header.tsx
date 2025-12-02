import React from 'react';
import { ArrowRightLeft, LifeBuoy } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-slate-900/90">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 select-none">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-2.5 rounded-xl shadow-lg shadow-green-500/20">
            <ArrowRightLeft className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              HIMAN
            </h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Public Converter Tool</p>
          </div>
        </div>

        <a 
          href="mailto:vdses.ngo@gmail.com?subject=HIMAN Support Request"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-all text-slate-300 hover:text-white active:scale-95 no-underline"
          title="Contact Support"
        >
            <LifeBuoy className="w-4 h-4" />
            <span>Support</span>
        </a>
      </div>
    </header>
  );
};