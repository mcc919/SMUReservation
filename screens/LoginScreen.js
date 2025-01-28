import React, { useState, useContext } from 'react';
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
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import UserContext from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import styles from '../constants/styles';

import { LOGIN_WAITING_TIME } from '../constants/settings';
import { accessTokenKey } from '../constants/keys';

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useAuth();
  const { user , setUser } = useContext(UserContext);

  const signIn = async () => {
    setIsLoading(true);     // 로딩 시작

    const controller = new AbortController();
    const  timeoutId = setTimeout(() => controller.abort(), LOGIN_WAITING_TIME);
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: controller.signal,
        body: `userId=${userId}&password=${password}`,
      });

      console.log('이것이 response입니다.', response);  // FOR DEBUG
      clearTimeout(timeoutId);

      switch (response.status) {
        case 200:
          result = await response.json();
          if (!result) console.log('what?');
          console.log('이것이 result입니다.', result);  // FOR DEBUG
          if (result.is_auth) {
            await AsyncStorage.setItem(accessTokenKey, result.access_token);
            dispatch({ type: 'SIGN_IN', token: result.access_token });
            setUser(result.user);
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
        case 403:
          setErrorMessage('승인 대기 중인 계정입니다. 관리자에게 문의하세요');
        case 404:
          setErrorMessage('존재하지 않는 사용자입니다. 회원가입을 진행해주세요.');
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
      clearTimeout(timeoutId);
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
        <View style={{ flex: 1 }}>
          <Image style={styles.imageStyle} source={require('../assets/smu_logo.png')}/>
          <View style={styles.contentsContainer}>
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
