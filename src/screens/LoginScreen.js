import React,{useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native'
export default function LoginScreen({navigation}){
const [email, setEmail] =useState('');
const [password, setPassword] =useState('');

const handleLogin =()=>{
navigation.replace('TaskList')
    };
    return(
        <View>
            <TextInput placeholder='Email' value={email} onChangeText={setEmail} style={styles.input}></TextInput>
             <TextInput placeholder='Password' value={password} onChangeText={setPassword}  style={styles.input}></TextInput>
             <Button title='Sign In' onPress={handleLogin}/>
        </View>
    );
}
const styles = StyleSheet.create({
container:{
    flex:1,justifyContent:'center',padding:20
},
input:{
    marginBottom:15,
    borderBottomWidth:1,
    padding:8
}
});