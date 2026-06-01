export const getLocalIsoDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDisplayDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export type DateRangeFilter = { from: string; to: string };

export const formatDateRangeLabel = (range: DateRangeFilter) => {
  const from = new Date(`${range.from}T12:00:00`);
  const to = new Date(`${range.to}T12:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return `${range.from} - ${range.to}`;
  }

  const fromLabel = from.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const toLabel = to.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (range.from === range.to) {
    return formatDisplayDate(range.from);
  }

  return `${fromLabel} - ${toLabel}`;
};

export const isDateInRange = (isoDate: string, range: DateRangeFilter) =>
  isoDate >= range.from && isoDate <= range.to;

export const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const amount = Number.isNaN(num) ? 0 : num;
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
