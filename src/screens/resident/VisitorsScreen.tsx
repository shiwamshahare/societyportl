import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Share, Dimensions, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '@/context/AuthContext';
import { VisitorContext, VisitorType, VisitorLogEntry, PreApprovedInvite } from '@/context/VisitorContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '@/constants/layout';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';

const { width } = Dimensions.get('window');

const VisitorsScreen = () => {
  const { colors } = useTheme();
  const { user, debugSwitchRole } = useContext(AuthContext);
  const { visitorsLog, preApprovedInvites, createPreApprovedInvite } = useContext(VisitorContext);

  const [activeTab, setActiveTab] = useState<'visitors' | 'preapprove'>('visitors');
  
  // States for Pre-approval Creator
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [visitorType, setVisitorType] = useState<VisitorType>('guest');
  const [dateTime, setDateTime] = useState('');
  
  // State for newly created ticket view
  const [activeTicket, setActiveTicket] = useState<PreApprovedInvite | null>(null);

  // Group visitors by date
  const groupedVisitors = visitorsLog.reduce((groups: { [key: string]: VisitorLogEntry[] }, visitor) => {
    const date = visitor.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(visitor);
    return groups;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10B981'; // Green
      case 'rejected':
        return '#EF4444'; // Red
      case 'left_at_gate':
        return '#3B82F6'; // Blue
      case 'pending':
      default:
        return '#F59E0B'; // Orange
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'checkmark-circle';
      case 'rejected':
        return 'close-circle';
      case 'left_at_gate':
        return 'cube';
      case 'pending':
      default:
        return 'time';
    }
  };

  const handleShare = async (ticket: PreApprovedInvite) => {
    try {
      await Share.share({
        message: `BelleVie Entry Passcode\n\n${ticket.residentName} has invited you to BelleVie!\nPasscode: ${ticket.passcode}\nDate: ${ticket.dateTime}\nAddress: ${ticket.flatNumber}, BelleVie, Makwana Rd, Marol, Andheri East, Mumbai-400059.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const submitCreatePass = () => {
    if (!guestName.trim()) {
      alert('Please enter guest name');
      return;
    }

    const dateToUse = dateTime.trim() || 'Today | 12:00 - 4:00 pm';
    const ticket = createPreApprovedInvite(guestName, visitorType, dateToUse);
    
    // Reset form and show created ticket
    setGuestName('');
    setVisitorType('guest');
    setDateTime('');
    setShowCreateModal(false);
    setActiveTicket(ticket);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F17' }}>
      {/* Role Switcher Debug Banner */}
      <View style={styles.debugBanner}>
        <Text style={styles.debugText}>Logged in as: <Text style={{fontWeight: 'bold', color: '#C084FC'}}>{user?.name} ({user?.role})</Text></Text>
        <TouchableOpacity 
          onPress={() => {
            if (debugSwitchRole) debugSwitchRole('guard');
          }}
          style={styles.debugButton}
        >
          <Text style={styles.debugButtonText}>Switch to Guard</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} hitSlop={TOUCH_TARGET.comfortable}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Visitors</Text>
        <TouchableOpacity style={styles.headerIconButton} hitSlop={TOUCH_TARGET.comfortable}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Segmented Control / Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('visitors')}
            style={[styles.tabButton, activeTab === 'visitors' && styles.tabButtonActive]}
            hitSlop={TOUCH_TARGET.comfortable}
          >
            <Text style={[styles.tabText, activeTab === 'visitors' && styles.tabTextActive]}>Visitors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('preapprove')}
            style={[styles.tabButton, activeTab === 'preapprove' && styles.tabButtonActive]}
            hitSlop={TOUCH_TARGET.comfortable}
          >
            <Text style={[styles.tabText, activeTab === 'preapprove' && styles.tabTextActive]}>Pre-approve</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      {activeTab === 'visitors' ? (
        <ScrollView style={styles.contentList} contentContainerStyle={{ paddingBottom: 100 }}>
          {Object.keys(groupedVisitors).length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#6B7280" />
              <Text style={styles.emptyText}>No visitors logged yet</Text>
            </View>
          ) : (
            Object.keys(groupedVisitors).map((date) => (
              <View key={date} style={styles.dateGroup}>
                {/* Date Header */}
                <Text style={styles.dateHeader}>{date}</Text>

                {/* Visitor Cards */}
                {groupedVisitors[date].map((item) => (
                  <View key={item.id} style={styles.visitorCard}>
                    {/* Left Column: Avatar & Green Phone Button overlay */}
                    <View style={styles.avatarWrapper}>
                      <Image source={item.avatar} style={styles.avatar} />
                      <TouchableOpacity
                        onPress={() => alert(`Calling ${item.name} at ${item.phone}`)}
                        style={styles.avatarPhoneOverlay}
                        hitSlop={TOUCH_TARGET.comfortable}
                      >
                        <Ionicons name="call" size={12} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {/* Middle Column: Info */}
                    <View style={styles.infoWrapper}>
                      <View style={styles.nameRow}>
                        <Text style={styles.visitorName}>{item.name}</Text>
                        <View style={[styles.typeBadge, { backgroundColor: item.type === 'guest' ? '#3B82F6' : item.type === 'delivery' ? '#F59E0B' : '#8B5CF6' }]}>
                          <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
                        </View>
                      </View>

                      <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                        <Text style={styles.timeText}>{item.time}</Text>
                      </View>

                      <View style={styles.statusRow}>
                        <Ionicons name="information-circle-outline" size={14} color="#6B7280" />
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                          {item.actionBy}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => alert(`Details for ${item.name}:\nTime: ${item.time}\nDate: ${item.date}\nFlat: ${item.flatNumber}\nStatus: ${item.status}\nLogs: ${item.actionBy}`)}
                        style={styles.viewMoreButton}
                        hitSlop={TOUCH_TARGET.comfortable}
                      >
                        <Text style={styles.viewMoreText}>View More</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Right Column: Status Icon */}
                    <View style={styles.statusIconWrapper}>
                      <Ionicons 
                        name={getStatusIcon(item.status) as any} 
                        size={22} 
                        color={getStatusColor(item.status)} 
                      />
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        /* Pre-approve List View */
        <ScrollView style={styles.contentList} contentContainerStyle={{ paddingBottom: 100 }}>
          {preApprovedInvites.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="qr-code-outline" size={48} color="#6B7280" />
              <Text style={styles.emptyText}>No pre-approvals created</Text>
            </View>
          ) : (
            <View style={styles.preapproveList}>
              {preApprovedInvites.map((invite) => (
                <TouchableOpacity
                  key={invite.id}
                  activeOpacity={0.8}
                  onPress={() => setActiveTicket(invite)}
                  style={styles.preapproveCard}
                  hitSlop={TOUCH_TARGET.comfortable}
                >
                  <View style={styles.preapproveInfo}>
                    <Text style={styles.preapproveName}>{invite.guestName}</Text>
                    <Text style={styles.preapproveDetails}>{invite.dateTime}</Text>
                    <Text style={styles.preapproveCode}>Code: {invite.passcode}</Text>
                  </View>
                  <View style={styles.preapproveAction}>
                    <View style={[styles.statusBadge, { backgroundColor: invite.status === 'active' ? '#059669' : '#4B5563' }]}>
                      <Text style={styles.statusBadgeText}>{invite.status.toUpperCase()}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" style={{ marginTop: 8 }} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Floating Action Button '+' */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowCreateModal(true)}
        style={styles.fab}
        hitSlop={TOUCH_TARGET.comfortable}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* MODAL 1: Create Gate Pass / Invite Input Form */}
      <Modal visible={showCreateModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Pre-approved Pass</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} hitSlop={TOUCH_TARGET.comfortable}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <FloatingLabelInput
                label="Guest Name"
                value={guestName}
                onChangeText={setGuestName}
                style={styles.modalInput}
                labelBgColor="#1F2937"
                containerStyle={{ marginTop: SPACING.md }}
              />

              <Text style={styles.inputLabel}>Visitor Type</Text>
              <View style={styles.typeSelectorRow}>
                {(['guest', 'delivery', 'maid'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setVisitorType(type)}
                    style={[styles.typeSelectButton, visitorType === type && styles.typeSelectButtonActive]}
                  >
                    <Text style={[styles.typeSelectText, visitorType === type && styles.typeSelectTextActive]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FloatingLabelInput
                label="Date & Time (Optional)"
                value={dateTime}
                onChangeText={setDateTime}
                style={styles.modalInput}
                labelBgColor="#1F2937"
                containerStyle={{ marginTop: SPACING.md }}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={submitCreatePass}
                style={styles.generateButton}
                hitSlop={TOUCH_TARGET.comfortable}
              >
                <Text style={styles.generateButtonText}>Generate Pass</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: High Fidelity Ticket / Invite Display (Screen 2) */}
      <Modal visible={activeTicket !== null} transparent={true} animationType="fade">
        {activeTicket && (
          <View style={styles.ticketOverlay}>
            <View style={styles.ticketHeaderRow}>
              <TouchableOpacity
                onPress={() => setActiveTicket(null)}
                style={styles.ticketBackBtn}
                hitSlop={TOUCH_TARGET.comfortable}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
                <Text style={styles.ticketBackText}>Invite</Text>
              </TouchableOpacity>
            </View>

            {/* Ticket Card */}
            <View style={styles.ticketCard}>
              <View style={styles.ticketOrnateFrame}>
                {/* Logo BelleVie */}
                <Text style={styles.ticketLogo}>BELLEVIE</Text>

                {/* Invited text */}
                <Text style={styles.ticketInviteText}>
                  {activeTicket.guestName} has invited you!
                </Text>

                {/* Date & Time */}
                <Text style={styles.ticketDateText}>{activeTicket.dateTime}</Text>

                {/* QR Code MOCK */}
                <View style={styles.qrContainer}>
                  <View style={styles.qrMockBorder}>
                    {/* Drawing a simple stylized grid representing QR */}
                    <View style={styles.qrGridRow}>
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#000' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                    </View>
                    <View style={styles.qrGridRow}>
                      <View style={[styles.qrBlock, { backgroundColor: '#000' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#000' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#000' }]} />
                    </View>
                    <View style={styles.qrGridRow}>
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#000' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                    </View>
                    <View style={styles.qrGridRow}>
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#fff' }]} />
                      <View style={[styles.qrBlock, { backgroundColor: '#000' }]} />
                    </View>
                  </View>
                </View>

                {/* Passcode Number */}
                <Text style={styles.ticketCodeNum}>{activeTicket.passcode}</Text>
                <Text style={styles.ticketCodeSub}>Single Entry</Text>

                {/* Address details */}
                <Text style={styles.ticketAddress}>
                  {activeTicket.flatNumber}, Society Name,{"\n"}
                  Makwana Rd, Marol, Andheri East,{"\n"}
                  Mumbai-400059
                </Text>
              </View>
            </View>

            {/* Share Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleShare(activeTicket)}
              style={styles.shareButton}
              hitSlop={TOUCH_TARGET.comfortable}
            >
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
  },
  debugBanner: {
    backgroundColor: '#1E1B4B',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#312E81',
  },
  debugText: {
    color: '#D8B4FE',
    fontSize: 12, // body3/caption size
  },
  debugButton: {
    backgroundColor: DarkTheme.accent.gold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerIconButton: {
    width: TOUCH_TARGET.comfortable,
    height: TOUCH_TARGET.comfortable,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18, // h5 size
    fontWeight: '600' as const,
    color: '#fff',
  },
  tabContainer: {
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.md,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14, // label1 size
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#000',
  },
  contentList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: SPACING.sm,
  },
  dateGroup: {
    marginBottom: SPACING.lg,
  },
  dateHeader: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    opacity: 0.7,
  },
  visitorCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(21, 21, 21, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: TOUCH_TARGET.comfortable,
    height: TOUCH_TARGET.comfortable,
    borderRadius: BORDER_RADIUS.xl,
  },
  avatarPhoneOverlay: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#151515',
  },
  infoWrapper: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  visitorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: SPACING.sm,
  },
  typeBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 0,
    borderRadius: BORDER_RADIUS.md,
  },
  typeBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: SPACING.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statusText: {
    fontSize: 11,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  viewMoreButton: {
    alignSelf: 'flex-start',
  },
  viewMoreText: {
    fontSize: 11,
    color: '#F59E0B',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  statusIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: '#000',
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    width: TOUCH_TARGET.large,
    height: TOUCH_TARGET.large,
    borderRadius: BORDER_RADIUS.pill,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  preapproveList: {
    paddingVertical: 8,
  },
  preapproveCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(21, 21, 21, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BORDER_RADIUS.xl,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preapproveInfo: {
    flex: 1,
  },
  preapproveName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  preapproveDetails: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  preapproveCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  preapproveAction: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.md,
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xxl,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18, // h5 size
    fontWeight: '600' as const,
    color: '#fff',
  },
  inputLabel: {
    color: '#9CA3AF',
    fontSize: 14, // label1 size
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.lg,
    height: TOUCH_TARGET.comfortable,
    paddingHorizontal: SPACING.md,
    color: '#fff',
    fontSize: 15,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  typeSelectButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  typeSelectButtonActive: {
    backgroundColor: DarkTheme.accent.gold,
    borderColor: DarkTheme.accent.gold,
  },
  typeSelectText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  typeSelectTextActive: {
    color: '#fff',
  },
  generateButton: {
    backgroundColor: DarkTheme.accent.gold,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: 16, // body1 size
  },
  ticketOverlay: {
    flex: 1,
    backgroundColor: '#0B0F17',
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketHeaderRow: {
    width: '100%',
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.md,
  },
  ticketBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketBackText: {
    color: '#fff',
    fontSize: 20, // h4 size
    fontWeight: '600' as const,
    marginLeft: SPACING.sm,
  },
  ticketCard: {
    width: width * 0.88,
    backgroundColor: '#111827',
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: '#D97706', // Ornate yellow border color
    padding: SPACING.lg,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  ticketOrnateFrame: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(217, 119, 6, 0.4)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  ticketLogo: {
    fontSize: 20, // h4 size
    fontWeight: '800' as const,
    color: '#D97706',
    letterSpacing: 4,
    marginBottom: SPACING.lg,
  },
  ticketInviteText: {
    fontSize: 20, // h4 size
    fontWeight: 'bold' as const,
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  ticketDateText: {
    fontSize: 16, // h6 size
    color: '#10B981', // green accent
    marginBottom: SPACING.lg,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  qrMockBorder: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xs,
  },
  qrGridRow: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
  },
  qrBlock: {
    flex: 1,
    margin: SPACING.xs,
  },
  ticketCodeNum: {
    fontSize: 32, // h2 size
    fontWeight: 'bold' as const,
    color: '#F59E0B',
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  ticketCodeSub: {
    fontSize: 14, // body2 size
    color: '#D97706',
    fontWeight: 'bold' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xl,
  },
  ticketAddress: {
    fontSize: 12, // body3 size
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  shareButton: {
    backgroundColor: DarkTheme.accent.gold,
    width: width * 0.88,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    position: 'absolute',
    bottom: SPACING.lg,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: 16, // h6 size
  },
});

export default VisitorsScreen;