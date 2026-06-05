import { getLocalIsoDate } from '../utils/dateUtils';

export function buildFuelExpensePayload(params: {
  date: string;
  odometer: string;
  litres: string;
  pricePerLitre: string;
  total: string;
  station: string;
  paymentMethod: string;
}) {
  return {
    category: 'FUEL',
    amount: parseFloat(params.total) || 0,
    description: `${params.station} (Fuel)`,
    expenseDate: params.date || getLocalIsoDate(),
    odometerKm: params.odometer ? parseFloat(params.odometer) : undefined,
    categoryDetails: {
      station: params.station,
      litres: parseFloat(params.litres) || 0,
      pricePerLitre: parseFloat(params.pricePerLitre) || 0,
      paymentMethod: params.paymentMethod,
    },
  };
}

export function buildTollExpensePayload(params: {
  tollName: string;
  amount: string;
  paymentType: string;
  tripPurpose?: string;
  date?: string;
}) {
  return {
    category: 'TOLL',
    amount: parseFloat(params.amount) || 0,
    description: `${params.tollName} (Toll)`,
    expenseDate: params.date || getLocalIsoDate(),
    categoryDetails: {
      tollName: params.tollName,
      paymentType: params.paymentType,
      tripPurpose: params.tripPurpose,
    },
  };
}

export function buildRepairRequestPayload(params: {
  title: string;
  description: string;
  receiptUrl?: string;
}) {
  return {
    title: params.title.trim(),
    description: params.description.trim(),
    receiptUrl: params.receiptUrl,
  };
}

export function buildDailyReportPayload(params: {
  totalKm: string;
  destination: string;
  dailyExpense: string;
  notes?: string;
  date?: string;
}) {
  return {
    totalKm: parseFloat(params.totalKm) || 0,
    destination: params.destination.trim(),
    totalExpense: parseFloat(params.dailyExpense.replace(/,/g, '')) || 0,
    notes: params.notes?.trim(),
    reportDate: params.date || getLocalIsoDate(),
  };
}
