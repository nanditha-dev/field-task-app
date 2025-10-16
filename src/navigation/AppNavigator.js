import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ActivityLogScreen from '../screens/ActivityLogScreen';
import AboutScreen from '../screens/AboutScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="TaskList"
            component={TaskListScreen}
            options={{ title: 'Field Tasks' }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{ title: 'Task Details' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
          <Stack.Screen
            name="ActivityLog"
            component={ActivityLogScreen}
            options={{ title: 'Activity Log' }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: 'About' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
