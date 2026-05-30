import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';

const ACTIVE_BLUE = '#1DA1F2';
const BRAND_DARK = '#02689B';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarDatePickerProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string | 'all';
  onSelectDate: (date: string | 'all') => void;
}

const parseIsoDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
};

const toIsoDate = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
}) => {
  const today = new Date();
  const initial =
    selectedDate !== 'all'
      ? parseIsoDate(selectedDate)
      : { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };

  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [pendingDate, setPendingDate] = useState<string | 'all'>(selectedDate);

  useEffect(() => {
    if (!visible) return;
    const next =
      selectedDate !== 'all'
        ? parseIsoDate(selectedDate)
        : { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
    setViewYear(next.year);
    setViewMonth(next.month);
    setShowYearPicker(false);
    setPendingDate(selectedDate);
  }, [visible, selectedDate]);

  const years = useMemo(() => {
    const current = today.getFullYear();
    const list: number[] = [];
    for (let y = current - 10; y <= current + 1; y += 1) {
      list.push(y);
    }
    return list;
  }, []);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(day);
    }
    return cells;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    setShowYearPicker(false);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    setShowYearPicker(false);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const iso = toIsoDate(viewYear, viewMonth, day);
    setPendingDate(iso);
    onSelectDate(iso);
    onClose();
  };

  const activeSelection = pendingDate;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.allDatesBtn, activeSelection === 'all' && styles.allDatesBtnActive]}
            onPress={() => {
              setPendingDate('all');
              onSelectDate('all');
              onClose();
            }}
          >
            <Text
              style={[
                styles.allDatesText,
                activeSelection === 'all' && styles.allDatesTextActive,
              ]}
            >
              All Dates
            </Text>
          </TouchableOpacity>

          <View style={styles.monthRow}>
            <TouchableOpacity style={styles.navBtn} onPress={goPrevMonth} activeOpacity={0.7}>
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.monthCenter}>
              <Text style={styles.monthText}>{MONTHS[viewMonth]}</Text>
              <TouchableOpacity
                style={styles.yearBtn}
                onPress={() => setShowYearPicker((v) => !v)}
                activeOpacity={0.7}
              >
                <Text style={styles.yearText}>{viewYear}</Text>
                <Text style={styles.yearChevron}>{showYearPicker ? '▲' : '▼'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.navBtn} onPress={goNextMonth} activeOpacity={0.7}>
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>

          {showYearPicker ? (
            <ScrollView style={styles.yearList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[styles.yearItem, viewYear === year && styles.yearItemActive]}
                  onPress={() => {
                    setViewYear(year);
                    setShowYearPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.yearItemText,
                      viewYear === year && styles.yearItemTextActive,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.calendarBody}>
              <View style={styles.weekRow}>
                {WEEK_DAYS.map((day) => (
                  <View key={day} style={styles.weekDayCell}>
                    <Text style={styles.weekDay}>{day}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <View key={`empty-${index}`} style={styles.dayCell} />;
                  }

                  const iso = toIsoDate(viewYear, viewMonth, day);
                  const isSelected = activeSelection === iso;
                  const isToday =
                    day === today.getDate() &&
                    viewMonth === today.getMonth() &&
                    viewYear === today.getFullYear();

                  return (
                    <TouchableOpacity
                      key={iso}
                      style={styles.dayCell}
                      onPress={() => handleSelectDay(day)}
                      activeOpacity={0.6}
                    >
                      <View style={styles.dayContent}>
                        <Text
                          style={[
                            styles.dayText,
                            isToday && styles.dayTextToday,
                            isSelected && styles.dayTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                        {isSelected ? <View style={styles.selectedDot} /> : <View style={styles.dotSpacer} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const CELL_WIDTH = `${100 / 7}%`;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 16, fontWeight: '600', color: TEXT_DARK },
  closeBtn: { fontSize: 16, color: TEXT_MUTED, padding: 2 },
  allDatesBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  allDatesBtnActive: {
    backgroundColor: '#E8F4FC',
  },
  allDatesText: { fontSize: 13, color: TEXT_MUTED, fontWeight: '500' },
  allDatesTextActive: { color: BRAND_DARK, fontWeight: '600' },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnText: { fontSize: 20, color: TEXT_DARK, lineHeight: 22, marginTop: -1 },
  monthCenter: { alignItems: 'center' },
  monthText: { fontSize: 16, fontWeight: '600', color: TEXT_DARK, letterSpacing: 0.2 },
  yearBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 2, paddingVertical: 2, paddingHorizontal: 4 },
  yearText: { fontSize: 13, color: ACTIVE_BLUE, fontWeight: '500' },
  yearChevron: { fontSize: 8, color: ACTIVE_BLUE, marginLeft: 4, marginTop: 1 },
  yearList: { maxHeight: 160, marginBottom: 4 },
  yearItem: {
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  yearItemActive: { backgroundColor: '#E8F4FC' },
  yearItemText: { fontSize: 14, color: TEXT_DARK, textAlign: 'center' },
  yearItemTextActive: { color: BRAND_DARK, fontWeight: '600' },
  calendarBody: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDayCell: {
    width: CELL_WIDTH,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekDay: {
    fontSize: 11,
    fontWeight: '500',
    color: TEXT_MUTED,
    letterSpacing: 0.2,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL_WIDTH,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  dayText: {
    fontSize: 14,
    color: TEXT_DARK,
    fontWeight: '400',
    lineHeight: 18,
  },
  dayTextToday: {
    color: ACTIVE_BLUE,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: BRAND_DARK,
    fontWeight: '700',
  },
  selectedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: ACTIVE_BLUE,
    marginTop: 3,
  },
  dotSpacer: {
    width: 5,
    height: 5,
    marginTop: 3,
  },
});
