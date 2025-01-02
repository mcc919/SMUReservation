import React, { useReducer, useEffect, useState, useContext } from 'react';
import { ActivityIndicator, View, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@env';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ReservationScreen from './screens/ReservationScreen';
import RegisterScreen from './screens/RegisterScreen';
import RecordsScreen from './screens/RecordsScreen';
import BoardScreen from './screens/BoardScreen';
import NotificationsScreen from './screens/NotificationsScreen';

import authReducer, { initialState } from './reducers/authReducer';

import { getToday } from './utils/utils';

import styles from './constants/styles';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialIcons } from '@expo/vector-icons';
import UserContext, { UserProvider } from './context/UserContext';

const accessTokenKey = '@accessTokenKey';

export default function App() {
  const [ state, dispatch ] = useReducer(authReducer, initialState);
  const [ today, setToday ] = useState('');
  const { user , setUser } = useContext(UserContext);

  async function logout() {
    await AsyncStorage.removeItem(accessTokenKey);
    dispatch({type: 'SIGN_OUT'});
    setUser([]);
    
  }

  useEffect(() => {
    const restoreToken = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem(accessTokenKey);
        //await AsyncStorage.removeItem(accessTokenKey);    // FOR DEBUG

        if (token) {
          const response = await fetch(`${API_URL}/validateToken`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          print('이것이 token입니다.', token);  // FOR DEBUG
          print('이것이 response입니다.', response);  // FOR DEBUG
          if (!response.ok) {
            token = null;
            console.log('유효한 토큰이 아니므로, 로컬에서 삭제하고 로그인 페이지로 이동');  // FOR DEBUG
            await AsyncStorage.removeItem(accessTokenKey);
            dispatch({ type: 'SIGN_OUT' });
          }
        }
      } catch (e) {
        token = null;
        console.log('May be network error...'); // FOR DEBUG 유저에게 어떻게 알릴 것인지?
        dispatch({ type: 'SIGN_OUT' });
      }
      dispatch({ type: 'RESTORE_TOKEN', token });
    };
    restoreToken();
    setToday(getToday());
  }, []);

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const renderLogoutButton = () => (
    <Button 
      title="로그아웃" 
      onPress={logout} 
      color="#007AFF" // 버튼 색상 변경x
    />
  );

  const TabsComponents = () => {
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
          }} />
        <Tab.Screen name="Records" component={RecordsScreen}
          options={{
            headerTitle: "기록",
            tabBarIcon: ((color) => (
              <MaterialIcons name="library-books" size={24} color={color} />
            ))
          }} />
        <Tab.Screen name="Board" component={BoardScreen}
          options={{
            headerTitle: "건의사항",
            tabBarIcon: ((color) => (
              <MaterialIcons name="dashboard" size={24} color={color} />
            ))
          }} />
        <Tab.Screen name="Notifications" component={NotificationsScreen}
          options={{
            headerTitle: "알림",
            tabBarIcon: ((color) => (
              <MaterialIcons name="notifications" size={24} color={color} />
            )),
            tabBarBadge: 5,
            tabBarBadgeStyle: {
              fontSize: 10
            }
          }} />
      </Tab.Navigator>
    )
  }


  if (state.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {state.userToken ? (
            <>
              <Stack.Screen
                name="Tabs"
                component={TabsComponents}
                options={{
                  headerShown: false
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="LoginScreen" options={{ title: 'Login' }}>
                {props => <LoginScreen {...props} dispatch={dispatch} />}
              </Stack.Screen>
              <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ title: '회원가입' }}>
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
