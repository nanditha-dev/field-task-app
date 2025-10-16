import AsyncStorage from '@react-native-async-storage/async-storage';

export const SESSION_KEY = '@session';
export const TASKS_KEY = '@tasks';
export const ACTIVITY_KEY = '@activity';
export const THEME_KEY = '@theme';

export async function loadTasks() {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveTasks(tasks) {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function loadActivity() {
  const json = await AsyncStorage.getItem(ACTIVITY_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveActivity(list) {
  await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(list));
}
