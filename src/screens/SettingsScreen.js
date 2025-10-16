import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen({ navigation }) {
  const { isDark, toggleTheme } = useThemeContext();
  const { signOut } = useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Group 1: Dark Mode + About */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.row, styles.rowWithDivider, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: '#60A5FA' }}
            thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('About')}
          activeOpacity={0.7}
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>About</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Group 2: Sign Out */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={signOut}
          activeOpacity={0.7}
        >
          <Text style={[styles.signOutText, { color: colors.text }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 12,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowWithDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
  },
});