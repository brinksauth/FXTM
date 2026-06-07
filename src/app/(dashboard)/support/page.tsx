'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  MessageSquare,
  LifeBuoy,
  Send,
  FileCheck
} from 'lucide-react';
import { whatsappHref } from '@/data/contact';
import { mockFAQs } from '@/data/mockData';

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('Operaciones de Bóveda');
  const [message, setMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    // Simulate sending ticket
    setTimeout(() => {
      const generatedId = `TKT-${Math.floor(Math.random() * 90000) + 10000}`;
      setTicketId(generatedId);
      setTicketSuccess(true);
      setSubject('');
      setMessage('');
      
      setTimeout(() => setTicketSuccess(false), 5000);
    }, 600);
  };

  const triggerAgentChat = () => {
    window.dispatchEvent(new CustomEvent('open-chat-agent'));
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900">
          Centro de Soporte
        </h1>
        <p className="text-text-muted text-xs sm:text-sm mt-1">
          Accede a nuestra base de preguntas frecuentes, abre tickets de servicio o habla con tu gerente dedicado
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Support channels & Forms */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Banner de contacto con agente */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-orange-primary/20 transition-colors relative overflow-hidden shadow-sm"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row w-full lg:w-auto">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-primary/10 border border-orange-primary/30 flex items-center justify-center text-orange-primary font-bold font-display text-lg">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-bg-card animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900 text-base">Línea Directa: Agente Alex</h3>
                <p className="text-text-muted text-xs mt-1 leading-normal">
                  En línea ahora. Haz clic para iniciar una sesión encriptada en vivo sobre los depósitos de tu bóveda.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={triggerAgentChat}
                className="px-5 py-3 rounded-xl bg-orange-primary hover:bg-orange-hover text-xs font-bold text-white shadow-lg shadow-orange-primary/10 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                Abrir chat con agente
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-xs font-bold text-white shadow-lg shadow-green-600/10 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.116-2.905-6.993-1.876-1.878-4.357-2.91-6.998-2.912-5.442 0-9.87 4.42-9.874 9.865-.001 1.769.463 3.498 1.345 5.021l-.979 3.57 3.667-.962zm10.843-7.79c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.174.2-.298.3-.496.099-.198.05-.371-.025-.521-.075-.148-.67-1.613-.918-2.209-.242-.579-.487-.501-.669-.512-.173-.01-.371-.012-.57-.012-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
                </svg>
                Agente por WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Ticket Submission Form */}
          <div className="bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 relative shadow-sm">
            
            <AnimatePresence>
              {ticketSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-bg-card/98 rounded-3xl flex flex-col items-center justify-center text-center p-6 z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center text-green-600 mb-4">
                    <FileCheck className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="font-display font-bold text-gray-900 text-base">Ticket de Soporte Creado</h4>
                  <p className="text-text-muted text-xs max-w-xs mt-2">
                    Tu solicitud ha sido registrada bajo el ID <span className="text-orange-primary font-mono font-bold">{ticketId}</span>. Alex hará un seguimiento en menos de 2 horas.
                  </p>
                  <button
                    onClick={() => setTicketSuccess(false)}
                    className="mt-6 px-4 py-2 text-xs font-semibold text-text-muted hover:text-gray-900 border border-border-main rounded-lg"
                  >
                    Crear Otro Ticket
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pb-4 border-b border-border-main/50 mb-6">
              <h3 className="font-display font-semibold text-sm text-gray-900">Crear Ticket de Soporte</h3>
              <p className="text-[11px] text-text-muted mt-0.5">
                Envía una consulta directamente a nuestros departamentos de cumplimiento y auditoría
              </p>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-750">Departamento</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-bg-main border border-border-main rounded-xl px-3.5 py-3 text-xs text-gray-900 focus:outline-none focus:border-orange-primary"
                  >
                    <option>Operaciones de Bóveda</option>
                    <option>Auditorías de Cumplimiento</option>
                    <option>Soporte General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-750">Asunto del Ticket</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Breve resumen"
                    required
                    className="w-full bg-bg-main border border-border-main rounded-xl px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-750">Detalles de la Consulta</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe tu problema o los detalles de coordinación del depósito..."
                  rows={4}
                  required
                  className="w-full bg-bg-main border border-border-main rounded-xl px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-primary resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-primary hover:bg-orange-hover text-xs font-bold text-white shadow-lg shadow-orange-primary/10 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Enviar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Database Panel */}
        <div className="lg:col-span-5 bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="pb-4 border-b border-border-main/50 mb-6 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-orange-primary" />
            <div>
              <h3 className="font-display font-semibold text-sm text-gray-900">Base de Preguntas Frecuentes</h3>
              <p className="text-[11px] text-text-muted mt-0.5">
                Soluciones rápidas de nuestra base de conocimientos
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mockFAQs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-bg-main/30 border border-border-main rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-[11px] text-gray-800 hover:text-orange-primary transition-colors focus:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-orange-primary flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted transition-transform duration-300 ${
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
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-3.5 pb-3.5 pt-0.5 text-[10px] text-text-muted leading-relaxed border-t border-border-main/20">
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
      </div>
    </div>
  );
}
