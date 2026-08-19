import React from 'react';
import { Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-lg">
            <Cpu className="w-5 h-5" />
            <span>Tech<span className="text-white">Nova</span></span>
          </div>
          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} TechNova. B.Tech DevOps Capstone Placement Project.
          </p>
          <div className="text-xs text-slate-600">
            Smart Shopping. Better Technology.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
