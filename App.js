import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text, TouchableOpacity, Button} from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from "./color.js"
import { createStaticNavigation, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import { Button } from "@react-navigation/elements";

import { API_URL } from '@env';


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
    
    const onChangeStudentId = (data) => { setStudentId(data);}
    const onChangeStudentPw = (data) => { setStudentPw(data);}

    const auth = async () => {
        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${studentId}&password=${studentPw}`,
          });
      
          if (!response.ok) {
            // HTTP 응답 상태 코드가 200-299 범위를 벗어나는 경우 처리
            console.error('Server responded with an error:', response.status);
            // 서버로부터 에러 코드를 받았을 경우 사용자에게 뭐라 할건지?

            return;
          }

          const result = await response.json();     // response는 메타데이터만 포함하고 있음, json()하면 튀어나옴
      
          if (result.is_auth === true) {
            setIsError(false);
            console.log('Login successful:', result);
            navigation.navigate('Home'); // 로그인 성공 시 페이지 이동
          } else {
            setIsError(true);
            console.log('Authentication failed:', result);
            setTimeout(() => {
              setIsError(false);
            }, 3000);
          }
        } catch (error) {
          // 네트워크 에러 또는 다른 예외 상황 처리
          console.error('Error during authentication:', error);
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
          }, 3000);
        }
    };
      

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