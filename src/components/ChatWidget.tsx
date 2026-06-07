'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import { whatsappHref } from '@/data/contact';
import { mockUser } from '@/data/mockData';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
  isWhatsAppCTA?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      sender: 'agent',
      text: `Hola ${mockUser.name}.\n\nSoy Alex, tu gerente de cuenta dedicado. ¿Cómo puedo ayudarte hoy con tu cuenta de Crypto Gem?`,
      isWhatsAppCTA: true,
      time: '',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Abre el chat desde acciones globales del panel.
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat-agent', handleOpenChat);
    return () => window.removeEventListener('open-chat-agent', handleOpenChat);
  }, []);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Respuesta del agente con coordinación por WhatsApp.
    setTimeout(() => {
      const replyText = `Para coordinar tu solicitud, procesar depósitos seguros o autorizar retiros pendientes, comunícate conmigo directamente por WhatsApp.\n\nEstoy en línea para ayudarte en tiempo real.`;

      const agentMsg: Message = {
        id: Math.random().toString(),
        sender: 'agent',
        text: replyText,
        isWhatsAppCTA: true,
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, agentMsg]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-20 right-6 md:bottom-6 md:right-8 z-40">
      {/* Floating Chat Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-orange-primary flex items-center justify-center text-white shadow-lg shadow-orange-primary/20 glow-border hover:bg-orange-hover transition-colors relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-bg-main text-[9px] font-bold flex items-center justify-center text-white">
            1
          </span>
        )}
      </motion.button>

      {/* Chat Box Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-18 right-0 w-[340px] sm:w-[380px] h-[480px] bg-white border border-border-main rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-800"
          >
            {/* Header */}
            <div className="p-4 bg-bg-main border-b border-border-main flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/avatar.png"
                    alt="Agente Alex"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-xl object-cover border border-orange-primary/20 bg-orange-primary/10"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-card" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Agente Alex</h4>
                  <span className="text-[10px] text-orange-primary font-semibold uppercase tracking-wider">
                    Gerente de cuenta dedicado
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-bg-main/35"
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-orange-primary text-white rounded-tr-none shadow-md shadow-orange-primary/10'
                          : 'bg-white border border-border-main text-gray-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line break-words">{msg.text}</p>
                      
                      {msg.isWhatsAppCTA && (
                        <div className="mt-3 pt-2.5 border-t border-border-main flex flex-col gap-2">
                          <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">
                            Soporte directo
                          </span>
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-green-500/10 text-[10px] font-sans"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.116-2.905-6.993-1.876-1.878-4.357-2.91-6.998-2.912-5.442 0-9.87 4.42-9.874 9.865-.001 1.769.463 3.498 1.345 5.021l-.979 3.57 3.667-.962zm10.843-7.79c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.174.2-.298.3-.496.099-.198.05-.371-.025-.521-.075-.148-.67-1.613-.918-2.209-.242-.579-.487-.501-.669-.512-.173-.01-.371-.012-.57-.012-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
                            </svg>
                            Contactar agente por WhatsApp
                          </a>
                        </div>
                      )}

                      <span
                        className={`text-[9px] mt-1.5 block text-right ${
                          isUser ? 'text-white/70' : 'text-text-muted'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border-main rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-1 shadow-sm">
                    <span className="text-text-muted">Alex está escribiendo</span>
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-bg-main border-t border-border-main flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-white border border-border-main rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-orange-primary transition-colors"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-orange-primary text-white hover:bg-orange-hover transition-colors shadow-md shadow-orange-primary/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
