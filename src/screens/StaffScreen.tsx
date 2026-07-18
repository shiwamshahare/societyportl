import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { DarkTheme } from '../utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '../constants/layout';
import { FloatingLabelInput } from '../components/ui/FloatingLabelInput';

const StaffScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const isGuard = user?.role === 'guard';
  const isResident = user?.role === 'resident';

  // Mock staff data
  const [staff, setStaff] = useState([
    {
      id: '1',
      name: 'Rajesh Kumar',
      role: 'Security Supervisor',
      shift: 'Morning (6AM-2PM)',
      contact: '+1 (555) 111-2222',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Housekeeping Lead',
      shift: 'Day (9AM-5PM)',
      contact: '+1 (555) 333-4444',
    },
    {
      id: '3',
      name: 'Amit Patel',
      role: 'Maintenance Technician',
      shift: 'Evening (2PM-10PM)',
      contact: '+1 (555) 555-6666',
    },
    {
      id: '4',
      name: 'Sneha Patel',
      role: 'Security Guard',
      shift: 'Night (10PM-6AM)',
      contact: '+1 (555) 777-8888',
    },
    {
      id: '5',
      name: 'Vikram Singh',
      role: 'Electrician',
      shift: 'On-call',
      contact: '+1 (555) 999-0000',
    },
  ]);

  // State for adding new staff (admin only)
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    shift: '',
    contact: '',
  });
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter staff based on user role
  const filteredStaff = staff.filter(member => {
    if (isAdmin) return true; // Admin sees all
    if (isGuard) return member.role.toLowerCase().includes('security'); // Guard sees only security
    if (isResident) return true; // Resident sees all (for contacting)
    return false;
  });

  const handleAddStaff = () => {
    if (!newStaff.name.trim() || !newStaff.role.trim() || !newStaff.shift.trim() || !newStaff.contact.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newId = String(staff.length + 1);
      const newStaffObj = {
        id: newId,
        name: newStaff.name,
        role: newStaff.role,
        shift: newStaff.shift,
        contact: newStaff.contact,
      };
      setStaff([...staff, newStaffObj]);
      setNewStaff({ name: '', role: '', shift: '', contact: '' });
      setShowAddStaffModal(false);
      setLoading(false);
      alert('Staff member added successfully!');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Staff & Service Providers</Text>
        {isAdmin && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowAddStaffModal(true)}
            style={styles.addButton}
          >
            <Ionicons name="add-outline" size={24} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 4 }}>Add Staff</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      )}

      {(filteredStaff.length === 0 && !isAdmin) ? (
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={40} color="#6B7280" />
          <Text style={styles.emptyText}>No staff members available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStaff}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.staffCard}>
              <View style={styles.staffInfo}>
                <Text style={styles.staffName}>{item.name}</Text>
                <Text style={styles.staffRole}>{item.role}</Text>
                <View style={styles.staffDetails}>
                  <Text style={styles.detailText}>Shift: {item.shift}</Text>
                  <Text style={styles.detailText}>Contact: {item.contact}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#6B7280" />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add Staff Modal (Admin only) */}
      <Modal visible={showAddStaffModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Staff Member</Text>
            <FloatingLabelInput
               label="Full Name"
               value={newStaff.name}
               onChangeText={text => setNewStaff({ ...newStaff, name: text })}
               style={styles.input}
               labelBgColor={DarkTheme.bg.card}
             />
             <FloatingLabelInput
               label="Role (e.g., Security Guard, Technician)"
               value={newStaff.role}
               onChangeText={text => setNewStaff({ ...newStaff, role: text })}
               style={styles.input}
               labelBgColor={DarkTheme.bg.card}
             />
             <FloatingLabelInput
               label="Shift (e.g., Morning 6AM-2PM)"
               value={newStaff.shift}
               onChangeText={text => setNewStaff({ ...newStaff, shift: text })}
               style={styles.input}
               labelBgColor={DarkTheme.bg.card}
             />
             <FloatingLabelInput
               label="Contact Number"
               value={newStaff.contact}
               onChangeText={text => setNewStaff({ ...newStaff, contact: text })}
               style={styles.input}
               labelBgColor={DarkTheme.bg.card}
             />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowAddStaffModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleAddStaff}
                disabled={loading}
                style={[styles.submitButton, loading && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Adding...' : 'Add Staff'}
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
  listContent: {
    padding: SPACING.md,
  },
  addButton: {
    backgroundColor: DarkTheme.accent.gold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
  },
  staffRole: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
  },
  staffDetails: {
    marginTop: SPACING.xs,
  },
  detailText: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
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

export default StaffScreen;