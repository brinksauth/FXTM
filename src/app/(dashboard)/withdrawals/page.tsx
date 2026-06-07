'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Landmark,
  MessageSquare,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import { mockUser } from '@/data/mockData';

type WizardStep = 'Form' | 'SecurityLoad' | 'CameraAccess' | 'FaceScan' | 'Failed';

const scanTasks = [
  'Manten los ojos dentro del circulo central',
  'Acerca tu rostro lentamente a la camara',
  'Gira la cabeza suavemente a la izquierda',
  'Gira la cabeza suavemente a la derecha',
  'Mira hacia arriba y vuelve al centro',
  'Sonrie levemente para finalizar',
];

export default function WithdrawalsPage() {
  const [step, setStep] = useState<WizardStep>('Form');
  const [bankName, setBankName] = useState(mockUser.bankName);
  const [accountNumber, setAccountNumber] = useState(mockUser.accountNumber);
  const [accountName, setAccountName] = useState(mockUser.name);
  const [currency, setCurrency] = useState('COP');
  const [amount, setAmount] = useState('5000');
  const [formError, setFormError] = useState<string | null>(null);
  const [secProgress, setSecProgress] = useState(0);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const val = Number(amount);
    if (!bankName || !accountNumber || !accountName || !amount) {
      setFormError('Completa todos los datos bancarios y de transferencia.');
      return;
    }

    if (val < 100) {
      setFormError('El retiro minimo permitido es COP 100.');
      return;
    }

    if (val > mockUser.portfolioValue) {
      setFormError('El monto de retiro excede el balance disponible.');
      return;
    }

    setSecProgress(0);
    setStep('SecurityLoad');
  };

  useEffect(() => {
    if (step !== 'SecurityLoad') return;

    const interval = setInterval(() => {
      setSecProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('CameraAccess'), 250);
          return 100;
        }
        return prev + 5;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [step]);

  const requestCameraAccess = async () => {
    setCameraPermission('prompt');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 960 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraPermission('granted');
      setScanProgress(0);
      setCurrentTaskIdx(0);
      setStep('FaceScan');
    } catch (err) {
      console.warn('No se pudo acceder a la camara:', err);
      setCameraPermission('denied');
    }
  };

  useEffect(() => {
    if (step !== 'FaceScan') return;

    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }

    let elapsed = 0;
    const totalScanTime = 7.2;
    const interval = setInterval(() => {
      elapsed += 0.1;
      const nextProgress = Math.min((elapsed / totalScanTime) * 100, 100);
      setScanProgress(nextProgress);
      setCurrentTaskIdx(Math.min(Math.floor((nextProgress / 100) * scanTasks.length), scanTasks.length - 1));

      if (elapsed >= totalScanTime) {
        clearInterval(interval);
        stopWebcam();
        setTimeout(() => setStep('Failed'), 500);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      stopWebcam();
    };
  }, [step]);

  const cancelVerification = () => {
    stopWebcam();
    setStep('Form');
  };

  const triggerAgentChat = () => {
    window.dispatchEvent(new CustomEvent('open-chat-agent'));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900">
          Retiro Seguro
        </h1>
        <p className="text-text-muted text-xs sm:text-sm mt-1">
          Solicita un retiro con verificacion facial en tiempo real.
        </p>
      </div>

      <div className="bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-primary/5 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {step === 'Form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-border-main/50 pb-4">
                <Landmark className="w-5 h-5 text-orange-primary" />
                <h3 className="font-display font-semibold text-sm text-gray-900">
                  Paso 1: datos del retiro
                </h3>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/35 rounded-xl flex items-center gap-2.5 text-xs text-red-500">
                  <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-800">Activo de retiro</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-bg-main border border-border-main rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-orange-primary transition-colors"
                  >
                    <option value="COP">COP (transferencia bancaria colombiana)</option>
                    <option value="BTC">BTC (liberacion de boveda segura)</option>
                    <option value="USDT">USDT (liquidacion estable TRC-20)</option>
                    <option value="ETH">ETH (liberacion de boveda Ethereum)</option>
                  </select>
                </div>

                <Field label="Banco receptor / direccion">
                  <input value={bankName} onChange={(e) => setBankName(e.target.value)} className="withdrawal-input" />
                </Field>

                <Field label="Numero de cuenta / billetera">
                  <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="withdrawal-input" />
                </Field>

                <Field label="Titular de cuenta">
                  <input value={accountName} onChange={(e) => setAccountName(e.target.value)} className="withdrawal-input" />
                </Field>

                <Field label={`Monto de retiro (${currency})`}>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="withdrawal-input" />
                </Field>

                <div className="sm:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-orange-primary hover:bg-orange-hover text-xs font-bold text-white shadow-lg shadow-orange-primary/10 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Continuar a verificacion
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'SecurityLoad' && (
            <VerificationShell onCancel={cancelVerification}>
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 w-full">
                <div className="relative">
                  <ShieldCheck className="w-16 h-16 text-orange-primary animate-pulse" />
                  <div className="absolute inset-0 rounded-full border border-orange-primary/20 animate-ping" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="font-display font-semibold text-base text-gray-900">
                    Validando seguridad del retiro
                  </h3>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    Revisando cuenta, balance, destino y reglas de custodia antes de solicitar acceso a camara.
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-2">
                  <div className="w-full h-1.5 bg-bg-main rounded-full overflow-hidden border border-border-main">
                    <div className="h-full bg-orange-primary transition-all duration-100" style={{ width: `${secProgress}%` }} />
                  </div>
                  <span className="text-[10px] text-text-muted font-bold font-mono">{secProgress}%</span>
                </div>
              </div>
            </VerificationShell>
          )}

          {step === 'CameraAccess' && (
            <VerificationShell onCancel={cancelVerification}>
              <div className="flex flex-col items-center text-center py-8 space-y-6 w-full">
                <div className="w-20 h-20 rounded-full bg-orange-primary/10 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-orange-primary" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="font-display font-bold text-lg text-gray-900">Permiso de camara requerido</h3>
                  <p className="text-text-muted text-xs leading-relaxed">
                    Para autorizar el retiro, necesitamos acceder a tu camara y ejecutar una verificacion facial en tiempo real.
                  </p>
                </div>
                {cameraPermission === 'denied' && (
                  <div className="w-full p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-600">
                    No se pudo acceder a la camara. Permite el acceso desde tu navegador e intenta de nuevo.
                  </div>
                )}
                <div className="w-full space-y-3">
                  <button
                    onClick={requestCameraAccess}
                    className="w-full py-3.5 rounded-xl bg-orange-primary hover:bg-orange-hover text-xs font-bold text-white shadow-lg shadow-orange-primary/10 transition-colors"
                  >
                    Permitir camara y verificar rostro
                  </button>
                  <button
                    onClick={cancelVerification}
                    className="w-full py-3 rounded-xl border border-border-main text-xs font-bold text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </VerificationShell>
          )}

          {step === 'FaceScan' && (
            <VerificationShell onCancel={cancelVerification}>
              <div className="flex flex-col items-center justify-between py-2 space-y-5 w-full">
                <div className="flex items-center gap-2 w-full border-b border-border-main/50 pb-3 pr-8">
                  <Camera className="w-4.5 h-4.5 text-orange-primary" />
                  <span className="text-xs font-bold text-gray-900">Verificacion facial en tiempo real</span>
                </div>

                <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden flex items-center justify-center bg-black shadow-glow border-2 border-border-main">
                  <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="46%"
                      stroke="#F7931A"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray="600"
                      strokeDashoffset={600 - (600 * scanProgress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-200"
                    />
                  </svg>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1] rounded-full" />
                  <div className="absolute left-0 right-0 h-0.5 bg-orange-primary/70 shadow-[0_0_12px_#F7931A] animate-[bounce_3s_infinite] z-10 pointer-events-none" />
                </div>

                <div className="text-center space-y-3 w-full max-w-sm">
                  <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">Instruccion actual</div>
                  <div className="text-sm font-extrabold text-orange-primary bg-orange-primary/5 border border-orange-primary/20 py-2.5 px-4 rounded-xl min-h-11 flex items-center justify-center">
                    {scanTasks[currentTaskIdx]}
                  </div>
                  <div className="text-[10px] text-text-muted font-mono">{Math.round(scanProgress)}%</div>
                  <button
                    onClick={cancelVerification}
                    className="w-full py-2.5 rounded-xl border border-border-main hover:border-red-200 hover:bg-red-50 text-xs font-semibold text-gray-600 hover:text-red-500 transition-colors"
                  >
                    Cancelar verificacion
                  </button>
                </div>
              </div>
            </VerificationShell>
          )}

          {step === 'Failed' && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-border-main/50 pb-4">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-display font-semibold text-sm text-gray-900">Retiro no exitoso</h3>
              </div>

              <div className="bg-red-500/5 border border-red-500/25 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-900">Estado: retiro detenido por revision manual</span>
                </div>
                <p className="text-[11px] leading-relaxed text-text-muted">
                  La solicitud de <span className="text-gray-900 font-bold font-mono">{Number(amount).toLocaleString()} {currency}</span> no pudo completarse automaticamente.
                </p>
              </div>

              <div className="p-4 bg-bg-main border border-border-main rounded-2xl text-xs space-y-2 text-text-muted leading-relaxed">
                <p className="font-bold text-gray-900">Motivo del rechazo</p>
                <p>
                  Su retiro no se ha procesado correctamente. Se ha completado toda la verificación y usted cumple con los requisitos para retirar fondos. Sin embargo, observamos una comisión final de 500,000 pesos, cuyo monto depende de la inversión. Asegúrese de realizar el pago en un plazo de 24 a 48 horas. Una vez que el pago se haya procesado correctamente, intente retirar nuevamente. Procesaremos su pago en un plazo de uno a siete minutos. Para más información, comuníquese con su agente.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => setStep('Form')}
                  className="flex-1 py-3 rounded-xl border border-border-main hover:border-orange-primary/30 hover:bg-bg-card/40 text-xs font-bold text-gray-900 transition-colors"
                >
                  Intentar de nuevo
                </button>
                <button
                  onClick={triggerAgentChat}
                  className="flex-1 py-3 rounded-xl bg-orange-primary hover:bg-orange-hover text-xs font-bold text-white shadow-lg shadow-orange-primary/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  Contactar agente
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-gray-800">{label}</label>
      {children}
    </div>
  );
}

function VerificationShell({
  children,
  onCancel,
}: {
  children: React.ReactNode;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-border-main rounded-3xl p-6 w-full max-w-md shadow-2xl relative flex flex-col items-center"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-text-muted hover:text-gray-900 transition-colors p-1.5 rounded-full hover:bg-bg-main"
          title="Cancelar"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
