import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { DarkTheme } from '@/utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '@/constants/layout';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';

const NoticesScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  type NoticeType = {
    id: number;
    title: string;
    category: string;
    excerpt: string;
    timestamp: string;
    isExpanded: boolean;
    content: string;
  };

  const [notices, setNotices] = useState<NoticeType[]>([
    {
      id: 1,
      title: 'Pool Maintenance Scheduled',
      category: 'Maintenance',
      excerpt: 'The pool will be closed for maintenance from 9 AM to 5 PM today.',
      timestamp: '2 hours ago',
      isExpanded: false,
      content: 'The swimming pool will be closed today for routine maintenance and cleaning. Maintenance will be conducted from 9:00 AM to 5:00 PM. We apologize for any inconvenience and appreciate your understanding as we work to keep our facilities in top condition.',
    },
    {
      id: 2,
      title: 'Community Garage Sale This Weekend',
      category: 'Event',
      excerpt: 'Join us for the annual community garage sale in the parking lot.',
      timestamp: '1 day ago',
      isExpanded: false,
      content: 'Mark your calendars for this Saturday and Sunday! Our annual community garage sale will be held in the main parking lot from 8 AM to 4 PM both days. Tables are available for reservation at the management office. This is a great opportunity to declutter and find treasures from your neighbors!',
    },
    {
      id: 3,
      title: 'New Security Protocol Effective Monday',
      category: 'Announcement',
      excerpt: 'All visitors must now present ID at the gate for verification.',
      timestamp: '3 days ago',
      isExpanded: false,
      content: 'Starting Monday, all visitors to our community will be required to present a valid government-issued photo ID at the gate for verification. This enhanced security measure helps ensure the safety of all residents. Please inform your guests and service providers in advance to avoid delays.',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  const toggleExpand = (id: number) => {
    setNotices(notices.map((notice: NoticeType) =>
      notice.id === id ? { ...notice, isExpanded: !notice.isExpanded } : notice
    ));
  };

  const handleCreateNotice = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewNoticeTitle('');
    setNewNoticeContent('');
  };

  const handleSaveNotice = () => {
    if (newNoticeTitle.trim() && newNoticeContent.trim()) {
      const newNotice = {
        id: notices.length + 1,
        title: newNoticeTitle,
        content: newNoticeContent,
        excerpt: newNoticeContent.length > 100 ? newNoticeContent.substring(0, 100) + '...' : newNoticeContent,
        timestamp: 'Just now',
        isExpanded: false,
        category: selectedCategory === 'All' ? 'Notice' : selectedCategory,
      };
      setNotices([newNotice, ...notices]);
      handleCloseModal();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Announcement':
        return '#3B82F6';
      case 'Maintenance':
        return DarkTheme.accent.gold;
      case 'Event':
        return DarkTheme.status.success;
      default:
        return DarkTheme.text.tertiary;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: DarkTheme.bg.primary }}>
      {/* Header */}
      <View style={{
        backgroundColor: DarkTheme.bg.card,
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: DarkTheme.border.subtle,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs }}>
          <Text
            style={{
              color: DarkTheme.text.primary,
              fontSize: 18, // h5 size
              fontWeight: '600' as const,
              marginBottom: 0
            }}
          >
            Community Notices
          </Text>
          {isAdmin && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCreateNotice}
              hitSlop={TOUCH_TARGET.comfortable}
              style={{
                backgroundColor: DarkTheme.bg.input,
                paddingVertical: SPACING.xs,
                paddingHorizontal: SPACING.md,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: DarkTheme.border.subtle,
              }}
            >
              <Ionicons name="add-outline" size={20} color={DarkTheme.accent.gold} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notices List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={notices}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                marginHorizontal: SPACING.md,
                marginTop: SPACING.md,
                backgroundColor: DarkTheme.bg.card,
                borderRadius: BORDER_RADIUS.xl,
                overflow: 'hidden',
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: DarkTheme.border.subtle,
              }}
            >
              {/* Category Tag */}
              <View
                style={{
                  position: 'absolute',
                  top: SPACING.md,
                  left: SPACING.md,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: getCategoryColor(item.category),
                  paddingHorizontal: SPACING.sm,
                  paddingVertical: SPACING.xs,
                  borderRadius: BORDER_RADIUS.md,
                }}
              >
                <Text
                  style={{
                    color: getCategoryColor(item.category),
                    fontSize: 12, // body3 size
                    fontWeight: '500' as const,
                    textTransform: 'uppercase'
                  }}
                >
                  {item.category}
                </Text>
              </View>

              {/* Main Content */}
              <View style={{ padding: SPACING.lg, paddingTop: SPACING.xl }}>
                <Text
                  style={{
                    fontWeight: '600' as const,
                    fontSize: 16, // h6 size
                    color: DarkTheme.text.primary,
                    marginBottom: SPACING.sm,
                    lineHeight: 22,
                    textAlignVertical: 'top'
                  }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: DarkTheme.text.secondary,
                    fontSize: 14, // label2 size
                    marginBottom: SPACING.md,
                    lineHeight: 20,
                  }}
                  numberOfLines={3}
                >
                  {item.excerpt}
                </Text>

                {/* Expandable Content */}
                {item.isExpanded && (
                  <View style={{ marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: StyleSheet.hairlineWidth, borderColor: DarkTheme.border.subtle }}>
                    <Text style={{ color: DarkTheme.text.secondary, fontSize: 13, lineHeight: 18 }}>
                      {item.content}
                    </Text>
                  </View>
                )}

                {/* Footer */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md }}>
                  <Text style={{ color: DarkTheme.text.tertiary, fontSize: 12, marginBottom: 0 }}>
                    {item.timestamp}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleExpand(item.id)}
                    hitSlop={TOUCH_TARGET.comfortable}
                    style={{
                      paddingHorizontal: SPACING.sm,
                      paddingVertical: SPACING.xs,
                      borderRadius: BORDER_RADIUS.md,
                      backgroundColor: DarkTheme.bg.input,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: DarkTheme.border.subtle,
                    }}
                  >
                    <Text
                      style={{
                        color: DarkTheme.text.primary,
                        fontWeight: '500' as const,
                        fontSize: 12 // body3 size
                      }}
                    >
                      {item.isExpanded ? 'Show Less' : 'Read More'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: SPACING.lg }}
        />
      </View>

      {/* Create Notice Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
          <View
            style={{
              backgroundColor: DarkTheme.bg.card,
              borderRadius: BORDER_RADIUS.xxl,
              padding: SPACING.xxl,
              width: '90%',
              maxHeight: '80%',
              borderWidth: 1,
              borderColor: DarkTheme.border.subtle,
            }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: SPACING.lg
            }}>
              <Text
                style={{
                  fontSize: 18, // h5 size
                  fontWeight: '600' as const,
                  color: DarkTheme.text.primary
                }}
              >
                Create Notice
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                hitSlop={TOUCH_TARGET.comfortable}
              >
                <Ionicons name="close-outline" size={24} color={DarkTheme.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Category Selector */}
            <View style={{ marginBottom: SPACING.md }}>
              <Text
                style={{
                  fontWeight: '500' as const,
                  marginBottom: SPACING.xs,
                  color: DarkTheme.text.secondary,
                  fontSize: 14 // label2 size
                }}
              >
                Category
              </Text>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: SPACING.sm
              }}>
                {['Announcement', 'Maintenance', 'Event'].map(category => (
                  <TouchableOpacity
                    key={category}
                    activeOpacity={0.7}
                    hitSlop={TOUCH_TARGET.comfortable}
                    style={{
                      paddingHorizontal: SPACING.md,
                      paddingVertical: SPACING.xs,
                      borderRadius: BORDER_RADIUS.md,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: selectedCategory === category ? DarkTheme.accent.gold : DarkTheme.border.input,
                      backgroundColor: selectedCategory === category ? 'rgba(217, 119, 6, 0.1)' : DarkTheme.bg.input,
                    }}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={{
                        fontSize: 13, // label2 size
                        color: selectedCategory === category ? DarkTheme.accent.gold : DarkTheme.text.secondary,
                        fontWeight: '500' as const
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Title Input */}
            <FloatingLabelInput
              label="Title"
              value={newNoticeTitle}
              onChangeText={setNewNoticeTitle}
              style={{
                height: TOUCH_TARGET.comfortable,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: DarkTheme.border.input,
                backgroundColor: DarkTheme.bg.input,
                color: DarkTheme.text.primary,
                borderRadius: BORDER_RADIUS.lg,
                paddingHorizontal: SPACING.md,
                fontSize: 16, // body1 size
              }}
              labelBgColor={DarkTheme.bg.card}
              containerStyle={{ marginBottom: SPACING.md }}
            />

            {/* Content Input */}
            <FloatingLabelInput
              label="Content"
              value={newNoticeContent}
              onChangeText={setNewNoticeContent}
              style={{
                height: 120, // Keep fixed height for multiline
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: DarkTheme.border.input,
                backgroundColor: DarkTheme.bg.input,
                color: DarkTheme.text.primary,
                borderRadius: BORDER_RADIUS.lg,
                paddingHorizontal: SPACING.md,
                textAlignVertical: 'top',
                fontSize: 16, // body1 size
              }}
              multiline={true}
              labelBgColor={DarkTheme.bg.card}
              containerStyle={{ marginBottom: SPACING.md }}
            />

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: SPACING.md }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCloseModal}
                hitSlop={TOUCH_TARGET.comfortable}
                style={{
                  flex: 1,
                  backgroundColor: DarkTheme.bg.input,
                  paddingVertical: SPACING.md,
                  borderRadius: BORDER_RADIUS.lg,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: DarkTheme.border.subtle,
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    color: DarkTheme.text.secondary,
                    fontWeight: '600' as const,
                    fontSize: 16 // body1 size
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSaveNotice}
                hitSlop={TOUCH_TARGET.comfortable}
                style={{
                  flex: 1,
                  backgroundColor: DarkTheme.accent.gold,
                  paddingVertical: SPACING.md,
                  borderRadius: BORDER_RADIUS.lg,
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600' as const,
                    fontSize: 16 // body1 size
                  }}
                >
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NoticesScreen;