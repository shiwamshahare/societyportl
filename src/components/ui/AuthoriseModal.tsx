import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VisitorContext } from '../../context/VisitorContext';
import { AuthContext } from '../../context/AuthContext';

export const AuthoriseModal = () => {
  const { activeAuthRequest, respondToAuthRequest } = useContext(VisitorContext);
  const { user } = useContext(AuthContext);

  // Modal is only visible to logged-in residents when there's an active request
  if (!activeAuthRequest || user?.role !== 'resident') {
    return null;
  }

  const { id, name, type, company, flatNumber, phone, timeLeft } = activeAuthRequest;

  // Decide avatar source
  const getAvatarSource = () => {
    if (type === 'delivery') {
      return require('../../../assets/images/avatars/visitor2.png');
    }
    return require('../../../assets/images/avatars/visitor4.png');
  };

  const handleAction = (response: 'approved' | 'rejected' | 'left_at_gate') => {
    respondToAuthRequest(id, response);
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Top Notch/Grabber */}
          <View style={styles.grabber} />

          {/* Visitor Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={getAvatarSource()} style={styles.avatar} />
            <View style={styles.badge}>
              <Ionicons 
                name={type === 'delivery' ? 'cube' : type === 'maid' ? 'briefcase' : 'person'} 
                size={16} 
                color="#fff" 
              />
            </View>
          </View>

          {/* Alert Title */}
          <Text style={styles.title}>
            {type === 'delivery' 
              ? `${company || 'Delivery guy'} is waiting at the gate!` 
              : `${type === 'maid' ? 'Helper' : 'Visitor'} ${name} is waiting at the gate!`}
          </Text>

          {/* Address details */}
          <Text style={styles.subtitle}>
            BelleVie, {user?.flatNumber || flatNumber}, Mumbai
          </Text>

          {/* Countdown Ring */}
          <View style={styles.countdownContainer}>
            <View style={[styles.countdownRing, { borderColor: timeLeft < 5 ? '#EF4444' : '#F59E0B' }]}>
              <Text style={[styles.countdownText, { color: timeLeft < 5 ? '#EF4444' : '#F59E0B' }]}>
                {timeLeft}
              </Text>
            </View>
            <Text style={styles.countdownLabel}>seconds remaining</Text>
          </View>

          {/* Visitor Name & Call Row */}
          <View style={styles.visitorRow}>
            <Text style={styles.visitorName}>{name}</Text>
            <TouchableOpacity 
              onPress={() => alert(`Calling ${name} at ${phone}`)}
              style={styles.phoneButton}
            >
              <Ionicons name="call" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Actions Row */}
          <View style={styles.actionsRow}>
            {/* Reject */}
            <View style={styles.actionItem}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => handleAction('rejected')}
                style={[styles.actionButton, styles.rejectButton]}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Reject</Text>
            </View>

            {/* Leave at Gate */}
            {type === 'delivery' && (
              <View style={styles.actionItem}>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => handleAction('left_at_gate')}
                  style={[styles.actionButton, styles.leaveButton]}
                >
                  <Ionicons name="cube-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Leave at Gate</Text>
              </View>
            )}

            {/* Approve */}
            <View style={styles.actionItem}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => handleAction('approved')}
                style={[styles.actionButton, styles.approveButton]}
              >
                <Ionicons name="checkmark" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Approve</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    paddingBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  grabber: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7C3AED',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111827',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  countdownRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  countdownLabel: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  visitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginRight: 10,
  },
  phoneButton: {
    backgroundColor: '#10B981',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
  },
  actionItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  leaveButton: {
    backgroundColor: '#3B82F6',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  actionLabel: {
    fontSize: 13,
    color: '#D1D5DB',
    fontWeight: '500',
  },
});
