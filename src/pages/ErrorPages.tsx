import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, ShieldAlert, FileQuestion, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  code: 401 | 403 | 404 | 500;
}

const ERROR_DETAILS = {
  401: {
    title: 'Unauthorized Access',
    description: 'You must be signed in with a coordinator account to view this page.',
    icon: <Lock className="w-10 h-10 text-amber-400" />,
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
  },
  403: {
    title: 'Access Forbidden',
    description: 'You do not have the required permissions to perform this operation.',
    icon: <ShieldAlert className="w-10 h-10 text-red-400" />,
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
  },
  404: {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist or has been relocated.',
    icon: <FileQuestion className="w-10 h-10 text-violet-400" />,
    bg: 'bg-violet-500/5',
    border: 'border-violet-500/20',
  },
  500: {
    title: 'Internal Server Error',
    description: 'The server encountered an error and was unable to complete your request.',
    icon: <AlertTriangle className="w-10 h-10 text-red-400" />,
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
  },
};

export default function ErrorPages({ code }: ErrorPageProps) {
  const navigate = useNavigate();
  const details = ERROR_DETAILS[code] || ERROR_DETAILS[404];

  return (
    <div className="min-h-screen bg-[#02020a] flex items-center justify-center p-6 text-white relative overflow-hidden font-sans">
      {/* Dynamic Background Auras */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-3xl p-8 text-center space-y-6 shadow-2xl relative z-10">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto border ${details.bg} ${details.border}`}>
          {details.icon}
        </div>

        <div className="space-y-2">
          <span className="text-sm font-extrabold text-violet-400 tracking-widest font-mono">
            ERROR {code}
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            {details.title}
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            {details.description}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all duration-200"
          >
            Go to Homepage
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
