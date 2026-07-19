import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { DarkTheme } from '../utils/theme';
import { SPACING, BORDER_RADIUS } from '../constants/layout';

const { width } = Dimensions.get('window');

// Local presets to choose from if camera/gallery isn't available or fails
const PRESET_PHOTOS = [
  require('../../assets/images/avatars/user.png'),
  require('../../assets/images/avatars/visitor1.png'),
  require('../../assets/images/avatars/visitor2.png'),
  require('../../assets/images/avatars/visitor3.png'),
  require('../../assets/images/avatars/visitor4.png'),
];

const DigitalIdScreen = ({ navigation }: any) => {
  const { user } = useContext(AuthContext);
  
  // State variables
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [usePresetIdx, setUsePresetIdx] = useState<number | null>(null);
  const [idGenerated, setIdGenerated] = useState(false);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  
  // Toggle between Owner & Tenant for demo/testing purposes
  const [isOwnerRole, setIsOwnerRole] = useState(user?.role !== 'guard');

  // Animation values
  const marqueeAnim = useRef(new Animated.Value(0)).current;
  const qrScannerAnim = useRef(new Animated.Value(0)).current;

  // Marquee text loop animation
  useEffect(() => {
    if (idGenerated) {
      marqueeAnim.setValue(0);
      Animated.loop(
        Animated.timing(marqueeAnim, {
          toValue: -width,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [idGenerated, isOwnerRole]);

  // QR code scanner laser animation
  useEffect(() => {
    if (showQrModal) {
      qrScannerAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(qrScannerAnim, {
            toValue: 200,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(qrScannerAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showQrModal]);

  // Handle Photo Picker
  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Photo library permissions are required to upload a profile picture. Would you like to select a preset avatar instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Use Preset', onPress: () => setShowPresetPicker(true) },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
        setUsePresetIdx(null);
      }
    } catch (err) {
      console.log('Error launching library picker:', err);
      setShowPresetPicker(true);
    }
  };

  const handlePresetSelect = (idx: number) => {
    setUsePresetIdx(idx);
    setPhotoUri(null);
    setShowPresetPicker(false);
  };

  const handleResetFlow = () => {
    setPhotoUri(null);
    setUsePresetIdx(null);
    setIdGenerated(false);
  };

  const dynamicName = user?.name || (isOwnerRole ? 'Priyanka Sharma' : 'Johnnathan Doe');
  const dynamicId = isOwnerRole ? '106567759' : '106567678';
  const dynamicFlats = isOwnerRole 
    ? ['Agona A 102', 'Eliza E 505', 'Arina A 104']
    : ['Arina A 105', 'Allura F 303', 'Wing B 202'];

  const societyName = user?.societyName || 'PORTL RESIDENCY';
  const userRoleText = isOwnerRole ? 'OWNER' : 'TENANT';
  const borderRingColor = isOwnerRole ? '#D97706' : '#9CA3AF'; // Gold vs Silver
  const headerBarBg = isOwnerRole ? '#D97706' : '#374151'; // Gold vs Silver/Gray

  const renderPhotoSource = () => {
    if (photoUri) {
      return { uri: photoUri };
    }
    if (usePresetIdx !== null) {
      return PRESET_PHOTOS[usePresetIdx];
    }
    return require('../../assets/images/avatars/user.png');
  };

  // Background Glow Spots (matching society theme)
  const BackgroundGlows = () => (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient id="glowLeft" cx="15%" cy="30%" rx="35%" ry="25%">
            <Stop offset="0%" stopColor={isOwnerRole ? '#D97706' : '#3B82F6'} stopOpacity="0.10" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="glowRight" cx="85%" cy="60%" rx="35%" ry="25%">
            <Stop offset="0%" stopColor="#0D9488" stopOpacity="0.10" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowLeft)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowRight)" />
      </Svg>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackgroundGlows />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital ID</Text>
        {idGenerated ? (
          <TouchableOpacity 
            style={styles.headerQrBtn} 
            onPress={() => setShowQrModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {!idGenerated ? (
          /* PHASES 1 & 2: CREATE & GENERATE FLOWS */
          <View style={styles.creationContainer}>
            <View style={[styles.idCardContainer, { borderColor: '#D97706' }]}>
              {/* Card Brand Header */}
              <View style={styles.cardBrandHeader}>
                <Text style={styles.cardBrandText}>PORTL</Text>
              </View>

              {/* Avatar upload/preview circle */}
              <View style={styles.avatarWrapper}>
                <View style={[styles.avatarBorder, { borderColor: 'rgba(255, 255, 255, 0.15)' }]}>
                  {photoUri || usePresetIdx !== null ? (
                    <Image source={renderPhotoSource()} style={styles.avatarImg} />
                  ) : (
                    <Ionicons name="person-outline" size={60} color="rgba(255, 255, 255, 0.3)" />
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.uploadCameraIcon} 
                  onPress={handlePickPhoto}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Action Prompt */}
              <View style={styles.promptBlock}>
                <Text style={styles.promptTitle}>
                  {photoUri || usePresetIdx !== null ? 'Generate Digital ID' : 'Create Digital ID'}
                </Text>
                <Text style={styles.promptSubtitle}>
                  {photoUri || usePresetIdx !== null 
                    ? 'Please review how your photo will appear & click below to generate' 
                    : 'Please upload a photo with your face clearly visible'}
                </Text>
              </View>

              {/* Submit Buttons */}
              <View style={styles.cardButtonContainer}>
                {photoUri || usePresetIdx !== null ? (
                  <TouchableOpacity
                    style={styles.actionBtnSolid}
                    onPress={() => setIdGenerated(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionBtnTextDark}>Generate ID</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.actionBtnSolid}
                    onPress={handlePickPhoto}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionBtnTextDark}>Upload Photo</Text>
                  </TouchableOpacity>
                )}

                {/* Option to use presets if pick fails or they want mock */}
                <TouchableOpacity
                  style={styles.presetOptionBtn}
                  onPress={() => setShowPresetPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.presetOptionText}>or pick preset avatar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          /* PHASE 3: ACTIVE ID CARD VIEW */
          <View style={styles.activeIdContainer}>
            <View style={[styles.idCardContainer, { borderColor: borderRingColor }]}>
              {/* Rolling/Marquee Top Header Bar */}
              <View style={[styles.marqueeBar, { backgroundColor: headerBarBg }]}>
                <Animated.View style={[styles.marqueeTextRow, { transform: [{ translateX: marqueeAnim }] }]}>
                  <Text style={styles.marqueeText}>
                    {`${societyName.toUpperCase()} • DIGITAL ID • ${userRoleText} • ${societyName.toUpperCase()} • `}
                  </Text>
                  <Text style={styles.marqueeText}>
                    {`${societyName.toUpperCase()} • DIGITAL ID • ${userRoleText} • ${societyName.toUpperCase()} • `}
                  </Text>
                </Animated.View>
              </View>

              {/* Card Brand Header */}
              <View style={[styles.cardBrandHeader, { marginTop: 12 }]}>
                <Text style={styles.cardBrandText}>PORTL</Text>
              </View>

              {/* Avatar Circle with Ring */}
              <View style={styles.avatarWrapperActive}>
                <View style={[styles.avatarBorderActive, { borderColor: borderRingColor }]}>
                  <Image source={renderPhotoSource()} style={styles.avatarImgActive} />
                </View>
              </View>

              {/* Resident Names and Id details */}
              <View style={styles.userInfoBlock}>
                <Text style={styles.activeUserName}>{dynamicName}</Text>
                <Text style={styles.activeUserIdText}>Resident ID - {dynamicId}</Text>
              </View>

              {/* Resident Flats Badges Grid */}
              <View style={styles.flatsBadgesRow}>
                {dynamicFlats.slice(0, 2).map((flat, idx) => (
                  <View key={idx} style={styles.flatBadgeChip}>
                    <Text style={styles.flatBadgeChipText}>{flat}</Text>
                  </View>
                ))}
                <View style={styles.flatBadgeChip}>
                  <Text style={styles.flatBadgeChipText}>+3</Text>
                </View>
              </View>

              {/* Key Common Area Access Icons */}
              <View style={styles.accessGrid}>
                {/* Clubhouse Access */}
                <View style={styles.accessIconCard}>
                  <View style={styles.accessIconCircle}>
                    <Ionicons name="baseball-outline" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.accessIconText}>Club House</Text>
                  <View style={styles.accessActiveCheck}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  </View>
                </View>

                {/* Parking Access */}
                <View style={styles.accessIconCard}>
                  <View style={styles.accessIconCircle}>
                    <Ionicons name="car-outline" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.accessIconText}>Car Parking</Text>
                  <View style={styles.accessActiveCheck}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  </View>
                </View>

                {/* Shuttle Access */}
                <View style={styles.accessIconCard}>
                  <View style={styles.accessIconCircle}>
                    <Ionicons name="bus-outline" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.accessIconText}>Bus Service</Text>
                  {isOwnerRole ? (
                    <View style={styles.accessActiveCheck}>
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    </View>
                  ) : (
                    <View style={styles.accessInactiveCheck}>
                      <Ionicons name="close-circle" size={14} color="#EF4444" />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* DEMO / TESTING CONTROLS */}
        <View style={styles.demoControlsContainer}>
          <Text style={styles.demoControlsTitle}>Developer & Testing Tools</Text>
          <View style={styles.demoControlsRow}>
            {idGenerated && (
              <TouchableOpacity
                style={styles.demoControlBtn}
                onPress={() => setIsOwnerRole(!isOwnerRole)}
                activeOpacity={0.7}
              >
                <Ionicons name="people-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.demoControlBtnText}>
                  Switch to {isOwnerRole ? 'Tenant View' : 'Owner View'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.demoControlBtn, { borderColor: 'rgba(239, 68, 68, 0.4)' }]}
              onPress={handleResetFlow}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={[styles.demoControlBtnText, { color: '#EF4444' }]}>Reset ID State</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Mock Preset Picker Modal */}
      <Modal
        visible={showPresetPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPresetPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowPresetPicker(false)}
        >
          <View style={styles.presetsModalContent}>
            <Text style={styles.presetsModalTitle}>Select Preset Avatar</Text>
            <View style={styles.presetsGrid}>
              {PRESET_PHOTOS.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.presetGridCard}
                  onPress={() => handlePresetSelect(idx)}
                  activeOpacity={0.7}
                >
                  <Image source={img} style={styles.presetAvatarGridImg} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* QR Code Bottom Sheet Modal */}
      <Modal
        visible={showQrModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContent}>
            {/* Sheet Header */}
            <View style={styles.qrModalHeader}>
              <Text style={styles.qrModalTitle}>Society QR Pass</Text>
              <TouchableOpacity onPress={() => setShowQrModal(false)} activeOpacity={0.7} style={styles.qrCloseBtn}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Scan Area */}
            <View style={styles.qrScanBoxWrapper}>
              <View style={styles.qrScanBox}>
                {/* Simulated QR Code Image */}
                <Image
                  source={require('../../assets/images/favicon.png')}
                  style={styles.qrMockCodeImg}
                  resizeMode="contain"
                />
                
                {/* Laser scan line anim */}
                <Animated.View 
                  style={[
                    styles.laserScanLine, 
                    { transform: [{ translateY: qrScannerAnim }] }
                  ]} 
                />
              </View>
            </View>

            {/* Details */}
            <View style={styles.qrDetailsBlock}>
              <Text style={styles.qrDetailName}>{dynamicName}</Text>
              <Text style={styles.qrDetailText}>Resident ID: {dynamicId}</Text>
              <Text style={styles.qrDetailText}>Flat: {dynamicFlats[0]}</Text>
              <Text style={[styles.qrStatusBadge, { color: '#10B981' }]}>
                ● Authorized Pass
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerQrBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  creationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  activeIdContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  idCardContainer: {
    width: width - 40,
    minHeight: 440,
    backgroundColor: '#0C0C0E',
    borderWidth: 1.5,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
    paddingBottom: 24,
    alignItems: 'center',
  },
  cardBrandHeader: {
    marginTop: 24,
    alignItems: 'center',
  },
  cardBrandText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 6,
  },
  avatarWrapper: {
    width: 140,
    height: 140,
    marginTop: 32,
    position: 'relative',
  },
  avatarBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  uploadCameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#D97706',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0C0C0E',
  },
  promptBlock: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  promptSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  cardButtonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 32,
    alignItems: 'center',
  },
  actionBtnSolid: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnTextDark: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  presetOptionBtn: {
    marginTop: 12,
    padding: 6,
  },
  presetOptionText: {
    color: '#6B7280',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  marqueeBar: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  marqueeTextRow: {
    flexDirection: 'row',
    width: width * 2,
  },
  marqueeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  avatarWrapperActive: {
    width: 120,
    height: 120,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorderActive: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    padding: 3,
    overflow: 'hidden',
  },
  avatarImgActive: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
  },
  userInfoBlock: {
    alignItems: 'center',
    marginTop: 16,
  },
  activeUserName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activeUserIdText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  flatsBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    width: '100%',
    paddingHorizontal: 20,
  },
  flatBadgeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  flatBadgeChipText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  accessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 20,
    gap: 8,
  },
  accessIconCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  accessIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  accessIconText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  accessActiveCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  accessInactiveCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  demoControlsContainer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 20,
  },
  demoControlsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  demoControlsRow: {
    flexDirection: 'column',
    gap: 12,
  },
  demoControlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
  },
  demoControlBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetsModalContent: {
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    width: width * 0.85,
    alignItems: 'center',
  },
  presetsModalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  presetGridCard: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  presetAvatarGridImg: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  qrModalContent: {
    backgroundColor: '#0C0C0E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 40,
    alignItems: 'center',
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  qrModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  qrCloseBtn: {
    padding: 4,
  },
  qrScanBoxWrapper: {
    marginTop: 32,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  qrScanBox: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  qrMockCodeImg: {
    width: 160,
    height: 160,
  },
  laserScanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  qrDetailsBlock: {
    alignItems: 'center',
    marginTop: 24,
  },
  qrDetailName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  qrDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  qrStatusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default DigitalIdScreen;
