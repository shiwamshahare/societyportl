import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, SPACING } from '../../constants/layout';

type DropdownItem = {
  label: string;
  value: string;
};

type DropdownPickerProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: DropdownItem[];
  placeholder?: string;
};

export const DropdownPicker = ({
  selectedValue,
  onValueChange,
  items,
  placeholder,
}: DropdownPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find((item) => item.value === selectedValue);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerTrigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.triggerText, !selectedItem && styles.placeholderText]}>
          {selectedItem ? selectedItem.label : placeholder || 'Select option'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="rgba(255, 255, 255, 0.5)" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>{placeholder || 'Select Option'}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
                {items.map((item, index) => {
                  const isSelected = item.value === selectedValue;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.item, isSelected && styles.selectedItem]}
                      onPress={() => {
                        onValueChange(item.value);
                        setModalVisible(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                        {item.label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  triggerText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: '#121214',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingVertical: SPACING.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  selectedItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
  },
  selectedItemText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
