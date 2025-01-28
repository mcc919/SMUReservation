
import React, { useContext } from "react";
import { Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';

import LoginScreen from './LoginScreen';
import ReservationScreen from './ReservationScreen';
import RegisterScreen from './RegisterScreen';
import RecordsScreen from './RecordsScreen';
import BoardScreenStack from "./BoardScreenStack";
//import BoardScreen from './BoardScreen';
import ProfileScreen from './ProfileScreen';

import { useAuth } from "../context/AuthContext";
import { accessTokenKey } from "../constants/keys";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function TabsComponents() {
    const {state, dispatch} = useAuth()
    
    async function logout() {
        return (
          Alert.alert('⚠️', '로그아웃하시겠습니까?', [
            {
                text: '취소',
                onPress: () => {}
            },
            {
              text: '확인',
              onPress: async () => {
                await AsyncStorage.removeItem(accessTokenKey);
                dispatch({type: 'SIGN_OUT'});
                setUser({});
              }
            }
          ])
        )
    }

    const renderLogoutButton = () => (
        <Pressable onPress={logout} style={{ marginLeft: 10 }}>
          <MaterialIcons name="logout" size={24} color='#007AFF'/>
        </Pressable>
      );

    return (
        <Tab.Navigator
        initialRouteName='Reservation'
        screenOptions={{
            //tabBarActiveTintColor: "#4CAF50", // 활성 탭 아이콘 색상
            tabBarInactiveTintColor: "#9E9E9E", // 비활성 탭 아이콘 색상
            tabBarStyle: {
            backgroundColor: "#FFFFFF",  // 탭 바 배경색
            height: 60,
            paddingTop: 5
            },
            headerLeft: renderLogoutButton, // 공통 헤더 왼쪽 버튼 설정
        }}>
        <Tab.Screen name="Reservation" component={ReservationScreen}
            options={{
                headerTitle: "예약",
                tabBarIcon: ((color) => (
                    <MaterialIcons name="piano" size={24} color={color} />
                ))
            }}
        s/>
        <Tab.Screen name="Records" component={RecordsScreen}
            options={{
                headerTitle: "기록",
                tabBarIcon: ((color) => (
                    <MaterialIcons name="library-books" size={24} color={color} />
                ))
            }}
        />
        <Tab.Screen name="Board" component={BoardScreenStack}
            options={{
                headerTitle: "건의사항 게시판",
                headerShown: false,
                tabBarIcon: ((color) => (
                    <MaterialIcons name="dashboard" size={24} color={color} />
                ))
            }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen}
            options={{
                headerTitle: "프로필",
                tabBarIcon: ((color) => (
                    <Ionicons name="person" size={24} color={color} />
                )),
                // tabBarBadge: 5,
                // tabBarBadgeStyle: {
                //     fontSize: 10
                // }
            }}
        />
        </Tab.Navigator>
    )
}

export default function MainStack({ isAuthenticated }) {
    return (
        <Stack.Navigator>
            {isAuthenticated ? (
                <Stack.Screen
                    name="Tabs"
                    component={TabsComponents}
                    options={{ headerShown: false }}
                />
            ) : (
            <>
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        title: '로그인',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="RegisterScreen"
                    component={RegisterScreen}
                    options={{ title: '회원가입' }}
                />
            </>
            )}
        </Stack.Navigator>
    );
}