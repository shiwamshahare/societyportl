import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, signOut } = useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const name = user?.name || 'Shiwam Shah';
  const phone = user?.phone || '+91 8605978199';
  const email = user?.email || 'cim.shahare@gmail.com';

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of BelleVie?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => signOut?.() }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addSpaceBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.addSpaceBtnText}>Add Space</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <Ionicons name="person" size={44} color="rgba(255, 255, 255, 0.45)" />
            </View>
            <TouchableOpacity style={styles.cameraIcon} activeOpacity={0.8}>
              <Ionicons name="camera" size={11} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userDetail}>{phone}</Text>
            <Text style={styles.userDetail}>{email}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <View style={styles.redDot} />
          </TouchableOpacity>
        </View>

        {/* Quick Action Grid */}
        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickCard} activeOpacity={0.8}>
            <Ionicons name="heart-outline" size={24} color="#38bdf8" />
            <Text style={styles.quickCardText}>Brands</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} activeOpacity={0.8}>
            <Ionicons name="chatbubbles-outline" size={24} color="#4ade80" />
            <Text style={styles.quickCardText}>Chat with us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} activeOpacity={0.8}>
            <Ionicons name="share-social-outline" size={24} color="#f87171" />
            <Text style={styles.quickCardText}>Share App</Text>
          </TouchableOpacity>
        </View>

        {/* Bookings block */}
        <View style={styles.menuBlock}>
          <Text style={styles.blockTitle}>Bookings</Text>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="storefront-outline" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Marketplace Bookings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
        </View>

        {/* Requests block */}
        <View style={styles.menuBlock}>
          <Text style={styles.blockTitle}>Requests</Text>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="cash-outline" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Loan Requests</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="key-outline" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Rental Requests</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="gift-outline" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Referral Requests</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
        </View>

        {/* My Account block */}
        <View style={styles.menuBlock}>
          <Text style={styles.blockTitle}>My Account</Text>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => setShowDeleteModal(true)}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-remove-outline" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="power-outline" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
        </View>

        {/* Footer brand */}
        <View style={styles.footerBrand}>
          <Text style={styles.brandTitle}>BelleVie</Text>
          <Text style={styles.brandVersion}>v3.6.0</Text>
        </View>
      </ScrollView>

      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalDesc}>
              Are you sure you want to delete your account?{'\n'}
              Note: This action will delete all your data. If you want to leave the property, please use the leave property option
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalBtn}
                onPress={() => {
                  setShowDeleteModal(false);
                  signOut?.();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteModalText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  addSpaceBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addSpaceBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarBorder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userDetail: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 14,
    marginBottom: 2,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    height: 90,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  quickCardText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  menuBlock: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  blockTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerBrand: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
    gap: 4,
  },
  brandTitle: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  brandVersion: {
    color: 'rgba(255, 255, 255, 0.15)',
    fontSize: 12,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalDesc: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelModalBtn: {
    flex: 1,
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelModalText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteModalBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteModalText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
  },
});