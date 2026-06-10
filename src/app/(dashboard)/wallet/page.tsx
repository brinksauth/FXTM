'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowDownCircle,
  Copy,
  ShieldAlert,
  MessageSquare,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { mockUser, mockTransactions } from '@/data/mockData';
import { privacyEventName, readPrivacyPreference } from '@/utils/privacy';

export default function WalletPage() {
  const depositTxns = mockTransactions.filter(tx => tx.type === 'Depósito').slice(0, 3);
  const mockWalletAddress = 'bc1q9x7y4z2h6f8e5j9k3m1p0q7s6v5w4u8t';
  const [isPrivate, setIsPrivate] = useState(true);
  const portfolioValue = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(mockUser.portfolioValue);
  const btcValue = new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(mockUser.btcHoldings);

  useEffect(() => {
    const handlePrivacyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPrivate(customEvent.detail);
    };

    setIsPrivate(readPrivacyPreference());
    window.addEventListener(privacyEventName, handlePrivacyChange);
    return () => window.removeEventListener(privacyEventName, handlePrivacyChange);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockWalletAddress);
    alert('¡Dirección simulada de la billetera copiada al portapapeles!');
  };

  const triggerAgentChat = () => {
    // Fire the custom window event that ChatWidget listens for
    window.dispatchEvent(new CustomEvent('open-chat-agent'));
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-text-primary">
          Billetera Segura
        </h1>
        <p className="text-text-muted text-xs sm:text-sm mt-1">
          Monitorea los balances de tu bóveda y los canales de transacciones de custodia
        </p>
      </div>

      {/* Wallet Balance Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Wallet Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand-primary/20 transition-colors"
        >
          <div className="flex items-center gap-3 text-text-muted">
            <Wallet className="w-5 h-5 text-brand-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Billetera Segura Multi-Firma
            </span>
          </div>

          <div className="mt-6">
            <span className="text-xs text-text-muted">Valor Total de Portafolio</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary mt-1">
              {portfolioValue}
            </h2>
            <span className="text-xs text-green-400 block mt-1 font-semibold">
              Balance de BTC: {btcValue} BTC
            </span>
          </div>

          <div className="h-px bg-border-main my-6" />

          {/* Wallet address copy area */}
          <div className="space-y-2">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block">
              Dirección de Billetera Multi-Firma
            </span>
            <div className="flex items-center gap-3 bg-bg-main border border-border-main rounded-xl p-3">
              <span className="text-[11px] font-mono text-text-primary select-all break-all overflow-hidden text-ellipsis flex-1">
                {mockWalletAddress}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-lg bg-bg-card border border-border-main text-text-muted hover:text-text-primary transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Disabled deposits warning widget */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 flex flex-col justify-between"
        >
          <div className="flex items-center gap-2.5">
            <ArrowDownCircle className="w-5 h-5 text-brand-primary" />
            <h3 className="font-display font-semibold text-sm text-text-primary">
              Depositar fondos
            </h3>
          </div>

          {/* Big Security Warning Alert */}
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-4 my-5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-primary block">
                Coordinación con agente requerida
              </span>
              <p className="text-[11px] leading-relaxed text-text-muted">
                Actualmente, los depósitos son manejados por el agente de tu cuenta para coordinar la configuración de firmas múltiples y el cumplimiento de la bóveda fría.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Disabled Deposit Button */}
            <button
              disabled
              className="py-3 rounded-xl bg-bg-main border border-border-main text-xs font-bold text-text-muted cursor-not-allowed opacity-50 flex items-center justify-center gap-1.5"
            >
              Depósito Deshabilitado
            </button>
            
            {/* Acción para contactar al agente */}
            <button
              onClick={triggerAgentChat}
              className="py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-xs font-bold text-white shadow-lg shadow-brand-primary/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              Contactar agente
            </button>
          </div>
        </motion.div>
      </div>

      {/* Multi-Sig Signer Keys Visualization Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Keys Schematic */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="xl:col-span-7 bg-bg-card border border-border-main rounded-3xl p-6"
        >
          <div className="pb-6">
            <h3 className="font-display font-semibold text-base text-text-primary">
              Estado de las Firmas de Bóveda
            </h3>
            <p className="text-text-muted text-[11px] mt-0.5">
              Requiere 2 de 3 firmas criptográficas para autorizar transacciones
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Signer 1 */}
            <div className="p-4 bg-bg-main border border-border-main rounded-2xl flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <KeyRound className="w-5 h-5 text-brand-primary" />
                <span className="text-[9px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Firmado
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-xs text-text-primary">Clave 01: {mockUser.name}</h4>
                <span className="text-[10px] text-text-muted block mt-0.5">Clave de Inversor</span>
              </div>
            </div>

            {/* Signer 2 */}
            <div className="p-4 bg-bg-main border border-border-main rounded-2xl flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <KeyRound className="w-5 h-5 text-brand-primary" />
                <span className="text-[9px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Firmado
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-xs text-text-primary">Clave 02: Agente Alex</h4>
                <span className="text-[10px] text-text-muted block mt-0.5">Clave de Custodio</span>
              </div>
            </div>

            {/* Signer 3 */}
            <div className="p-4 bg-bg-main border border-border-main rounded-2xl flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <KeyRound className="w-5 h-5 text-text-muted" />
                <span className="text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Inactivo
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-xs text-text-primary">Clave 03: Plataforma</h4>
                <span className="text-[10px] text-text-muted block mt-0.5">Recuperación de Respaldo</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Deposit Ledger Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-5 bg-bg-card border border-border-main rounded-3xl p-6"
        >
          <div className="pb-4 border-b border-border-main/50">
            <h3 className="font-display font-semibold text-base text-text-primary">
              Libro Mayor de Canales de Depósito
            </h3>
            <p className="text-text-muted text-[11px] mt-0.5">
              Eventos de depósito verificados para {mockUser.name}
            </p>
          </div>

          <div className="divide-y divide-border-main/50 mt-3">
            {depositTxns.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-primary block">Evento de Depósito Bancario</span>
                    <span className="text-[10px] text-text-muted block mt-0.5">{tx.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-green-600 block">
                    +{isPrivate ? '••••' : `MXN ${tx.amount.toLocaleString()}`}
                  </span>
                  <span className="text-[9px] text-text-muted block mt-0.5">
                    {isPrivate ? '••••' : tx.btcAmount} BTC
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
