import React, { useReducer, useEffect } from 'react';
import { ActivityIndicator, View, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@env';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ReservationScreen from './screens/ReservationScreen';
import RegisterScreen from './screens/RegisterScreen';

import authReducer, { initialState } from './reducers/authReducer';

import styles from './constants/styles';


const accessTokenKey = '@accessTokenKey';

export default function App() {
  const [state, dispatch] = useReducer(authReducer, initialState);

  async function logout() {
    await AsyncStorage.removeItem(accessTokenKey);
    dispatch({type: 'SIGN_OUT'});
  }

  useEffect(() => {
    const restoreToken = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem(accessTokenKey);
        await AsyncStorage.removeItem(accessTokenKey);    // FOR DEBUG

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
          }
        }
      } catch (e) {
        token = null;
        console.log('May be network error...'); // FOR DEBUG 유저에게 어떻게 알릴 것인지?
      }
      dispatch({ type: token ? 'RESTORE_TOKEN' : 'SIGN_OUT', token });
    };
    restoreToken();
  }, []);

  const Stack = createNativeStackNavigator();

  if (state.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.userToken ? (
          <>
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                title: 'Home',
                headerRight: () => (
                  <Button title="로그아웃" onPress={logout}></Button>
                ),
              }} />
            <Stack.Screen
              name="ReservationScreen"
              component={ReservationScreen}
              options={{
                title: '예약',
                gestureEnabled: false
              }} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignInScreen" options={{ title: 'Login' }}>
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
  );
}
