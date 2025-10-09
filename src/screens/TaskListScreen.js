import React,{useState} from 'react';
import {View,StyleSheet, TouchableOpacity} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
const tasks= [
    {id: '1', title: 'Inspect Pump', dueDate: '2025-10-10',status: 'upcoming'},
     {id: '2', title: 'Check Valve', dueDate: '2025-10-10',status: 'upcoming'},
      {id: '3', title: 'Submit Report', dueDate: '2025-10-10',status: 'overdue'},
       {id: '4', title: 'Order Parts', dueDate: '2025-10-10',status: 'overdue'},
];
export default function TaskListScreen({navigation}){
const renderTask =({item})=>(
    <TouchableOpacity style={styles.taskItem}onPress={()=>navigation.navigate('TaskDetail',{task:item})}>
        <Text>{item.title}</Text>
        <Text>{item.dueDate}</Text>
    </TouchableOpacity>
);

    return(
        <View style={styles.container}>
         <Text style={styles.section}>Upcoming</Text>
         <FlatList data ={tasks.filter(t=>t.status === 'upcoming')} renderItem={renderTask}
            keyExtractor={item => item.id}></FlatList>
           <Text style={styles.section}>Overdue</Text>
              <FlatList data ={tasks.filter(t=>t.status === 'overdue')} renderItem={renderTask}
            keyExtractor={item => item.id}></FlatList>
        </View>
    );
}
const styles = StyleSheet.create({
container:{
   padding:20
},
section:{fontSize:18,fontWeight:'bold',marginVertical:10},
taskItem: {padding:10,bordderBottomWidth:1},
date:{color:'gray'},
});