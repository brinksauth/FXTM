'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import LoginParticleBackground from '@/components/LoginParticleBackground';
import { mockUser } from '@/data/mockData';

const GemIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 3h12l4 6-10 12L2 9z" />
    <path d="M11 3 8 9l4 12 4-12-3-6" />
    <path d="M2 9h20" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto pre-fill preset details for user testing ease
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const savedEmail = localStorage.getItem('remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Completa todos los campos de acceso.');
      return;
    }

    if (email.toLowerCase() !== mockUser.email.toLowerCase() || password !== mockUser.password) {
      setError('Correo o clave de acceso incorrectos.');
      return;
    }

    setLoading(true);

    // Simulate server delay
    setTimeout(() => {
      setLoading(false);
      
      // Save session in LocalStorage
      localStorage.setItem('user_session', JSON.stringify({ email, isLoggedIn: true }));
      
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-black overflow-hidden">
      <LoginParticleBackground />

      {/* Floating back button */}
      <Link
        href="/"
        className="absolute top-8 left-6 md:left-8 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white border border-white/15 rounded-xl hover:bg-white/10 transition-all z-10"
      >
        &larr; Volver al inicio
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white border border-border-main rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
      >
        {/* Header logo */}
        <div className="flex flex-col items-center text-center">
          <GemIcon className="w-10 h-10 text-orange-primary mb-4" />
          <h2 className="font-display font-extrabold text-2xl text-gray-900 tracking-tight">
            Acceso al Portal Privado
          </h2>
          <p className="text-text-muted text-xs mt-2">
            Acceso seguro para inversionistas de Bitcoin Gem Colombia
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/35 rounded-xl flex items-center gap-2.5 text-xs text-red-600"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Correo electronico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ingresa tu correo"
                className="w-full bg-bg-main border border-border-main rounded-xl pl-11 pr-4 py-3.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-primary focus:shadow-glow transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Clave de acceso</label>
              <a href="#" className="text-[10px] font-semibold text-orange-primary hover:underline">
                Olvidaste tu clave?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ingresa tu clave"
                className="w-full bg-bg-main border border-border-main rounded-xl pl-11 pr-11 py-3.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-primary focus:shadow-glow transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Keep logged in check */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer select-none font-semibold">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 rounded-lg border-border-main text-orange-primary focus:ring-orange-primary bg-bg-main"
              />
              <span>Recordar correo</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-orange-primary hover:bg-orange-hover text-sm font-bold text-white shadow-xl shadow-orange-primary/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Validando acceso...</span>
              </>
            ) : (
              <span>Entrar al panel</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
