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
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setIsLoading(true);     // 로딩 시작
    try {
      console.log(API_URL);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `userId=${userId}&password=${password}`,
      });

      console.log('이것이 response입니다.', response);  // FOR DEBUG
      //console.log('이것이 response.status입니다.', response.status);  // FOR DEBUG

      switch (response.status) {
        case 200:
          result = await response.json();
          console.log('이것이 result입니다.', result);  // FOR DEBUG
          if (result.is_auth) {
            await AsyncStorage.setItem(accessTokenKey, result.access_token);
            dispatch({ type: 'SIGN_IN', token: result.access_token });
          } else {
            setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
          }
          break;
        case 400:
          setErrorMessage('아이디 또는 비밀번호를 입력해주세요.');
          break;
        case 401:
          setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
          break;
        case 404:
          setErrorMessage('존재하지 않는 사용자입니다. 회원가입을 진행해주세요.');
          break;
        case 409:
          setErrorMessage('이미 존재하는 사용자입니다. 관리자에게 문의하세요.');
          break;
        case 500:
          setErrorMessage('서버 내부 오류입니다. 관리자에게 문의하세요.');
          break;
        default:
          setErrorMessage('알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.');
          break;
        }
    } catch (e) {
      console.error('Login error:', e);
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
            placeholder="학번"
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
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
              <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.link}>계정이 없으신가요? 회원가입</Text>
            </TouchableOpacity>
          </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
