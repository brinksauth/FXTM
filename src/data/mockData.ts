export interface UserProfile {
  name: string;
  investmentService: string;
  portfolioValue: number;
  profit: number;
  growthPercentage: number;
  btcHoldings: number;
  accountNumber: string;
  bankName: string;
  email: string;
  phone: string;
  password: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Depósito' | 'Ganancia' | 'Retiro';
  status: 'Completado' | 'Pendiente' | 'Fallido';
  amount: number;
  btcAmount?: number;
  reference: string;
}

export interface ChartDataPoint {
  date: string;
  price: number;
  value: number;
}

export interface WeeklyPerformance {
  day: string;
  percentage: number;
  amount: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minDeposit: number;
  roi: string;
  duration: string;
  features: string[];
}

export const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

export const mockUser: UserProfile = {
  name: 'JULIO QUINTERO DAZA',
  investmentService: 'Rendimiento Estándar',
  portfolioValue: 47850000,
  profit: 42850000,
  growthPercentage: 31.5,
  btcHoldings: 0.7472,
  accountNumber: '302 5468241',
  bankName: 'Nequi bank',
  email: 'julioquintero7129@gmail.com',
  phone: '+57 302 5468241',
  password: '12345PP',
};

export const mockTransactions: Transaction[] = [
  // Transacciones recientes
  {
    id: 'TXN-009',
    date: 'Junio 2026',
    type: 'Ganancia',
    status: 'Completado',
    amount: 9850000,
    btcAmount: 0.1536,
    reference: 'REF-BTC-PRF-009',
  },
  {
    id: 'TXN-008',
    date: 'Mayo 2026',
    type: 'Ganancia',
    status: 'Completado',
    amount: 8750000,
    btcAmount: 0.1365,
    reference: 'REF-BTC-PRF-008',
  },
  {
    id: 'TXN-007',
    date: 'Abril 2026',
    type: 'Ganancia',
    status: 'Completado',
    amount: 7500000,
    btcAmount: 0.117,
    reference: 'REF-BTC-PRF-007',
  },
  {
    id: 'TXN-006',
    date: 'Marzo 2026',
    type: 'Ganancia',
    status: 'Completado',
    amount: 6800000,
    btcAmount: 0.1061,
    reference: 'REF-BTC-PRF-006',
  },
  {
    id: 'TXN-005',
    date: 'Febrero 2026',
    type: 'Ganancia',
    status: 'Completado',
    amount: 5400000,
    btcAmount: 0.0842,
    reference: 'REF-BTC-PRF-005',
  },
  {
    id: 'TXN-004',
    date: 'Enero 2026',
    type: 'Ganancia',
    status: 'Completado',
    amount: 4550000,
    btcAmount: 0.071,
    reference: 'REF-BTC-PRF-004',
  },
  {
    id: 'TXN-003',
    date: 'Enero 2026',
    type: 'Depósito',
    status: 'Completado',
    amount: 3000000,
    btcAmount: 0.0468,
    reference: 'REF-BTC-DEP-003',
  },
  {
    id: 'TXN-002',
    date: 'Diciembre 2025',
    type: 'Ganancia',
    status: 'Completado',
    amount: 4000000,
    btcAmount: 0.0624,
    reference: 'REF-BTC-PRF-002',
  },
  {
    id: 'TXN-001',
    date: 'Diciembre 2025',
    type: 'Depósito',
    status: 'Completado',
    amount: 2000000,
    btcAmount: 0.0312,
    reference: 'REF-BTC-DEP-001',
  },
];

