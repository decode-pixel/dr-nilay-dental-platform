import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#02020a] flex items-center justify-center p-6 text-white relative overflow-hidden font-sans">
          {/* Dynamic Background Auras */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-md w-full bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-3xl p-8 text-center space-y-6 shadow-2xl relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                Something went wrong
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                An unexpected runtime error occurred. Our team has been notified.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-left">
                <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                  Technical Details
                </span>
                <p className="text-[11px] font-mono text-red-300 break-words leading-normal max-h-32 overflow-y-auto pr-1">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.children;
  }
}
