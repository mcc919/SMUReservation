import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from "./color.js"
import { parse } from 'htmlparser2';

export default function App() {
    const [studentId, setStudentId] = useState("");
    const [studentPw, setStudentPw] = useState("");

    const onChangeStudentId = (data) => { setStudentId(data); console.log(studentId)}
    const onChangeStudentPw = (data) => { setStudentPw(data); console.log(studentPw)}

    const login = () => {



    }

    return (
        <View style={styles.container}>
            <View style={styles.loginBox}>
                <FontAwesome5 name="user-alt" size={24} color="black" style={styles.loginIcon} />
                <TextInput onChangeText={onChangeStudentId}>tete</TextInput>
            </View>
            <View style={styles.loginBox}>
                <FontAwesome5 name="lock" size={24} color="black" style={styles.loginIcon} />
                <TextInput onChangeText={onChangeStudentPw}>tete</TextInput>
            </View>
            <Button title="로그인" color="#841584" onPress={login}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBox: {
        flexDirection: "row",
        margin: 10,
    },
    loginIcon: {
        marginHorizontal: 10,
    }
});