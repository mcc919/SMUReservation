import React, { useReducer, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import authReducer, { initialState } from './reducers/authReducer';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import styles from './constants/styles';

const accessTokenKey = '@accessTokenKey';

export default function App() {
  const [state, dispatch] = useReducer(authReducer, initialState);

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
          if (!response.ok) {
            token = null;
            console.log('유효한 토큰이 아니므로, 로컬에서 삭제하고 로그인 페이지로 이동');  // FOR DEBUG
            await AsyncStorage.removeItem(accessTokenKey);
          }
        }
      } catch (e) {
        token = null;
        console.log('May be network error...'); // FOR DEBUG
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
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Welcome' }} />
        ) : (
          <Stack.Screen name="SignInScreen" options={{ title: '로그인' }}>
            {props => <LoginScreen {...props} dispatch={dispatch} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
