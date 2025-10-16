import 'react-native-gesture-handler';
import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import RootStack from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/store/TaskContext';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';

function AppNav() {
  const { isDark } = useThemeContext();
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <RootStack />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <AppNav />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
