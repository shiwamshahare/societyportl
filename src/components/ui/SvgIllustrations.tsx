import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

// Helper to make styled lines or boxes easily
const Line = ({ style, color }: { style?: any; color?: string }) => (
  <View style={[{ backgroundColor: color || '#FFFFFF' }, style]} />
);

// 1. Mumbai: Gateway of India (Rendered using pure Views)
export const MumbaiIcon: React.FC<IconProps> = ({
  width = 60,
  height = 60,
  color = '#FFFFFF',
  strokeWidth = 1.5,
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    {/* Top spires */}
    <View style={styles.mumbaiSpires}>
      <View style={[styles.triangleUp, { borderBottomColor: color, borderLeftWidth: 3, borderRightWidth: 3, borderBottomWidth: 8 }]} />
      <View style={[styles.mumbaiTopCenter, { borderColor: color, borderWidth: strokeWidth }]} />
      <View style={[styles.triangleUp, { borderBottomColor: color, borderLeftWidth: 3, borderRightWidth: 3, borderBottomWidth: 8 }]} />
    </View>
    {/* Top balcony */}
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 3, width: 42 }]} />
    {/* Pillars and arches block */}
    <View style={styles.mumbaiColumnsContainer}>
      {/* Left outer pillar */}
      <View style={[styles.mumbaiPillar, { borderColor: color, borderWidth: strokeWidth }]} />
      {/* Side arch left */}
      <View style={[styles.mumbaiSideArch, { borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
      {/* Inner pillar left */}
      <View style={[styles.mumbaiInnerPillar, { backgroundColor: color }]} />
      {/* Center main arch */}
      <View style={[styles.mumbaiCenterArch, { borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
      {/* Inner pillar right */}
      <View style={[styles.mumbaiInnerPillar, { backgroundColor: color }]} />
      {/* Side arch right */}
      <View style={[styles.mumbaiSideArch, { borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
      {/* Right outer pillar */}
      <View style={[styles.mumbaiPillar, { borderColor: color, borderWidth: strokeWidth }]} />
    </View>
    {/* Base Steps */}
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 2, width: 44, marginTop: 1 }]} />
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 2, width: 48, marginTop: 1 }]} />
  </View>
);

// 2. Pune: Shaniwar Wada
export const PuneIcon: React.FC<IconProps> = ({
  width = 60,
  height = 60,
  color = '#FFFFFF',
  strokeWidth = 1.5,
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    {/* Bastion tops */}
    <View style={styles.puneTops}>
      <View style={styles.puneBastionTopLeft}>
        <Line color={color} style={{ width: 3, height: 4 }} />
        <Line color={color} style={{ width: 3, height: 4 }} />
      </View>
      <View style={styles.puneWallTop}>
        <Line color={color} style={{ width: 2, height: 2 }} />
        <Line color={color} style={{ width: 2, height: 2 }} />
        <Line color={color} style={{ width: 2, height: 2 }} />
      </View>
      <View style={styles.puneBastionTopRight}>
        <Line color={color} style={{ width: 3, height: 4 }} />
        <Line color={color} style={{ width: 3, height: 4 }} />
      </View>
    </View>
    {/* Main Facade */}
    <View style={styles.puneBody}>
      {/* Left Tower */}
      <View style={[styles.puneBastion, { borderColor: color, borderWidth: strokeWidth, borderTopLeftRadius: 6, borderBottomLeftRadius: 4 }]} />
      {/* Center wall and gate */}
      <View style={[styles.puneCenterSection, { borderColor: color, borderTopWidth: strokeWidth }]}>
        <View style={[styles.puneGate, { borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
      </View>
      {/* Right Tower */}
      <View style={[styles.puneBastion, { borderColor: color, borderWidth: strokeWidth, borderTopRightRadius: 6, borderBottomRightRadius: 4 }]} />
    </View>
    {/* Ground */}
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 2, width: 48 }]} />
  </View>
);

// 3. Bangalore: Vidhana Soudha
export const BangaloreIcon: React.FC<IconProps> = ({
  width = 60,
  height = 60,
  color = '#FFFFFF',
  strokeWidth = 1.5,
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    {/* Dome and spire */}
    <View style={[styles.bangaloreSpire, { backgroundColor: color }]} />
    <View style={[styles.bangaloreDome, { borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
    {/* Facade block with columns */}
    <View style={[styles.bangaloreFacade, { borderColor: color, borderWidth: strokeWidth }]}>
      <View style={[styles.bangalorePediment, { borderBottomColor: color, borderLeftWidth: 16, borderRightWidth: 16, borderBottomWidth: 6 }]} />
      <View style={styles.bangaloreColumns}>
        <Line color={color} style={{ width: 1, height: 16 }} />
        <Line color={color} style={{ width: 1, height: 16 }} />
        <Line color={color} style={{ width: 1, height: 16 }} />
        <Line color={color} style={{ width: 1, height: 16 }} />
      </View>
    </View>
    {/* Base Steps */}
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 1.5, width: 40 }]} />
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 1.5, width: 44, marginTop: 1 }]} />
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 1.5, width: 48, marginTop: 1 }]} />
  </View>
);

