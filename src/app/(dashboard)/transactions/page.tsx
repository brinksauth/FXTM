'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Download,
  CheckCircle,
  Clock
} from 'lucide-react';
import { mockTransactions } from '@/data/mockData';
import { privacyEventName, readPrivacyPreference } from '@/utils/privacy';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'Todos' | 'Depósito' | 'Ganancia' | 'Retiro'>('Todos');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrivate, setIsPrivate] = useState(readPrivacyPreference);
  const itemsPerPage = 5;

  useEffect(() => {
    const handlePrivacyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPrivate(customEvent.detail);
    };

    window.addEventListener(privacyEventName, handlePrivacyChange);
    return () => window.removeEventListener(privacyEventName, handlePrivacyChange);
  }, []);

  // Search & Filter Logic
  const filteredTxns = useMemo(() => {
    return mockTransactions
      .filter((tx) => {
        // Filter by Type
        if (filterType !== 'Todos' && tx.type !== filterType) return false;
        
        // Filter by Search Query
        const term = search.toLowerCase();
        return (
          tx.id.toLowerCase().includes(term) ||
          tx.reference.toLowerCase().includes(term) ||
          tx.type.toLowerCase().includes(term) ||
          tx.date.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        // Sorting Logic
        if (sortField === 'date') {
          const timeA = new Date(a.date).getTime();
          const timeB = new Date(b.date).getTime();
          return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
        } else {
          return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
      });
  }, [search, filterType, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTxns.length / itemsPerPage) || 1;
  const paginatedTxns = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredTxns.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredTxns, currentPage]);

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Export CSV mock trigger
  const exportToCSV = () => {
    alert('¡Exportación CSV simulada! Todos los registros han sido descargados.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900">
            Historial de Transacciones
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1">
            Busca, ordena, filtra y descarga los registros de tus transacciones
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-card border border-border-main hover:border-orange-primary/30 text-xs font-semibold text-text-muted hover:text-gray-900 rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Registro CSV</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-bg-card border border-border-main p-4 rounded-2xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar ref, ID, tipo o fecha..."
            className="w-full bg-bg-main border border-border-main rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-orange-primary transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Filter className="w-4 h-4 text-text-muted hidden sm:inline" />
          {(['Todos', 'Depósito', 'Ganancia', 'Retiro'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setFilterType(t);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === t
                  ? 'bg-orange-primary border border-orange-primary text-white shadow-glow'
                  : 'bg-bg-main border border-border-main text-text-muted hover:text-gray-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-bg-card border border-border-main rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-bg-main/55 border-b border-border-main font-semibold text-text-muted">
                <th className="p-4 sm:p-5">ID de Transacción</th>
                <th
                  onClick={() => handleSort('date')}
                  className="p-4 sm:p-5 cursor-pointer hover:text-gray-900 transition-colors select-none"
                >
                  <span className="flex items-center gap-1">
                    Fecha y Hora
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th className="p-4 sm:p-5">Tipo</th>
                <th className="p-4 sm:p-5">Estado</th>
                <th
                  onClick={() => handleSort('amount')}
                  className="p-4 sm:p-5 cursor-pointer hover:text-gray-900 transition-colors select-none"
                >
                  <span className="flex items-center gap-1">
                    Monto (COP)
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th className="p-4 sm:p-5 hidden lg:table-cell">Referencia Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/55 font-medium text-gray-800">
              {paginatedTxns.length > 0 ? (
                paginatedTxns.map((tx) => {
                  const isDeposit = tx.type === 'Depósito';
                  const isProfit = tx.type === 'Ganancia';
                  return (
                    <tr key={tx.id} className="hover:bg-bg-card-hover/20 transition-colors">
                      <td className="p-4 sm:p-5 font-mono text-[11px] text-text-muted">{tx.id}</td>
                      <td className="p-4 sm:p-5">{tx.date}</td>
                      <td className="p-4 sm:p-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                            isDeposit
                              ? 'bg-blue-500/10 text-blue-500'
                              : isProfit
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-orange-primary/10 text-orange-primary'
                          }`}
                        >
                          {isDeposit ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : isProfit ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span
                          className={`w-2 h-2 rounded-full inline-block mr-1.5 ${
                            tx.status === 'Completado'
                              ? 'bg-green-500'
                              : tx.status === 'Pendiente'
                              ? 'bg-orange-primary animate-pulse'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="text-[11px] text-text-muted">{tx.status}</span>
                      </td>
                      <td className="p-4 sm:p-5 font-mono font-bold text-sm">
                        <span className={isProfit || isDeposit ? 'text-green-600' : 'text-orange-primary'}>
                          {isProfit || isDeposit ? '+' : '-'}{isPrivate ? '••••' : `COP ${tx.amount.toLocaleString()}`}
                        </span>
                        <span className="text-[9px] text-text-muted block mt-0.5 font-normal">
                          {tx.btcAmount ? (isPrivate ? '•••• BTC' : `${tx.btcAmount} BTC`) : '--'}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 font-mono text-[10px] text-text-muted hidden lg:table-cell">
                        {tx.reference}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text-muted text-xs">
                    Ninguna transacción coincide con tus criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-bg-main/30 border-t border-border-main flex items-center justify-between text-xs text-text-muted">
            <span>
              Mostrando Página <span className="text-gray-900 font-bold">{currentPage}</span> de{' '}
              <span className="text-gray-900 font-bold">{totalPages}</span>
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-border-main bg-bg-main text-text-muted hover:text-gray-900 disabled:opacity-40 disabled:hover:text-text-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-border-main bg-bg-main text-text-muted hover:text-gray-900 disabled:opacity-40 disabled:hover:text-text-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
