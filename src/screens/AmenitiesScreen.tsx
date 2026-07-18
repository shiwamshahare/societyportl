import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView, TextInput, ActivityIndicator, Image, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
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

const AmenitiesScreen = () => {
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

  // Local state for bookings history
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'AM10044210170',
      amenityName: 'Football Court',
      subName: '1st small amenity',
      date: '22 Apr 2025',
      timeSlot: '19:00 - 19:15',
      peopleCount: 2,
      price: 'Free',
      status: 'EXPIRED',
      bookedOn: '22 Apr 2025',
    },
    {
      id: 'AM10044210155',
      amenityName: 'Badminton Court',
      subName: 'Court 1',
      date: '23 Apr 2025',
      timeSlot: '11:00 - 12:00',
      peopleCount: 1,
      price: '₹ 100',
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

  // Mock time slots
  const timeSlots = [
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '01:00 PM', available: false },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: false },
    { time: '04:00 PM', available: true },
    { time: '05:00 PM', available: true },
    { time: '06:00 PM', available: true },
    { time: '07:00 PM', available: false },
    { time: '08:00 PM', available: true },
  ];

  // Mock amenity data
  const amenitiesList = [
    { id: '1', name: 'Pool', icon: 'water-outline', image: require('../../assets/images/amenities/pool.png'), subName: 'Olympic size pool' },
    { id: '2', name: 'Clubhouse', icon: 'home-outline', image: require('../../assets/images/amenities/clubhouse.png'), subName: 'Central Wing Clubhouse' },
    { id: '3', name: 'Gym', icon: 'fitness-outline', image: require('../../assets/images/amenities/gym.png'), subName: 'Towers Fitness Gym' },
    { id: '4', name: 'Garden', icon: 'leaf-outline', image: require('../../assets/images/amenities/garden.png'), subName: 'Lawn and walking garden' },
    { id: '5', name: 'Theatre', icon: 'film-outline', image: null, subName: 'Mini Cineplex' },
    { id: '6', name: 'Air Hockey', icon: 'game-controller-outline', image: null, subName: 'Recreation center' },
    { id: '7', name: 'Badminton Court', icon: 'grid-outline', image: null, subName: 'Court 1 & 2 indoor' },
    { id: '8', name: 'Banquet Hall', icon: 'cafe-outline', image: null, subName: 'Community party hall' },
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
      date: selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
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

  if (isAdmin) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: DarkTheme.bg.primary }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Amenities Management</Text>
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
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Membership Purchase Banner */}
            <TouchableOpacity style={styles.membershipBanner} activeOpacity={0.9}>
              <View style={{ flex: 1 }}>
                <Text style={styles.membershipBadge}>MEMBERSHIP</Text>
                <Text style={styles.membershipTitle}>Get access to exclusive premium facilities</Text>
              </View>
              <View style={styles.buyNowBtn}>
                <Text style={styles.buyNowText}>BUY NOW</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.sectionHeading}>Select Amenity</Text>
            
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
                    {item.image ? (
                      <Image source={item.image} style={styles.gridItemImg} />
                    ) : (
                      <Ionicons name={item.icon as any} size={24} color={DarkTheme.accent.gold} />
                    )}
                  </View>
                  <View style={styles.gridItemTextContainer}>
                    <Text style={styles.gridItemTitle}>{item.name}</Text>
                    <Text style={styles.gridItemSubTitle} numberOfLines={1}>{item.subName}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          /* Slots Selection Screen */
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setActiveScreen('grid')} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color={DarkTheme.text.primary} />
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle}>Book {selectedAmenity?.name}</Text>
            </View>

            {/* Date Picker */}
            <Text style={styles.fieldLabel}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginBottom: 24 }}>
              {dates.map((date) => {
                const dateNum = date.getDate();
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
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
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Time Slot Picker */}
            <Text style={styles.fieldLabel}>Select Time Slot</Text>
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

            {/* Guest Count */}
            <Text style={styles.fieldLabel}>Add Guests</Text>
            <View style={styles.guestCounterRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => guestCount > 0 && setGuestCount(guestCount - 1)}
                style={styles.counterBtn}
              >
                <Ionicons name="remove" size={20} color={DarkTheme.text.primary} />
              </TouchableOpacity>
              <Text style={styles.counterText}>{guestCount} Guests</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setGuestCount(guestCount + 1)}
                style={styles.counterBtn}
              >
                <Ionicons name="add" size={20} color={DarkTheme.text.primary} />
              </TouchableOpacity>
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
          <View style={styles.historySubTabs}>
            <TouchableOpacity
              style={[styles.historySubTabBtn, historyTab === 'amenities' && styles.historySubTabBtnActive]}
              onPress={() => setHistoryTab('amenities')}
            >
              <Text style={[styles.historySubTabText, historyTab === 'amenities' && styles.historySubTabTextActive]}>Amenities</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.historySubTabBtn, historyTab === 'membership' && styles.historySubTabBtnActive]}
              onPress={() => setHistoryTab('membership')}
            >
              <Text style={[styles.historySubTabText, historyTab === 'membership' && styles.historySubTabTextActive]}>Membership</Text>
            </TouchableOpacity>
          </View>

          {historyTab === 'amenities' ? (
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <View style={styles.bookingHistoryCard}>
                  {/* Card Time Header */}
                  <View style={styles.bookingCardHeader}>
                    <Text style={styles.bookingCardTimeText}>{item.date} | {item.timeSlot}</Text>
                    <View style={[
                      styles.statusBadge,
                      item.status === 'UPCOMING' && { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
                      item.status === 'EXPIRED' && { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                      item.status === 'FAILED' && { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
                    ]}>
                      <Text style={[
                        styles.statusBadgeText,
                        item.status === 'UPCOMING' && { color: DarkTheme.status.success },
                        item.status === 'EXPIRED' && { color: DarkTheme.text.tertiary },
                        item.status === 'FAILED' && { color: DarkTheme.status.error },
                      ]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Card Content Row */}
                  <View style={styles.bookingCardContent}>
                    <View style={styles.bookingIconContainer}>
                      <Ionicons name="fitness-outline" size={24} color={DarkTheme.accent.gold} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.bookingAmenityTitle}>{item.amenityName}</Text>
                      <Text style={styles.bookingAmenitySub}>{item.subName}</Text>
                      <Text style={styles.bookingAmenityMeta}>{item.peopleCount} People / {item.price}</Text>
                      <Text style={styles.bookingAmenityMeta}>Booked on {item.bookedOn}</Text>
                      <Text style={styles.bookingIdText}>Booking Id {item.id}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={styles.moreOptionsBtn}>
                      <Ionicons name="ellipsis-vertical" size={20} color={DarkTheme.text.tertiary} />
                    </TouchableOpacity>
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
              <View>
                <Text style={styles.modalTitle}>{selectedAmenity?.name}</Text>
                <Text style={styles.modalSubtitle}>Slot: {selectedTime} - 1 Hour</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCheckoutModal(false)}>
                <Ionicons name="close" size={24} color={DarkTheme.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Checklist items */}
            <View style={styles.checklist}>
              <Text style={styles.checklistTitle}>Family Members</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIncludeFamily(!includeFamily)}
                style={styles.checkRow}
              >
                <Ionicons
                  name={includeFamily ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={includeFamily ? DarkTheme.accent.gold : DarkTheme.text.tertiary}
                />
                <Text style={styles.checkText}>Sarikasingh Singh</Text>
              </TouchableOpacity>

              <Text style={[styles.checklistTitle, { marginTop: 16 }]}>Guests</Text>
              <View style={styles.guestsAddRow}>
                <Text style={styles.guestsCountLabel}>{guestCount} Guests Added</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setGuestCount(guestCount + 1)}
                  style={styles.addGuestsBtn}
                >
                  <Text style={styles.addGuestsBtnText}>+ Add Guests</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setAgreeTerms(!agreeTerms)}
                style={[styles.checkRow, { marginTop: 24 }]}
              >
                <Ionicons
                  name={agreeTerms ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={agreeTerms ? DarkTheme.accent.gold : DarkTheme.text.tertiary}
                />
                <Text style={styles.termsText}>By proceeding ahead, I agree to Terms and Conditions</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Pay Bar */}
            <View style={styles.payBar}>
              <View>
                <Text style={styles.payLabel}>{(includeFamily ? 1 : 0) + guestCount} PAID</Text>
                <Text style={styles.payAmount}>
                  {selectedAmenity?.name === 'Badminton Court' || selectedAmenity?.name === 'Theatre' ? '₹ 100' : 'Free'}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={handlePayNow} style={styles.payNowBtn}>
                <Text style={styles.payNowBtnText}>Pay Now</Text>
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
    backgroundColor: DarkTheme.bg.card,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
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
    backgroundColor: DarkTheme.bg.card,
    margin: 16,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: DarkTheme.bg.elevated,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.text.secondary,
  },
  segmentTextActive: {
    color: DarkTheme.accent.gold,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  membershipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#312E81',
  },
  membershipBadge: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  membershipTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    width: '90%',
  },
  buyNowBtn: {
    backgroundColor: DarkTheme.accent.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridItem: {
    width: (width - 44) / 2,
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
  gridItemIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: DarkTheme.bg.input,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  gridItemImg: {
    width: '100%',
    height: '100%',
  },
  gridItemTextContainer: {
    width: '100%',
  },
  gridItemTitle: {
    color: DarkTheme.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  gridItemSubTitle: {
    color: DarkTheme.text.tertiary,
    fontSize: 11,
    marginTop: 2,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  detailHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
    marginBottom: 12,
  },
  dateChip: {
    minWidth: 60,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: 12,
  },
  dateChipSelected: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
  },
  dateChipDay: {
    fontSize: 10,
    color: DarkTheme.text.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateChipDaySelected: {
    color: DarkTheme.accent.gold,
  },
  dateChipNum: {
    fontSize: 18,
    color: DarkTheme.text.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  dateChipNumSelected: {
    color: DarkTheme.accent.gold,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  slotItem: {
    width: (width - 42) / 2,
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotItemSelected: {
    borderColor: DarkTheme.accent.gold,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
  },
  slotItemOccupied: {
    backgroundColor: DarkTheme.bg.primary,
    opacity: 0.4,
  },
  slotText: {
    fontSize: 14,
    color: DarkTheme.text.primary,
    fontWeight: '600',
  },
  slotTextSelected: {
    color: DarkTheme.accent.gold,
  },
  slotTextOccupied: {
    color: DarkTheme.text.tertiary,
    textDecorationLine: 'line-through',
  },
  occupiedLabel: {
    fontSize: 9,
    color: DarkTheme.status.error,
    marginTop: 4,
  },
  guestCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: DarkTheme.bg.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.text.primary,
  },
  proceedButton: {
    backgroundColor: DarkTheme.accent.gold,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historySubTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
    marginBottom: 12,
  },
  historySubTabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  historySubTabBtnActive: {
    borderBottomWidth: 2,
    borderColor: DarkTheme.accent.gold,
  },
  historySubTabText: {
    fontSize: 14,
    color: DarkTheme.text.tertiary,
    fontWeight: '600',
  },
  historySubTabTextActive: {
    color: DarkTheme.text.primary,
  },
  bookingHistoryCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.input,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  bookingCardTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  bookingCardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  bookingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: DarkTheme.bg.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingAmenityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  bookingAmenitySub: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
    marginTop: 2,
  },
  bookingAmenityMeta: {
    fontSize: 12,
    color: DarkTheme.text.tertiary,
    marginTop: 4,
  },
  bookingIdText: {
    fontSize: 11,
    color: DarkTheme.text.tertiary,
    marginTop: 6,
  },
  moreOptionsBtn: {
    padding: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: DarkTheme.bg.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: DarkTheme.text.secondary,
    marginTop: 2,
  },
  checklist: {
    padding: 24,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DarkTheme.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkText: {
    fontSize: 16,
    color: DarkTheme.text.primary,
    fontWeight: '600',
  },
  guestsAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestsCountLabel: {
    fontSize: 16,
    color: DarkTheme.text.primary,
    fontWeight: '600',
  },
  addGuestsBtn: {
    borderColor: DarkTheme.accent.gold,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addGuestsBtnText: {
    color: DarkTheme.accent.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
    flex: 1,
  },
  payBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  payLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: DarkTheme.text.tertiary,
  },
  payAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
    marginTop: 2,
  },
  payNowBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 24,
  },
  payNowBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AmenitiesScreen;