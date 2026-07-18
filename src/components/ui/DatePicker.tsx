import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../../constants/layout';

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  visible: boolean;
  onClose: () => void;
  maximumDate?: Date;
  minimumDate?: Date;
};

export const CustomDatePicker = ({
  value,
  onChange,
  visible,
  onClose,
  maximumDate,
  minimumDate,
}: DatePickerProps) => {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Days in month
  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  // First day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate grid items
  const gridItems = [];
  // Empty spaces for padding
  for (let i = 0; i < firstDay; i++) {
    gridItems.push({ type: 'empty', key: `empty-${i}` });
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    gridItems.push({ type: 'day', day: d, key: `day-${d}` });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    const nextMonthDate = new Date(year, month + 1, 1);
    if (maximumDate && nextMonthDate > maximumDate) {
      return;
    }
    setCurrentDate(nextMonthDate);
  };

  const handleDaySelect = (day: number) => {
    const selected = new Date(year, month, day);
    if (maximumDate && selected > maximumDate) return;
    if (minimumDate && selected < minimumDate) return;
    onChange(selected);
    onClose();
  };

  // Quick year selector lists
  const yearsList = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 80; y <= currentYear; y++) {
    yearsList.push(y);
  }

  const [showYearPicker, setShowYearPicker] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                {!showYearPicker ? (
                  <>
                    <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
                      <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowYearPicker(true)} style={styles.titleBtn}>
                      <Text style={styles.titleText}>
                        {months[month]} {year}
                      </Text>
                      <Ionicons name="caret-down" size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
                      <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Text style={styles.titleText}>Select Year</Text>
                    <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                      <Text style={{ color: '#0ea5e9', fontWeight: 'bold' }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Year Selection Dropdown list */}
              {showYearPicker ? (
                <View style={styles.yearListContainer}>
                  <FlatList
                    data={yearsList}
                    keyExtractor={(item) => String(item)}
                    initialScrollIndex={yearsList.indexOf(year) - 3 >= 0 ? yearsList.indexOf(year) - 3 : 0}
                    getItemLayout={(data, index) => ({
                      length: 44,
                      offset: 44 * index,
                      index,
                    })}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.yearItem, item === year && styles.selectedYearItem]}
                        onPress={() => {
                          setCurrentDate(new Date(item, month, 1));
                          setShowYearPicker(false);
                        }}
                      >
                        <Text style={[styles.yearItemText, item === year && styles.selectedYearItemText]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : (
                <>
                  {/* Days of week headers */}
                  <View style={styles.weekHeaders}>
                    {daysOfWeek.map((day) => (
                      <Text key={day} style={styles.weekHeaderCell}>
                        {day}
                      </Text>
                    ))}
                  </View>

                  {/* Days grid */}
                  <View style={styles.grid}>
                    {gridItems.map((item, index) => {
                      if (item.type === 'empty') {
                        return <View key={item.key} style={styles.gridCell} />;
                      }

                      const dayNumber = item.day!;
                      const isSelected =
                        value &&
                        value.getDate() === dayNumber &&
                        value.getMonth() === month &&
                        value.getFullYear() === year;

                      const isToday =
                        new Date().getDate() === dayNumber &&
                        new Date().getMonth() === month &&
                        new Date().getFullYear() === year;

                      const isDayDisabled =
                        (maximumDate && new Date(year, month, dayNumber) > maximumDate) ||
                        (minimumDate && new Date(year, month, dayNumber) < minimumDate);

                      return (
                        <TouchableOpacity
                          key={item.key}
                          style={[
                            styles.gridCell,
                            isSelected && styles.selectedCell,
                            isToday && !isSelected && styles.todayCell,
                          ]}
                          disabled={isDayDisabled}
                          onPress={() => handleDaySelect(dayNumber)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.cellText,
                              isSelected && styles.selectedCellText,
                              isDayDisabled && styles.disabledCellText,
                            ]}
                          >
                            {dayNumber}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#121214',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: SPACING.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  arrowBtn: {
    padding: SPACING.sm,
  },
  titleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  weekHeaderCell: {
    width: '14%',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 2,
  },
  selectedCell: {
    backgroundColor: '#0ea5e9',
  },
  todayCell: {
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.5)',
  },
  cellText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
  },
  selectedCellText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  disabledCellText: {
    color: 'rgba(255, 255, 255, 0.15)',
  },
  yearListContainer: {
    height: 240,
  },
  yearItem: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedYearItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  yearItemText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  selectedYearItemText: {
    color: '#0ea5e9',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
