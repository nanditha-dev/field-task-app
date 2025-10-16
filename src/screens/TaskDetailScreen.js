import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../store/TaskContext';
import { formatDate } from '../utils/date';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { logEvent } from '../analytics/logger';

export default function TaskDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { colors } = useTheme();
  const { tasks, addTask, updateTask, toggleComplete, deleteTask } = useTasks();

  const existing = useMemo(() => tasks.find(t => t.id === id), [tasks, id]);

  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [priority, setPriority] = useState(existing?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(existing?.dueDate ? new Date(existing.dueDate) : null);
  const [tagsInput, setTagsInput] = useState(existing?.tags?.join(', ') || '');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    logEvent('screen_view', { screen: 'TaskDetail', mode: existing ? 'edit' : 'create' });
  }, [existing]);

  const onSave = () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title');
      return;
    }
    const payload = {
      title,
      description,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (existing) {
      updateTask(existing.id, payload);
    } else {
      const newId = addTask(payload);
      navigation.setParams({ id: newId });
    }
    navigation.goBack();
  };

  const onDelete = () => {
    if (!existing) return;
    Alert.alert('Delete Task', `Delete "${existing.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        deleteTask(existing.id);
        navigation.goBack();
      }},
    ]);
  };

  const onToggleComplete = () => {
    if (!existing) return;
    toggleComplete(existing.id);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Labeled label="Title" color={colors.text}>
        <TextInput
          placeholder="Task title"
          style={[styles.input, { backgroundColor: colors.inputBg || colors.card, borderColor: colors.border, color: colors.text }]}
          placeholderTextColor={colors.mutedText || '#9CA3AF'}
          value={title}
          onChangeText={setTitle}
        />
      </Labeled>

      <Labeled label="Description" color={colors.text}>
        <TextInput
          placeholder="Describe the task"
          style={[styles.input, { height: 96, backgroundColor: colors.inputBg || colors.card, borderColor: colors.border, color: colors.text }]}
          placeholderTextColor={colors.mutedText || '#9CA3AF'}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </Labeled>

      <Labeled label="Priority" color={colors.text}>
        <View style={[styles.segmentRow, { borderColor: colors.border }]}>
          {['Low', 'Medium', 'High'].map(p => {
            const selected = priority === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.segment,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selected && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: colors.text },
                    selected && { color: '#fff' },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Labeled>

      <Labeled label="Due Date" color={colors.text}>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[styles.input, { backgroundColor: colors.inputBg || colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <View style={styles.inputRow}>
            <Text style={{ color: dueDate ? colors.text : (colors.mutedText || '#9CA3AF'), flex: 1 }}>
              {dueDate ? formatDate(dueDate.toISOString()) : 'Select a date'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.mutedText || '#6B7280'} />
          </View>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, d) => {
              if (Platform.OS === 'android') {
                setShowPicker(false);
                if (event.type === 'set' && d) setDueDate(d);
              } else {
                 setShowPicker(false);
                if (d) setDueDate(d);
              }
            }}
          />
        )}
      </Labeled>

      <Labeled label="Tags" color={colors.text}>
        <TextInput
          placeholder="e.g. pump, urgent"
          style={[styles.input, { backgroundColor: colors.inputBg || colors.card, borderColor: colors.border, color: colors.text }]}
          placeholderTextColor={colors.mutedText || '#9CA3AF'}
          value={tagsInput}
          onChangeText={setTagsInput}
          autoCapitalize="none"
        />
      </Labeled>

      <View style={{ height: 12 }} />

      <TouchableOpacity onPress={onSave} style={[styles.primaryBtn, { backgroundColor: colors.primary || '#3B63A8' }]}>
        <Text style={styles.primaryBtnText}>
          <Ionicons name="save-outline" size={16} />  Save
        </Text>
      </TouchableOpacity>

      {existing && (
        <>
          <TouchableOpacity onPress={onToggleComplete} style={[styles.secondaryBtn, { backgroundColor: colors.card }]}>
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
              {existing.status === 'Done' ? 'Reopen Task' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={[styles.destructiveBtn, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.destructiveBtnText, { color: '#B91C1C' }]}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

function Labeled({ label, children, color }) {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
      <Text style={{ marginBottom: 6, fontWeight: '600', color }}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // segmented control
  segmentRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0,
  },
  segmentText: { fontWeight: '600' },

  // buttons
  primaryBtn: {
    marginHorizontal: 16,
    marginTop: 4,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: { fontWeight: '700' },
  destructiveBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  destructiveBtnText: { fontWeight: '700' },
});