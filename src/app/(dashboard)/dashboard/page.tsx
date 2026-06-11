'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  TrendingUp,
  Cpu,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';
import CountUp from '@/components/CountUp';
import TradingChart from '@/components/TradingChart';
import {
  mockUser,
  mockTransactions,
  mockWeeklyPerformance,
  mockInsights
} from '@/data/mockData';
import { privacyEventName, readPrivacyPreference } from '@/utils/privacy';

// HSL color palette mapping
const COLORS = [
  '#ffb3c3', // Blush Pink
  '#ff99ae', 
  '#ff8099', 
  '#ff6684', 
  '#ff4d6f', 
  '#ff335a', 
  '#ff1a45', 
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [isPrivate, setIsPrivate] = useState(true);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));

    const handlePrivacyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPrivate(customEvent.detail);
    };

    window.addEventListener(privacyEventName, handlePrivacyChange);
    setIsPrivate(readPrivacyPreference());

    // Rotate insights every 10s
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % mockInsights.length);
    }, 10000);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(interval);
      window.removeEventListener(privacyEventName, handlePrivacyChange);
    };
  }, []);

  const recentTransactions = mockTransactions.slice(0, 2);
  const portfolioValue = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(mockUser.portfolioValue);
  const profitValue = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(mockUser.profit);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    if (isPrivate) return '••••';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Portfolio Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass-panel border border-border-main rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-brand-primary/30 transition-all duration-300"
        >
          {/* Subtle bg glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Valor Total de Activos del Portafolio
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-primary mt-2">
                {portfolioValue}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className="flex items-center gap-1 font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{mockUser.growthPercentage}%
                </span>
                <span className="text-text-muted">Crecimiento de Rendimiento Neto</span>
              </div>
            </div>

            <div className="h-px sm:h-12 w-full sm:w-px bg-border-main my-2 sm:my-0" />

            <div className="grid grid-cols-2 gap-8 text-left">
              <div>
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                  Balance de Bitcoin
                </span>
                <span className="text-lg font-bold text-text-primary block mt-1.5 font-mono">
                  <CountUp end={mockUser.btcHoldings} suffix=" BTC" decimals={2} />
                </span>
                <span className="text-[10px] text-text-muted mt-1 block">
                  1 BTC = MXN 64.102
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                  Ganancias de la Cuenta
                </span>
                <span className="text-lg font-bold text-green-400 block mt-1.5">
                  +{profitValue}
                </span>
                <span className="text-[10px] text-text-muted mt-1 block">
                  Rendimiento de Bloque Acumulado
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Investment Plan Metadata Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 glass-panel border border-border-main rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand-primary/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Nivel de Inversión
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          </div>
          
          <div className="mt-4">
            <h3 className="font-display font-bold text-xl text-text-primary">
              {mockUser.investmentService}
            </h3>
            <p className="text-text-muted text-xs mt-1">
              Autorizado desde Dic 2025
            </p>
          </div>

          <div className="h-px bg-border-main my-4" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                ROI Objetivo Mensual
              </span>
              <span className="text-sm font-bold text-brand-primary mt-1">
                28% - 32% Anual
              </span>
            </div>
            <Link
              href="/portfolio"
              className="p-2.5 rounded-xl bg-bg-main border border-border-main hover:border-brand-primary/50 hover:text-brand-primary hover:shadow-[0_0_15px_rgba(255,179,195,0.2)] text-text-muted transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Main Line Chart View (TradingView) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="xl:col-span-8 glass-panel border border-border-main rounded-3xl p-6 flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
            <div>
              <h3 className="font-display font-semibold text-base text-text-primary">
                Gráfico de TradingView en Vivo
              </h3>
              <p className="text-text-muted text-[11px] mt-0.5">
                Datos de mercado en tiempo real y análisis técnico
              </p>
            </div>
          </div>

          {/* TradingChart Container */}
          <div className="h-[400px] w-full text-xs rounded-xl overflow-hidden border border-border-main">
            {mounted ? (
              <TradingChart />
            ) : (
              <div className="w-full h-full animate-shimmer" />
            )}
          </div>
        </motion.div>

        {/* Weekly Performance Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-4 glass-panel border border-border-main rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-display font-semibold text-base text-text-primary">
              Asignación Semanal
            </h3>
            <p className="text-text-muted text-[11px] mt-0.5">
              Porcentaje de participación de rendimiento neto por días hábiles
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative mt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockWeeklyPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="percentage"
                    stroke="rgba(42,35,79,0.5)"
                  >
                    {mockWeeklyPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="glass-panel p-2.5 rounded-xl text-xs shadow-xl">
                            <span className="font-bold text-text-primary block">{data.day}</span>
                            <span className="text-brand-primary block font-medium mt-0.5">
                              {data.percentage}% Participación
                            </span>
                            <span className="text-[10px] text-text-muted mt-0.5 block">
                              Ganado: {isPrivate ? '••••' : `MXN ${data.amount}`}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-40 h-40 rounded-full border border-border-main animate-shimmer" />
            )}
            
            {/* Center label */}
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Participación
              </span>
              <span className="text-lg font-extrabold text-text-primary mt-1">100%</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 text-[10px] text-text-muted font-semibold">
            {mockWeeklyPerformance.slice(0, 4).map((entry, idx) => (
              <div key={entry.day} className="flex items-center gap-1.5 justify-center">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                <span>{entry.day}</span>
              </div>
            ))}
            {mockWeeklyPerformance.slice(4).map((entry, idx) => (
              <div key={entry.day} className="flex items-center gap-1.5 justify-center">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx + 4] }} />
                <span>{entry.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights & Recent Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-5 glass-panel border border-border-main rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand-primary/30 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-text-primary">Analizador de Inteligencia de Mercado</h4>
              <span className="text-[9px] font-semibold text-brand-primary uppercase tracking-wider">
                Señales de IA en Vivo
              </span>
            </div>
          </div>

          {/* Fading Carousel Text */}
          <div className="min-h-24 flex items-center mt-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeInsight}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-text-primary leading-relaxed font-medium"
              >
                &ldquo;{mockInsights[activeInsight]}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-1.5 mt-4 justify-start">
            {mockInsights.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveInsight(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  activeInsight === idx ? 'bg-brand-primary shadow-[0_0_8px_rgba(255,179,195,0.8)]' : 'bg-border-main hover:bg-text-muted/40'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-7 glass-panel border border-border-main rounded-3xl p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border-main/50">
            <div>
              <h3 className="font-display font-semibold text-base text-text-primary">
                Transacciones Recientes
              </h3>
              <p className="text-text-muted text-[10px] mt-0.5">
                Últimos depósitos de bóveda y registros de ganancias
              </p>
            </div>
            
            <Link
              href="/transactions"
              className="text-xs font-semibold text-brand-primary hover:text-brand-hover flex items-center gap-1 transition-colors"
            >
              Ver Todo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border-main/50 mt-2">
            {recentTransactions.map((tx) => {
              const isDeposit = tx.type === 'Deposit';
              const isProfit = tx.type === 'Revenue';
              return (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                        isDeposit
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : isProfit
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                      }`}
                    >
                      {isDeposit ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isProfit ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-text-primary block">{tx.type}</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">{tx.date}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold font-mono block ${
                        isProfit || isDeposit ? 'text-green-400' : 'text-brand-primary'
                      }`}
                    >
                      {isProfit || isDeposit ? '+' : '-'}{isPrivate ? '••••' : `MXN ${tx.amount.toLocaleString()}`}
                    </span>
                    <span className="text-[9px] text-text-muted block mt-0.5">
                      {tx.btcAmount ? (isPrivate ? '•••• BTC' : `${tx.btcAmount} BTC`) : '--'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
