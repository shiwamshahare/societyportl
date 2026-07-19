import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { DropdownPicker } from '@/components/ui/DropdownPicker';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '@/context/AuthContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '@/constants/layout';

const TowersScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  // Mock towers data
  const [towers, setTowers] = useState([
    { id: '1', name: 'Tower A', flats: '24', status: 'Active' },
    { id: '2', name: 'Tower B', flats: '20', status: 'Active' },
    { id: '3', name: 'Tower C', flats: '18', status: 'Under Maintenance' },
  ]);

  // State for adding new tower (admin only)
  const [newTower, setNewTower] = useState({
    name: '',
    flats: '',
    status: 'Active',
  });
  const [showAddTowerModal, setShowAddTowerModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusOptions = ['Active', 'Under Maintenance', 'Under Construction'];

  const handleAddTower = () => {
    if (!newTower.name.trim() || !newTower.flats.trim()) {
      Alert.alert('Info', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newId = String(towers.length + 1);
      const newTowerObj = {
        id: newId,
        name: newTower.name,
        flats: newTower.flats,
        status: newTower.status,
      };
      setTowers([...towers, newTowerObj]);
      setNewTower({ name: '', flats: '', status: 'Active' });
      setShowAddTowerModal(false);
      setLoading(false);
      Alert.alert('Success', 'Tower added successfully!');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Towers & Buildings</Text>
        {isAdmin && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowAddTowerModal(true)}
            style={styles.addButton}
          >
            <Ionicons name="add-outline" size={24} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 4 }}>Add Tower</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      )}

      <FlatList
        data={towers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.towerCard}>
            <View style={styles.towerInfo}>
              <Text style={styles.towerName}>{item.name}</Text>
              <Text style={styles.towerDetail}>
                {item.flats} flats • {item.status}
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#6B7280" />
          </View>
        )}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="build-outline" size={40} color="#6B7280" />
            <Text style={styles.emptyText}>No towers found</Text>
          </View>
        }
      />

      {/* Add Tower Modal (Admin only) */}
      <Modal visible={showAddTowerModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Tower</Text>
            <FloatingLabelInput
              label="Tower Name (e.g., Tower A)"
              value={newTower.name}
              onChangeText={text => setNewTower({ ...newTower, name: text })}
              style={styles.input}
              labelBgColor={DarkTheme.bg.card}
            />
            <FloatingLabelInput
              label="Number of Flats"
              value={newTower.flats}
              onChangeText={text => setNewTower({ ...newTower, flats: text })}
              style={styles.input}
              keyboardType="number-pad"
              labelBgColor={DarkTheme.bg.card}
            />
            <View style={{ marginBottom: SPACING.md }}>
              <Text style={[styles.pickerLabel, { marginBottom: 8 }]}>Status:</Text>
              <DropdownPicker
                selectedValue={newTower.status}
                onValueChange={(value) => setNewTower({ ...newTower, status: value as any })}
                items={statusOptions.map(status => ({ label: status, value: status }))}
                placeholder="Select Status"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowAddTowerModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleAddTower}
                disabled={loading}
                style={[styles.submitButton, loading && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Adding...' : 'Add Tower'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
  },
  header: {
    backgroundColor: DarkTheme.bg.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: SPACING.md,
  },
  towerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  towerInfo: {
    flex: 1,
  },
  towerName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
  },
  towerDetail: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
  },
  addButton: {
    backgroundColor: DarkTheme.accent.gold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    marginTop: SPACING.sm,
    fontSize: 16,
    color: DarkTheme.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '80%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textAlign: 'center',
    color: DarkTheme.text.primary,
  },
  input: {
    height: TOUCH_TARGET.comfortable,
    borderWidth: 1,
    borderColor: DarkTheme.border.input,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    fontSize: 14,
    backgroundColor: DarkTheme.bg.input,
    color: DarkTheme.text.primary,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerLabel: {
    fontWeight: '600',
    color: DarkTheme.text.secondary,
    fontSize: 13,
  },
  picker: {
    height: TOUCH_TARGET.comfortable,
    width: 120,
    backgroundColor: DarkTheme.bg.input,
    color: DarkTheme.text.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: DarkTheme.bg.input,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  submitButton: {
    flex: 1,
    backgroundColor: DarkTheme.accent.gold,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: DarkTheme.text.tertiary,
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TowersScreen;