import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardLogin from './DashboardLogin';
import DashboardHome from './DashboardHome';
import { RefreshCw } from 'lucide-react';

export default function DashboardRoute() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch current active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth state transitions reactively
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRefreshState = () => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02020a] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-violet-500 mb-3" />
        <p className="text-sm text-gray-400 font-medium">Validating credentials...</p>
      </div>
    );
  }

  if (!session) {
    return <DashboardLogin onLoginSuccess={handleRefreshState} />;
  }

  return <DashboardHome onSignOut={handleRefreshState} />;
}
