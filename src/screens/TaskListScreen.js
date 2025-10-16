import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../store/TaskContext';
import { isDueToday, isOverdue } from '../utils/date';
import { logEvent } from '../analytics/logger';

function groupTasks(tasks, query, priorityFilter, statusFilter) {
  const q = query.trim().toLowerCase();
  const filtered = tasks.filter(t => {
    const matchText =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    const matchPriority =
      priorityFilter === 'All' || t.priority === priorityFilter;
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Done' ? t.status === 'Done' : t.status === 'Todo');
    return matchText && matchPriority && matchStatus;
  });

  const today = filtered.filter(t => t.dueDate && isDueToday(t.dueDate));
  const overdue = filtered.filter(
    t => isOverdue(t.dueDate) && t.status !== 'Done',
  );
  const upcoming = filtered.filter(
    t => !today.includes(t) && !overdue.includes(t),
  );

  const sorter = (a, b) => {
    const da = a.dueDate
      ? new Date(a.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER;
    const db = b.dueDate
      ? new Date(b.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER;
    return da - db;
  };

  today.sort(sorter);
  overdue.sort(sorter);
  upcoming.sort(sorter);

  const sections = [];
  if (today.length) sections.push({ title: 'Today', data: today });
  if (upcoming.length) sections.push({ title: 'Upcoming', data: upcoming });
  if (overdue.length) sections.push({ title: 'Overdue', data: overdue });
  if (!sections.length) sections.push({ title: 'Tasks', data: [] });
  return sections;
}

export default function TaskListScreen({ navigation }) {
  const { tasks, toggleComplete, deleteTask, reloadFromStorage } = useTasks();
  const { colors } = useTheme();

  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.card },
      headerTitleStyle: { color: colors.text },
      headerTintColor: colors.text,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ActivityLog')}>
            <Ionicons name="time-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, colors]);

  useEffect(() => {
    logEvent('screen_view', { screen: 'TaskList' });
  }, []);

  const sections = useMemo(
    () => groupTasks(tasks, query, priorityFilter, statusFilter),
    [tasks, query, priorityFilter, statusFilter],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await reloadFromStorage();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        placeholder="Search by title or description"
        placeholderTextColor={colors.mutedText || '#9CA3AF'}
        style={[
          styles.search,
          {
            backgroundColor: colors.inputBg || colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.filters}>
        <FilterChip
          colors={colors}
          label="All"
          selected={priorityFilter === 'All'}
          onPress={() => setPriorityFilter('All')}
        />
        <FilterChip
          colors={colors}
          label="Low"
          selected={priorityFilter === 'Low'}
          onPress={() => setPriorityFilter('Low')}
        />
        <FilterChip
          colors={colors}
          label="Medium"
          selected={priorityFilter === 'Medium'}
          onPress={() => setPriorityFilter('Medium')}
        />
        <FilterChip
          colors={colors}
          label="High"
          selected={priorityFilter === 'High'}
          onPress={() => setPriorityFilter('High')}
        />
        <View style={{ width: 12 }} />
        <FilterChip
          colors={colors}
          label="All"
          selected={statusFilter === 'All'}
          onPress={() => setStatusFilter('All')}
        />
        <FilterChip
          colors={colors}
          label="Todo"
          selected={statusFilter === 'Todo'}
          onPress={() => setStatusFilter('Todo')}
        />
        <FilterChip
          colors={colors}
          label="Done"
          selected={statusFilter === 'Done'}
          onPress={() => setStatusFilter('Done')}
        />
      </View>

      <SectionList
        style={{ backgroundColor: colors.background }}
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: colors.text }]}>
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { id: item.id })}
            onToggle={() => toggleComplete(item.id)}
            onDelete={() => {
              Alert.alert('Delete Task', `Delete "${item.title}"?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteTask(item.id),
                },
              ]);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: colors.text }}>
              No tasks. Tap + to create one.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('TaskDetail')}
        style={[styles.fab, { backgroundColor: colors.primary || '#3B63A8' }]}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function FilterChip({ label, selected, onPress, colors }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: colors.chipBg || colors.card,
          borderColor: colors.border,
        },
        selected && {
          backgroundColor: colors.card,
          borderColor: colors.primary,
        },
      ]}
    >
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  sectionHeader: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
