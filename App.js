import React, { useReducer, useEffect, useState, useContext } from 'react';
import { SafeAreaView, ActivityIndicator, View, Button, Text, Pressable, Alert, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider } from 'react-native-popup-menu';
import MainStack from './screens/MainStack';

import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ReservationProvider } from './context/ReservationContext';
import { setGlobalDispatch, apiRequest } from './utils/api';
import { API_URL } from '@env'
import { getReservationDay } from './utils/utils';

import styles from './constants/styles';

const accessTokenKey = '@accessTokenKey';

function AppContent() {
  const { state, dispatch } = useAuth();
  const [ today, setToday ] = useState('');

  useEffect(() => {
    console.log('dispatch 바뀜')
  }, [dispatch]);

  useEffect(() => {
    const restoreToken = async () => {
      console.log('서버 url: ', API_URL);
      const response = await apiRequest('/validateToken', {});
      if (!response.ok) {
        dispatch({ type: 'SIGN_OUT' });
        console.log(response.status);
      }
      else {
        console.log('여기롣 와겟지');
        const token = await AsyncStorage.getItem(accessTokenKey);
        dispatch({ type: 'RESTORE_TOKEN', token });
        //setUser(result);    // 왜인지 동작을 안함, 그냥 ReservationScreen.js 에서 유저 데이터 받아오도록 처리
      }
      
    };
    setGlobalDispatch(dispatch);
    restoreToken();
    console.log('restored token:', state);
    setToday(getReservationDay());
  }, []);

  if (state.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainStack isAuthenticated={!!state.userToken} />
    </NavigationContainer>
  );
}

export default function App() {



  return (
    <MenuProvider>
    <SafeAreaView style={{
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: StatusBar.currentHeight || 0, // StatusBar 높이를 안전하게 추가
      }}
    >
      {/* <StatusBar
        barStyle="light-content" // 또는 'light-content'
        backgroundColor="#ffffff" // 원하는 배경색
      /> */}
      <AuthProvider>
        <UserProvider>
          <ReservationProvider>
            <AppContent />
          </ReservationProvider>
        </UserProvider>
      </AuthProvider>
    </SafeAreaView>
    </MenuProvider>
  );
}
