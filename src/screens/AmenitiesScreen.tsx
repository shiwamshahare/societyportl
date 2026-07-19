import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { AuthContext } from '../context/AuthContext';
import { DarkTheme } from '../utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '../constants/layout';

const { width } = Dimensions.get('window');

interface Booking {
  id: string;
  amenityName: string;
  subName: string;
  date: string;
  timeSlot: string;
  peopleCount: number;
  price: string;
  status: 'UPCOMING' | 'EXPIRED' | 'FAILED';
  bookedOn: string;
}

const AmenitiesScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  // Navigation state inside resident screen: 'grid' | 'booking'
  const [activeScreen, setActiveScreen] = useState<'grid' | 'booking'>('grid');
  
  // Segment state: 'book' | 'history'
  const [activeSegment, setActiveSegment] = useState<'book' | 'history'>('book');
  
  // History sub-tab: 'amenities' | 'membership'
  const [historyTab, setHistoryTab] = useState<'amenities' | 'membership'>('amenities');

  // Booking states
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(0);
  const [includeFamily, setIncludeFamily] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Flat selection state
  const flatsList = ['Dt Casa Eviva, G 601', 'Dt Casa Eviva, G 602', 'Dt Casa Eviva, A 104'];
  const [selectedFlat, setSelectedFlat] = useState(flatsList[0]);
  const [showFlatDropdown, setShowFlatDropdown] = useState(false);

  // Local state for bookings history
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'AM10044210170',
      amenityName: 'Football Court',
      subName: '1st small amenity',
      date: '22 Apr',
      timeSlot: '19:00 - 19:15',
      peopleCount: 2,
      price: 'Free',
      status: 'EXPIRED',
      bookedOn: '22 Apr 2025',
    },
    {
      id: 'AM10044210160',
      amenityName: 'Football Court',
      subName: '1st small amenity',
      date: '22 Apr',
      timeSlot: '18:45 - 19:00',
      peopleCount: 20,
      price: '₹ 380',
      status: 'FAILED',
      bookedOn: '22 Apr 2025',
    },
    {
      id: 'AM10044210171',
      amenityName: 'Football Court',
      subName: '1st small amenity',
      date: '22 Apr',
      timeSlot: '18:45 - 19:00',
      peopleCount: 11,
      price: 'Free',
      status: 'EXPIRED',
      bookedOn: '22 Apr 2025',
    },
    {
      id: 'AM10044210172',
      amenityName: 'Football Court',
      subName: '1st small amenity',
      date: '22 Apr',
      timeSlot: '00:00 - 00:15',
      peopleCount: 11,
      price: '₹ 380',
      status: 'FAILED',
      bookedOn: '22 Apr 2025',
    }
  ]);

  // Generate stable dates (today to next 10 days)
  const generateDates = () => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      list.push(date);
    }
    return list;
  };
  const dates = generateDates();

  const getDayName = (date: Date) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()];
  const getMonthName = (date: Date) => ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][date.getMonth()];

  // Mock time slots (3-column layout)
  const timeSlots = [
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '01:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: false },
    { time: '04:00 PM', available: true },
    { time: '05:00 PM', available: true },
    { time: '06:00 PM', available: true },
    { time: '07:00 PM', available: false },
    { time: '08:00 PM', available: true },
    { time: '09:00 PM', available: true },
    { time: '10:00 PM', available: true },
  ];

  // Mock amenity data matching the mockup
  const amenitiesList = [
    { id: '1', name: 'Theatre', icon: 'film-outline', image: null, subName: 'Mini Cineplex' },
    { id: '2', name: 'Air Hockey', icon: 'game-controller-outline', image: null, subName: 'Recreation center' },
    { id: '3', name: 'Badminton', icon: 'grid-outline', image: null, subName: 'Court 1 & 2 indoor' },
    { id: '4', name: 'Badminton Court', icon: 'grid-outline', image: null, subName: 'Court 1 & 2 indoor' },
    { id: '5', name: 'Badminton Test', icon: 'grid-outline', image: null, subName: 'Test Court' },
    { id: '6', name: 'Banquet Hall', icon: 'cafe-outline', image: null, subName: 'Community party hall' },
    { id: '7', name: 'Bus Services', icon: 'bus-outline', image: null, subName: 'Shuttle services' },
    { id: '8', name: 'Bus Services', icon: 'bus-outline', image: null, subName: 'Office Shuttle' },
    { id: '9', name: 'Carrom Test', icon: 'albums-outline', image: null, subName: 'Indoor games room' },
    { id: '10', name: 'Centrum Banquet Hall', icon: 'cafe-outline', image: null, subName: 'Premium party hall' },
    { id: '11', name: 'Cricket Ground', icon: 'trophy-outline', image: null, subName: 'Nets & pitch practice' },
    { id: '12', name: 'Guest Day Pass', icon: 'card-outline', image: null, subName: 'Day visitor pass' },
  ];

  const handleSelectAmenity = (amenity: any) => {
    setSelectedAmenity(amenity);
    setActiveScreen('booking');
    setSelectedTime(null);
  };

  const handlePayNow = () => {
    if (!agreeTerms) {
      alert('Please agree to the Terms and Conditions');
      return;
    }

    const price = selectedAmenity.name === 'Badminton Court' || selectedAmenity.name === 'Theatre' ? '₹ 100' : 'Free';
    const newBooking: Booking = {
      id: 'AM' + Math.floor(10000000000 + Math.random() * 90000000000),
      amenityName: selectedAmenity.name,
      subName: selectedAmenity.subName,
      date: selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      timeSlot: selectedTime ? `${selectedTime} - ${parseInt(selectedTime) + 1}:00 ${selectedTime.includes('PM') ? 'PM' : 'AM'}` : '11:00 AM - 12:00 PM',
      peopleCount: (includeFamily ? 1 : 0) + guestCount,
      price: price,
      status: 'UPCOMING',
      bookedOn: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setBookings([newBooking, ...bookings]);
    setShowCheckoutModal(false);
    setActiveScreen('grid');
    setActiveSegment('history');
    alert('Booking Confirmed Successfully!');
  };

  // Background ambient glows
  const BackgroundGlows = () => (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient id="glowLeft" cx="10%" cy="35%" rx="40%" ry="25%">
            <Stop offset="0%" stopColor="#D97706" stopOpacity="0.10" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="glowRight" cx="90%" cy="55%" rx="40%" ry="25%">
            <Stop offset="0%" stopColor="#0D9488" stopOpacity="0.10" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="glowBottom" cx="30%" cy="85%" rx="35%" ry="20%">
            <Stop offset="0%" stopColor="#7C3AED" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowLeft)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowRight)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowBottom)" />
      </Svg>
    </View>
  );

  if (isAdmin) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: DarkTheme.bg.primary }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Amenities Management</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.container}>
          <FlatList
            data={amenitiesList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.amenityCard}>
                {item.image ? (
                  <Image source={item.image} style={styles.amenityImage} />
                ) : (
                  <View style={styles.amenityImagePlaceholder}>
                    <Ionicons name={item.icon as any} size={28} color={DarkTheme.accent.gold} />
                  </View>
                )}
                <View style={styles.amenityInfo}>
                  <Text style={styles.amenityName}>{item.name}</Text>
                  <Text style={styles.amenityDescription}>{item.subName}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.editButton}
                  onPress={() => alert(`Manage ${item.name}`)}
                  hitSlop={TOUCH_TARGET.comfortable}
                >
                  <Ionicons name="create-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: DarkTheme.bg.primary }}>
      <BackgroundGlows />

      {/* Screen Custom Header */}
      <View style={styles.screenHeader}>
        <TouchableOpacity
          onPress={() => {
            if (activeScreen === 'booking') {
              setActiveScreen('grid');
            } else {
              navigation.goBack();
            }
          }}
          style={styles.headerBackBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={DarkTheme.text.primary} />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>
          {activeSegment === 'book' ? 'Amenities' : 'My Amenities'}
        </Text>
        {activeSegment === 'history' ? (
          <TouchableOpacity style={styles.headerFilterBtn} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={22} color={DarkTheme.text.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Tab Segment Selector */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentButton, activeSegment === 'book' && styles.segmentButtonActive]}
          onPress={() => {
            setActiveSegment('book');
            setActiveScreen('grid');
          }}
          hitSlop={TOUCH_TARGET.comfortable}
        >
          <Text style={[styles.segmentText, activeSegment === 'book' && styles.segmentTextActive]}>Book Amenity</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, activeSegment === 'history' && styles.segmentButtonActive]}
          onPress={() => setActiveSegment('history')}
          hitSlop={TOUCH_TARGET.comfortable}
        >
          <Text style={[styles.segmentText, activeSegment === 'history' && styles.segmentTextActive]}>My Bookings</Text>
        </TouchableOpacity>
      </View>

      {activeSegment === 'book' ? (
        activeScreen === 'grid' ? (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Membership Purchase Banner */}
            <Text style={styles.sectionHeading}>Book Membership</Text>
            <TouchableOpacity style={styles.membershipBanner} activeOpacity={0.9}>
              <View style={{ flex: 1 }}>
                <Text style={styles.membershipBadge}>MEMBERSHIP</Text>
                <Text style={styles.membershipTitle}>Get access to exclusive premium facilities</Text>
              </View>
              <View style={styles.buyNowBtn}>
                <Text style={styles.buyNowText}>BUY NOW</Text>
              </View>
            </TouchableOpacity>

            {/* Book Amenity Section Header Row */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Book Amenity</Text>
              <TouchableOpacity
                style={styles.flatSelectorBtn}
                onPress={() => setShowFlatDropdown(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.flatSelectorText}>{selectedFlat}</Text>
                <Ionicons name="chevron-down" size={14} color={DarkTheme.text.secondary} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
            
            {/* 2-column Grid of Amenities */}
            <View style={styles.gridContainer}>
              {amenitiesList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={styles.gridItem}
                  onPress={() => handleSelectAmenity(item)}
                >
                  <View style={styles.gridItemIconBg}>
                    <Ionicons name={item.icon as any} size={20} color={DarkTheme.accent.gold} />
                  </View>
                  <View style={styles.gridItemTextContainer}>
                    <Text style={styles.gridItemTitle} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.gridItemSubTitle} numberOfLines={1}>{item.subName}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          /* Slots Selection Screen */
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.detailHeader}>
              <View style={styles.detailHeaderInfo}>
                <Text style={styles.detailHeaderTitle}>{selectedAmenity?.name}</Text>
                <TouchableOpacity activeOpacity={0.7} style={styles.infoIconBtn}>
                  <Ionicons name="information-circle-outline" size={20} color={DarkTheme.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Picker */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginBottom: 24, paddingBottom: 4 }}>
              {dates.map((date) => {
                const dateNum = date.getDate();
                const dayName = getDayName(date);
                const monthName = getMonthName(date);
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                  <TouchableOpacity
                    key={date.toISOString()}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDate(date)}
                    style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                  >
                    <Text style={[styles.dateChipDay, isSelected && styles.dateChipDaySelected]}>{dayName}</Text>
                    <Text style={[styles.dateChipNum, isSelected && styles.dateChipNumSelected]}>{dateNum}</Text>
                    <Text style={[styles.dateChipMonth, isSelected && styles.dateChipMonthSelected]}>{monthName}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Time Slot Picker Section Title */}
            <View style={styles.slotHeadingRow}>
              <Text style={styles.fieldLabel}>Court 1</Text>
              <Text style={styles.slotSubtitleText}>(1 hour slots)</Text>
            </View>

            {/* Time Slot Picker Grid (3 columns) */}
            <View style={styles.slotsGrid}>
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <TouchableOpacity
                    key={slot.time}
                    activeOpacity={0.7}
                    disabled={!slot.available}
                    onPress={() => setSelectedTime(slot.time)}
                    style={[
                      styles.slotItem,
                      isSelected && styles.slotItemSelected,
                      !slot.available && styles.slotItemOccupied
                    ]}
                  >
                    <Text style={[
                      styles.slotText,
                      isSelected && styles.slotTextSelected,
                      !slot.available && styles.slotTextOccupied
                    ]}>
                      {slot.time}
                    </Text>
                    {!slot.available && <Text style={styles.occupiedLabel}>Occupied</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Proceed to Booking Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (!selectedTime) {
                  alert('Please select a time slot first');
                  return;
                }
                setShowCheckoutModal(true);
              }}
              style={styles.proceedButton}
            >
              <Text style={styles.proceedButtonText}>Proceed to Booking</Text>
            </TouchableOpacity>
          </ScrollView>
        )
      ) : (
        /* My Bookings History Tab */
        <View style={{ flex: 1 }}>
          {/* Segment control matching mockup */}
          <View style={styles.bookingsSegmentWrapper}>
            <View style={styles.bookingsSegmentContainer}>
              <TouchableOpacity
                style={[styles.bookingsSegmentBtn, historyTab === 'amenities' && styles.bookingsSegmentBtnActive]}
                onPress={() => setHistoryTab('amenities')}
                activeOpacity={0.8}
              >
                <Text style={[styles.bookingsSegmentText, historyTab === 'amenities' && styles.bookingsSegmentTextActive]}>Amenities</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bookingsSegmentBtn, historyTab === 'membership' && styles.bookingsSegmentBtnActive]}
                onPress={() => setHistoryTab('membership')}
                activeOpacity={0.8}
              >
                <Text style={[styles.bookingsSegmentText, historyTab === 'membership' && styles.bookingsSegmentTextActive]}>Membership</Text>
              </TouchableOpacity>
            </View>
          </View>

          {historyTab === 'amenities' ? (
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.bookingCard}>
                  {/* Card Time Header */}
                  <View style={styles.bookingHeader}>
                    <Text style={styles.bookingDateText}>{item.date} | {item.timeSlot}</Text>
                    <View style={styles.bookingHeaderRight}>
                      <View style={[
                        styles.bookingStatusBadge,
                        item.status === 'UPCOMING' && styles.statusUpcoming,
                        item.status === 'EXPIRED' && styles.statusExpired,
                        item.status === 'FAILED' && styles.statusFailed,
                      ]}>
                        <Text style={[
                          styles.bookingStatusText,
                          item.status === 'UPCOMING' && { color: '#10B981' },
                          item.status === 'EXPIRED' && { color: '#6B7280' },
                          item.status === 'FAILED' && { color: '#EF4444' },
                        ]}>
                          {item.status}
                        </Text>
                      </View>
                      <TouchableOpacity activeOpacity={0.7} style={styles.bookingMenuBtn}>
                        <Ionicons name="ellipsis-vertical" size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Card Content Row */}
                  <View style={styles.bookingBody}>
                    <View style={styles.bookingIconCircle}>
                      <Ionicons name="football-outline" size={20} color="#10B981" />
                    </View>
                    <View style={styles.bookingTitleBlock}>
                      <Text style={styles.bookingAmenityName}>{item.amenityName}</Text>
                      <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={12} color="#6B7280" style={{ marginRight: 2 }} />
                        <Text style={styles.bookingLocationText}>{item.subName}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Metadata Row (3 columns) */}
                  <View style={styles.bookingMetaGrid}>
                    <View style={styles.bookingMetaCol}>
                      <View style={styles.peopleCountContainer}>
                        <Text style={styles.metaLabelText}>{item.peopleCount} People</Text>
                        <Ionicons name="information-circle-outline" size={10} color="#6B7280" style={{ marginLeft: 2 }} />
                      </View>
                      <Text style={styles.metaValueText}>{item.price}</Text>
                    </View>
                    <View style={styles.bookingMetaCol}>
                      <Text style={styles.metaLabelText}>Booked On</Text>
                      <Text style={styles.metaValueText}>{item.bookedOn}</Text>
                    </View>
                    <View style={styles.bookingMetaCol}>
                      <Text style={styles.metaLabelText}>Booking Id</Text>
                      <Text style={styles.metaValueText}>{item.id}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="card-outline" size={48} color={DarkTheme.text.tertiary} style={{ marginBottom: 12 }} />
              <Text style={{ color: DarkTheme.text.secondary, fontSize: 16 }}>No active membership packages.</Text>
            </View>
          )}
        </View>
      )}

      {/* Flat Selector Dropdown Modal */}
      <Modal
        visible={showFlatDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFlatDropdown(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowFlatDropdown(false)}
        >
          <View style={styles.dropdownContent}>
            {flatsList.map((flat) => (
              <TouchableOpacity
                key={flat}
                style={[
                  styles.dropdownItem,
                  flat === selectedFlat && styles.dropdownItemActive
                ]}
                onPress={() => {
                  setSelectedFlat(flat);
                  setShowFlatDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  flat === selectedFlat && styles.dropdownItemTextActive
                ]}>
                  {flat}
                </Text>
                {flat === selectedFlat && (
                  <Ionicons name="checkmark" size={18} color={DarkTheme.accent.gold} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Checkout Bottom Sheet Modal */}
      <Modal
        visible={showCheckoutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCheckoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Sheet Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowCheckoutModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Court 1</Text>
                <Text style={styles.modalSubtitle}>Slot: {selectedTime} - 12:00 PM</Text>
              </View>
              <View style={{ width: 36 }} />
            </View>

            {/* Checklist items */}
            <View style={styles.checklist}>
              <View style={styles.checklistSection}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionSubTitle}>Family Members</Text>
                  <Text style={styles.sectionPriceTag}>₹ 100/Person</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIncludeFamily(!includeFamily)}
                  style={styles.checkboxRow}
                >
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>S</Text>
                  </View>
                  <Text style={styles.checkboxLabel}>Sarikasingh Singh</Text>
                  <View style={styles.checkboxIcon}>
                    <Ionicons
                      name={includeFamily ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={includeFamily ? DarkTheme.accent.gold : DarkTheme.text.tertiary}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.checklistSection, { marginTop: 16 }]}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionSubTitle}>Guests</Text>
                  <Text style={styles.sectionPriceTag}>₹ 150/Person</Text>
                </View>

                {guestCount > 0 && (
                  <View style={styles.guestsList}>
                    {Array.from({ length: guestCount }).map((_, idx) => (
                      <View key={idx} style={styles.guestRow}>
                        <Ionicons name="person-outline" size={14} color="#6B7280" />
                        <Text style={styles.guestNameText}>Guest {idx + 1}</Text>
                        <TouchableOpacity onPress={() => setGuestCount(Math.max(0, guestCount - 1))}>
                          <Ionicons name="trash-outline" size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setGuestCount(guestCount + 1)}
                  style={styles.addGuestsOutlineBtn}
                >
                  <Text style={styles.addGuestsOutlineBtnText}>Add Guests</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setAgreeTerms(!agreeTerms)}
                style={styles.termsCheckboxRow}
              >
                <Ionicons
                  name={agreeTerms ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={agreeTerms ? DarkTheme.accent.gold : DarkTheme.text.tertiary}
                />
                <Text style={styles.termsCheckboxLabel}>
                  By proceeding ahead, I agree to <Text style={styles.underline}>Terms and Conditions</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Pay Bar */}
            <View style={styles.modalPayBar}>
              <View>
                <Text style={styles.modalPayCountText}>
                  {((includeFamily ? 1 : 0) + guestCount)} PAID
                </Text>
                <Text style={styles.modalPayPriceText}>
                  ₹ {((includeFamily ? 1 : 0) * 100) + (guestCount * 150)}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={handlePayNow} style={styles.modalPayNowBtn}>
                <Text style={styles.modalPayNowBtnText}>Pay Now</Text>
              </TouchableOpacity>
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
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DarkTheme.bg.card,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  screenHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerFilterBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: SPACING.md,
  },
  amenityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  amenityImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
  },
  amenityImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: DarkTheme.bg.input,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  amenityInfo: {
    flex: 1,
  },
  amenityName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
  },
  amenityDescription: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
  },
  editButton: {
    backgroundColor: DarkTheme.accent.gold,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#0C0C0E',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  segmentTextActive: {
    color: '#000000',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  flatSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  flatSelectorText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
  },
  membershipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 29, 43, 0.4)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  membershipBadge: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  membershipTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    width: '90%',
  },
  buyNowBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyNowText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridItem: {
    width: (width - 42) / 2,
    backgroundColor: 'rgba(12, 12, 14, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridItemIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gridItemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  gridItemTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  gridItemSubTitle: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 2,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  detailHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoIconBtn: {
    padding: 6,
    marginLeft: 4,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  slotHeadingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  slotSubtitleText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  dateChip: {
    width: 58,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
  },
  dateChipSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  dateChipDay: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateChipDaySelected: {
    color: '#000000',
  },
  dateChipNum: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginVertical: 2,
  },
  dateChipNumSelected: {
    color: '#000000',
  },
  dateChipMonth: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateChipMonthSelected: {
    color: '#000000',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  slotItem: {
    width: (width - 32 - 16) / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotItemSelected: {
    borderColor: '#D97706',
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
  },
  slotItemOccupied: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.03)',
    opacity: 0.3,
  },
  slotText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  slotTextSelected: {
    color: '#D97706',
  },
  slotTextOccupied: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  occupiedLabel: {
    fontSize: 8,
    color: '#EF4444',
    marginTop: 2,
  },
  proceedButton: {
    backgroundColor: '#D97706',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bookingsSegmentWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  bookingsSegmentContainer: {
    flexDirection: 'row',
    width: '60%',
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 2,
  },
  bookingsSegmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  bookingsSegmentBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  bookingsSegmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  bookingsSegmentTextActive: {
    color: '#000000',
  },
  bookingCard: {
    backgroundColor: 'rgba(12, 12, 14, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 10,
    marginBottom: 12,
  },
  bookingDateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bookingHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusUpcoming: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusExpired: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusFailed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  bookingStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  bookingMenuBtn: {
    marginLeft: 8,
    padding: 4,
  },
  bookingBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingTitleBlock: {
    flex: 1,
  },
  bookingAmenityName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bookingLocationText: {
    fontSize: 11,
    color: '#6B7280',
  },
  bookingMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  bookingMetaCol: {
    flex: 1,
  },
  peopleCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabelText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  metaValueText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    width: width * 0.8,
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  dropdownItemTextActive: {
    color: '#D97706',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0C0C0E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleContainer: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  checklist: {
    padding: 20,
  },
  checklistSection: {
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionSubTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionPriceTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#D97706',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  checkboxIcon: {
    padding: 4,
  },
  guestsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  guestNameText: {
    color: '#FFFFFF',
    fontSize: 13,
    flex: 1,
    marginLeft: 8,
  },
  addGuestsOutlineBtn: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGuestsOutlineBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  termsCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 4,
  },
  termsCheckboxLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 10,
    flex: 1,
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },
  modalPayBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalPayCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  modalPayPriceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  modalPayNowBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 24,
  },
  modalPayNowBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AmenitiesScreen;