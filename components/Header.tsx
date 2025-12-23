
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">WeChat2Word</h1>
            <p className="text-xs text-slate-500">Python 脚本生成器</p>
          </div>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-sm font-medium text-emerald-600">脚本生成</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">使用文档</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">常见问题</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
