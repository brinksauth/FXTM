'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  Cpu,
  UserCheck,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Lock,
  Zap,
  HelpCircle
} from 'lucide-react';
import XiaomiBackground from '@/components/XiaomiBackground';
import LoginParticleBackground from '@/components/LoginParticleBackground';

const homePlans = [
  {
    id: 'standard-yield',
    name: 'Rendimiento Standard',
    minDeposit: 1000,
    roi: '28% - 32% anual',
    features: ['Rendimiento diario', 'Soporte de cuenta', 'Panel privado con IA', 'Verificaciones automaticas', 'Custodia en frio personalizada'],
  },
];

const homeFAQs = [
  {
    question: 'Como se administra mi inversion en Bitcoin?',
    answer: 'Tus fondos se asignan de forma controlada dentro de nuestra estructura privada de Bitcoin. El equipo coordina operaciones, seguimiento y reportes para que puedas revisar el rendimiento desde tu panel.',
  },
  {
    question: 'Por que los depositos directos estan deshabilitados?',
    answer: 'Para mantener controles de seguridad y cumplimiento, los depositos se coordinan con tu agente asignado. Desde soporte puedes solicitar la ruta disponible para completar cada operacion.',
  },
  {
    question: 'Cuanto tardan en procesarse los retiros?',
    answer: 'Las solicitudes de retiro pasan por verificacion facial y revision manual. El proceso normalmente toma entre 24 y 48 horas, dependiendo de la validacion de seguridad.',
  },
  {
    question: 'Existe un monto minimo de retiro?',
    answer: 'Si. El monto minimo de retiro es de COP 100 y cada solicitud debe cumplir las condiciones activas del plan contratado.',
  },
  {
    question: 'Como funciona la verificacion facial?',
    answer: 'La verificacion facial usa la camara del navegador para confirmar que la solicitud coincide con el perfil registrado. El sistema puede pedir movimientos sencillos para completar la validacion.',
  },
];

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

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  } satisfies Variants;

  return (
    <div className="relative min-h-screen flex flex-col bg-bg-main text-gray-800">
      {/* Dynamic Animated Particle Background */}
      <XiaomiBackground />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-border-main z-30 transition-all">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GemIcon className="w-8 h-8 text-orange-primary" />
            <span className="font-display font-extrabold text-lg tracking-wide text-gray-900">CRYPTO GEM</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-muted">
            <a href="#features" className="hover:text-orange-primary transition-colors">Beneficios</a>
            <a href="#plans" className="hover:text-orange-primary transition-colors">Planes</a>
            <a href="#why-us" className="hover:text-orange-primary transition-colors">Seguridad</a>
            <a href="#faq" className="hover:text-orange-primary transition-colors">FAQ</a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl border border-border-main text-sm font-semibold text-gray-700 hover:border-orange-primary/40 hover:shadow-glow transition-all"
            >
              Iniciar sesion
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-orange-primary hover:bg-orange-hover text-sm font-semibold text-white shadow-lg shadow-orange-primary/15 transition-all"
            >
              Empezar
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-text-muted hover:text-gray-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 bg-white border-b border-border-main px-6 py-8 flex flex-col gap-6 z-20 md:hidden shadow-2xl"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-text-muted hover:text-orange-primary"
            >
              Beneficios
            </a>
            <a
              href="#plans"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-text-muted hover:text-orange-primary"
            >
              Planes
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-text-muted hover:text-orange-primary"
            >
              Seguridad
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-text-muted hover:text-orange-primary"
            >
              FAQ
            </a>
            <div className="h-px bg-border-main" />
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="w-full text-center py-3 rounded-xl border border-border-main text-sm font-semibold text-gray-700 hover:border-orange-primary/45"
              >
                Iniciar sesion
              </Link>
              <Link
                href="/login"
                className="w-full text-center py-3 rounded-xl bg-orange-primary text-sm font-semibold text-white"
              >
                Empezar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden bg-black text-white">
        <LoginParticleBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(247,147,26,0.20),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.88))] z-0" />
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center relative z-10">
          
          {/* Left Text */}
          <div className="max-w-4xl flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-primary/15 border border-orange-primary/30 text-xs font-bold text-orange-primary w-fit mb-6 uppercase tracking-wider shadow-glow"
            >
              <Zap className="w-3.5 h-3.5 fill-orange-primary" />
              Plataforma Bitcoin privada en Colombia
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl text-white leading-tight tracking-tight max-w-5xl"
            >
              Invierte en Bitcoin con una experiencia <span className="text-orange-primary font-bold">segura y premium</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/72 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Monitorea tu crecimiento, revisa tus rendimientos y gestiona tu portafolio desde un panel privado creado para inversionistas en Colombia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9"
            >
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-primary hover:bg-orange-hover text-base font-bold text-white shadow-xl shadow-orange-primary/20 flex items-center justify-center gap-2 group transition-all"
              >
                Empezar ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/20 text-base font-semibold text-white/85 hover:border-orange-primary/40 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                Acceder al panel
              </Link>
            </motion.div>
          </div>

          {/* Floating Gem emblem */}
          <div className="mt-14 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.3 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center"
            >
              {/* Outer Ripple Rings */}
              <div className="absolute inset-0 rounded-full border border-orange-primary/10 animate-[ping_3s_infinite]" />
              <div className="absolute inset-4 rounded-full border border-orange-primary/5 animate-[ping_4s_infinite]" />
              
              {/* Floating Gem */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotateY: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-orange-primary/20 to-white/5 border border-orange-primary/35 flex items-center justify-center shadow-2xl relative select-none backdrop-blur-sm"
              >
                <div className="absolute inset-3 rounded-full border border-dashed border-orange-primary/25" />
                <GemIcon className="w-24 h-24 sm:w-32 sm:h-32 text-orange-primary filter drop-shadow-[0_0_20px_rgba(255,122,0,0.3)]" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white/50 relative border-t border-border-main">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900">
              Disenado para crecer con confianza
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-4">
              Herramientas claras, seguras y modernas para controlar tu inversion en Bitcoin desde cualquier dispositivo.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 glass-panel-hover shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-primary/10 flex items-center justify-center text-orange-primary mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-gray-900">Custodia en frio</h3>
              <p className="text-text-muted text-xs leading-relaxed mt-3">
                Los activos se protegen con protocolos de custodia fuera de linea y controles de multiples firmas.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 glass-panel-hover shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-primary/10 flex items-center justify-center text-orange-primary mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-gray-900">Seguimiento diario</h3>
              <p className="text-text-muted text-xs leading-relaxed mt-3">
                Revisa rendimientos, movimientos y cambios semanales con datos faciles de leer.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 glass-panel-hover shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-primary/10 flex items-center justify-center text-orange-primary mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-gray-900">Analisis inteligente</h3>
              <p className="text-text-muted text-xs leading-relaxed mt-3">
                Recibe lecturas del mercado, niveles relevantes y resumenes utiles para tomar mejores decisiones.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 glass-panel-hover shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-primary/10 flex items-center justify-center text-orange-primary mb-5">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-gray-900">Agente privado</h3>
              <p className="text-text-muted text-xs leading-relaxed mt-3">
                Coordina depositos, retiros y soporte con un asesor asignado a tu cuenta.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section id="plans" className="py-24 px-6 relative border-t border-border-main">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900">
              Planes de inversion para Colombia
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-4">
              Elige una ruta clara para empezar, medir resultados y escalar tu capital con acompanamiento privado.
            </p>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-8 mt-16">
            {homePlans.map((plan) => {
              const isStandard = plan.id === 'standard-yield';
              return (
                <div
                  key={plan.id}
                  className={`glass-panel rounded-2xl p-6 flex flex-col justify-between relative transition-all duration-300 shadow-sm w-full max-w-md ${
                    isStandard ? 'glow-border-active ring-1 ring-orange-primary/30 scale-105 md:scale-100 lg:scale-105 z-10' : ''
                  }`}
                >
                  {isStandard && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-primary text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
                      Mas elegido
                    </span>
                  )}
                  
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-900">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-gray-900">COP {plan.minDeposit.toLocaleString()}</span>
                      <span className="text-text-muted text-xs">minimo</span>
                    </div>
                    <div className="mt-2 text-xs font-bold text-orange-primary">
                      {plan.roi}
                    </div>

                    <div className="h-px bg-border-main my-5" />

                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-text-muted leading-tight">
                          <CheckIcon className="w-3.5 h-3.5 text-orange-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/login"
                      className={`block w-full text-center py-3 rounded-xl text-xs font-bold transition-all ${
                        isStandard
                          ? 'bg-orange-primary hover:bg-orange-hover text-white shadow-lg shadow-orange-primary/10'
                          : 'bg-white hover:bg-gray-50 border border-border-main text-gray-800'
                      }`}
                    >
                      Invertir ahora
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-24 px-6 bg-white/50 border-t border-border-main relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900">
                Un estandar mas privado para Bitcoin
              </h2>
              <p className="text-text-muted text-sm mt-4 leading-relaxed">
                Combinamos controles de custodia, verificacion personalizada y una experiencia digital simple para inversionistas que quieren claridad y seguridad.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-primary/10 flex items-center justify-center text-orange-primary flex-shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Sin exposicion de billetera caliente</h4>
                    <p className="text-text-muted text-xs mt-1">
                      La estructura prioriza almacenamiento desconectado, revision constante y procesos de retiro controlados.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-primary/10 flex items-center justify-center text-orange-primary flex-shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Validacion facial y cumplimiento</h4>
                    <p className="text-text-muted text-xs mt-1">
                      Los retiros pasan por verificacion de identidad y revision manual para proteger cada cuenta.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-border-main rounded-2xl flex flex-col gap-2 shadow-sm">
                <span className="font-display font-bold text-3xl text-orange-primary">COP 120M+</span>
                <span className="text-xs font-semibold text-gray-800">Activos bajo custodia</span>
              </div>
              <div className="p-6 bg-white border border-border-main rounded-2xl flex flex-col gap-2 shadow-sm mt-6">
                <span className="font-display font-bold text-3xl text-orange-primary">0%</span>
                <span className="text-xs font-semibold text-gray-800">Brechas historicas de seguridad</span>
              </div>
              <div className="p-6 bg-white border border-border-main rounded-2xl flex flex-col gap-2 shadow-sm">
                <span className="font-display font-bold text-3xl text-orange-primary">2.4k+</span>
                <span className="text-xs font-semibold text-gray-800">Cuentas Standard activas</span>
              </div>
              <div className="p-6 bg-white border border-border-main rounded-2xl flex flex-col gap-2 shadow-sm mt-6">
                <span className="font-display font-bold text-3xl text-orange-primary">24/7</span>
                <span className="text-xs font-semibold text-gray-800">Cobertura de agente privado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 border-t border-border-main relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <h2 className="font-display font-bold text-3xl text-gray-900">Preguntas frecuentes</h2>
            <p className="text-text-muted text-xs sm:text-sm mt-3">
              Todo lo esencial sobre depositos, retiros, seguridad y gestion del portafolio.
            </p>
          </div>

          <div className="mt-16 space-y-4">
            {homeFAQs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-border-main rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-gray-800 hover:text-orange-primary transition-colors focus:outline-none"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-orange-primary flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-text-muted transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-orange-primary' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-text-muted leading-relaxed border-t border-border-main/40">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white border-t border-border-main mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <GemIcon className="w-8 h-8 text-orange-primary" />
              <span className="font-display font-extrabold text-lg tracking-wide text-gray-900">CRYPTO GEM</span>
            </div>
            <p className="text-text-muted text-[11px] leading-relaxed mt-4">
              Gestion privada de Bitcoin para inversionistas en Colombia que buscan seguridad, claridad y acompanamiento.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-gray-950 uppercase tracking-wider">Plataforma</h4>
            <ul className="mt-4 space-y-2 text-[11px] text-text-muted">
              <li><Link href="/login" className="hover:text-orange-primary transition-colors">Resumen</Link></li>
              <li><Link href="/login" className="hover:text-orange-primary transition-colors">Planes de inversion</Link></li>
              <li><Link href="/login" className="hover:text-orange-primary transition-colors">Custodia segura</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-gray-950 uppercase tracking-wider">Recursos</h4>
            <ul className="mt-4 space-y-2 text-[11px] text-text-muted">
              <li><a href="#faq" className="hover:text-orange-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-orange-primary transition-colors">Registro blockchain</a></li>
              <li><a href="#" className="hover:text-orange-primary transition-colors">Informes de auditoria</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-gray-950 uppercase tracking-wider">Legal</h4>
            <ul className="mt-4 space-y-2 text-[11px] text-text-muted">
              <li><a href="#" className="hover:text-orange-primary transition-colors">Terminos de servicio</a></li>
              <li><a href="#" className="hover:text-orange-primary transition-colors">Politica de privacidad</a></li>
              <li><a href="#" className="hover:text-orange-primary transition-colors">Acuerdo de custodia</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-border-main flex flex-col sm:flex-row items-center justify-between text-[10px] text-text-muted">
          <span>&copy; 2026 Crypto Gem Colombia. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
