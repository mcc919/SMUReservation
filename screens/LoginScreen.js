import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import styles from '../constants/styles';

const accessTokenKey = '@accessTokenKey';

export default function LoginScreen({ navigation, dispatch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    //setErrorMessage('');
    setIsLoading(true);     // 로딩 시작
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${username}&password=${password}`,
      });

      if (!response.ok) {
        throw new Error('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      const result = await response.json();
      console.log(result);  // FOR DEBUG
      if (result.is_auth) {
        await AsyncStorage.setItem(accessTokenKey, result.access_token);
        dispatch({ type: 'SIGN_IN', token: result.access_token });
      } else {
        setErrorMessage('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } catch (e) {
      //console.error('Login error:', e);
      setErrorMessage('서버가 응답하지 않습니다. 관리자에게 문의하세요.');
    } finally {
        setIsLoading(false);        // 로딩 종료
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
          {isLoading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : (
            <>
            <TouchableOpacity
              style={styles.button}
              onPress={signIn}
              disabled={isLoading} // 로딩 중 버튼 비활성화
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
