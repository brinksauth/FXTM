'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Award,
  Calendar,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { mockPlans } from '@/data/mockData';
import { privacyEventName, readPrivacyPreference } from '@/utils/privacy';

// Mock Monthly Return Data
const mockMonthlyReturns = [
  { month: 'Dic 25', profit: 350, rate: 1.1 },
  { month: 'Ene 26', profit: 450, rate: 1.3 },
  { month: 'Feb 26', profit: 700, rate: 1.9 },
  { month: 'Mar 26', profit: 850, rate: 2.2 },
  { month: 'Abr 26', profit: 1200, rate: 2.8 },
  { month: 'May 26', profit: 1650, rate: 3.3 },
];

// Mock Allocation Data
const mockAllocation = [
  { subject: 'Custodia de Seguridad', value: 95, fullMark: 100 },
  { subject: 'Rendimientos de Bloque', value: 90, fullMark: 100 },
  { subject: 'Crecimiento Compuesto', value: 85, fullMark: 100 },
  { subject: 'Liquidez de Activos', value: 65, fullMark: 100 },
  { subject: 'Gestión de Riesgos', value: 100, fullMark: 100 },
];

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const [calcMonths, setCalcMonths] = useState(12);
  const [calcPrincipal, setCalcPrincipal] = useState(50000);
  const [isPrivate, setIsPrivate] = useState(true);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));

    const handlePrivacyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPrivate(customEvent.detail);
    };

    window.addEventListener(privacyEventName, handlePrivacyChange);
    setIsPrivate(readPrivacyPreference());
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener(privacyEventName, handlePrivacyChange);
    };
  }, []);

  const activePlanDetails = mockPlans[0];

  // Projections calculations: 2.5% monthly compound (approx 30% annually)
  const compoundRate = 0.025;
  const projectVal = calcPrincipal * Math.pow(1 + compoundRate, calcMonths);
  const projectProfit = projectVal - calcPrincipal;

  return (
    <div className="space-y-8">
      {/* Portfolio Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-text-primary">
            Análisis del Portafolio
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1">
            Revisa detalladamente asignaciones de rendimiento, parámetros de planes y proyecciones
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-bg-card border border-border-main rounded-xl text-xs font-semibold text-text-muted">
          <Calendar className="w-4 h-4 text-brand-primary" />
          <span>Estado de Sincronización: Tiempo real</span>
        </div>
      </div>

      {/* active plan details cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active plan card details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">
                  Servicio de Inversion Activo
                </span>
                <h2 className="font-display font-extrabold text-lg text-text-primary mt-0.5">
                  {activePlanDetails.name}
                </h2>
              </div>
            </div>

            <span className="text-[10px] font-bold text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Generando
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 my-6 text-left">
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                ROI Anual Objetivo
              </span>
              <span className="text-sm font-bold text-text-primary block mt-1">
                {activePlanDetails.roi}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                Duración de Bloqueo del Plan
              </span>
              <span className="text-sm font-bold text-text-primary block mt-1">
                {activePlanDetails.duration}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                Estado del Depósito
              </span>
              <span className="text-sm font-bold text-brand-primary block mt-1">
                Asegurado en Frío
              </span>
            </div>
          </div>

          <div className="border-t border-border-main/50 pt-5">
            <h4 className="text-xs font-semibold text-text-primary mb-3">Beneficios del Servicio Incluidos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-text-muted">
              {activePlanDetails.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Compound projection widget */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 flex flex-col justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-text-primary">
              Calculadora de Proyecciones de Rendimiento
            </h3>
          </div>

          {/* Calculator Controls */}
          <div className="space-y-4 my-6">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>Saldo Principal (MXN)</span>
                <span className="font-bold text-text-primary">{isPrivate ? '••••' : `MXN ${calcPrincipal.toLocaleString()}`}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={200000}
                step={5000}
                value={calcPrincipal}
                onChange={(e) => setCalcPrincipal(Number(e.target.value))}
                className="w-full h-1 bg-border-main rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>Período de Duración (Meses)</span>
                <span className="font-bold text-text-primary">{calcMonths} Meses</span>
              </div>
              <input
                type="range"
                min={3}
                max={36}
                step={3}
                value={calcMonths}
                onChange={(e) => setCalcMonths(Number(e.target.value))}
                className="w-full h-1 bg-border-main rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
          </div>

          <div className="bg-bg-main border border-border-main p-4 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                Valor Estimado de Madurez
              </span>
              <span className="text-base font-extrabold text-green-600 block mt-1 font-mono">
                {isPrivate ? '••••' : `MXN ${projectVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                Beneficio de Rendimiento Neto
              </span>
              <span className="text-xs font-bold text-brand-primary block mt-1 font-mono">
                {isPrivate ? '••••' : `+MXN ${projectProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts section row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Returns Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="xl:col-span-8 bg-bg-card border border-border-main rounded-3xl p-6"
        >
          <div className="pb-6">
            <h3 className="font-display font-semibold text-base text-gray-900">
              Rendimientos Mensuales Acumulados
            </h3>
            <p className="text-text-muted text-[11px] mt-0.5">
              Desglose de ganancias acumuladas de bóveda por meses
            </p>
          </div>

          <div className="h-64 w-full text-xs">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMonthlyReturns} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    stroke="#6B7280"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(val) => isPrivate ? '••••' : `MXN ${val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-bg-card border border-border-main p-3 rounded-xl shadow-lg text-xs">
                            <span className="font-bold text-gray-900 block">{data.month}</span>
                            <span className="text-green-600 block mt-1 font-semibold">
                              Rendimiento Ganado: {isPrivate ? '••••' : `+MXN ${data.profit}`}
                            </span>
                            <span className="text-[10px] text-text-muted mt-0.5 block">
                              Índice de Madurez: {data.rate}%
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="profit"
                    fill="#FF7A00"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full animate-shimmer rounded-2xl" />
            )}
          </div>
        </motion.div>

        {/* Custody parameters radar chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-4 bg-bg-card border border-border-main rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-display font-semibold text-base text-gray-900">
              Parámetros de Custodia
            </h3>
            <p className="text-text-muted text-[11px] mt-0.5">
              Índices de puntuación de seguridad del inversor privado
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center mt-4 text-[10px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={mockAllocation}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" stroke="#6B7280" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6B7280" tick={false} />
                  <Radar
                    name="Custodia"
                    dataKey="value"
                    stroke="#FF7A00"
                    fill="#FF7A00"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-48 h-48 rounded-full border border-border-main animate-shimmer" />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
