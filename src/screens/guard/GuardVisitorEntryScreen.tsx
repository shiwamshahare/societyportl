import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthContext';
import { VisitorContext, VisitorType, PreApprovedInvite } from '@/context/VisitorContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '@/constants/layout';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';

const GuardVisitorEntryScreen = () => {
  const { signOut, user, debugSwitchRole } = useContext(AuthContext);
  const { 
    preApprovedInvites, 
    submitGuardPasscode, 
    submitGuardManualEntry,
    visitorsLog,
    activeAuthRequest,
    respondToAuthRequest
  } = useContext(VisitorContext);

  const [details, setDetails] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modals & States
  const [showScanModal, setShowScanModal] = useState(false);
  const [showManualRegModal, setShowManualRegModal] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ title: string; message: string } | null>(null);

  // Manual registration form fields
  const [visitorName, setVisitorName] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [visitorType, setVisitorType] = useState<VisitorType>('delivery');
  const [company, setCompany] = useState('');

  // Track the ID of the current request we are waiting for resident decision
  const [currentRequestLogId, setCurrentRequestLogId] = useState<string | null>(null);
  const [waitingForResident, setWaitingForResident] = useState(false);

  // Keypad Handlers
  const handleKeyPress = (val: string) => {
    setErrorMessage('');
    if (details.length < 10) {
      setDetails(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    setDetails(prev => prev.slice(0, -1));
  };

  const handleReset = () => {
    setDetails('');
    setErrorMessage('');
  };

  // Submit Passcode or Mobile
  const handleSubmit = () => {
    if (!details.trim()) {
      setErrorMessage('Please enter details');
      return;
    }

    // 1. Check if it matches a pre-approved passcode (6 digits)
    if (details.length === 6) {
      const result = submitGuardPasscode(details);
      if (result.success && result.invite) {
        setSuccessInfo({
          title: 'Passcode Verified!',
          message: `Welcome, ${result.invite.guestName}\nVisiting Flat ${result.invite.flatNumber}\nType: ${result.invite.type.toUpperCase()}`,
        });
        setShowSuccessOverlay(true);
        setDetails('');
        setErrorMessage('');
      } else {
        setErrorMessage(result.message);
      }
    } else {
      // 2. Treat as Mobile number or other entry -> Open Manual Registration
      setVisitorName('');
      setFlatNumber('');
      setCompany(details.toLowerCase().includes('amazon') || details.toLowerCase().includes('flipkart') ? details : 'Amazon');
      setVisitorType(details.length >= 10 ? 'delivery' : 'guest');
      setShowManualRegModal(true);
    }
  };

  // Submit Manual Form -> Trigger Resident Approval
  const submitManualForm = () => {
    if (!visitorName.trim() || !flatNumber.trim()) {
      alert('Please enter Name and Flat Number');
      return;
    }

    const result = submitGuardManualEntry({
      name: visitorName,
      type: visitorType,
      company: visitorType === 'delivery' ? (company || 'Delivery') : undefined,
      flatNumber,
      phone: details || '+91 99999 88888',
    });

    if (result.success) {
      setCurrentRequestLogId(result.requestId);
      setWaitingForResident(true);
      setShowManualRegModal(false);
    }
  };

  // Monitor visitorsLog to detect resident approval in real time
  useEffect(() => {
    if (!waitingForResident || !currentRequestLogId) return;

    const logEntry = visitorsLog.find(entry => entry.id === currentRequestLogId);
    if (logEntry && logEntry.status !== 'pending') {
      setWaitingForResident(false);
      
      if (logEntry.status === 'approved') {
        setSuccessInfo({
          title: 'Resident Approved!',
          message: `Access Granted for ${logEntry.name}\nFlat ${logEntry.flatNumber}`,
        });
        setShowSuccessOverlay(true);
      } else if (logEntry.status === 'rejected') {
        alert(`Access Denied: Resident rejected entry for ${logEntry.name}`);
      } else if (logEntry.status === 'left_at_gate') {
        setSuccessInfo({
          title: 'Left at Gate Request!',
          message: `Resident requested ${logEntry.name} to leave the package at the gate.`,
        });
        setShowSuccessOverlay(true);
      }
      
      // Clear tracking
      setCurrentRequestLogId(null);
      setDetails('');
    }
  }, [visitorsLog, waitingForResident, currentRequestLogId]);

  // Simulate scanning a QR Code
  const simulateScan = (invite: PreApprovedInvite) => {
    const result = submitGuardPasscode(invite.passcode);
    if (result.success) {
      setSuccessInfo({
        title: 'QR Code Scanned!',
        message: `Welcome, ${invite.guestName}\nVisiting Flat ${invite.flatNumber}\nPre-approved Entry`,
      });
      setShowScanModal(false);
      setShowSuccessOverlay(true);
      setDetails('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Role Switcher Debug Banner */}
      <View style={styles.debugBanner}>
        <Text style={styles.debugText}>Logged in as: <Text style={{fontWeight: 'bold', color: '#34D399'}}>{user?.name} ({user?.role})</Text></Text>
        <TouchableOpacity 
          onPress={() => {
            if (debugSwitchRole) debugSwitchRole('resident');
          }}
          style={styles.debugButton}
        >
          <Text style={styles.debugButtonText}>Switch to Resident</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BelleVie Guard Gate</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            onPress={signOut}
            style={styles.headerIcon}
          >
            <Ionicons name="power" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Form content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Scan section */}
        <View style={styles.sectionCard}>
          <View style={styles.scanRow}>
            <View style={styles.scanTextContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="qr-code-outline" size={24} color="#0D9488" style={{ marginRight: 8 }} />
                <Text style={styles.scanTitle}>Scan the QR code for</Text>
              </View>
              <Text style={styles.scanSubtitle}>Quick Entry</Text>
            </View>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setShowScanModal(true)}
              style={styles.scanButton}
            >
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OR Divider */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        {/* Text Details input field and numeric Keypad */}
        <View style={styles.sectionCard}>
          <Text style={styles.welcomeLabel}>Welcome Guard</Text>
          <Text style={styles.inputTitle}>Enter Passcode or Mobile Number</Text>
          
          {/* Details Textbox with submit arrow */}
          <View style={styles.inputWrapper}>
            <FloatingLabelInput
              label="Enter passcode or mobile"
              value={details}
              editable={false}
              style={styles.textbox}
              containerStyle={{ flex: 1, marginRight: SPACING.xs }}
            />
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleSubmit}
              style={styles.submitArrow}
            >
              <Ionicons name="arrow-forward-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {/* Keypad Grid */}
          <View style={styles.keypadGrid}>
            <View style={styles.keypadRow}>
              <TouchableOpacity onPress={() => handleKeyPress('1')} style={styles.keyButton}><Text style={styles.keyText}>1</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleKeyPress('2')} style={styles.keyButton}><Text style={styles.keyText}>2</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleKeyPress('3')} style={styles.keyButton}><Text style={styles.keyText}>3</Text></TouchableOpacity>
            </View>
            <View style={styles.keypadRow}>
              <TouchableOpacity onPress={() => handleKeyPress('4')} style={styles.keyButton}><Text style={styles.keyText}>4</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleKeyPress('5')} style={styles.keyButton}><Text style={styles.keyText}>5</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleKeyPress('6')} style={styles.keyButton}><Text style={styles.keyText}>6</Text></TouchableOpacity>
            </View>
            <View style={styles.keypadRow}>
              <TouchableOpacity onPress={() => handleKeyPress('7')} style={styles.keyButton}><Text style={styles.keyText}>7</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleKeyPress('8')} style={styles.keyButton}><Text style={styles.keyText}>8</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleKeyPress('9')} style={styles.keyButton}><Text style={styles.keyText}>9</Text></TouchableOpacity>
            </View>
            <View style={styles.keypadRow}>
              <TouchableOpacity onPress={handleReset} style={styles.keyButton}><Text style={[styles.keyText, { fontSize: 14, color: '#6B7280' }]}>Reset</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleKeyPress('0')} style={styles.keyButton}><Text style={styles.keyText}>0</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleBackspace} style={styles.keyButton}>
                <Ionicons name="arrow-back-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* MODAL 1: QR Scan Simulator Picker */}
      <Modal visible={showScanModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Simulate QR Code Scan</Text>
              <TouchableOpacity onPress={() => setShowScanModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalLabel}>Select a Pre-approved Invite to Scan:</Text>
              {preApprovedInvites.filter(i => i.status === 'active').length === 0 ? (
                <Text style={styles.noInvitesText}>No active pre-approved invites. Generate one in the Resident app first!</Text>
              ) : (
                preApprovedInvites.filter(i => i.status === 'active').map((invite) => (
                  <TouchableOpacity 
                    key={invite.id} 
                    onPress={() => simulateScan(invite)}
                    style={styles.inviteItem}
                  >
                    <Ionicons name="qr-code" size={20} color="#0D9488" style={{ marginRight: 12 }} />
                    <View>
                      <Text style={styles.inviteName}>{invite.guestName} (Code: {invite.passcode})</Text>
                      <Text style={styles.inviteDetails}>Flat {invite.flatNumber} • {invite.dateTime}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Manual Registration Form */}
      <Modal visible={showManualRegModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manual Visitor Registration</Text>
              <TouchableOpacity onPress={() => setShowManualRegModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <FloatingLabelInput
                label="Mobile Entered"
                value={details}
                editable={false}
                style={styles.formInput}
                labelBgColor={DarkTheme.bg.card}
                containerStyle={{ marginTop: SPACING.md }}
              />

              <FloatingLabelInput
                label="Visitor Name"
                value={visitorName}
                onChangeText={setVisitorName}
                style={styles.formInput}
                labelBgColor={DarkTheme.bg.card}
                containerStyle={{ marginTop: SPACING.md }}
              />

              <FloatingLabelInput
                label="Flat Number"
                value={flatNumber}
                onChangeText={setFlatNumber}
                style={styles.formInput}
                labelBgColor={DarkTheme.bg.card}
                containerStyle={{ marginTop: SPACING.md }}
              />

              <Text style={[styles.formInputLabel, { marginTop: SPACING.md, marginBottom: 8 }]}>Visitor Type</Text>
              <View style={styles.regTypeRow}>
                {(['guest', 'delivery', 'maid'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setVisitorType(t)}
                    style={[styles.regTypeBtn, visitorType === t && styles.regTypeBtnActive]}
                  >
                    <Text style={[styles.regTypeText, visitorType === t && styles.regTypeTextActive]}>
                      {t.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {visitorType === 'delivery' && (
                <FloatingLabelInput
                  label="Delivery Company"
                  value={company}
                  onChangeText={setCompany}
                  style={styles.formInput}
                  labelBgColor={DarkTheme.bg.card}
                  containerStyle={{ marginTop: SPACING.md }}
                />
              )}

              <TouchableOpacity 
                onPress={submitManualForm}
                style={styles.formSubmitButton}
              >
                <Text style={styles.formSubmitText}>Request Resident Approval</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Waiting for Resident Approval Screen */}
      <Modal visible={waitingForResident} transparent={true} animationType="fade">
        <View style={styles.waitingOverlay}>
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="large" color="#0D9488" style={{ marginBottom: 16 }} />
            <Text style={styles.waitingTitle}>Waiting for Resident Approval</Text>
            <Text style={styles.waitingSubtitle}>
              Sent request to Flat {flatNumber} for {visitorName} (timer: {activeAuthRequest?.timeLeft || 15}s)
            </Text>
            
            {/* Simulation Assist Panel */}
            <View style={styles.simulationPanel}>
              <Text style={styles.simulationTitle}>⚡ Simulation Controls ⚡</Text>
              <Text style={styles.simulationSub}>Since this is a mockup, you can switch roles to the Resident to approve, or click shortcuts below to simulate:</Text>
              <View style={styles.simulationButtons}>
                <TouchableOpacity 
                  onPress={() => currentRequestLogId && respondToAuthRequest(currentRequestLogId, 'approved')}
                  style={[styles.simBtn, { backgroundColor: '#10B981' }]}
                >
                  <Text style={styles.simBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => currentRequestLogId && respondToAuthRequest(currentRequestLogId, 'left_at_gate')}
                  style={[styles.simBtn, { backgroundColor: '#3B82F6' }]}
                >
                  <Text style={styles.simBtnText}>Leave Gate</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => currentRequestLogId && respondToAuthRequest(currentRequestLogId, 'rejected')}
                  style={[styles.simBtn, { backgroundColor: '#EF4444' }]}
                >
                  <Text style={styles.simBtnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* OVERLAY 4: Verification Success Feedback Screen */}
      <Modal visible={showSuccessOverlay} transparent={true} animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <View style={styles.successIconOuter}>
              <Ionicons name="checkmark-circle" size={80} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>{successInfo?.title}</Text>
            <Text style={styles.successMessage}>{successInfo?.message}</Text>
            
            <TouchableOpacity 
              onPress={() => setShowSuccessOverlay(false)}
              style={styles.successOkButton}
            >
              <Text style={styles.successOkText}>Ok, Allow Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
    padding: SPACING.lg,
  },
  debugBanner: {
    backgroundColor: '#064E3B',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#065F46',
  },
  debugText: {
    color: '#A7F3D0',
    fontSize: 12,
  },
  debugButton: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
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
    backgroundColor: DarkTheme.bg.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 2,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  sectionCard: {
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  scanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  scanSubtitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DarkTheme.accent.teal,
    marginTop: SPACING.xs,
  },
  scanButton: {
    backgroundColor: DarkTheme.accent.teal,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: DarkTheme.border.subtle,
  },
  orText: {
    marginHorizontal: SPACING.md,
    fontSize: 13,
    fontWeight: 'bold',
    color: DarkTheme.text.tertiary,
  },
  welcomeLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DarkTheme.accent.teal,
    marginBottom: SPACING.xs,
  },
  inputTitle: {
    fontSize: 13,
    color: DarkTheme.text.secondary,
    marginBottom: SPACING.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  textbox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: DarkTheme.border.input,
    backgroundColor: DarkTheme.bg.input,
    borderRadius: BORDER_RADIUS.md,
    height: TOUCH_TARGET.comfortable,
    paddingHorizontal: SPACING.md,
    fontSize: 18,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  submitArrow: {
    backgroundColor: DarkTheme.accent.teal,
    width: TOUCH_TARGET.comfortable,
    height: TOUCH_TARGET.comfortable,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  errorText: {
    color: DarkTheme.status.error,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  keypadGrid: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  keyButton: {
    flex: 1,
    backgroundColor: DarkTheme.bg.input,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.md,
    height: TOUCH_TARGET.comfortable,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
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
    width: '90%',
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
    paddingBottom: SPACING.xs,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  modalLabel: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    marginBottom: SPACING.sm,
  },
  noInvitesText: {
    color: DarkTheme.text.tertiary,
    textAlign: 'center',
    paddingVertical: SPACING.md,
    fontSize: 13,
  },
  inviteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  inviteName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  inviteDetails: {
    fontSize: 11,
    color: DarkTheme.text.secondary,
    marginTop: SPACING.xs,
  },
  formInputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: DarkTheme.text.secondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  formInput: {
    borderWidth: 1,
    borderColor: DarkTheme.border.input,
    borderRadius: BORDER_RADIUS.md,
    height: TOUCH_TARGET.comfortable,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    backgroundColor: DarkTheme.bg.input,
    color: DarkTheme.text.primary,
  },
  regTypeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  regTypeBtn: {
    flex: 1,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: DarkTheme.bg.input,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  regTypeBtnActive: {
    backgroundColor: DarkTheme.accent.teal,
    borderColor: DarkTheme.accent.teal,
  },
  regTypeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: DarkTheme.text.secondary,
  },
  regTypeTextActive: {
    color: '#fff',
  },
formSubmitButton: {
    backgroundColor: DarkTheme.accent.teal,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  formSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  waitingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingContainer: {
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  waitingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginBottom: SPACING.sm,
  },
  waitingSubtitle: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  simulationPanel: {
    width: '100%',
    backgroundColor: 'rgba(13, 148, 136, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.2)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  simulationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DarkTheme.accent.teal,
    marginBottom: SPACING.xs,
  },
  simulationSub: {
    fontSize: 11,
    color: DarkTheme.text.secondary,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: SPACING.md,
  },
  simulationButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  simBtn: {
    flex: 1,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  simBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  successIconOuter: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginBottom: SPACING.xs,
  },
  successMessage: {
    fontSize: 15,
    color: DarkTheme.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  successOkButton: {
    backgroundColor: DarkTheme.status.success,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
    alignItems: 'center',
  },
  successOkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GuardVisitorEntryScreen;
