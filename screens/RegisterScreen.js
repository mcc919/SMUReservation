import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, TextInput, ActivityIndicator, Alert} from 'react-native';
import { API_URL } from '@env';
import styles from '../constants/styles';

export default function RegisterScreen({ navigation }) {

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const register = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `userId=${userId}&password=${password}`,
            });
            console.log('이것이 response입니다.', response);

            switch (response.status) { 
                case 201:
                    Alert.alert('회원가입 성공', '로그인 페이지로 이동합니다.', [
                        {
                            text: '확인',
                            onPress: () => navigation.goBack('LoginScreen'),
                        },
                    ]);
                    break;
                case 400:
                    setErrorMessage('학번 또는 비밀번호를 입력해주세요.');
                    break
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
            console.error('Register error:', e);
            setErrorMessage('서버가 응답하지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
                                onPress={register}
                                disabled={isLoading} // 로딩 중 버튼 비활성화
                            >
                                <Text style={styles.buttonText}>회원가입</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}