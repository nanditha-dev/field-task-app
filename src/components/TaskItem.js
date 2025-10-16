import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatDate, isOverdue } from '../utils/date';

export default function TaskItem({ task, onPress, onToggle, onDelete }) {
  const { colors } = useTheme();
  const overdue = isOverdue(task.dueDate) && task.status !== 'Done';

  const priorityColor = {
    Low: '#6B7280',
    Medium: '#2563EB',
    High: '#DC2626',
  }[task.priority || 'Medium'];

  const neutral = colors.mutedText || '#9CA3AF';

  return (
    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={0.8}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.checkbox}
        accessibilityLabel={
          task.status === 'Done' ? 'Reopen task' : 'Mark task complete'
        }
      >
        {task.status === 'Done' ? (
          <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
        ) : overdue ? (
          <Ionicons name="alert-circle-outline" size={22} color="#DC2626" />
        ) : (
          <Ionicons name="ellipse-outline" size={22} color={neutral} />
        )}
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: colors.text },
            task.status === 'Done' && {
              textDecorationLine: 'line-through',
              color: neutral,
            },
          ]}
        >
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          {task.dueDate ? (
            <Text style={[styles.metaText, { color: neutral }]}>
              {formatDate(task.dueDate)}
            </Text>
          ) : null}
          {task.tags?.length ? (
            <Text
              style={[styles.metaText, { color: neutral }]}
              numberOfLines={1}
            >
              {task.tags.map(t => `#${t}`).join(' ')}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.chip, { borderColor: priorityColor }]}>
        <Text style={[styles.chipText, { color: priorityColor }]}>
          {task.priority}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onDelete}
        hitSlop={8}
        style={{ marginLeft: 8 }}
      >
        <Ionicons name="trash-outline" size={20} color={neutral} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
  },
  checkbox: { marginRight: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 2 },
  metaText: { fontSize: 12 },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
});