// 4. Chennai: Gopuram
export const ChennaiIcon: React.FC<IconProps> = ({
  width = 60,
  height = 60,
  color = '#FFFFFF',
  strokeWidth = 1.5,
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    {/* Top Kalasam Spires */}
    <View style={styles.chennaiSpires}>
      <Line color={color} style={{ width: 1.5, height: 4 }} />
      <Line color={color} style={{ width: 1.5, height: 6 }} />
      <Line color={color} style={{ width: 1.5, height: 4 }} />
    </View>
    {/* Top Dome */}
    <View style={[styles.chennaiTopDome, { borderColor: color, borderWidth: strokeWidth, borderTopLeftRadius: 4, borderTopRightRadius: 4 }]} />
    {/* Tapering Tiers */}
    <View style={[styles.chennaiTier, { width: 18, height: 6, borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
    <View style={[styles.chennaiTier, { width: 24, height: 6, borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
    <View style={[styles.chennaiTier, { width: 30, height: 6, borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
    {/* Base Layer & Door */}
    <View style={[styles.chennaiBase, { width: 38, height: 12, borderColor: color, borderWidth: strokeWidth }]}>
      <View style={[styles.chennaiDoor, { borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
    </View>
    {/* Ground */}
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 2, width: 48 }]} />
  </View>
);

// 5. Noida: Skyscrapers
export const NoidaIcon: React.FC<IconProps> = ({
  width = 60,
  height = 60,
  color = '#FFFFFF',
  strokeWidth = 1.5,
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <View style={styles.noidaContainer}>
      {/* Left Tall Skyscraper */}
      <View style={[styles.noidaTower, { height: 38, width: 10, borderColor: color, borderWidth: strokeWidth, borderTopLeftRadius: 4 }]}>
        <View style={[styles.noidaWindow, { backgroundColor: color }]} />
        <View style={[styles.noidaWindow, { backgroundColor: color }]} />
        <View style={[styles.noidaWindow, { backgroundColor: color }]} />
      </View>
      {/* Center Tower */}
      <View style={[styles.noidaTower, { height: 30, width: 12, borderColor: color, borderWidth: strokeWidth, marginHorizontal: 2 }]}>
        <View style={[styles.noidaWindowRow]}>
          <View style={[styles.noidaWindowMini, { backgroundColor: color }]} />
          <View style={[styles.noidaWindowMini, { backgroundColor: color }]} />
        </View>
        <View style={[styles.noidaWindowRow]}>
          <View style={[styles.noidaWindowMini, { backgroundColor: color }]} />
          <View style={[styles.noidaWindowMini, { backgroundColor: color }]} />
        </View>
      </View>
      {/* Right Tower */}
      <View style={[styles.noidaTower, { height: 22, width: 10, borderColor: color, borderWidth: strokeWidth, borderTopRightRadius: 4 }]}>
        <View style={[styles.noidaWindow, { backgroundColor: color, height: 2 }]} />
        <View style={[styles.noidaWindow, { backgroundColor: color, height: 2 }]} />
      </View>
    </View>
    {/* Ground */}
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 2, width: 48 }]} />
  </View>
);

// 6. Hyderabad: Charminar
export const HyderabadIcon: React.FC<IconProps> = ({
  width = 60,
  height = 60,
  color = '#FFFFFF',
  strokeWidth = 1.5,
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    {/* Spires on minarets */}
    <View style={styles.hyderabadMinaretTops}>
      <View style={[styles.circleGlow, { backgroundColor: color, width: 4, height: 4, borderRadius: 2 }]} />
      <View style={[styles.circleGlow, { backgroundColor: color, width: 4, height: 4, borderRadius: 2 }]} />
    </View>
    {/* Main body with minarets on sides */}
    <View style={styles.hyderabadMiddle}>
      {/* Left Minaret */}
      <View style={[styles.hyderabadMinaret, { borderColor: color, borderLeftWidth: strokeWidth }]} />
      
      {/* Center Building */}
      <View style={styles.hyderabadCenterBuilding}>
        {/* Balcony */}
        <View style={[styles.horizontalBar, { backgroundColor: color, height: 2, width: 26 }]} />
        {/* Central main block */}
        <View style={[styles.hyderabadCenterBlock, { borderColor: color, borderWidth: strokeWidth, borderTopWidth: 0 }]}>
          {/* Central Arch */}
          <View style={[styles.hyderabadArch, { borderColor: color, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
        </View>
      </View>

      {/* Right Minaret */}
      <View style={[styles.hyderabadMinaret, { borderColor: color, borderRightWidth: strokeWidth }]} />
    </View>
    {/* Ground */}
    <View style={[styles.horizontalBar, { backgroundColor: color, height: 2, width: 48 }]} />
  </View>
);

// 7. Onboarding Request Bottom Sheet Illustrations
// Illustration A: Add Your Home (House with Trees)
export const HouseIllustration: React.FC = () => (
  <View style={styles.houseIllustrationContainer}>
    {/* Moon Glow */}
    <View style={styles.moonGlow} />

    {/* The House */}
    <View style={styles.houseContainer}>
      {/* Roof */}
      <View style={[styles.triangleUp, { borderBottomColor: '#D97706', borderLeftWidth: 24, borderRightWidth: 24, borderBottomWidth: 16 }]} />
      {/* House Body */}
      <View style={styles.houseBody}>
        {/* Windows */}
        <View style={styles.houseWindow} />
        {/* Door */}
        <View style={styles.houseDoor} />
        {/* Windows */}
        <View style={styles.houseWindow} />
      </View>
    </View>

    {/* Tree Left */}
    <View style={[styles.treeContainer, { left: 4 }]}>
      <View style={styles.treeCrown} />
      <View style={styles.treeTrunk} />
    </View>

    {/* Tree Right */}
    <View style={[styles.treeContainer, { right: 4 }]}>
      <View style={styles.treeCrown} />
      <View style={styles.treeTrunk} />
    </View>

    {/* Ground bar */}
    <View style={styles.illustrationGround} />
  </View>
);

// Illustration B: List Your Society With Us
export const ListSocietyIllustration: React.FC = () => (
  <View style={styles.houseIllustrationContainer}>
    {/* Background Buildings */}
    <View style={styles.backSkyscrapers}>
      <View style={styles.backSkyscraper1} />
      <View style={styles.backSkyscraper2} />
    </View>

    {/* Main Society Building */}
    <View style={styles.mainBuilding}>
      <View style={styles.buildingWindowRow}>
        <View style={[styles.buildingWindow, { backgroundColor: '#D97706' }]} />
        <View style={styles.buildingWindow} />
      </View>
      <View style={styles.buildingWindowRow}>
        <View style={styles.buildingWindow} />
        <View style={[styles.buildingWindow, { backgroundColor: '#D97706' }]} />
      </View>
      <View style={styles.buildingWindowRow}>
        <View style={styles.buildingWindow} />
        <View style={styles.buildingWindow} />
      </View>
      <View style={styles.buildingWindowRow}>
        <View style={[styles.buildingWindow, { backgroundColor: '#D97706' }]} />
        <View style={styles.buildingWindow} />
      </View>
    </View>

    {/* Hand holding Phone */}
    <View style={styles.phoneContainer}>
      <View style={styles.phoneBodyFrame}>
        {/* Logo/Icon on Phone Screen */}
        <View style={styles.phoneScreenContent}>
          <Text style={styles.phoneBrandLogo}>B</Text>
        </View>
      </View>
    </View>

    {/* Ground bar */}
    <View style={styles.illustrationGround} />
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  horizontalBar: {
    width: '100%',
  },
  triangleUp: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  circleGlow: {
    opacity: 0.8,
  },
  // Mumbai Styles
  mumbaiSpires: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 32,
    alignItems: 'flex-end',
  },
  mumbaiTopCenter: {
    width: 14,
    height: 6,
    borderBottomWidth: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  mumbaiColumnsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    width: 40,
  },
  mumbaiPillar: {
    width: 4,
    height: 24,
  },
  mumbaiSideArch: {
    width: 6,
    height: 18,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  mumbaiInnerPillar: {
    width: 2,
    height: 24,
  },
  mumbaiCenterArch: {
    width: 12,
    height: 20,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  // Pune Styles
  puneTops: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 40,
    paddingHorizontal: 2,
  },
  puneBastionTopLeft: {
    flexDirection: 'row',
    gap: 1.5,
  },
  puneBastionTopRight: {
    flexDirection: 'row',
    gap: 1.5,
  },
  puneWallTop: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'flex-end',
    height: 4,
  },
  puneBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 40,
    height: 24,
  },
  puneBastion: {
    width: 8,
    height: 24,
  },
  puneCenterSection: {
    flex: 1,
    height: 18,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  puneGate: {
    width: 10,
    height: 12,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  // Bangalore Styles
  bangaloreSpire: {
    width: 1.5,
    height: 6,
  },
  bangaloreDome: {
    width: 12,
    height: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: -1,
  },
  bangaloreFacade: {
    width: 34,
    height: 16,
    position: 'relative',
    alignItems: 'center',
  },
  bangalorePediment: {
    position: 'absolute',
    top: -6,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  bangaloreColumns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 2,
  },
  // Chennai Styles
  chennaiSpires: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  chennaiTopDome: {
    width: 12,
    height: 6,
    borderBottomWidth: 0,
  },
  chennaiTier: {
    borderBottomWidth: 0,
  },
  chennaiBase: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chennaiDoor: {
    width: 10,
    height: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  // Noida Styles
  noidaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  noidaTower: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 2,
  },
  noidaWindow: {
    width: 4,
    height: 1.5,
    opacity: 0.5,
  },
  noidaWindowRow: {
    flexDirection: 'row',
    gap: 2,
  },
  noidaWindowMini: {
    width: 2,
    height: 2,
    opacity: 0.5,
  },
  // Hyderabad Styles
  hyderabadMinaretTops: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 36,
  },
  hyderabadMiddle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 36,
    height: 26,
  },
  hyderabadMinaret: {
    width: 4,
    height: 26,
  },
  hyderabadCenterBuilding: {
    flex: 1,
    height: 22,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  hyderabadCenterBlock: {
    width: 26,
    height: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  hyderabadArch: {
    width: 12,
    height: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  // House Illustration
  houseIllustrationContainer: {
    width: 90,
    height: 70,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  moonGlow: {
    position: 'absolute',
    top: 6,
    right: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F59E0B',
    opacity: 0.15,
  },
  houseContainer: {
    alignItems: 'center',
    marginBottom: 4,
    zIndex: 2,
  },
  houseBody: {
    width: 42,
    height: 26,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 2,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
    marginTop: -1,
  },
  houseWindow: {
    width: 7,
    height: 7,
    borderWidth: 1.2,
    borderColor: '#9CA3AF',
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    borderRadius: 1,
  },
  houseDoor: {
    width: 9,
    height: 15,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    marginTop: 9,
  },
  treeContainer: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
    zIndex: 1,
  },
  treeCrown: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  treeTrunk: {
    width: 2,
    height: 10,
    backgroundColor: '#9CA3AF',
  },
  illustrationGround: {
    width: 82,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  // List Society Illustration
  backSkyscrapers: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  backSkyscraper1: {
    width: 14,
    height: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
  },
  backSkyscraper2: {
    width: 12,
    height: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
  },
  mainBuilding: {
    width: 26,
    height: 44,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 2,
    backgroundColor: '#111827',
    position: 'absolute',
    bottom: 4,
    left: 36,
    padding: 3,
    gap: 3,
    zIndex: 1,
  },
  buildingWindowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buildingWindow: {
    width: 4,
    height: 4,
    backgroundColor: '#9CA3AF',
    borderRadius: 0.5,
  },
  phoneContainer: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    zIndex: 3,
    transform: [{ rotate: '-5deg' }],
  },
  phoneBodyFrame: {
    width: 18,
    height: 30,
    borderWidth: 1.8,
    borderColor: '#D97706',
    borderRadius: 3,
    backgroundColor: '#0B0F17',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneScreenContent: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0B0F17',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneBrandLogo: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
