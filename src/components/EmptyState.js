import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ title = 'No tasks yet', caption = 'Create your first task to get started.' }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40 },
  title: { fontSize: 16, fontWeight: '600' },
  caption: { marginTop: 6, color: '#6B7280' },
});