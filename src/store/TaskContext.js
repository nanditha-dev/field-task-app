import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { loadTasks, saveTasks, loadActivity, saveActivity } from '../utils/storage';
import { logEvent } from '../analytics/logger';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  activity: [],
  hydrated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, tasks: action.tasks, activity: action.activity, hydrated: true };
    case 'ADD_TASK':
      return { ...state, tasks: [action.task, ...state.tasks], activity: [action.activity, ...state.activity] };
    case 'UPDATE_TASK': {
      const tasks = state.tasks.map(t => (t.id === action.task.id ? action.task : t));
      return { ...state, tasks, activity: [action.activity, ...state.activity] };
    }
    case 'DELETE_TASK': {
      const tasks = state.tasks.filter(t => t.id !== action.id);
      return { ...state, tasks, activity: [action.activity, ...state.activity] };
    }
    case 'REPLACE_ALL': 
      return { ...state, tasks: action.tasks };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const [tasks, activity] = await Promise.all([loadTasks(), loadActivity()]);
      dispatch({ type: 'HYDRATE', tasks, activity });
    })();
  }, []);

  // persist on tasks/activity change (after hydration)
  useEffect(() => {
    if (state.hydrated) {
      saveTasks(state.tasks);
      saveActivity(state.activity);
    }
  }, [state.tasks, state.activity, state.hydrated]);

  const addTask = (partial) => {
    const now = new Date().toISOString();
    const task = {
      id: uuidv4(),
      title: partial.title.trim(),
      description: partial.description?.trim() || '',
      priority: partial.priority || 'Medium',
      dueDate: partial.dueDate || null,
      status: partial.status || 'Todo',
      tags: partial.tags || [],
      createdAt: now,
      updatedAt: now,
    };
    const activity = {
      id: uuidv4(),
      type: 'create',
      taskId: task.id,
      timestamp: now,
      meta: { title: task.title },
    };
    dispatch({ type: 'ADD_TASK', task, activity });
    logEvent('task_created', { id: task.id });
    return task.id;
  };

  const updateTask = (id, changes) => {
    const now = new Date().toISOString();
    const prev = state.tasks.find(t => t.id === id);
    if (!prev) return;

    const task = { ...prev, ...changes, updatedAt: now };
    const activity = {
      id: uuidv4(),
      type: 'update',
      taskId: id,
      timestamp: now,
      meta: { title: task.title, changes },
    };
    dispatch({ type: 'UPDATE_TASK', task, activity });
  };

  const toggleComplete = (id) => {
    const t = state.tasks.find(x => x.id === id);
    if (!t) return;
    const now = new Date().toISOString();
    const nextStatus = t.status === 'Done' ? 'Todo' : 'Done';
    const task = { ...t, status: nextStatus, updatedAt: now };
    const activity = {
      id: uuidv4(),
      type: nextStatus === 'Done' ? 'complete' : 'reopen',
      taskId: id,
      timestamp: now,
      meta: { title: task.title },
    };
    dispatch({ type: 'UPDATE_TASK', task, activity });
  };

  const deleteTask = (id) => {
    const t = state.tasks.find(x => x.id === id);
    const now = new Date().toISOString();
    const activity = {
      id: uuidv4(),
      type: 'delete',
      taskId: id,
      timestamp: now,
      meta: { title: t?.title || '' },
    };
    dispatch({ type: 'DELETE_TASK', id, activity });
  };

  const reloadFromStorage = async () => {
    const tasks = await loadTasks();
    dispatch({ type: 'REPLACE_ALL', tasks });
  };

  const value = useMemo(() => ({
    tasks: state.tasks,
    activity: state.activity,
    hydrated: state.hydrated,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reloadFromStorage,
  }), [state, addTask, updateTask, deleteTask, toggleComplete]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export const useTasks = () => useContext(TaskContext);