import { getLocalIsoDate } from '../utils/dateUtils';

export function buildFuelExpensePayload(params: {
  date: string;
  odometer: string;
  litres: string;
  pricePerLitre: string;
  total: string;
  station: string;
  paymentMethod: string;
  receiptUrl?: string;
}) {
  return {
    category: 'FUEL',
    amount: parseFloat(params.total) || 0,
    description: `${params.station} (Fuel)`,
    expenseDate: params.date || getLocalIsoDate(),
    odometerKm: params.odometer ? parseFloat(params.odometer) : undefined,
    receiptUrl: params.receiptUrl,
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
  receiptUrl?: string;
}) {
  return {
    category: 'TOLL',
    amount: parseFloat(params.amount) || 0,
    description: `${params.tollName} (Toll)`,
    expenseDate: params.date || getLocalIsoDate(),
    receiptUrl: params.receiptUrl,
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

export function buildServiceExpensePayload(params: {
  date: string;
  serviceType: string;
  serviceCenter: string;
  amount: string;
  odometer?: string;
  notes?: string;
  receiptUrl?: string;
}) {
  const serviceType = params.serviceType.trim();
  const serviceCenter = params.serviceCenter.trim();

  return {
    category: 'SERVICE',
    amount: parseFloat(params.amount) || 0,
    description: `${serviceCenter} (${serviceType})`,
    expenseDate: params.date || getLocalIsoDate(),
    odometerKm: params.odometer ? parseFloat(params.odometer) : undefined,
    receiptUrl: params.receiptUrl,
    categoryDetails: {
      serviceType,
      serviceCenter,
      notes: params.notes?.trim(),
    },
  };
}

export function buildOtherExpensePayload(params: {
  cost: string;
  description: string;
  date?: string;
  receiptUrl?: string;
}) {
  const desc = params.description.trim();

  return {
    category: 'OTHER',
    amount: parseFloat(params.cost.replace(/,/g, '')) || 0,
    description: desc,
    expenseDate: params.date || getLocalIsoDate(),
    receiptUrl: params.receiptUrl,
    categoryDetails: {
      type: 'OTHER_EXPENSE',
      description: desc,
    },
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
