import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Switch, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DarkTheme } from '../utils/theme';
import { SPACING, TOUCH_TARGET, BORDER_RADIUS } from '../constants/layout';
import { FloatingLabelInput } from '../components/ui/FloatingLabelInput';

const PollsScreen = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const isResident = user?.role === 'resident';
  const canVote = isResident; // Only residents can vote
  const canCreate = isAdmin; // Only admins can create polls

  type PollOption = {
    id: string;
    label: string;
    votes: number;
  };

  type Poll = {
    id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    endDate: string;
    status: string;
    userVote: string | null;
  };

  // Mock polls data
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      question: 'Should we extend the pool hours for summer?',
      options: [
        { id: '1', label: 'Yes, extend to 8 PM', votes: 24 },
        { id: '2', label: 'No, keep current 6 PM closing', votes: 18 },
      ],
      totalVotes: 42,
      endDate: '2023-06-30',
      status: 'Active',
      userVote: null,
    },
    {
      id: '2',
      question: 'Preferred timing for monthly society meetings?',
      options: [
        { id: '1', label: 'First Saturday 10 AM', votes: 15 },
        { id: '2', label: 'Third Sunday 4 PM', votes: 27 },
        { id: '3', label: 'Second Wednesday 7 PM', votes: 10 },
      ],
      totalVotes: 52,
      endDate: '2023-06-15',
      status: 'Active',
      userVote: null,
    },
    {
      id: '3',
      question: 'Approve budget for garden renovation?',
      options: [
        { id: '1', label: 'Approve ₹2,00,000', votes: 30 },
        { id: '2', label: 'Revoke, too expensive', votes: 12 },
      ],
      totalVotes: 42,
      endDate: '2023-06-20',
      status: 'Voting Ended',
      userVote: null,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    endDate: '',
  });
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = (pollId: string, optionId: string) => {
    if (!canVote) {
      alert('Only residents can vote in polls');
      return;
    }

    setPolls(prevPolls =>
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          if (poll.userVote) {
            const optionIndex = poll.options.findIndex(opt => opt.id === poll.userVote);
            if (optionIndex !== -1) {
              poll.options[optionIndex].votes -= 1;
            }
          }

          const optionIndex = poll.options.findIndex(opt => opt.id === optionId);
          if (optionIndex !== -1) {
            poll.options[optionIndex].votes += 1;
            return {
              ...poll,
              totalVotes: poll.totalVotes + 1,
              userVote: optionId,
            };
          }
        }
        return poll;
      })
    );
  };

  const handleCreatePoll = () => {
    if (!canCreate) {
      alert('Only administrators can create polls');
      return;
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewPoll({ question: '', options: ['', ''], endDate: '' });
    setSelectedOption(null);
  };

  const handleAddOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSavePoll = () => {
    if (!canCreate) {
      alert('Only administrators can create polls');
      return;
    }

    if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim()) || !newPoll.endDate.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const validOptions = newPoll.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    const newPollObj = {
      id: String(Date.now()),
      question: newPoll.question,
      options: validOptions.map((opt, index) => ({
        id: String(index + 1),
        label: opt,
        votes: 0,
      })),
      totalVotes: 0,
      endDate: newPoll.endDate,
      status: 'Active',
      userVote: null,
    };

    setPolls(prev => [...prev, newPollObj]);
    handleCloseModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Polls</Text>
        {canCreate && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCreatePoll}
            style={styles.addButton}
            hitSlop={TOUCH_TARGET.comfortable}
          >
            <Ionicons name="add-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 4, fontWeight: 'bold' }}>Create Poll</Text>
          </TouchableOpacity>
        )}
      </View>

      {modalVisible && (
        <Modal
          transparent={true}
          visible={true}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
                <Text style={styles.modalTitle}>Create New Poll</Text>
                <TouchableOpacity onPress={handleCloseModal} hitSlop={TOUCH_TARGET.comfortable}>
                  <Ionicons name="close-outline" size={24} color={DarkTheme.text.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ paddingBottom: SPACING.md }}>
                <FloatingLabelInput
                  label="Poll Question"
                  value={newPoll.question}
                  onChangeText={text => setNewPoll({ ...newPoll, question: text })}
                  style={styles.input}
                  labelBgColor={DarkTheme.bg.card}
                  containerStyle={{ marginTop: SPACING.md }}
                />

                <Text style={[styles.inputLabel, { marginTop: SPACING.md, marginBottom: 8 }]}>Options</Text>
                <View style={styles.optionsInputContainer}>
                  {newPoll.options.map((option, index) => (
                    <View key={index} style={styles.optionInput}>
                      <FloatingLabelInput
                        label={`Option ${index + 1}`}
                        value={option}
                        onChangeText={text => {
                          const options = [...newPoll.options];
                          options[index] = text;
                          setNewPoll({ ...newPoll, options });
                        }}
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        labelBgColor={DarkTheme.bg.card}
                      />
                      {index > 1 && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => handleRemoveOption(index)}
                          style={styles.removeButton}
                          hitSlop={TOUCH_TARGET.comfortable}
                        >
                          <Ionicons name="trash-outline" size={20} color={DarkTheme.status.error} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleAddOption}
                    style={styles.addOptionButton}
                    hitSlop={TOUCH_TARGET.comfortable}
                  >
                    <Ionicons name="add-outline" size={20} color={DarkTheme.accent.gold} />
                    <Text style={styles.addOptionText}>Add Option</Text>
                  </TouchableOpacity>
                </View>

                <FloatingLabelInput
                  label="End Date (YYYY-MM-DD)"
                  value={newPoll.endDate}
                  onChangeText={text => setNewPoll({ ...newPoll, endDate: text })}
                  style={styles.input}
                  labelBgColor={DarkTheme.bg.card}
                  containerStyle={{ marginTop: SPACING.md }}
                />
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCloseModal}
                  style={styles.cancelButton}
                  hitSlop={TOUCH_TARGET.comfortable}
                >
                  <Text style={{ color: DarkTheme.text.secondary, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSavePoll}
                  disabled={!canCreate}
                  style={[
                    styles.submitButton,
                    !canCreate && styles.buttonDisabled
                  ]}
                  hitSlop={TOUCH_TARGET.comfortable}
                >
                  <Text style={styles.buttonText}>
                    {canCreate ? 'Create' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <FlatList
        data={polls}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const userVoted = item.userVote !== null;
          const userVoteOption = item.options.find(opt => opt.id === item.userVote);

          return (
            <View style={styles.pollCard}>
              <View style={styles.pollQuestionContainer}>
                <Text style={styles.pollQuestion}>{item.question}</Text>
                <View style={styles.pollMeta}>
                  <Text style={styles.pollMetaText}>
                    Ends: {item.endDate}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    item.status === 'Active' ? styles.statusActive : styles.statusEnded
                  ]}>
                    <Text style={[
                      styles.statusBadgeText,
                      item.status === 'Active' ? { color: DarkTheme.status.success } : { color: DarkTheme.status.error }
                    ]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.optionsContainer}>
                {item.options.map((option, index) => {
                  const percentage =
                    item.totalVotes > 0
                      ? Math.round((option.votes / item.totalVotes) * 100)
                      : 0;
                  const userVotedOnThisOption = userVoteOption?.id === option.id;

                  return (
                    <View key={option.id} style={styles.optionRow}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          if (!canVote) {
                            alert('Only residents can vote');
                            return;
                          }
                          if (item.status === 'Active' && !userVoted) {
                            handleVote(item.id, option.id);
                          } else if (userVoted && !userVotedOnThisOption) {
                            alert('You have already voted. You can only vote once.');
                          } else if (item.status !== 'Active') {
                            alert('Voting has ended for this poll');
                          }
                        }}
                        disabled={
                          !canVote ||
                          item.status !== 'Active' ||
                          (userVoted && !userVotedOnThisOption)
                        }
                        style={{ flex: 1, marginRight: SPACING.md }}
                        hitSlop={TOUCH_TARGET.comfortable}
                      >
                        <View style={[
                          styles.optionContent,
                          userVotedOnThisOption && styles.selectedOption
                        ]}>
                          <Text style={[
                            styles.optionText,
                            userVotedOnThisOption && { color: DarkTheme.status.success, fontWeight: 'bold' }
                          ]}>{option.label}</Text>
                          {userVotedOnThisOption && (
                            <Ionicons name="checkmark-circle" size={16} color={DarkTheme.status.success} style={{ marginLeft: SPACING.xs }} />
                          )}
                        </View>
                      </TouchableOpacity>
                      <View style={styles.voteProgressContainer}>
                        <View
                          style={[
                            styles.voteBarContainer,
                            userVotedOnThisOption && { borderColor: DarkTheme.status.success }
                          ]}
                        >
                          <View
                            style={[
                              styles.voteBar,
                              { width: `${percentage}%` },
                              userVotedOnThisOption && { backgroundColor: DarkTheme.status.success }
                            ]}
                          />
                        </View>
                        <Text style={styles.voteCount}>
                          {option.votes} votes ({percentage}%)
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={40} color={DarkTheme.text.tertiary} />
            <Text style={styles.emptyText}>No polls available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.bg.primary,
    padding: SPACING.lg,
  },
  header: {
    backgroundColor: DarkTheme.bg.card,
    padding: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  headerTitle: {
    color: DarkTheme.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: DarkTheme.accent.gold,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.lg,
  },
  pollCard: {
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  pollQuestionContainer: {
    marginBottom: SPACING.lg,
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.text.primary,
    marginBottom: SPACING.sm,
  },
  pollMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollMetaText: {
    fontSize: 12,
    color: DarkTheme.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusEnded: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: DarkTheme.bg.input,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: DarkTheme.status.success,
  },
  optionText: {
    fontSize: 14,
    color: DarkTheme.text.primary,
  },
  voteProgressContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  voteBarContainer: {
    height: 6,
    backgroundColor: DarkTheme.bg.input,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
    marginBottom: SPACING.xs,
  },
  voteBar: {
    backgroundColor: DarkTheme.accent.gold,
    height: '100%',
  },
  voteCount: {
    fontSize: 11,
    color: DarkTheme.text.tertiary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxxl,
    marginTop: SPACING.lg,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: DarkTheme.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: DarkTheme.bg.card,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    width: '85%',
    maxHeight: '80%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DarkTheme.text.primary,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: DarkTheme.text.secondary,
    marginBottom: SPACING.sm,
  },
  input: {
    height: TOUCH_TARGET.comfortable,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.input,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    fontSize: 14,
    backgroundColor: DarkTheme.bg.input,
    color: DarkTheme.text.primary,
  },
  optionsContainer: {
    marginBottom: SPACING.lg,
  },
  optionsInputContainer: {
    marginBottom: SPACING.lg,
  },
  optionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.bg.input,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  addOptionText: {
    fontSize: 13,
    color: DarkTheme.accent.gold,
    marginLeft: SPACING.sm,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: SPACING.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: DarkTheme.bg.input,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DarkTheme.border.subtle,
  },
  submitButton: {
    flex: 1,
    backgroundColor: DarkTheme.accent.gold,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: DarkTheme.text.tertiary,
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PollsScreen;