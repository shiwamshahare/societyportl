import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '@/context/AuthContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '@/constants/layout';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';

const ResidentsScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const isGuard = user?.role === 'guard';
  const isResident = user?.role === 'resident';

  const [searchTerm, setSearchTerm] = useState('');

  // Mock residents data
  const [residents, setResidents] = useState([
    {
      id: '1',
      name: 'John Doe',
      flat: '101A',
      tower: 'Tower A',
      phone: '+1 (555) 123-4567',
      email: 'john@example.com',
    },
    {
      id: '2',
      name: 'Jane Smith',
      flat: '102B',
      tower: 'Tower A',
      phone: '+1 (555) 234-5678',
      email: 'jane@example.com',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      flat: '201C',
      tower: 'Tower B',
      phone: '+1 (555) 345-6789',
      email: 'bob@example.com',
    },
    {
      id: '4',
      name: 'Alice Brown',
      flat: '305A',
      tower: 'Tower C',
      phone: '+1 (555) 456-7890',
      email: 'alice@example.com',
    },
  ]);

  // State for adding new resident (admin only)
  const [newResident, setNewResident] = useState({
    name: '',
    flat: '',
    tower: '',
    phone: '',
    email: '',
  });
  const [showAddResidentModal, setShowAddResidentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.flat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddResident = () => {
    if (!newResident.name.trim() || !newResident.flat.trim() || !newResident.tower.trim() || !newResident.phone.trim() || !newResident.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newResident.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newId = String(residents.length + 1);
      const newResidentObj = {
        id: newId,
        name: newResident.name,
        flat: newResident.flat,
        tower: newResident.tower,
        phone: newResident.phone,
        email: newResident.email,
      };
      setResidents([...residents, newResidentObj]);
      setNewResident({ name: '', flat: '', tower: '', phone: '', email: '' });
      setShowAddResidentModal(false);
      setLoading(false);
      alert('Resident added successfully!');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Residents</Text>
        {isAdmin && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowAddResidentModal(true)}
            style={styles.addButton}
          >
            <Ionicons name="add-outline" size={24} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 4 }}>Add Resident</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      )}

      <View style={styles.searchContainer}>
        <FloatingLabelInput
          label="Search residents..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
          rightComponent={<Ionicons name="search-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />}
          containerStyle={{ flex: 1, marginRight: 0 }}
        />
      </View>

      {(filteredResidents.length === 0) ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={40} color="#D1D5DB" />
          <Text style={styles.emptyText}>No residents found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredResidents}
          renderItem={({ item }) => (
            <View style={styles.residentItem}>
              <View style={styles.residentInfo}>
                <Text style={styles.residentName}>{item.name}</Text>
                <Text style={styles.residentDetail}>
                  Flat {item.flat}, {item.tower}
                </Text>
                <Text style={styles.residentContact}>
                  {item.phone} • {item.email}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#6B7280" />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add Resident Modal (Admin only) */}
      <Modal visible={showAddResidentModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Resident</Text>
            <FloatingLabelInput
              label="Full Name"
              value={newResident.name}
              onChangeText={text => setNewResident({ ...newResident, name: text })}
              style={styles.input}
              labelBgColor={DarkTheme.bg.card}
            />
            <FloatingLabelInput
              label="Flat Number"
              value={newResident.flat}
              onChangeText={text => setNewResident({ ...newResident, flat: text })}
              style={styles.input}
              labelBgColor={DarkTheme.bg.card}
            />
            <FloatingLabelInput
              label="Tower/Building"
              value={newResident.tower}
              onChangeText={text => setNewResident({ ...newResident, tower: text })}
              style={styles.input}
              labelBgColor={DarkTheme.bg.card}
            />
            <FloatingLabelInput
              label="Phone Number"
              value={newResident.phone}
              onChangeText={text => setNewResident({ ...newResident, phone: text })}
              style={styles.input}
              labelBgColor={DarkTheme.bg.card}
            />
            <FloatingLabelInput
              label="Email Address"
              value={newResident.email}
              onChangeText={text => setNewResident({ ...newResident, email: text })}
              style={styles.input}
              autoCapitalize="none"
              labelBgColor={DarkTheme.bg.card}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowAddResidentModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleAddResident}
                disabled={loading}
                style={[styles.submitButton, loading && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Adding...' : 'Add Resident'}
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
  searchContainer: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.primary,
  },
  searchInput: {
    flex: 1,
    height: TOUCH_TARGET.comfortable,
    borderWidth: 1,
    borderColor: DarkTheme.border.input,
    backgroundColor: DarkTheme.bg.input,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.xs,
    color: DarkTheme.text.primary,
  },
  listContent: {
    padding: SPACING.md,
  },
  residentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
  },
  residentDetail: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
  },
  residentContact: {
    fontSize: 12,
    color: DarkTheme.text.tertiary,
    marginTop: SPACING.xs,
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
  addButton: {
    backgroundColor: DarkTheme.accent.gold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default ResidentsScreen;