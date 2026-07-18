import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { DropdownPicker } from '../components/ui/DropdownPicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { DarkTheme } from '../utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '../constants/layout';

const ComplaintsScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const isGuard = user?.role === 'guard';
  const isResident = user?.role === 'resident';

  // Mock complaints data
  const [complaints, setComplaints] = useState([
    {
      id: '1',
      residentName: 'John Doe',
      flat: '101A',
      issue: 'Water leakage in kitchen',
      status: 'Open',
      priority: 'High',
      date: '2023-05-15',
    },
    {
      id: '2',
      residentName: 'Jane Smith',
      flat: '102B',
      issue: 'Broken intercom',
      status: 'In Progress',
      priority: 'Medium',
      date: '2023-05-14',
    },
    {
      id: '3',
      residentName: 'Bob Johnson',
      flat: '201C',
      issue: 'Parking space unavailable',
      status: 'Closed',
      priority: 'Low',
      date: '2023-05-10',
    },
  ]);

  // State for new complaint (resident)
  const [newComplaint, setNewComplaint] = useState({
    issue: '',
    flat: '',
    priority: 'Medium',
  });
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for updating complaint (guard/admin)
  const [updateComplaintId, setUpdateComplaintId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updatePriority, setUpdatePriority] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const statusOptions = ['Open', 'In Progress', 'Closed'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Open': return '#EF4444';
      case 'In Progress': return '#F59E0B';
      case 'Closed': return '#10B981';
      default: return '#6B7280';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleSubmitNewComplaint = () => {
    if (!newComplaint.issue.trim() || !newComplaint.flat.trim()) {
      Alert.alert('Info', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newId = String(complaints.length + 1);
      const newComplaintObj = {
        id: newId,
        residentName: user?.name || 'Current User',
        flat: newComplaint.flat,
        issue: newComplaint.issue,
        status: 'Open',
        priority: newComplaint.priority,
        date: new Date().toISOString().split('T')[0],
      };
      setComplaints([...complaints, newComplaintObj]);
      setNewComplaint({ issue: '', flat: '', priority: 'Medium' });
      setShowNewComplaintModal(false);
      setLoading(false);
      Alert.alert('Success', 'Complaint submitted successfully!');
    }, 1000);
  };

  const handleUpdateComplaint = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setComplaints(prev => prev.map(complaint =>
        complaint.id === updateComplaintId
          ? { ...complaint, status: updateStatus, priority: updatePriority }
          : complaint
      ));
      setShowUpdateModal(false);
      setLoading(false);
      Alert.alert('Success', 'Complaint updated successfully!');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaints & Issues</Text>
        {isResident && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowNewComplaintModal(true)}
          >
            <Ionicons name="add-outline" size={24} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: SPACING.xs }}>New Complaint</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      )}

      {/* New Complaint Modal (Resident) */}
      <Modal visible={showNewComplaintModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Complaint</Text>
            <TextInput
              placeholder="Issue Description"
              value={newComplaint.issue}
              onChangeText={text => setNewComplaint({ ...newComplaint, issue: text })}
              style={[styles.input, { minHeight: 96 }]}
              multiline
            />
            <TextInput
              placeholder="Flat Number"
              value={newComplaint.flat}
              onChangeText={text => setNewComplaint({ ...newComplaint, flat: text })}
              style={styles.input}
            />
            <View style={{ marginBottom: SPACING.md }}>
              <Text style={[styles.pickerLabel, { marginBottom: 8 }]}>Priority:</Text>
              <DropdownPicker
                selectedValue={newComplaint.priority}
                onValueChange={(value) => setNewComplaint({ ...newComplaint, priority: value as any })}
                items={priorityOptions.map(priority => ({ label: priority, value: priority }))}
                placeholder="Select Priority"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowNewComplaintModal(false)}
                style={styles.cancelButton}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSubmitNewComplaint}
                disabled={loading}
                style={[
                  styles.submitButton,
                  loading && styles.buttonDisabled
                ]}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Complaint Modal (Guard/Admin) */}
      <Modal visible={showUpdateModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Complaint</Text>
            <View style={{ marginBottom: SPACING.md }}>
              <Text style={{ fontWeight: '600', marginBottom: 8, color: DarkTheme.text.secondary }}>Status:</Text>
              <DropdownPicker
                selectedValue={updateStatus}
                onValueChange={(value) => setUpdateStatus(value as string)}
                items={statusOptions.map(status => ({ label: status, value: status }))}
                placeholder="Select Status"
              />
            </View>
            <View style={{ marginBottom: SPACING.md }}>
              <Text style={{ fontWeight: '600', marginBottom: 8, color: DarkTheme.text.secondary }}>Priority:</Text>
              <DropdownPicker
                selectedValue={updatePriority}
                onValueChange={(value) => setUpdatePriority(value as string)}
                items={priorityOptions.map(priority => ({ label: priority, value: priority }))}
                placeholder="Select Priority"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowUpdateModal(false)}
                style={styles.cancelButton}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleUpdateComplaint}
                disabled={loading}
                style={[
                  styles.submitButton,
                  loading && styles.buttonDisabled
                ]}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Updating...' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          // For residents, maybe show only their complaints?
          // For simplicity, showing all but with different capabilities
          const showActions = isGuard || isAdmin;

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            >
              <View style={styles.complaintCard}>
                <View style={styles.complaintInfo}>
                  <Text style={styles.complaintTitle}>{item.issue}</Text>
                  <View style={styles.complaintDetails}>
                    <Text style={styles.detailText}>
                      By: {item.residentName} (Flat {item.flat})
                    </Text>
                    <Text style={styles.detailText}>
                      Date: {item.date}
                    </Text>
                  </View>
                  {showActions && (
                    <View style={styles.actionsContainer}>
                      {(isGuard || isAdmin) && (
                        <View style={styles.statusBadgeContainer}>
                          <Text style={[styles.statusBadge, { backgroundColor: statusColor(item.status) }]}>
                            {item.status}
                          </Text>
                          <Text style={[styles.priorityBadge, { backgroundColor: priorityColor(item.priority) }]}>
                            {item.priority}
                          </Text>
                        </View>
                      )}
                      {showActions && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            setUpdateComplaintId(item.id);
                            setUpdateStatus(item.status);
                            setUpdatePriority(item.priority);
                            setShowUpdateModal(true);
                          }}
                          style={styles.actionButton}
                          hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
                        >
                          <Ionicons name="create-outline" size={20} color="#7C3AED" />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  {!showActions && (
                    <View style={styles.statusBadgeContainer}>
                      <Text style={[styles.statusBadge, { backgroundColor: statusColor(item.status) }]}>
                        {item.status}
                      </Text>
                      <Text style={[styles.priorityBadge, { backgroundColor: priorityColor(item.priority) }]}>
                        {item.priority}
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color="#D1D5DB" />
            <Text style={styles.emptyText}>No complaints found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  header: {
    backgroundColor: DarkTheme.bg.card,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.accent.gold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
  },
  listContent: {
    padding: SPACING.md,
  },
  complaintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  complaintInfo: {
    flex: 1,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
  },
  complaintDetails: {
    marginTop: SPACING.xs,
  },
  detailText: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  actionButton: {
    backgroundColor: DarkTheme.bg.input,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '85%',
    maxHeight: '85%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: DarkTheme.text.primary,
  },
  input: {
    marginBottom: SPACING.md,
    height: TOUCH_TARGET.comfortable,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.input,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    backgroundColor: DarkTheme.bg.input,
    color: DarkTheme.text.primary,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  pickerLabel: {
    fontWeight: '600',
    color: DarkTheme.text.secondary,
    fontSize: 14,
  },
  picker: {
    height: TOUCH_TARGET.comfortable,
    width: 100,
    backgroundColor: DarkTheme.bg.input,
    color: DarkTheme.text.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: DarkTheme.bg.input,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  submitButton: {
    flex: 1,
    backgroundColor: DarkTheme.accent.gold,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: DarkTheme.text.tertiary,
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: DarkTheme.text.secondary,
  },
});

export default ComplaintsScreen;