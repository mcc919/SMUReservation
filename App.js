import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text, TouchableOpacity, Button} from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from "./color.js"
import {NavigationContainer} from '@react-navigation/native';
import { createStaticNavigation, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import { Button } from "@react-navigation/elements";

const RootStack = createNativeStackNavigator({
    initialRouteName: 'Login',
    screenOptions: {
        headerStyle: { backgroundColor: "lightskyblue" }
    },
    screens: {
        Login: {
            screen: LoginScreen,
            options: {
                title: "로그인"
            }
        },
        Home: HomeScreen,
    },
})

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return <Navigation />;    
}

function LoginScreen() {
    const navigation = useNavigation();

    const [studentId, setStudentId] = useState("");
    const [studentPw, setStudentPw] = useState("");
    const [isError, setIsError] = useState(false);
    
    const onChangeStudentId = (data) => { setStudentId(data); console.log(studentId)}
    const onChangeStudentPw = (data) => { setStudentPw(data); console.log(studentPw)}

    const auth = () => {
        fetch("https://smunity.co.kr/api/auth", {
            method: "POST",
            body: JSON.stringify({
                "username": studentId,
                "password": studentPw
            }),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
                },
            })
            .then((response) => response.json())
            .then((result) => {        
            console.log('dfdfdf');

            if (result["is_auth"] === true) {
                setIsError(false);
                console.log('login success');
                // page 이동
                navigation.navigate('Home');
            } else {
                setIsError(true);
                setTimeout(() => {
                    setIsError(false);
                }, 3000);
            }}
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.loginBox}>
                <FontAwesome5 name="user-alt" size={24} color="black" style={styles.loginIcon} />
                <TextInput onChangeText={onChangeStudentId}>Login 화면이다.</TextInput>
            </View>
            <View style={styles.loginBox}>
                <FontAwesome5 name="lock" size={24} color="black" style={styles.loginIcon} />
                <TextInput onChangeText={onChangeStudentPw} secureTextEntry>tset</TextInput>
            </View>
            <Button title="로그인!!" color="#841584" onPress={auth}></Button>
            <View style={styles.loginError}>{ isError ? (<Text>아이디와 비밀번호가 일치하지 않습니다.</Text>) : null }
            </View>
        </View>
    );
}

function HomeScreen() {

    return (
        <View styles={{flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center"}}><Text>Home Screen</Text></View>
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