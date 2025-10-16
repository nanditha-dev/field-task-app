import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTasks } from '../store/TaskContext';
import { logEvent } from '../analytics/logger';

// Simple formatter (MMM d, HH:mm). Set hour12: true if you want 12-hour time.
const fmt = (d) =>
  new Date(d).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

function renderLine(a) {
  const time = fmt(a.timestamp);
  const title = a?.meta?.title ?? '';
  switch (a.type) {
    case 'create':   return `Created "${title}" at ${time}`;
    case 'update':   return `Updated "${title}" at ${time}`;
    case 'complete': return `Marked "${title}" as complete at ${time}`;
    case 'reopen':   return `Reopened "${title}" at ${time}`;
    case 'delete':   return `Deleted "${title}" at ${time}`;
    default:         return `${a.type} - ${time}`;
  }
}

export default function ActivityLogScreen() {
  const { activity } = useTasks();
  const { colors } = useTheme();

  useEffect(() => {
    logEvent('screen_view', { screen: 'ActivityLog' });
  }, []);

  return (
    <FlatList
      style={[styles.list, { backgroundColor: colors.background }]}
      data={activity}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.text, { color: colors.text }]}>{renderLine(item)}</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={{ padding: 24 }}>
          <Text style={{ color: colors.text }}>No activity yet</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {},
});