import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldAlert, KeyRound, Mail, Lock, RefreshCw, Key } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardLoginProps {
  onLoginSuccess: () => void;
}

export default function DashboardLogin({ onLoginSuccess }: DashboardLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        // Double check if the user metadata or email is correct.
        // Wait, for our project any authenticated user can view the dashboard.
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail('assistant@sahadental.com');
    setPassword('AssistantPassword2026!');
  };

  return (
    <div className="min-h-screen bg-[#02020a] flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">
      {/* Background Lighting Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel bg-[#050614]/80 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center mx-auto border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              Assistant Console
            </h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Secure authentication for clinical coordinators
            </p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5"
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Access Denied</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="e.g. assistant@sahadental.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 focus:border-violet-400/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 focus:border-violet-400/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-sweep bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm py-4 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center gap-2 transition-all duration-300"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Test credentials banner */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={fillTestCredentials}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/25 text-violet-300 hover:text-white text-xs font-medium transition-all duration-200"
            >
              <Key className="w-3.5 h-3.5" />
              Use seeded test credentials
            </button>
            <p className="text-[10px] text-gray-500 mt-2 font-mono">
              assistant@sahadental.com / AssistantPassword2026!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
