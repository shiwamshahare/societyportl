import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '@/utils/theme';
import { SPACING, BORDER_RADIUS } from '@/constants/layout';

const ProjectScreen = () => {
  const projects = [
    {
      title: 'Solar Panel Installation',
      status: 'In Progress',
      progress: 0.65,
      budget: '₹4.5L',
      timeline: 'Est. Completion: Aug 15',
      desc: 'Installing rooftop solar panels on all towers to reduce common-area electricity bills.',
      color: '#3B82F6', // Blue
    },
    {
      title: 'CCTV Camera Upgrade',
      status: 'Planning',
      progress: 0.2,
      budget: '₹2.8L',
      timeline: 'Est. Start: Sep 1',
      desc: 'Upgrading the security perimeter with AI-enabled motion detection cameras.',
      color: '#A78BFA', // Purple
    },
    {
      title: 'Rainwater Harvesting',
      status: 'Completed',
      progress: 1.0,
      budget: '₹1.5L',
      timeline: 'Completed on: July 10',
      desc: 'Restoration and cleaning of the main rainwater harvesting wells before monsoon.',
      color: '#10B981', // Green
    },
  ];

  const documents = [
    { name: 'Society Bye-laws (2026 Edition)', size: '2.4 MB', type: 'PDF' },
    { name: 'Financial Audit Report FY 2025-26', size: '4.1 MB', type: 'PDF' },
    { name: 'Annual General Meeting Minutes', size: '840 KB', type: 'PDF' },
    { name: 'Amenity Guidelines & Rulebook', size: '1.2 MB', type: 'PDF' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Society Projects</Text>
        <Text style={styles.headerSubtitle}>Follow updates on community infrastructure & documents</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Projects Section */}
        <Text style={styles.sectionTitle}>Active Projects</Text>
        {projects.map((project, idx) => (
          <View key={idx} style={styles.projectCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${project.color}15` }]}>
                <Text style={[styles.statusText, { color: project.color }]}>{project.status}</Text>
              </View>
            </View>

            <Text style={styles.projectDesc}>{project.desc}</Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${project.progress * 100}%`, backgroundColor: project.color }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressPct}>{Math.round(project.progress * 100)}% Done</Text>
                <Text style={styles.budgetVal}>Budget: {project.budget}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Ionicons name="calendar-outline" size={14} color={DarkTheme.text.tertiary} />
              <Text style={styles.footerText}>{project.timeline}</Text>
            </View>
          </View>
        ))}

        {/* Documents Section */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Official Documents</Text>
        <View style={styles.docsList}>
          {documents.map((doc, idx) => (
            <TouchableOpacity key={idx} style={styles.docItem} activeOpacity={0.7}>
              <View style={styles.docLeft}>
                <View style={styles.docIconContainer}>
                  <Ionicons name="document-text-outline" size={20} color="#3B82F6" />
                </View>
                <View style={styles.docInfo}>
                  <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                  <Text style={styles.docMeta}>{doc.type} • {doc.size}</Text>
                </View>
              </View>
              <Ionicons name="download-outline" size={20} color={DarkTheme.text.secondary} />
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
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: DarkTheme.text.secondary,
    fontSize: 13,
    marginTop: 4,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100, // Leave room for tab bar
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.text.primary,
    marginBottom: SPACING.md,
  },
  projectCard: {
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {
    color: DarkTheme.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  projectDesc: {
    color: DarkTheme.text.secondary,
    fontSize: 13,
    lineHeight: 18,
  },
  progressContainer: {
    gap: 6,
    marginVertical: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPct: {
    color: DarkTheme.text.secondary,
    fontSize: 11,
    fontWeight: '500',
  },
  budgetVal: {
    color: DarkTheme.text.tertiary,
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: SPACING.sm,
    marginTop: 2,
  },
  footerText: {
    color: DarkTheme.text.tertiary,
    fontSize: 11,
  },
  docsList: {
    gap: SPACING.xs,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DarkTheme.bg.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: SPACING.md,
  },
  docIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  docName: {
    color: DarkTheme.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  docMeta: {
    color: DarkTheme.text.tertiary,
    fontSize: 11,
  },
});

export default ProjectScreen;
