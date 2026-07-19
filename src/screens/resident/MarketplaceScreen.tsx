import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '@/utils/theme';
import { SPACING, BORDER_RADIUS } from '@/constants/layout';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - SPACING.lg * 2 - SPACING.md) / 2;

const MarketplaceScreen = () => {
  const categories = ['All', 'Cleaning', 'Repairs', 'Delivery', 'Wellness'];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const services = [
    {
      title: 'Home Cleaning',
      provider: 'Spotless Homes Co.',
      rating: '4.8',
      price: '₹399',
      icon: 'sparkles-outline',
      category: 'Cleaning',
    },
    {
      title: 'Plumbing Service',
      provider: 'FixIt Experts',
      rating: '4.9',
      price: '₹199',
      icon: 'water-outline',
      category: 'Repairs',
    },
    {
      title: 'Electrical Repairs',
      provider: 'VoltTech Labs',
      rating: '4.7',
      price: '₹249',
      icon: 'flash-outline',
      category: 'Repairs',
    },
    {
      title: 'Pest Control',
      provider: 'Shield Pest Solutions',
      rating: '4.6',
      price: '₹599',
      icon: 'shield-checkmark-outline',
      category: 'Cleaning',
    },
    {
      title: 'Daily Groceries',
      provider: 'FreshMart local',
      rating: '4.5',
      price: 'Free Del.',
      icon: 'cart-outline',
      category: 'Delivery',
    },
    {
      title: 'Yoga & Wellness',
      provider: 'Inner Peace Studio',
      rating: '4.9',
      price: '₹499/hr',
      icon: 'body-outline',
      category: 'Wellness',
    },
  ];

  const filteredServices = services.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Marketplace</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={24} color={DarkTheme.accent.gold} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>One stop shop for all your household needs</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={DarkTheme.text.tertiary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search services, vendors..."
            placeholderTextColor={DarkTheme.text.tertiary}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Categories Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Banner */}
        <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.9}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTag}>PROMO OF THE WEEK</Text>
            <Text style={styles.bannerTitle}>Get 20% Off Deep Cleaning</Text>
            <Text style={styles.bannerDesc}>Use code: CLEAN20 | Valid till Sunday</Text>
          </View>
          <Ionicons name="gift-outline" size={48} color={DarkTheme.accent.goldLight} />
        </TouchableOpacity>

        {/* Grid of Services */}
        <Text style={styles.sectionTitle}>Featured Services</Text>
        <View style={styles.grid}>
          {filteredServices.map((service, idx) => (
            <TouchableOpacity key={idx} style={styles.card} activeOpacity={0.8}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name={service.icon as any} size={24} color={DarkTheme.accent.gold} />
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color={DarkTheme.accent.gold} />
                  <Text style={styles.ratingText}>{service.rating}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.serviceTitle} numberOfLines={1}>
                  {service.title}
                </Text>
                <Text style={styles.providerName} numberOfLines={1}>
                  {service.provider}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.priceLabel}>Starting from</Text>
                <Text style={styles.priceValue}>{service.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerSubtitle: {
    color: DarkTheme.text.secondary,
    fontSize: 13,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: DarkTheme.text.primary,
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100, // Leave room for tab bar
  },
  categoriesContainer: {
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: `${DarkTheme.accent.gold}15`,
    borderColor: DarkTheme.accent.gold,
  },
  categoryText: {
    color: DarkTheme.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: DarkTheme.accent.goldLight,
    fontWeight: '600',
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(217, 119, 6, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.2)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  bannerTag: {
    color: DarkTheme.accent.goldLight,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bannerDesc: {
    color: DarkTheme.text.secondary,
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.text.primary,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  card: {
    width: CARD_SIZE,
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    color: DarkTheme.text.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    marginVertical: SPACING.xs,
  },
  serviceTitle: {
    color: DarkTheme.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  providerName: {
    color: DarkTheme.text.tertiary,
    fontSize: 11,
    marginTop: 2,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 8,
    marginTop: 4,
  },
  priceLabel: {
    color: DarkTheme.text.tertiary,
    fontSize: 9,
  },
  priceValue: {
    color: DarkTheme.accent.goldLight,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 1,
  },
});

export default MarketplaceScreen;
