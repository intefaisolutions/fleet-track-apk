import type { Expense } from '../redux/slices/expenseSlice';

const CATEGORY_ICONS: Record<string, { icon: string; iconBg: string }> = {
  FUEL: { icon: '⛽', iconBg: '#E0F2FE' },
  TOLL: { icon: '🛣️', iconBg: '#F3F4F6' },
  SERVICE: { icon: '🔧', iconBg: '#F3F4F6' },
  REPAIR: { icon: '🔧', iconBg: '#F3F4F6' },
  OTHER: { icon: '📝', iconBg: '#F3F4F6' },
  INSURANCE: { icon: '🛡️', iconBg: '#F3F4F6' },
  PUC: { icon: '📋', iconBg: '#F3F4F6' },
  CHALLAN: { icon: '⚠️', iconBg: '#FEE2E2' },
};

function formatIsoDate(value: unknown): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function resolveVehicleReg(item: Record<string, unknown>): string {
  if (typeof item.vehicle === 'string' && item.vehicle.trim()) {
    return item.vehicle.trim();
  }

  const vehicleObj = item.vehicle;
  if (vehicleObj && typeof vehicleObj === 'object') {
    const reg = (vehicleObj as Record<string, unknown>).registrationNumber;
    if (reg != null) return String(reg);
  }

  const vehicleId = item.vehicleId;
  if (typeof vehicleId === 'string' && vehicleId.trim()) {
    return vehicleId.trim();
  }
  if (vehicleId && typeof vehicleId === 'object') {
    const reg = (vehicleId as Record<string, unknown>).registrationNumber;
    if (reg != null) return String(reg);
  }

  return '';
}

function buildTitle(item: Record<string, unknown>): string {
  const category = String(item.category ?? 'OTHER');
  const details = (item.categoryDetails as Record<string, unknown>) || {};
  const description = String(item.description ?? '').trim();

  if (details.type === 'DAILY_REPORT') {
    const dest = details.destination ?? 'Trip';
    const km = details.totalKm != null ? `${details.totalKm} km` : '';
    return `Daily Report: ${dest}${km ? ` (${km})` : ''}`;
  }

  if (details.type === 'REPAIR_REQUEST') {
    return String(details.title ?? description ?? 'Repair Request');
  }

  if (category === 'FUEL') {
    const station = details.station ?? details.fuelStation ?? description;
    return station ? `${station} (Fuel)` : 'Fuel expense';
  }

  if (category === 'TOLL') {
    const toll = details.tollName ?? description;
    return toll ? `${toll} (Toll)` : 'Toll expense';
  }

  if (category === 'SERVICE') {
    const center = details.serviceCenter ?? description;
    const type = details.serviceType ?? 'Service';
    return center ? `${center} (${type})` : 'Service expense';
  }

  if (description) return description;
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export function mapExpenseToUi(item: Record<string, unknown>): Expense {
  const category = String(item.category ?? 'OTHER').toUpperCase();
  const meta = CATEGORY_ICONS[category] ?? CATEGORY_ICONS.OTHER;
  const vehicle = resolveVehicleReg(item).replace(/\s/g, '');

  const receiptUrl =
    typeof item.receiptUrl === 'string' && item.receiptUrl.trim()
      ? item.receiptUrl.trim()
      : undefined;

  return {
    id: String(item.id ?? item._id),
    title: buildTitle(item),
    date: formatIsoDate(item.expenseDate ?? item.date),
    amount: String(item.amount ?? '0'),
    vehicle,
    icon: meta.icon,
    iconBg: meta.iconBg,
    category,
    receiptUrl,
  };
}

export function normalizeExpenseList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.expenses)) return obj.expenses as Record<string, unknown>[];
    if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    if (obj._id != null || obj.id != null) return [obj];
  }
  return [];
}

export function mapExpensesToUi(items: unknown): Expense[] {
  return normalizeExpenseList(items).map(mapExpenseToUi);
}
