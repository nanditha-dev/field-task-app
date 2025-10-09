import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function TaskDetailScreen({ route }) {
  const { task } = route.params;
  const [priority, setPriority] = useState('Medium');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput value={task.title} editable={false} style={styles.input} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value="Inspect the valve for leaks"
        editable={false}
        style={styles.input}
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {['Low', 'Medium', 'High'].map(p => (
          <Button
            key={p}
            title={p}
            onPress={() => setPriority(p)}
            color={priority === p ? 'blue' : 'gray'}
          />
        ))}
      </View>

      <Text style={styles.label}>Due Date</Text>
      <Text>{task.dueDate}</Text>

      <Button title="Mark Complete" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderBottomWidth: 1, padding: 8, marginBottom: 10 },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
});
