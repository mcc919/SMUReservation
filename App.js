import React, { useReducer, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native'; // Platform import 추가
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const accessTokenKey = '@accessTokenKey';

const initialState = {
  isLoading: true,
  userToken: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

function LoginScreen({ navigation, dispatch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const signIn = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${username}&password=${password}`,
      });

      const result = await response.json();
      if (result.is_auth) {
        await AsyncStorage.setItem(accessTokenKey, result.access_token);
        dispatch({type: 'SIGN_IN', token: result.access_token})
      } else {
        setErrorMessage('Authentication failed. Please check your credentials.');
      }
    } catch (e) {
      console.error('Login error:', e);
      setErrorMessage('An error occurred while trying to log in.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding" // iOS에서는 padding 방식으로 키보드를 피합니다.
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Android에서는 키보드가 올라오는 높이를 조정
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.inner}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home Screen!</Text>
    </View>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreToken = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem(accessTokenKey);
        await AsyncStorage.removeItem(accessTokenKey);
        if (token) {
          const response = await fetch(`${API_URL}/validateToken`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            token = null;
          }
        }
      } catch (e) {
        token = null;
      }

      if (!token) {
        dispatch({ type: 'SIGN_OUT', token });
      } else {
        dispatch({ type: 'RESTORE_TOKEN', token });
      }
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
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'Welcome'}}
          />
        ) : (
          <Stack.Screen
            name="SignInScreen"
            options={{ title: '로그인'}}
          >
            {props => <LoginScreen {...props} dispatch={dispatch}/>}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  link: {
    color: '#3b82f6',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
