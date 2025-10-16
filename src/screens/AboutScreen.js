import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const APP_VERSION = '1.0.0';

export default function AboutScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>FieldTaskApp</Text>
      <Text style={[styles.caption, { color: colors.mutedText || '#6B7280' }]}>
        Version {APP_VERSION}
      </Text>

      <View style={{ height: 12 }} />

      <Text style={[styles.note, { color: colors.mutedText || '#6B7280' }]}>
        Offline-first demo app for task management with local storage and activity log.
      </Text>

      <View style={{ height: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  caption: { marginTop: 6 },
  note: { marginTop: 10, textAlign: 'center' },
});