// Historical Bitcoin price data for Recharts (representing 1D, 1W, 1M, 1Y charts)
export const mockChartData: Record<string, ChartDataPoint[]> = {
  '1D': [
    { date: '00:00', price: 63800, value: 49764 },
    { date: '04:00', price: 64100, value: 49998 },
    { date: '08:00', price: 63950, value: 49881 },
    { date: '12:00', price: 64300, value: 50154 },
    { date: '16:00', price: 64600, value: 50388 },
    { date: '20:00', price: 64100, value: 49998 },
    { date: '24:00', price: 64102, value: 50000 },
  ],
  '1W': [
    { date: 'Lun', price: 62200, value: 48516 },
    { date: 'Mar', price: 63100, value: 49218 },
    { date: 'Mié', price: 62800, value: 48984 },
    { date: 'Jue', price: 64000, value: 49920 },
    { date: 'Vie', price: 63900, value: 49842 },
    { date: 'Sáb', price: 64500, value: 50310 },
    { date: 'Dom', price: 64102, value: 50000 },
  ],
  '1M': [
    { date: 'Sem 1', price: 58500, value: 45630 },
    { date: 'Sem 2', price: 61000, value: 47580 },
    { date: 'Sem 3', price: 63400, value: 49452 },
    { date: 'Sem 4', price: 64102, value: 50000 },
  ],
  '3M': [
    { date: 'Ene', price: 42500, value: 33150 },
    { date: 'Feb', price: 54000, value: 42120 },
    { date: 'Mar', price: 64102, value: 50000 },
  ],
  '1Y': [
    { date: 'Abr 25', price: 30200, value: 23556 },
    { date: 'Jun 25', price: 34800, value: 27144 },
    { date: 'Ago 25', price: 29500, value: 23010 },
    { date: 'Oct 25', price: 38400, value: 29952 },
    { date: 'Dic 25', price: 44200, value: 34476 },
    { date: 'Feb 26', price: 54000, value: 42120 },
    { date: 'Abr 26', price: 64102, value: 50000 },
  ],
};

export const mockWeeklyPerformance: WeeklyPerformance[] = [
  { day: 'Lun', percentage: 12, amount: 1440 },
  { day: 'Mar', percentage: 15, amount: 1800 },
  { day: 'Mié', percentage: 10, amount: 1200 },
  { day: 'Jue', percentage: 18, amount: 2160 },
  { day: 'Vie', percentage: 22, amount: 2640 },
  { day: 'Sáb', percentage: 13, amount: 1560 },
  { day: 'Dom', percentage: 10, amount: 1200 },
];

export const mockInsights = [
  "Bitcoin se mantiene estable esta semana, manteniendo el nivel base de soporte de COP 64.000.",
  "El valor de tu portafolio aumentó un +4.2% desde el martes pasado, impulsado por continuas recompensas de bloque.",
  "El sentimiento del mercado sigue siendo altamente positivo (índice de Avaricia en 74/100) ante las próximas entradas de ETF.",
  "Las asignaciones del Rendimiento Estándar muestran un rendimiento óptimo comparado con los índices generales del mercado."
];

export const mockFAQs: FAQItem[] = [
  {
    question: '¿Cómo se administra mi inversión en Bitcoin?',
    answer: 'Tus fondos se asignan dinámicamente en nuestros grupos especializados de bóvedas de Bitcoin. Nuestros agentes expertos coordinan operaciones para optimizar los rendimientos, asegurando adiciones diarias de crédito por recompensas de bloque directamente a tu panel de portafolio.',
  },
  {
    question: '¿Por qué están deshabilitados los depósitos directos en mi cuenta?',
    answer: 'Para garantizar el cumplimiento regulatorio y los protocolos de seguridad personalizados de nuestros inversores de Rendimiento Estándar, todos los depósitos son manejados manualmente por tu gerente de cuenta asignado. Comunícate con soporte o usa las opciones del chat "Contactar agente" para coordinar las vías de depósito.',
  },
  {
    question: '¿Cuánto tardan en procesarse los retiros?',
    answer: 'Las solicitudes de retiro requieren verificación facial biométrica automática seguida de una revisión manual de cumplimiento. Esto se procesa dentro de una ventana estándar de 24 a 48 horas para proteger la seguridad y cumplir con las restricciones de transferencia de almacenamiento en frío.',
  },
  {
    question: '¿Existe un monto mínimo de retiro?',
    answer: 'Sí, el monto mínimo de retiro simulado es de COP 100. Los retiros también deben alinearse con los requisitos actuales de tenencia activa especificados del servicio Rendimiento Estándar.',
  },
  {
    question: '¿Cómo funciona la verificación facial?',
    answer: 'Nuestra verificación facial biométrica utiliza imágenes basadas en el navegador (simulación o señal de cámara real) para garantizar la alineación con los perfiles de seguridad registrados. Se te pedirá que gires la cabeza a la izquierda, a la derecha, mires hacia arriba y sonrías para completar el protocolo de validación.',
  },
];

export const mockPlans: InvestmentPlan[] = [
  {
    id: 'standard-yield',
    name: 'Rendimiento Estándar',
    minDeposit: 5000000,
    roi: '28% - 32% Anual',
    duration: '12 Meses',
    features: ['Rendimiento diario', 'Soporte de cuenta', 'Panel completo de IA', 'Verificaciones automaticas', 'Almacenamiento en frio personalizado'],
  },
];

